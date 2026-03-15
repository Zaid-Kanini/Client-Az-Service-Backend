const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { auth, admin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const {
  getAllCakes,
  getCakeById,
  addCake,
  updateCake,
  deleteCake,
  getCategories,
} = require('../controllers/cakeController');

/**
 * @swagger
 * /cakes/categories:
 *   get:
 *     summary: Get all cake categories
 *     tags: [Cakes]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', getCategories);

/**
 * @swagger
 * /cakes:
 *   get:
 *     summary: Get all cakes
 *     tags: [Cakes]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of cakes
 */
router.get('/', getAllCakes);

/**
 * @swagger
 * /cakes/{id}:
 *   get:
 *     summary: Get a cake by ID
 *     tags: [Cakes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cake details
 *       404:
 *         description: Cake not found
 */
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid cake ID')],
  validate,
  getCakeById
);

/**
 * @swagger
 * /cakes:
 *   post:
 *     summary: Add a new cake
 *     tags: [Cakes]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, description, price, category, image]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Cake created
 */
router.post(
  '/',
  auth,
  admin,
  upload.single('image'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').trim().notEmpty().withMessage('Category is required'),
  ],
  validate,
  addCake
);

/**
 * @swagger
 * /cakes/{id}:
 *   put:
 *     summary: Update a cake
 *     tags: [Cakes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cake updated
 *       404:
 *         description: Cake not found
 */
router.put(
  '/:id',
  auth,
  admin,
  upload.single('image'),
  [param('id').isMongoId().withMessage('Invalid cake ID')],
  validate,
  updateCake
);

/**
 * @swagger
 * /cakes/{id}:
 *   delete:
 *     summary: Delete a cake
 *     tags: [Cakes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cake deleted
 *       404:
 *         description: Cake not found
 */
router.delete(
  '/:id',
  auth,
  admin,
  [param('id').isMongoId().withMessage('Invalid cake ID')],
  validate,
  deleteCake
);

module.exports = router;
