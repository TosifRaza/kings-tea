const crypto = require('crypto');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');
const { MAX_WEIGHT_GRAMS, parseWeightGrams, normalizeWeightGrams, getPriceForWeight } = require('../utils/productPricing');

const getPaymentCredentials = () => ({
  keyId: process.env.RAZORPAY_KEY_ID,
  keySecret: process.env.RAZORPAY_KEY_SECRET,
  webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
});

const getRazorpayClient = () => {
  const { keyId, keySecret } = getPaymentCredentials();
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

const getPaymentConfig = (req, res) => {
  const { keyId, keySecret, webhookSecret } = getPaymentCredentials();
  return successResponse(res, {
    enabled: Boolean(keyId && keySecret && webhookSecret),
    onlineEnabled: Boolean(keyId && keySecret && webhookSecret),
    cashOnDeliveryEnabled: true,
    keyId: keyId || '',
    currency: 'INR',
  }, 'Payment configuration fetched');
};

const createCashOnDeliveryOrder = async (req, res) => {
  const items = req.body.items;
  if (!Array.isArray(items) || !items.length || items.length > 30) {
    return errorResponse(res, 'Your cart must contain between 1 and 30 products', 400);
  }
  const checkoutKey = String(req.get('Idempotency-Key') || '').trim();
  if (!/^[A-Za-z0-9._:-]{8,100}$/.test(checkoutKey)) return errorResponse(res, 'A valid checkout request key is required', 400);

  const session = await mongoose.startSession();
  try {
    let createdOrder;
    await session.withTransaction(async () => {
      const previous = await Order.findOne({ userId: req.user.userId, checkoutKey }).session(session);
      if (previous) {
        if (previous.paymentMethod !== 'cod' || previous.paymentStatus !== 'cod_due') throw new Error('CHECKOUT_KEY_USED');
        createdOrder = previous;
        return;
      }

      const variants = new Map();
      for (const item of items) {
        if (!mongoose.Types.ObjectId.isValid(item.productId) || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1 || Number(item.quantity) > 100) {
          throw new Error('INVALID_CART');
        }
        const requestedWeight = item.weightGrams === undefined || item.weightGrams === null ? null : Number(item.weightGrams);
        if (requestedWeight !== null && (!Number.isInteger(requestedWeight) || requestedWeight < 1 || requestedWeight > MAX_WEIGHT_GRAMS)) {
          throw new Error('INVALID_CART_WEIGHT');
        }
        const id = String(item.productId);
        const key = `${id}:${requestedWeight || 'base'}`;
        const existing = variants.get(key);
        variants.set(key, { productId: id, requestedWeight, quantity: (existing?.quantity || 0) + Number(item.quantity) });
      }

      const orderItems = [];
      const inventoryQuantities = new Map();
      let subtotal = 0;
      for (const { productId, requestedWeight, quantity } of variants.values()) {
        const product = await Product.findOne({ _id: productId, isActive: { $ne: false } }).select('name price images inStock stockQuantity weight').session(session);
        if (!product) throw new Error('PRODUCT_UNAVAILABLE');
        const baseWeightGrams = parseWeightGrams(product.weight) || 100;
        const weightGrams = normalizeWeightGrams(requestedWeight, baseWeightGrams);
        const unitPrice = getPriceForWeight(product.price, baseWeightGrams, weightGrams);
        inventoryQuantities.set(productId, (inventoryQuantities.get(productId) || 0) + quantity);
        orderItems.push({ productId: product._id, name: product.name, price: unitPrice, quantity, weight: `${weightGrams}g`, weightGrams, image: product.images?.[0] || '' });
        subtotal += unitPrice * quantity;
      }

      const threshold = configuredAmount('FREE_SHIPPING_THRESHOLD_INR', 1000);
      const flatRate = configuredAmount('SHIPPING_FLAT_RATE_INR', 99);
      const taxRate = configuredAmount('TAX_RATE_PERCENT', 0);
      if (![threshold, flatRate, taxRate].every(Number.isFinite) || taxRate > 100) throw new Error('STORE_PRICING_UNAVAILABLE');
      const shipping = subtotal >= threshold ? 0 : flatRate;
      const tax = Math.round(subtotal * taxRate) / 100;
      const total = Math.round((subtotal + shipping + tax) * 100) / 100;
      if (!Number.isSafeInteger(Math.round(total * 100)) || total <= 0) throw new Error('INVALID_ORDER_AMOUNT');

      for (const [productId, quantity] of inventoryQuantities) {
        const updated = await Product.findOneAndUpdate(
          { _id: productId, isActive: { $ne: false }, inStock: true, stockQuantity: { $gte: quantity } },
          { $inc: { stockQuantity: -quantity }, $set: { inStock: true } },
          { new: true, session, runValidators: true },
        );
        if (!updated) {
          const unavailable = await Product.findById(productId).select('name stockQuantity').session(session);
          throw new Error(`INSUFFICIENT_STOCK:${unavailable?.name || 'A product'}:${unavailable?.stockQuantity ?? 0}:${quantity}`);
        }
        if (updated.stockQuantity <= 0) {
          updated.inStock = false;
          await updated.save({ session });
        }
      }

      const orderNumber = `KT-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      [createdOrder] = await Order.create([{
        orderNumber,
        userId: req.user.userId,
        items: orderItems,
        subtotal: Math.round(subtotal * 100) / 100,
        shipping,
        tax,
        total,
        currency: 'INR',
        shippingName: String(req.body.shippingName || '').trim(),
        shippingPhone: String(req.body.shippingPhone || '').trim(),
        customerEmail: req.user.email || '',
        shippingAddress: String(req.body.shippingAddress || '').trim(),
        shippingCity: String(req.body.shippingCity || '').trim(),
        shippingState: String(req.body.shippingState || '').trim(),
        shippingZip: String(req.body.shippingZip || '').trim(),
        shippingCountry: String(req.body.shippingCountry || '').trim(),
        paymentMethod: 'cod',
        paymentStatus: 'cod_due',
        status: 'pending',
        inventoryReserved: true,
        checkoutKey,
      }], { session });
    });
    return successResponse(res, createdOrder, 'Cash-on-delivery order placed', 201);
  } catch (error) {
    if (error.code === 11000) {
      const existing = await Order.findOne({ userId: req.user.userId, checkoutKey });
      if (existing?.paymentMethod === 'cod' && existing.paymentStatus === 'cod_due') {
        return successResponse(res, existing, 'Cash-on-delivery order already placed');
      }
      return errorResponse(res, 'This checkout request has already been used', 409);
    }
    if (error.message === 'CHECKOUT_KEY_USED') return errorResponse(res, 'This checkout request has already been used', 409);
    if (error.message === 'INVALID_CART') return errorResponse(res, 'Cart contains an invalid product or quantity', 400);
    if (error.message === 'INVALID_CART_WEIGHT') return errorResponse(res, 'Cart contains an invalid weight', 400);
    if (error.message === 'PRODUCT_UNAVAILABLE') return errorResponse(res, 'A product in your cart is no longer available', 409);
    if (error.message.startsWith('INSUFFICIENT_STOCK:')) {
      const [, name, available, requested] = error.message.split(':');
      return errorResponse(res, `${name} has ${available} pack(s) in stock, but your cart has ${requested}. Reduce the quantity or contact us.`, 409);
    }
    if (error.message === 'STORE_PRICING_UNAVAILABLE') return errorResponse(res, 'Store pricing is not configured correctly', 503);
    if (error.message === 'INVALID_ORDER_AMOUNT') return errorResponse(res, 'Order amount is invalid', 400);
    return errorResponse(res, 'Unable to place your cash-on-delivery order', 500);
  } finally {
    await session.endSession();
  }
};

const configuredAmount = (name, fallback) => {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : NaN;
};

const createPaymentOrder = async (req, res) => {
  const razorpay = getRazorpayClient();
  if (!razorpay || !getPaymentCredentials().webhookSecret) return errorResponse(res, 'Online payments are not configured', 503);

  const items = req.body.items;
  if (!Array.isArray(items) || !items.length || items.length > 30) {
    return errorResponse(res, 'Your cart must contain between 1 and 30 products', 400);
  }
  const checkoutKey = String(req.get('Idempotency-Key') || '').trim();
  if (!/^[A-Za-z0-9._:-]{8,100}$/.test(checkoutKey)) return errorResponse(res, 'A valid checkout request key is required', 400);

  try {
    const previous = await Order.findOne({ userId: req.user.userId, checkoutKey });
    if (previous) {
      if (!previous.razorpayOrderId || previous.paymentStatus !== 'pending') {
        return errorResponse(res, 'This checkout request has already been used', 409);
      }
      return successResponse(res, {
        orderId: previous._id,
        orderNumber: previous.orderNumber,
        razorpayOrderId: previous.razorpayOrderId,
        amount: Math.round(previous.total * 100),
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID,
      }, 'Payment order reused');
    }

    const variants = new Map();
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId) || !Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1) {
        return errorResponse(res, 'Cart contains an invalid product or quantity', 400);
      }
      const id = String(item.productId);
      const requestedWeight = item.weightGrams === undefined || item.weightGrams === null
        ? null
        : Number(item.weightGrams);
      if (requestedWeight !== null && (!Number.isInteger(requestedWeight) || requestedWeight < 1 || requestedWeight > MAX_WEIGHT_GRAMS)) {
        return errorResponse(res, 'Cart contains an invalid weight', 400);
      }
      const key = `${id}:${requestedWeight || 'base'}`;
      const existing = variants.get(key);
      variants.set(key, { productId: id, requestedWeight, quantity: (existing?.quantity || 0) + Number(item.quantity) });
    }

    const orderItems = [];
    const inventoryQuantities = new Map();
    let subtotal = 0;
    for (const { productId, requestedWeight, quantity } of variants.values()) {
      const product = await Product.findOne({ _id: productId, isActive: { $ne: false } }).select('name price images inStock stockQuantity weight');
      if (!product) return errorResponse(res, 'A product in your cart is no longer available', 409);
      const baseWeightGrams = parseWeightGrams(product.weight) || 100;
      const weightGrams = normalizeWeightGrams(requestedWeight, baseWeightGrams);
      const unitPrice = getPriceForWeight(product.price, baseWeightGrams, weightGrams);
      inventoryQuantities.set(productId, (inventoryQuantities.get(productId) || 0) + quantity);
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: unitPrice,
        quantity,
        weight: `${weightGrams}g`,
        weightGrams,
        image: product.images?.[0] || '',
      });
      subtotal += unitPrice * quantity;
    }
    for (const [productId, quantity] of inventoryQuantities) {
      const product = await Product.findById(productId).select('name inStock stockQuantity');
      if (!product?.inStock || product.stockQuantity < quantity) {
        return errorResponse(res, `${product?.name || 'A product'} does not have enough stock`, 409);
      }
    }

    const threshold = configuredAmount('FREE_SHIPPING_THRESHOLD_INR', 1000);
    const flatRate = configuredAmount('SHIPPING_FLAT_RATE_INR', 99);
    const taxRate = configuredAmount('TAX_RATE_PERCENT', 0);
    if (![threshold, flatRate, taxRate].every(Number.isFinite) || taxRate > 100) {
      return errorResponse(res, 'Store pricing is not configured correctly', 503);
    }
    const shipping = subtotal >= threshold ? 0 : flatRate;
    const tax = Math.round(subtotal * taxRate) / 100;
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;
    if (!Number.isSafeInteger(Math.round(total * 100)) || total <= 0) {
      return errorResponse(res, 'Order amount is invalid', 400);
    }

    const orderNumber = `KT-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const providerOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: 'INR',
      receipt: orderNumber,
      notes: { customerId: req.user.userId },
    });
    const order = await Order.create({
      orderNumber,
      userId: req.user.userId,
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      shipping,
      tax,
      total,
      currency: 'INR',
      shippingName: String(req.body.shippingName || '').trim(),
      shippingPhone: String(req.body.shippingPhone || '').trim(),
      customerEmail: req.user.email || '',
      shippingAddress: String(req.body.shippingAddress || '').trim(),
      shippingCity: String(req.body.shippingCity || '').trim(),
      shippingState: String(req.body.shippingState || '').trim(),
      shippingZip: String(req.body.shippingZip || '').trim(),
      shippingCountry: String(req.body.shippingCountry || '').trim(),
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
      razorpayOrderId: providerOrder.id,
      checkoutKey,
    });

    return successResponse(res, {
      orderId: order._id,
      orderNumber,
      razorpayOrderId: providerOrder.id,
      amount: providerOrder.amount,
      currency: providerOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    }, 'Secure payment order created', 201);
  } catch (error) {
    if (error.code === 11000) return errorResponse(res, 'Checkout request already exists; retry with the same key', 409);
    return errorResponse(res, 'Unable to create a secure payment order', 502);
  }
};

const finalizePaidOrder = async (order, payment) => {
  if (order.paymentStatus === 'paid') return order;
  if (order.paymentStatus !== 'pending') throw new Error('Order is no longer payable');
  if (payment.order_id !== order.razorpayOrderId || payment.currency !== order.currency || payment.amount !== Math.round(order.total * 100)) {
    throw new Error('Payment does not match this order');
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const freshOrder = await Order.findById(order._id).session(session);
      if (!freshOrder) throw new Error('Order not found');
      if (freshOrder.paymentStatus === 'paid') return;
      const grouped = new Map();
      for (const item of freshOrder.items) grouped.set(String(item.productId), (grouped.get(String(item.productId)) || 0) + item.quantity);
      for (const [productId, quantity] of grouped) {
        const product = await Product.findById(productId).session(session);
        if (!product || product.isActive === false || !product.inStock || product.stockQuantity < quantity) {
          throw new Error('Inventory changed before payment confirmation');
        }
        const remainingStock = product.stockQuantity - quantity;
        const updated = await Product.findOneAndUpdate(
          { _id: productId, isActive: { $ne: false }, inStock: true, stockQuantity: { $gte: quantity } },
          { $inc: { stockQuantity: -quantity }, $set: { inStock: remainingStock > 0 } },
          { new: true, session, runValidators: true },
        );
        if (!updated) throw new Error('Inventory changed before payment confirmation');
      }
      freshOrder.paymentId = payment.id;
      freshOrder.paymentStatus = 'paid';
      freshOrder.status = 'processing';
      await freshOrder.save({ session });
    });
    return Order.findById(order._id);
  } finally {
    await session.endSession();
  }
};

const refundIfCaptured = async (razorpay, paymentId, order) => {
  const refund = await razorpay.payments.refund(paymentId, {});
  await Order.updateOne({ _id: order._id, paymentStatus: 'pending' }, {
    $set: { paymentStatus: 'refunded', status: 'cancelled', paymentId, refundId: refund.id },
  });
  return refund;
};

const verifyPayment = async (req, res) => {
  const razorpay = getRazorpayClient();
  if (!razorpay || !getPaymentCredentials().webhookSecret) return errorResponse(res, 'Online payments are not configured', 503);
  const { orderId, razorpay_payment_id: paymentId, razorpay_order_id: providerOrderId, razorpay_signature: signature } = req.body;
  if (!orderId || !paymentId || !providerOrderId || !signature) return errorResponse(res, 'Payment verification details are incomplete', 400);

  try {
    const order = await Order.findOne({ _id: orderId, userId: req.user.userId });
    if (!order) return errorResponse(res, 'Order not found', 404);
    if (order.paymentStatus === 'paid') return successResponse(res, order, 'Payment already verified');
    if (order.razorpayOrderId !== providerOrderId) return errorResponse(res, 'Payment order does not match', 400);
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.razorpayOrderId}|${paymentId}`).digest();
    const supplied = Buffer.from(signature, 'hex');
    if (supplied.length !== expected.length || !crypto.timingSafeEqual(expected, supplied)) {
      return errorResponse(res, 'Payment signature is invalid', 400);
    }
    const payment = await razorpay.payments.fetch(paymentId);
    if (payment.status !== 'captured') return errorResponse(res, 'Payment has not been captured yet', 409);
    try {
      const paidOrder = await finalizePaidOrder(order, payment);
      return successResponse(res, paidOrder, 'Payment verified and order confirmed');
    } catch (inventoryError) {
      await refundIfCaptured(razorpay, paymentId, order);
      return errorResponse(res, 'Inventory changed while payment completed. The payment was refunded; please place a new order.', 409);
    }
  } catch (error) {
    return errorResponse(res, 'Payment verification could not be completed', 502);
  }
};

const paymentWebhook = async (req, res) => {
  const { webhookSecret } = getPaymentCredentials();
  const signature = req.get('x-razorpay-signature') || '';
  if (!webhookSecret || !Buffer.isBuffer(req.body)) return res.status(503).json({ success: false });
  const expected = crypto.createHmac('sha256', webhookSecret).update(req.body).digest();
  const supplied = Buffer.from(signature, 'hex');
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(expected, supplied)) {
    return res.status(400).json({ success: false });
  }

  try {
    const event = JSON.parse(req.body.toString('utf8'));
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payment = event.payload?.payment?.entity;
      const providerOrderId = payment?.order_id || event.payload?.order?.entity?.id;
      if (providerOrderId) {
        const order = await Order.findOne({ razorpayOrderId: providerOrderId });
        if (order && order.paymentStatus === 'pending' && payment?.status === 'captured') {
          try {
            await finalizePaidOrder(order, payment);
          } catch {
            const razorpay = getRazorpayClient();
            if (razorpay && payment.id) await refundIfCaptured(razorpay, payment.id, order);
          }
        }
      }
    }
    return res.status(200).json({ received: true });
  } catch {
    return res.status(400).json({ success: false });
  }
};

module.exports = { getPaymentConfig, createPaymentOrder, createCashOnDeliveryOrder, verifyPayment, paymentWebhook };
