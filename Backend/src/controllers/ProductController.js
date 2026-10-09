const mongoose = require('mongoose');
const Product = require('../models/ProductModel');
const Review = require('../models/ReviewModel');
const Category = require('../models/CategoryModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');

const withLiveReviewStats = async (products) => {
  const list = (Array.isArray(products) ? products : [products]).filter(Boolean);
  if (list.length === 0) return [];

  const productIds = list.map((product) => product._id).filter(Boolean);
  const stats = productIds.length > 0
    ? await Review.aggregate([
      { $match: { productId: { $in: productIds } } },
      {
        $group: {
          _id: '$productId',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ])
    : [];
  const statsByProductId = new Map(stats.map((entry) => [String(entry._id), entry]));

  return list.map((product) => {
    const record = typeof product.toObject === 'function' ? product.toObject() : { ...product };
    const reviewStats = statsByProductId.get(String(record._id));
    return {
      ...record,
      rating: reviewStats ? Math.round(reviewStats.averageRating * 10) / 10 : 0,
      reviewCount: reviewStats?.reviewCount || 0,
    };
  });
};

const getGalleryPaths = (value) => {
  if (value === undefined) return undefined;
  try {
    const paths = JSON.parse(value);
    return Array.isArray(paths) ? paths.filter((path) => typeof path === 'string' && path.trim()) : [];
  } catch {
    return [];
  }
};

const getRelatedProductIds = (value) => {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return [];
  try {
    const ids = JSON.parse(value);
    return Array.isArray(ids) ? ids : [];
  } catch {
    return null;
  }
};

const validateRelatedProducts = async (value, currentProductId) => {
  const ids = getRelatedProductIds(value);
  if (ids === undefined) return { ids: undefined };
  if (ids === null) return { error: 'Related products must be a valid list.' };

  const uniqueIds = [...new Set(ids.map((id) => String(id)))].filter((id) => id !== String(currentProductId || ''));
  if (uniqueIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
    return { error: 'One or more related product IDs are invalid.' };
  }
  if (uniqueIds.length > 10) return { error: 'You can select up to 10 related products.' };

  const existingCount = await Product.countDocuments({ _id: { $in: uniqueIds } });
  if (existingCount !== uniqueIds.length) return { error: 'One or more related products no longer exist.' };
  return { ids: uniqueIds };
};

const relatedProductsPopulate = {
  path: 'relatedProducts',
  match: { isActive: true },
  select: 'name slug price comparePrice images category origin rating reviewCount featured bestSeller isNew gradientColor',
};
console.log('🎯 ProductController.js LOADED at', new Date().toISOString());
// Get all products
const getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 50, sort = '-createdAt' } = req.query;

    let query = {};

    if (category) {
      query.$or = [
        { category: category },
        { categoryId: category }
      ];
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const count = await Product.countDocuments(query);

    const productsWithReviewStats = await withLiveReviewStats(products);

    return successResponse(res, {
      products: productsWithReviewStats,
      totalProducts: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
    }, 'Products fetched successfully');
  } catch (error) {
    console.error('getProducts error:', error.message);
    return errorResponse(res, error.message);
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(relatedProductsPopulate);

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    const [productWithReviewStats] = await withLiveReviewStats(product);
    productWithReviewStats.relatedProducts = await withLiveReviewStats(productWithReviewStats.relatedProducts || []);

    return successResponse(res, { product: productWithReviewStats }, 'Product fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// ============================================================
// Get product by slug (PUBLIC — used by Frontend product pages)
// ============================================================
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate(relatedProductsPopulate);

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    const [productWithReviewStats] = await withLiveReviewStats(product);
    productWithReviewStats.relatedProducts = await withLiveReviewStats(productWithReviewStats.relatedProducts || []);

    return successResponse(res, { product: productWithReviewStats }, 'Product fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// Create product
// const createProduct = async (req, res) => {
//   try {
//     const productData = { ...req.body };

//     // 🔍 ADD THIS DEBUG BLOCK
//     console.log('========================================');
//     console.log('📦 CREATE PRODUCT DEBUG');
//     console.log('Body keys:', Object.keys(req.body));
//     console.log('Files count:', req.files ? req.files.length : 'NO req.files');
//     if (req.files && req.files.length > 0) {
//       console.log('First file object:', JSON.stringify({
//         fieldname: req.files[0].fieldname,
//         originalname: req.files[0].originalname,
//         path: req.files[0].path,
//         filename: req.files[0].filename,
//         mimetype: req.files[0].mimetype,
//       }, null, 2));
//     }
//     console.log('========================================');
//     // 🔍 END DEBUG BLOCK

//     if (req.files && req.files.length > 0) {
//        productData.images = req.files.map((file) => file.path);
//     }
//     // ... rest stays same
//     // if (req.files && req.files.length > 0) {
//     //   productData.images = req.files.map((file) => `/uploads/${file.filename}`);
//     // }
//     // if (req.files && req.files.length > 0) {
//     //    productData.images = req.files.map((file) => file.path);  
//     // }

//     if (productData.category && !productData.categoryId) {
//       if (productData.category.match(/^[0-9a-fA-F]{24}$/)) {
//         const cat = await Category.findById(productData.category);
//         if (cat) {
//           productData.categoryId = productData.category;
//           productData.category = cat.name;
//         }
//       }
//     }

//     if (productData.price) productData.price = Number(productData.price);
//     if (productData.comparePrice) productData.comparePrice = Number(productData.comparePrice);
//     if (productData.stockQuantity) productData.stockQuantity = Number(productData.stockQuantity);
//     if (productData.stock) productData.stock = Number(productData.stock);

//     if (productData.tastingNotes && typeof productData.tastingNotes === 'string') {
//       productData.tastingNotes = productData.tastingNotes.split(',').map(t => t.trim());
//     }

//     if (productData.stockQuantity !== undefined) {
//       productData.inStock = Number(productData.stockQuantity) > 0;
//     }

//     const product = await Product.create(productData);

//     return successResponse(res, { product }, 'Product created successfully', 201);
//   } catch (error) {
//     console.error('createProduct error:', error.message);
//     return errorResponse(res, error.message);
//   }
// };
// Create product
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    const related = await validateRelatedProducts(productData.relatedProducts);
    if (related.error) return errorResponse(res, related.error, 400);
    if (related.ids !== undefined) productData.relatedProducts = related.ids;

    // 🔍 DEBUG BLOCK
    console.log('========================================');
    console.log('📦 CREATE PRODUCT DEBUG');
    console.log('Body keys:', Object.keys(req.body));
    console.log('Files count:', req.files ? req.files.length : 'NO req.files');
    if (req.files && req.files.length > 0) {
      console.log('First file object:', JSON.stringify({
        fieldname: req.files[0].fieldname,
        originalname: req.files[0].originalname,
        path: req.files[0].path,
        filename: req.files[0].filename,
        mimetype: req.files[0].mimetype,
      }, null, 2));
    }
    console.log('========================================');
    // 🔍 END DEBUG BLOCK

    const galleryPaths = getGalleryPaths(req.body.galleryImages);
    const uploadedPaths = (req.files || []).map((file) => file.path);
    if (galleryPaths !== undefined || uploadedPaths.length > 0) {
      productData.images = [...(galleryPaths || []), ...uploadedPaths].slice(0, 4);
    }
    delete productData.galleryImages;

    if (productData.category && !productData.categoryId) {
      if (productData.category.match(/^[0-9a-fA-F]{24}$/)) {
        const cat = await Category.findById(productData.category);
        if (cat) {
          productData.categoryId = productData.category;
          productData.category = cat.name;
        }
      }
    }

    if (productData.price) productData.price = Number(productData.price);
    if (productData.comparePrice) productData.comparePrice = Number(productData.comparePrice);
    if (productData.stockQuantity) productData.stockQuantity = Number(productData.stockQuantity);
    if (productData.stock) productData.stock = Number(productData.stock);

    if (productData.tastingNotes && typeof productData.tastingNotes === 'string') {
      productData.tastingNotes = productData.tastingNotes.split(',').map(t => t.trim());
    }

    if (productData.stockQuantity !== undefined) {
      productData.inStock = Number(productData.stockQuantity) > 0;
    }

    const product = await Product.create(productData);

    return successResponse(res, { product }, 'Product created successfully', 201);
  } catch (error) {
    console.error('createProduct error:', error.message);
    return errorResponse(res, error.message);
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    const related = await validateRelatedProducts(productData.relatedProducts, req.params.id);
    if (related.error) return errorResponse(res, related.error, 400);
    if (related.ids !== undefined) productData.relatedProducts = related.ids;

    // if (req.files && req.files.length > 0) {
    //   productData.images = req.files.map((file) => `/uploads/${file.filename}`);
    // }

    const galleryPaths = getGalleryPaths(req.body.galleryImages);
    const uploadedPaths = (req.files || []).map((file) => file.path);
    if (galleryPaths !== undefined || uploadedPaths.length > 0) {
      productData.images = [...(galleryPaths || []), ...uploadedPaths].slice(0, 4);
    }
    delete productData.galleryImages;

    if (productData.category && !productData.categoryId) {
      if (productData.category.match(/^[0-9a-fA-F]{24}$/)) {
        const cat = await Category.findById(productData.category);
        if (cat) {
          productData.categoryId = productData.category;
          productData.category = cat.name;
        }
      }
    }

    if (productData.price) productData.price = Number(productData.price);
    if (productData.comparePrice) productData.comparePrice = Number(productData.comparePrice);
    if (productData.stockQuantity) productData.stockQuantity = Number(productData.stockQuantity);
    if (productData.stock) productData.stock = Number(productData.stock);

    if (productData.tastingNotes && typeof productData.tastingNotes === 'string') {
      productData.tastingNotes = productData.tastingNotes.split(',').map(t => t.trim());
    }

    if (productData.stockQuantity !== undefined) {
      productData.inStock = Number(productData.stockQuantity) > 0;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: false }
    );

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    return successResponse(res, { product }, 'Product updated successfully');
  } catch (error) {
    console.error('updateProduct error:', error.message);
    return errorResponse(res, error.message);
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    return successResponse(res, null, 'Product deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
