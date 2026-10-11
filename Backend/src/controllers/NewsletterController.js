const Newsletter = require('../models/NewsletterModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

const tokenHash = (token) => crypto.createHash('sha256').update(token).digest('hex');

const subscribe = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400);
  }

  try {
    const { email, name, consent } = req.body;
    if (consent !== true) return errorResponse(res, 'Marketing consent is required to subscribe', 400);
    const normalizedEmail = String(email).trim().toLowerCase();
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    const existing = await Newsletter.findOne({ email: normalizedEmail }).select('+unsubscribeTokenHash');
    if (existing) {
      if (existing.active) return successResponse(res, { subscribed: true }, 'Subscription confirmed');
      existing.active = true;
      existing.name = name || existing.name;
      existing.marketingConsentAt = new Date();
      existing.unsubscribeTokenHash = tokenHash(unsubscribeToken);
      await existing.save();
      return successResponse(res, { subscribed: true, unsubscribeToken }, 'Subscription confirmed');
    }

    const subscription = await Newsletter.create({
      email: normalizedEmail,
      name: name || '',
      active: true,
      marketingConsentAt: new Date(),
      unsubscribeTokenHash: tokenHash(unsubscribeToken),
    });

    return successResponse(res, { subscribed: true, unsubscribeToken }, 'Subscription confirmed', 201);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 'Email already subscribed', 400);
    }
    return errorResponse(res, error.message || 'Failed to subscribe', 500);
  }
};

const unsubscribe = async (req, res) => {
  try {
    const { token } = req.body;
    if (!/^[a-f0-9]{64}$/i.test(String(token || ''))) return errorResponse(res, 'A valid unsubscribe token is required', 400);
    const subscription = await Newsletter.findOne({ unsubscribeTokenHash: tokenHash(token), active: true }).select('+unsubscribeTokenHash');
    if (!subscription) return errorResponse(res, 'This unsubscribe link is invalid or has already been used', 400);
    subscription.active = false;
    subscription.unsubscribeTokenHash = null;
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
    const subscribers = await Newsletter.find(filter).select('-unsubscribeTokenHash')
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

const exportSubscribers = async (_req, res) => {
  try {
    const subscribers = await Newsletter.find({ active: true }).select('email name marketingConsentAt createdAt').sort({ createdAt: -1 }).lean();
    const quote = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = ['email,name,consent_at,subscribed_at', ...subscribers.map((subscriber) => [
      quote(subscriber.email), quote(subscriber.name), quote(subscriber.marketingConsentAt?.toISOString()), quote(subscriber.createdAt?.toISOString()),
    ].join(','))].join('\r\n');
    res.set({ 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="newsletter-subscribers.csv"', 'Cache-Control': 'no-store' });
    return res.send(csv);
  } catch {
    return errorResponse(res, 'Unable to export subscribers', 500);
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  listSubscribers,
  exportSubscribers,
};
