const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/AuthenticationMiddleware');
const { authorize } = require('../middleware/AuthorizationMiddleware');
const {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/TestimonialController');

// Public routes
router.get('/', getTestimonials);
router.get('/:id', getTestimonialById);

// Protected admin routes
router.post('/', protect, authorize('super_admin', 'admin', 'manager'), createTestimonial);
router.put('/:id', protect, authorize('super_admin', 'admin', 'manager'), updateTestimonial);
router.delete('/:id', protect, authorize('super_admin', 'admin'), deleteTestimonial);

module.exports = router;
