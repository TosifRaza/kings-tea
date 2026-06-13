const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/AuthenticationMiddleware');
const {
  getSubscriptionPlans,
  getSubscriptionPlanById,
  listSubscriptions,
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription
} = require('../controllers/SubscriptionController');

// ============================================================
// PUBLIC routes — anyone can browse subscription plans
// ============================================================
router.get('/plans', getSubscriptionPlans);
router.get('/plans/:id', getSubscriptionPlanById);

// ============================================================
// PROTECTED routes — require authentication
// ============================================================
router.get('/', protect, listSubscriptions);
router.get('/:id', protect, getSubscription);
router.post('/', protect, createSubscription);
router.put('/:id', protect, updateSubscription);
router.put('/:id/cancel', protect, cancelSubscription);

module.exports = router;