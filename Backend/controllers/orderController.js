const Order = require('../models/order');
const Table = require('../models/table');
const MenuItem = require('../models/menuItem');

const GST_RATE = 0.05;

const NEXT_STATUS = {
  Placed: ['Preparing', 'Cancelled'],
  Preparing: ['Served', 'Cancelled'],
  Served: ['Paid'],
  Paid: [],
  Cancelled: [],
};

const populateOrder = (query) =>
  query
    .populate('user', 'name email')
    .populate('table', 'tableNumber capacity');

const createOrder = async (req, res) => {
  const { table, items } = req.body;

  if (!table || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Table and at least one item are required' });
  }

  if (!(await Table.findById(table))) {
    return res.status(404).json({ message: 'Table not found' });
  }

  const lines = [];
  for (const entry of items) {
    const quantity = Number(entry.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a whole number of at least 1' });
    }

    const menuItem = await MenuItem.findById(entry.menuItem);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    if (!menuItem.available) {
      return res.status(400).json({ message: `${menuItem.name} is not available` });
    }

    lines.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      category: menuItem.category,
      price: menuItem.price,
      quantity,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const gst = Math.round(subtotal * GST_RATE * 100) / 100;
  const total = Math.round((subtotal + gst) * 100) / 100;

  const order = await Order.create({
    user: req.user._id,
    table,
    items: lines,
    subtotal,
    gst,
    total,
  });

  res.status(201).json(await populateOrder(Order.findById(order._id)));
};

const getMyOrders = async (req, res) => {
  res.json(await populateOrder(Order.find({ user: req.user._id }).sort({ createdAt: -1 })));
};

const getAllOrders = async (req, res) => {
  res.json(await populateOrder(Order.find().sort({ createdAt: -1 })));
};

const getOrder = async (req, res) => {
  const order = await populateOrder(Order.findById(req.params.id));

  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json(order);
};

const updateStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const { status } = req.body;
  if (!NEXT_STATUS[order.status].includes(status)) {
    return res.status(400).json({ message: `Cannot change order from ${order.status} to ${status}` });
  }

  order.status = status;
  await order.save();

  res.json(await populateOrder(Order.findById(order._id)));
};

const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Access denied' });
  }
  if (order.status !== 'Placed') {
    return res.status(400).json({ message: 'Only a Placed order can be cancelled' });
  }

  order.status = 'Cancelled';
  await order.save();

  res.json(await populateOrder(Order.findById(order._id)));
};

module.exports = { createOrder, getMyOrders, getAllOrders, getOrder, updateStatus, cancelOrder };
