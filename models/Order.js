const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    cakeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cake',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    weight: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v) => v.length > 0,
        message: 'Order must contain at least one item',
      },
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative'],
    },
    deliveryDate: {
      type: Date,
      required: [true, 'Delivery date is required'],
    },
    customMessage: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
