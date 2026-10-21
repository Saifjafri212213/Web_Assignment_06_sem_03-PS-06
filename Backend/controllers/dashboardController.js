const Order = require('../models/order');

const getDashboard = async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todayOrders = await Order.countDocuments({ createdAt: { $gte: startOfDay } });

  const revenue = await Order.aggregate([
    { $match: { createdAt: { $gte: startOfDay }, status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);

  const notCancelled = { $match: { status: { $ne: 'Cancelled' } } };

  const topItems = await Order.aggregate([
    notCancelled,
    { $unwind: '$items' },
    { $group: { _id: '$items.name', quantity: { $sum: '$items.quantity' } } },
    { $sort: { quantity: -1 } },
    { $limit: 5 },
    { $project: { _id: 0, name: '$_id', quantity: 1 } },
  ]);

  const categorySales = await Order.aggregate([
    notCancelled,
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.category',
        sales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      },
    },
    { $sort: { sales: -1 } },
    { $project: { _id: 0, category: '$_id', sales: 1 } },
  ]);

  res.json({
    todayOrders,
    todayRevenue: revenue.length ? revenue[0].total : 0,
    topItems,
    categorySales,
  });
};

module.exports = { getDashboard };
