const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { auth, admin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const {
  getAllServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');

router.get('/', getAllServices);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid service ID')],
  validate,
  getServiceById
);

router.post(
  '/',
  auth,
  admin,
  upload.single('image'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
  ],
  validate,
  addService
);

router.put(
  '/:id',
  auth,
  admin,
  upload.single('image'),
  [param('id').isMongoId().withMessage('Invalid service ID')],
  validate,
  updateService
);

router.delete(
  '/:id',
  auth,
  admin,
  [param('id').isMongoId().withMessage('Invalid service ID')],
  validate,
  deleteService
);

module.exports = router;
