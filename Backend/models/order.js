const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
    items: { type: [itemSchema], required: true },
    subtotal: { type: Number, required: true },
    gst: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Placed', 'Preparing', 'Served', 'Paid', 'Cancelled'],
      default: 'Placed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
