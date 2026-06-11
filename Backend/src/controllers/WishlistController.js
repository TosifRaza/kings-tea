const Wishlist = require('../models/WishlistModel');
const Product = require('../models/ProductModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');

const getWishlist = async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    const populatedItems = [];
    for (const item of wishlistItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        populatedItems.push({
          _id: item._id,
          productId: product._id,
          name: product.name,
          price: product.price,
          comparePrice: product.comparePrice,
          image: product.images && product.images.length > 0 ? product.images[0] : '',
          inStock: product.inStock,
          category: product.category,
          createdAt: item.createdAt
        });
      }
    }

    return successResponse(res, populatedItems, 'Wishlist fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch wishlist', 500);
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return errorResponse(res, 'Product ID is required', 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    const existing = await Wishlist.findOne({
      userId: req.user.userId,
      productId
    });

    if (existing) {
      return errorResponse(res, 'Product already in wishlist', 400);
    }

    const wishlistItem = await Wishlist.create({
      userId: req.user.userId,
      productId
    });

    return successResponse(res, wishlistItem, 'Added to wishlist', 201);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 'Product already in wishlist', 400);
    }
    return errorResponse(res, error.message || 'Failed to add to wishlist', 500);
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOneAndDelete({
      userId: req.user.userId,
      productId: req.params.productId
    });

    if (!wishlistItem) {
      return errorResponse(res, 'Item not found in wishlist', 404);
    }

    return successResponse(res, null, 'Removed from wishlist');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to remove from wishlist', 500);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
