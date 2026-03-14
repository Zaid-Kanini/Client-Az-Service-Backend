const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { createOrder, getAllOrders, getOrderById } = require('../controllers/orderController');

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerName, phone, address, items, total, deliveryDate]
 *             properties:
 *               customerName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *               total:
 *                 type: number
 *               deliveryDate:
 *                 type: string
 *                 format: date-time
 *               customMessage:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Validation error
 */
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

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get('/', getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid order ID')],
  validate,
  getOrderById
);

module.exports = router;
