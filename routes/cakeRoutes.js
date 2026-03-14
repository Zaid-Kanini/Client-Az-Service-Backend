const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { upload } = require('../config/cloudinary');
const {
  getAllCakes,
  getCakeById,
  addCake,
  updateCake,
  deleteCake,
  getCategories,
} = require('../controllers/cakeController');

router.get('/categories', getCategories);

router.get('/', getAllCakes);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid cake ID')],
  validate,
  getCakeById
);

router.post(
  '/',
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

router.put(
  '/:id',
  upload.single('image'),
  [param('id').isMongoId().withMessage('Invalid cake ID')],
  validate,
  updateCake
);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid cake ID')],
  validate,
  deleteCake
);

module.exports = router;
