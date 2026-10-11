// console.log('AUTH ROUTES FILE LOADED');
// const express = require('express');
// const router = express.Router();
// const { body } = require('express-validator');
// const { register, login, logout, getMe } = require('../controllers/AuthController');
// const { protect } = require('../middleware/AuthenticationMiddleware');

// router.post(
//   '/register',
//   [
//     body('email').isEmail().withMessage('Please provide a valid email'),
//     body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
//     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
//   ],
//   register
// );

// router.post(
//   '/login',
//   [
//     body('email').isEmail().withMessage('Please provide a valid email'),
//     body('password').notEmpty().withMessage('Password is required')
//   ],
//   login
// );

// router.post('/logout', logout);

// router.get('/me', protect, getMe);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, logout, getMe } = require('../controllers/AuthController');
const { protect } = require('../middleware/AuthenticationMiddleware');
const { rateLimit } = require('express-rate-limit');
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false, message: { success: false, message: 'Too many authentication attempts. Try again later.' } });

router.post(
  '/register',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  login
);
router.post('/logout', logout);

router.get('/me', protect, getMe);

module.exports = router;
