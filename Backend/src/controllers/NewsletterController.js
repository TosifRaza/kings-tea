const Newsletter = require('../models/NewsletterModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');
const { validationResult } = require('express-validator');

const subscribe = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400);
  }

  try {
    const { email, name } = req.body;

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (!existing.active) {
        existing.active = true;
        existing.name = name || existing.name;
        await existing.save();
        return successResponse(res, existing, 'Re-subscribed successfully');
      }
      return errorResponse(res, 'Email already subscribed', 400);
    }

    const subscription = await Newsletter.create({
      email,
      name: name || '',
      active: true
    });

    return successResponse(res, subscription, 'Subscribed successfully', 201);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 'Email already subscribed', 400);
    }
    return errorResponse(res, error.message || 'Failed to subscribe', 500);
  }
};

const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 'Email is required', 400);
    }

    const subscription = await Newsletter.findOne({ email });
    if (!subscription) {
      return errorResponse(res, 'Email not found', 404);
    }

    subscription.active = false;
    await subscription.save();

    return successResponse(res, null, 'Unsubscribed successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to unsubscribe', 500);
  }
};

const listSubscribers = async (req, res) => {
  try {
    const { page = 1, limit = 10, active } = req.query;
    const filter = {};

    if (active !== undefined) {
      filter.active = active === 'true';
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Newsletter.countDocuments(filter);
    const subscribers = await Newsletter.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const result = {
      docs: subscribers,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    };

    return successResponse(res, result, 'Subscribers fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch subscribers', 500);
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  listSubscribers
};
