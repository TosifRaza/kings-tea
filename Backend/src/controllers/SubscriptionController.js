const Subscription = require('../models/SubscriptionModel');
const SubscriptionPlan = require('../models/SubscriptionPlanModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');

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

// ============================================================
// PUBLIC — Get all subscription plans (no auth required)
// Used by Frontend subscription page to display plans
// ============================================================
const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ active: true }).sort({ sortOrder: 1, name: 1 }).lean();
    return successResponse(res, { plans }, 'Published subscription plans fetched');
  } catch { return errorResponse(res, 'Unable to load subscription plans', 500); }
};

// ============================================================
// PUBLIC — Get single subscription plan by ID (no auth required)
// ============================================================
const getSubscriptionPlanById = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findOne({ _id: req.params.id, active: true }).lean();
    return plan ? successResponse(res, plan) : errorResponse(res, 'Subscription plan not found', 404);
  } catch { return errorResponse(res, 'Subscription plan not found', 404); }
};

const listAdminPlans = async (_req, res) => {
  try { return successResponse(res, await SubscriptionPlan.find().sort({ sortOrder: 1, name: 1 }).lean()); }
  catch { return errorResponse(res, 'Unable to load subscription plans', 500); }
};

const savePlan = async (req, res) => {
  const { id } = req.params;
  const { name, slug, description = '', price, currency = 'INR', interval, benefits = [], active = false, sortOrder = 0 } = req.body || {};
  if (typeof name !== 'string' || !name.trim() || typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !Number.isFinite(Number(price)) || Number(price) < 0 || !['month', 'quarter', 'year'].includes(interval) || !Array.isArray(benefits) || benefits.length > 20 || benefits.some((item) => typeof item !== 'string' || item.length > 200)) {
    return errorResponse(res, 'Provide a valid name, slug, price, billing interval, and benefits list', 400);
  }
  try {
    const data = { name: name.trim(), slug, description: String(description).slice(0, 2000), price: Number(price), currency: String(currency).toUpperCase(), interval, benefits, active: active === true, sortOrder: Number(sortOrder) || 0 };
    const plan = id
      ? await SubscriptionPlan.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      : await SubscriptionPlan.create(data);
    if (!plan) return errorResponse(res, 'Subscription plan not found', 404);
    return successResponse(res, plan, id ? 'Plan updated' : 'Plan created', id ? 200 : 201);
  } catch (error) {
    return errorResponse(res, error.code === 11000 ? 'A plan already uses that slug' : 'Unable to save subscription plan', error.code === 11000 ? 409 : 400);
  }
};

const deletePlan = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndDelete(req.params.id);
    return plan ? successResponse(res, null, 'Plan deleted') : errorResponse(res, 'Subscription plan not found', 404);
  } catch { return errorResponse(res, 'Unable to delete subscription plan', 500); }
};

// ============================================================
// PROTECTED — List user subscriptions (requires auth)
// ============================================================
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
  // Enrollment must be wired to published plan definitions and a verified payment flow.
  return errorResponse(res, 'Subscriptions are temporarily unavailable until plans and payment processing are configured', 503);
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
  getSubscriptionPlans,
  getSubscriptionPlanById,
  listAdminPlans,
  savePlan,
  deletePlan,
  listSubscriptions,
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription
};
