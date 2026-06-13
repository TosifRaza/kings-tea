const Testimonial = require('../models/TestimonialModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');

// @desc    Get all testimonials
// @route   GET /api/testimonials
const getTestimonials = async (req, res) => {
  try {
    const { featured, active } = req.query;
    let filter = {};

    if (featured === 'true') filter.featured = true;
    if (active === 'false') {
      // allow inactive only for admin
    } else {
      filter.isActive = true;
    }

    const testimonials = await Testimonial.find(filter).sort({ sortOrder: 1, createdAt: 1 });

    successResponse(res, 'Testimonials fetched successfully', { testimonials });
  } catch (error) {
    errorResponse(res, 'Error fetching testimonials', 500, error.message);
  }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return errorResponse(res, 'Testimonial not found', 404);
    }

    successResponse(res, 'Testimonial fetched successfully', { testimonial });
  } catch (error) {
    errorResponse(res, 'Error fetching testimonial', 500, error.message);
  }
};

// @desc    Create testimonial
// @route   POST /api/testimonials
const createTestimonial = async (req, res) => {
  try {
    const { name, location, quote, rating, avatar, featured, sortOrder, isActive } = req.body;

    const testimonial = await Testimonial.create({
      name,
      location,
      quote,
      rating,
      avatar,
      featured: featured || false,
      sortOrder: sortOrder || 0,
      isActive: isActive !== undefined ? isActive : true
    });

    successResponse(res, 'Testimonial created successfully', { testimonial }, 201);
  } catch (error) {
    errorResponse(res, 'Error creating testimonial', 500, error.message);
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return errorResponse(res, 'Testimonial not found', 404);
    }

    successResponse(res, 'Testimonial updated successfully', { testimonial });
  } catch (error) {
    errorResponse(res, 'Error updating testimonial', 500, error.message);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return errorResponse(res, 'Testimonial not found', 404);
    }

    successResponse(res, 'Testimonial deleted successfully');
  } catch (error) {
    errorResponse(res, 'Error deleting testimonial', 500, error.message);
  }
};

module.exports = {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
