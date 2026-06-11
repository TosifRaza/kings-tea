const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { submitMessage, listMessages } = require('../controllers/ContactController');
const { protect } = require('../middleware/AuthenticationMiddleware');
const { authorize } = require('../middleware/AuthorizationMiddleware');

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
  ],
  submitMessage
);

router.get('/', protect, authorize('super_admin', 'admin', 'manager'), listMessages);

module.exports = router;
