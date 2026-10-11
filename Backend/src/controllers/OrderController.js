const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const mongoose = require('mongoose');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');

const listOrders = async (req, res) => {
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

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('userId', 'name email');

    const result = {
      docs: orders,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    };

    return successResponse(res, result, 'Orders fetched successfully');
    // return successResponse(res, 'Orders fetched successfully', result);
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch orders', 500);
  }
};

const createOrder = async (req, res) => {
  // There is no payment gateway/webhook configured in this project yet. Fail closed
  // before reserving stock so an unpaid order cannot look like a completed checkout.
  return errorResponse(res, 'Checkout is temporarily unavailable until a verified payment provider is configured', 503);
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');
    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    if (req.user.role === 'customer' && order.userId._id.toString() !== req.user.userId) {
      return errorResponse(res, 'Not authorized to view this order', 403);
    }

    return successResponse(res, order, 'Order fetched successfully');
    // return successResponse(res, 'Order fetched successfully', order);
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch order', 500);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, paymentStatus } = req.body;

    if (paymentStatus !== undefined) {
      return errorResponse(res, 'Payment status can only be changed by a verified payment integration', 409);
    }

    const currentOrder = await Order.findById(req.params.id);
    if (!currentOrder) return errorResponse(res, 'Order not found', 404);

    if (currentOrder.paymentMethod === 'cod' && status === 'cancelled' && currentOrder.inventoryReserved) {
      const session = await mongoose.startSession();
      let cancelledOrder;
      try {
        await session.withTransaction(async () => {
          const order = await Order.findById(req.params.id).session(session);
          if (!order) throw new Error('Order not found');
          if (order.paymentMethod === 'cod' && order.inventoryReserved) {
            const grouped = new Map();
            for (const item of order.items) grouped.set(String(item.productId), (grouped.get(String(item.productId)) || 0) + item.quantity);
            for (const [productId, quantity] of grouped) {
              await Product.updateOne({ _id: productId }, { $inc: { stockQuantity: quantity }, $set: { inStock: true } }, { session });
            }
            order.inventoryReserved = false;
            order.paymentStatus = 'failed';
          }
          order.status = 'cancelled';
          if (trackingNumber) order.trackingNumber = trackingNumber;
          await order.save({ session });
          cancelledOrder = order;
        });
      } finally {
        await session.endSession();
      }
      return successResponse(res, cancelledOrder, 'Order cancelled and reserved stock released');
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (currentOrder.paymentMethod === 'cod' && status === 'delivered' && currentOrder.paymentStatus === 'cod_due') {
      updateData.paymentStatus = 'paid';
      updateData.inventoryReserved = false;
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    return successResponse(res, order, 'Order updated successfully');
    // return successResponse(res, 'Order updated successfully', order);
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to update order', 500);
  }
};

module.exports = {
  listOrders,
  createOrder,
  getOrder,
  updateOrderStatus
};
