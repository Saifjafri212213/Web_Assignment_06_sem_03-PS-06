const MenuItem = require('../models/menuItem');

const getItems = async (req, res) => {
  res.json(await MenuItem.find().sort({ category: 1, name: 1 }));
};

const getItem = async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Menu item not found' });
  res.json(item);
};

const createItem = async (req, res) => {
  res.status(201).json(await MenuItem.create(req.body));
};

const updateItem = async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ message: 'Menu item not found' });
  res.json(item);
};

const deleteItem = async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Menu item not found' });
  res.json({ message: 'Menu item deleted' });
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem };
