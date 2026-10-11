const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/AuthenticationMiddleware');
const { authorize } = require('../middleware/AuthorizationMiddleware');
const {
  getSubscriptionPlans,
  getSubscriptionPlanById,
  listAdminPlans,
  savePlan,
  deletePlan,
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
router.get('/admin/plans', protect, authorize('super_admin', 'admin'), listAdminPlans);
router.post('/admin/plans', protect, authorize('super_admin', 'admin'), savePlan);
router.put('/admin/plans/:id', protect, authorize('super_admin', 'admin'), savePlan);
router.delete('/admin/plans/:id', protect, authorize('super_admin', 'admin'), deletePlan);

// ============================================================
// PROTECTED routes — require authentication
// ============================================================
router.get('/', protect, listSubscriptions);
router.get('/:id', protect, getSubscription);
router.post('/', protect, createSubscription);
router.put('/:id', protect, authorize('super_admin', 'admin', 'manager'), updateSubscription);
router.put('/:id/cancel', protect, cancelSubscription);

module.exports = router;
