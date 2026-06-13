const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/AuthenticationMiddleware');
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
router.post('/', protect, createTestimonial);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;
