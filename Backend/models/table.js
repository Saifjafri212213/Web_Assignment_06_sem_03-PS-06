const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: [true, 'Table number is required'],
    unique: true,
    min: [1, 'Table number must be at least 1'],
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [20, 'Capacity cannot be more than 20'],
  },
});

module.exports = mongoose.model('Table', tableSchema);
