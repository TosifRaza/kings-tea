const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { listReviews, createReview, deleteReview, moderateReview } = require('../controllers/ReviewController');
const { protect } = require('../middleware/AuthenticationMiddleware');
const { authorize } = require('../middleware/AuthorizationMiddleware');

router.get('/moderation', protect, authorize('super_admin', 'admin', 'manager'), listReviews);
router.get('/:productId', listReviews);
router.get('/', listReviews);

router.post(
  '/',
  protect,
  [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title').optional().trim().isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('comment').optional().trim().isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters')
  ],
  createReview
);

router.delete(
  '/:id',
  protect,
  deleteReview
);

router.patch('/:id/approval', protect, authorize('super_admin', 'admin', 'manager'), moderateReview);

module.exports = router;
