const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { subscribe, unsubscribe, listSubscribers } = require('../controllers/NewsletterController');
const { protect } = require('../middleware/AuthenticationMiddleware');
const { authorize } = require('../middleware/AuthorizationMiddleware');

router.post(
  '/',
  [
    body('email').isEmail().withMessage('Please provide a valid email')
  ],
  subscribe
);

router.post(
  '/unsubscribe',
  [
    body('email').isEmail().withMessage('Please provide a valid email')
  ],
  unsubscribe
);

router.get('/', protect, authorize('super_admin', 'admin', 'manager'), listSubscribers);

module.exports = router;
