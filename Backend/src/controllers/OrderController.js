const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');
const { validationResult } = require('express-validator');

const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `KT-${timestamp}-${random}`;
};

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
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch orders', 500);
  }
};

const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400);
  }

  try {
    const {
      items,
      shippingName,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZip,
      shippingCountry,
      paymentMethod,
      notes
    } = req.body;

    if (!items || items.length === 0) {
      return errorResponse(res, 'Order must contain at least one item', 400);
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return errorResponse(res, `Product not found: ${item.productId}`, 404);
      }
      if (!product.inStock || product.stockQuantity < item.quantity) {
        return errorResponse(res, `Product out of stock: ${product.name}`, 400);
      }

      const orderItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images && product.images.length > 0 ? product.images[0] : ''
      };
      orderItems.push(orderItem);
      subtotal += product.price * item.quantity;
    }

    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: req.user.userId,
      items: orderItems,
      subtotal,
      shipping,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      shippingName,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingZip,
      shippingCountry,
      paymentMethod: paymentMethod || 'card',
      notes: notes || ''
    });

    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stockQuantity: -item.quantity }
      });
    }

    return successResponse(res, order, 'Order created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to create order', 500);
  }
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
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch order', 500);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, paymentStatus } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!order) {
      return errorResponse(res, 'Order not found', 404);
    }

    return successResponse(res, order, 'Order updated successfully');
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
