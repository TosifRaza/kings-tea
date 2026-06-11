const Subscription = require('../models/SubscriptionModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');
const { validationResult } = require('express-validator');

const getNextBillingDate = (plan) => {
  const now = new Date();
  switch (plan) {
    case 'monthly':
      return new Date(now.setMonth(now.getMonth() + 1));
    case 'quarterly':
      return new Date(now.setMonth(now.getMonth() + 3));
    case 'yearly':
      return new Date(now.setFullYear(now.getFullYear() + 1));
    default:
      return new Date(now.setMonth(now.getMonth() + 1));
  }
};

const listSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = {};

    if (req.user.role === 'customer') {
      filter.userId = req.user.userId;
    }

    if (status) {
      filter.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Subscription.countDocuments(filter);
    const subscriptions = await Subscription.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const result = {
      docs: subscriptions,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    };

    return successResponse(res, result, 'Subscriptions fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch subscriptions', 500);
  }
};

const createSubscription = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400);
  }

  try {
    const { plan, price } = req.body;

    const activeSubscription = await Subscription.findOne({
      userId: req.user.userId,
      status: 'active'
    });

    if (activeSubscription) {
      return errorResponse(res, 'You already have an active subscription', 400);
    }

    const subscription = await Subscription.create({
      userId: req.user.userId,
      plan,
      status: 'active',
      startDate: new Date(),
      nextBillingDate: getNextBillingDate(plan),
      price
    });

    return successResponse(res, subscription, 'Subscription created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to create subscription', 500);
  }
};

const getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id).populate('userId', 'name email');
    if (!subscription) {
      return errorResponse(res, 'Subscription not found', 404);
    }

    if (req.user.role === 'customer' && subscription.userId._id.toString() !== req.user.userId) {
      return errorResponse(res, 'Not authorized to view this subscription', 403);
    }

    return successResponse(res, subscription, 'Subscription fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch subscription', 500);
  }
};

const updateSubscription = async (req, res) => {
  try {
    const { status, plan, price } = req.body;
    const updateData = {};

    if (status) updateData.status = status;
    if (plan) updateData.plan = plan;
    if (price) updateData.price = price;

    if (plan) {
      updateData.nextBillingDate = getNextBillingDate(plan);
    }

    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!subscription) {
      return errorResponse(res, 'Subscription not found', 404);
    }

    return successResponse(res, subscription, 'Subscription updated successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to update subscription', 500);
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return errorResponse(res, 'Subscription not found', 404);
    }

    if (req.user.role === 'customer' && subscription.userId.toString() !== req.user.userId) {
      return errorResponse(res, 'Not authorized to cancel this subscription', 403);
    }

    subscription.status = 'cancelled';
    subscription.endDate = new Date();
    await subscription.save();

    return successResponse(res, subscription, 'Subscription cancelled successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to cancel subscription', 500);
  }
};

module.exports = {
  listSubscriptions,
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription
};
