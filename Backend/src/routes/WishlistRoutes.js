const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/WishlistController');
const { protect } = require('../middleware/AuthenticationMiddleware');

router.get('/', protect, getWishlist);

router.post(
  '/',
  protect,
  [
    body('productId').notEmpty().withMessage('Product ID is required')
  ],
  addToWishlist
);

router.delete('/:productId', protect, removeFromWishlist);

module.exports = router;
