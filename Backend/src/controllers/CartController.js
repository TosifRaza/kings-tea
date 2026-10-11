const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');
const { normalizeWeightGrams, parseWeightGrams, getPriceForWeight } = require('../utils/productPricing');

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.userId, items: [] });
    }

    const populatedItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const baseWeightGrams = parseWeightGrams(product.weight) || 100;
        const weightGrams = normalizeWeightGrams(item.weightGrams, baseWeightGrams);
        populatedItems.push({
          productId: product._id,
          name: product.name,
          price: getPriceForWeight(product.price, baseWeightGrams, weightGrams),
          image: product.images && product.images.length > 0 ? product.images[0] : '',
          quantity: item.quantity,
          weight: `${weightGrams}g`,
          weightGrams,
          inStock: product.inStock,
          stockQuantity: product.stockQuantity
        });
      }
    }

    const subtotal = populatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return successResponse(res, {
      items: populatedItems,
      subtotal,
      itemCount: populatedItems.reduce((sum, item) => sum + item.quantity, 0)
    }, 'Cart fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch cart', 500);
  }
};

const saveCart = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return errorResponse(res, 'Items array is required', 400);
    }

    const cartItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return errorResponse(res, `Product not found: ${item.productId}`, 404);
      }
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) return errorResponse(res, 'Cart quantity must be a positive whole number.', 400);
      const baseWeightGrams = parseWeightGrams(product.weight) || 100;
      const requestedWeight = item.weightGrams ?? parseWeightGrams(item.weight);
      const weightGrams = normalizeWeightGrams(requestedWeight, baseWeightGrams);
      const parsedRequestedWeight = requestedWeight === undefined || requestedWeight === null
        ? null
        : parseWeightGrams(requestedWeight);
      if (parsedRequestedWeight !== null && parsedRequestedWeight !== weightGrams) {
        return errorResponse(res, 'Cart weight must be a whole number between 1 and 10000 grams.', 400);
      }
      cartItems.push({ productId: product._id, quantity, weightGrams });
    }

    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.userId },
      { items: cartItems },
      { new: true, upsert: true, runValidators: true }
    );

    return successResponse(res, cart, 'Cart saved successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to save cart', 500);
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.userId },
      { items: [] },
      { new: true }
    );

    return successResponse(res, cart, 'Cart cleared successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to clear cart', 500);
  }
};

module.exports = {
  getCart,
  saveCart,
  clearCart
};
