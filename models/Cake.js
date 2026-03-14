const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cake name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    weightOptions: {
      type: [String],
      default: ['500g', '1kg'],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Cake', cakeSchema);
