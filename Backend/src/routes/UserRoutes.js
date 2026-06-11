const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { listUsers, getUser, updateUser, deleteUser } = require('../controllers/UserController');
const { protect } = require('../middleware/AuthenticationMiddleware');
const { authorize } = require('../middleware/AuthorizationMiddleware');

router.get('/', protect, authorize('super_admin', 'admin', 'manager'), listUsers);

router.get('/:id', protect, getUser);

router.put(
  '/:id',
  protect,
  [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').optional().isEmail().withMessage('Please provide a valid email')
  ],
  updateUser
);

router.delete(
  '/:id',
  protect,
  authorize('super_admin', 'admin'),
  deleteUser
);

module.exports = router;
