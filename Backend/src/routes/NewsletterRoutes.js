const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { subscribe, unsubscribe, listSubscribers, exportSubscribers } = require('../controllers/NewsletterController');
const { protect } = require('../middleware/AuthenticationMiddleware');
const { authorize } = require('../middleware/AuthorizationMiddleware');
const { rateLimit } = require('express-rate-limit');
const newsletterLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false, message: { success: false, message: 'Too many newsletter requests. Try again later.' } });

router.post(
  '/',
  newsletterLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('consent').equals('true').withMessage('Please provide marketing consent')
  ],
  subscribe
);

router.post(
  '/unsubscribe',
  newsletterLimiter,
  [
    body('token').isHexadecimal().isLength({ min: 64, max: 64 })
  ],
  unsubscribe
);

router.get('/export', protect, authorize('super_admin', 'admin'), exportSubscribers);
router.get('/', protect, authorize('super_admin', 'admin', 'manager'), listSubscribers);

module.exports = router;
