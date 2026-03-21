const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const { signup, login, googleAuth, updateProfile, getMe, updatePassword } = require('../controllers/authController');

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Create a new account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Account created
 *       400:
 *         description: Email already registered
 */
router.post(
  '/signup',
  [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  signup
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Authenticate with Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, googleId]
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               googleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Google auth successful
 */
router.post(
  '/google',
  [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('googleId').notEmpty().withMessage('Google ID is required'),
  ],
  validate,
  googleAuth
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
router.get('/me', auth, getMe);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Update user name
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/profile',
  auth,
  [body('name').trim().notEmpty().withMessage('Name is required')],
  validate,
  updateProfile
);

/**
 * @swagger
 * /auth/update-password:
 *   put:
 *     summary: Update password using email and old password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, oldPassword, newPassword]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       401:
 *         description: Old password is incorrect
 *       404:
 *         description: No account found
 */
router.put(
  '/update-password',
  [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('oldPassword').notEmpty().withMessage('Old password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ],
  validate,
  updatePassword
);

module.exports = router;
