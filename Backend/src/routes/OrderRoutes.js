const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { listOrders, createOrder, getOrder, updateOrderStatus } = require('../controllers/OrderController');
const { protect } = require('../middleware/AuthenticationMiddleware');
const { authorize } = require('../middleware/AuthorizationMiddleware');

router.get('/', protect, listOrders);

router.post(
  '/',
  protect,
  [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('items.*.productId').notEmpty().withMessage('Product ID is required for each item'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('shippingName').trim().notEmpty().withMessage('Shipping name is required'),
    body('shippingAddress').trim().notEmpty().withMessage('Shipping address is required'),
    body('shippingCity').trim().notEmpty().withMessage('Shipping city is required'),
    body('shippingState').trim().notEmpty().withMessage('Shipping state is required'),
    body('shippingZip').trim().notEmpty().withMessage('Shipping zip is required'),
    body('shippingCountry').trim().notEmpty().withMessage('Shipping country is required')
  ],
  createOrder
);

router.get('/:id', protect, getOrder);

router.patch(
  '/:id',
  protect,
  authorize('super_admin', 'admin', 'manager'),
  updateOrderStatus
);

module.exports = router;
