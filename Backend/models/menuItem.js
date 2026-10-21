const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  category: { type: String, required: [true, 'Category is required'], trim: true },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  isVeg: { type: Boolean, default: true },
  available: { type: Boolean, default: true },
  imageUrl: { type: String, trim: true, default: '' },
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
