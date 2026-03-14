const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { createOrder, getAllOrders, getOrderById } = require('../controllers/orderController');

router.post(
  '/',
  [
    body('customerName').trim().notEmpty().withMessage('Customer name is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.cakeId').isMongoId().withMessage('Invalid cake ID'),
    body('items.*.name').trim().notEmpty().withMessage('Item name is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be positive'),
    body('total').isFloat({ min: 0 }).withMessage('Total must be positive'),
    body('deliveryDate').isISO8601().withMessage('Valid delivery date is required'),
  ],
  validate,
  createOrder
);

router.get('/', getAllOrders);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid order ID')],
  validate,
  getOrderById
);

module.exports = router;
