const Review = require('../models/ReviewModel');
const Product = require('../models/ProductModel');
const Order = require('../models/OrderModel');
const mongoose = require('mongoose');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');
const { validationResult } = require('express-validator');

const listReviews = async (req, res) => {
  try {
    const productId = req.params.productId || req.query.productId;
    const { page = 1, limit = 10 } = req.query;
    const isModerator = req.path === '/moderation' && ['super_admin', 'admin', 'manager'].includes(req.user?.role);

    if (!productId && !isModerator) {
      return errorResponse(res, 'Product ID is required', 400);
    }

    if (productId && !mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse(res, 'Product ID is invalid', 400);
    }
    const filter = {
      ...(productId ? { productId } : {}),
      ...(!isModerator ? { approved: true, isSeeded: { $ne: true } } : {}),
    };
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .populate('userId', 'name image')
      .populate('productId', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const result = {
      docs: reviews,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    };

    return successResponse(res, result, 'Reviews fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch reviews', 500);
  }
};

const createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400);
  }

  try {
    const { productId, rating, title, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    const existingReview = await Review.findOne({
      userId: req.user.userId,
      productId
    });

    if (existingReview) {
      return errorResponse(res, 'You have already reviewed this product', 400);
    }

    const eligiblePurchase = await Order.exists({
      userId: req.user.userId,
      status: 'delivered',
      paymentStatus: 'paid',
      'items.productId': productId,
    });

    const review = await Review.create({
      userId: req.user.userId,
      productId,
      rating,
      title: title || '',
      comment: comment || '',
      verified: Boolean(eligiblePurchase),
      approved: false
    });

    const populatedReview = await Review.findById(review._id).populate('userId', 'name image');

    return successResponse(res, populatedReview, 'Review created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to create review', 500);
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return errorResponse(res, 'Review not found', 404);
    }

    if (review.userId.toString() !== req.user.userId && !['admin', 'super_admin', 'manager'].includes(req.user.role)) {
      return errorResponse(res, 'Not authorized to delete this review', 403);
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(req.params.id);

    const [stats] = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId.toString()), approved: true, isSeeded: { $ne: true } } },
      {
        $group: {
          _id: '$productId',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);

    if (stats) {
      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(stats.avgRating * 10) / 10,
        reviewCount: stats.count
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        reviewCount: 0
      });
    }

    return successResponse(res, null, 'Review deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to delete review', 500);
  }
};

const moderateReview = async (req, res) => {
  const { approved } = req.body;
  if (typeof approved !== 'boolean') return errorResponse(res, 'approved must be a boolean', 400);

  try {
    const review = await Review.findById(req.params.id);
    if (!review) return errorResponse(res, 'Review not found', 404);
    if (review.isSeeded && approved) {
      return errorResponse(res, 'Sample reviews cannot be published as customer reviews', 409);
    }
    review.approved = approved;
    await review.save();

    const [stats] = await Review.aggregate([
      { $match: { productId: review.productId, approved: true, isSeeded: { $ne: true } } },
      { $group: { _id: '$productId', average: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    await Product.findByIdAndUpdate(review.productId, {
      $set: { rating: stats ? Math.round(stats.average * 10) / 10 : 0, reviewCount: stats?.count || 0 },
    });

    return successResponse(res, review, approved ? 'Review approved' : 'Review hidden');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to moderate review', 500);
  }
};

module.exports = {
  listReviews,
  createReview,
  deleteReview,
  moderateReview
};
