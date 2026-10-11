const express = require('express');
const { body, validationResult } = require('express-validator');
const { rateLimit } = require('express-rate-limit');
const { protect } = require('../middleware/AuthenticationMiddleware');
const { getPaymentConfig, createPaymentOrder, verifyPayment } = require('../controllers/PaymentController');

const router = express.Router();
const checkoutLimiter = rateLimit({ windowMs: 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false });

const validateCheckout = [
  body('items').isArray({ min: 1, max: 30 }),
  body('items.*.productId').isMongoId(),
  body('items.*.quantity').isInt({ min: 1, max: 100 }),
  body('shippingName').isString().trim().isLength({ min: 2, max: 120 }),
  body('shippingAddress').isString().trim().isLength({ min: 5, max: 240 }),
  body('shippingPhone').isString().trim().isLength({ min: 7, max: 30 }),
  body('shippingCity').isString().trim().isLength({ min: 2, max: 100 }),
  body('shippingState').isString().trim().isLength({ min: 2, max: 100 }),
  body('shippingZip').isString().trim().isLength({ min: 3, max: 20 }),
  body('shippingCountry').isString().trim().isLength({ min: 2, max: 80 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Please check your shipping details and cart.' });
    next();
  },
];

router.get('/config', getPaymentConfig);
router.post('/create-order', protect, checkoutLimiter, validateCheckout, createPaymentOrder);
router.post('/verify', protect, checkoutLimiter, [
  body('orderId').isMongoId(),
  body('razorpay_payment_id').isString().trim().isLength({ min: 5, max: 100 }),
  body('razorpay_order_id').isString().trim().isLength({ min: 5, max: 100 }),
  body('razorpay_signature').isString().trim().isLength({ min: 64, max: 128 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Payment verification details are invalid.' });
    next();
  },
], verifyPayment);

module.exports = router;
