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
console.log('AUTH ROUTES FILE LOADED');

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, logout, getMe } = require('../controllers/AuthController');
const { protect } = require('../middleware/AuthenticationMiddleware');

// Debug middleware
router.use((req, res, next) => {
  console.log('AUTH ROUTE HIT:', req.method, req.originalUrl);
  next();
});

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  (req, res, next) => {
    console.log('LOGIN ROUTE HIT');
    console.log('Request Body:', req.body);
    next();
  },
  login
);
router.get('/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login route working'
  });
});
router.post('/logout', logout);

router.get('/me', protect, getMe);

module.exports = router;