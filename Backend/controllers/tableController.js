const Table = require('../models/table');

const getTables = async (req, res) => {
  res.json(await Table.find().sort({ tableNumber: 1 }));
};

const createTable = async (req, res) => {
  res.status(201).json(await Table.create(req.body));
};

const updateTable = async (req, res) => {
  const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!table) return res.status(404).json({ message: 'Table not found' });
  res.json(table);
};

const deleteTable = async (req, res) => {
  const table = await Table.findByIdAndDelete(req.params.id);
  if (!table) return res.status(404).json({ message: 'Table not found' });
  res.json({ message: 'Table deleted' });
};

module.exports = { getTables, createTable, updateTable, deleteTable };
