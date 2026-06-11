const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { listSubscriptions, createSubscription, getSubscription, updateSubscription, cancelSubscription } = require('../controllers/SubscriptionController');
const { protect } = require('../middleware/AuthenticationMiddleware');
const { authorize } = require('../middleware/AuthorizationMiddleware');

router.get('/', protect, listSubscriptions);

router.post(
  '/',
  protect,
  [
    body('plan').isIn(['monthly', 'quarterly', 'yearly']).withMessage('Plan must be monthly, quarterly, or yearly'),
    body('price').isNumeric().withMessage('Price must be a number')
  ],
  createSubscription
);

router.get('/:id', protect, getSubscription);

router.patch(
  '/:id',
  protect,
  authorize('super_admin', 'admin', 'manager'),
  updateSubscription
);

router.delete('/:id', protect, cancelSubscription);

module.exports = router;
