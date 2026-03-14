const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const { customerName, phone, address, items, total, deliveryDate, customMessage } = req.body;

    const order = await Order.create({
      customerName,
      phone,
      address,
      items,
      total,
      deliveryDate,
      customMessage,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createOrder, getAllOrders, getOrderById };
