const express = require('express');
const router = express.Router();
const { getCart, saveCart, clearCart } = require('../controllers/CartController');
const { protect } = require('../middleware/AuthenticationMiddleware');

router.get('/', protect, getCart);

router.post('/', protect, saveCart);

router.delete('/', protect, clearCart);

module.exports = router;
