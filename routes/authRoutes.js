const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const { sendOtp, verifyOtp, updateProfile, getMe } = require('../controllers/authController');

router.post(
  '/send-otp',
  [body('email').trim().isEmail().withMessage('Valid email is required')],
  validate,
  sendOtp
);

router.post(
  '/verify-otp',
  [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('otp').trim().notEmpty().withMessage('OTP is required'),
  ],
  validate,
  verifyOtp
);

router.get('/me', auth, getMe);

router.put(
  '/profile',
  auth,
  [body('name').trim().notEmpty().withMessage('Name is required')],
  validate,
  updateProfile
);

module.exports = router;
