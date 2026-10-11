const mongoose = require('mongoose');
const Product = require('../models/ProductModel');
const Review = require('../models/ReviewModel');
const Category = require('../models/CategoryModel');
const MediaAsset = require('../models/MediaAssetModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');

const includeSeededReviews = process.env.ENABLE_SEEDED_REVIEWS === 'true'
  || (process.env.NODE_ENV === 'production' && process.env.ENABLE_SEEDED_REVIEWS !== 'false');

const withLiveReviewStats = async (products) => {
  const list = (Array.isArray(products) ? products : [products]).filter(Boolean);
  if (list.length === 0) return [];

  const productIds = list.map((product) => product._id).filter(Boolean);
  const stats = productIds.length > 0
    ? await Review.aggregate([
      {
        $match: {
          productId: { $in: productIds },
          approved: true,
          ...(!includeSeededReviews ? { isSeeded: { $ne: true } } : {}),
        },
      },
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
    const isNewArrival = record.newArrival ?? record.isNew ?? false;
    delete record.newArrival;
    delete record.isNew;
    delete record.catalogRating;
    return {
      ...record,
      isNew: isNewArrival,
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

const getProductImages = (galleryPaths, uploadedPaths, body = {}) => {
  const images = [...galleryPaths, ...uploadedPaths];
  const fileIndex = Number.parseInt(body.thumbnailImageFileIndex, 10);
  const thumbnailPath = body.thumbnailImagePath;
  const thumbnail = thumbnailPath && images.includes(thumbnailPath)
    ? thumbnailPath
    : Number.isInteger(fileIndex) && fileIndex >= 0
      ? uploadedPaths[fileIndex]
      : null;

  if (!thumbnail || !images.includes(thumbnail)) return images.slice(0, 4);
  return [thumbnail, ...images.filter((image) => image !== thumbnail)].slice(0, 4);
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
  select: 'name slug price comparePrice images category origin rating reviewCount featured bestSeller newArrival gradientColor',
};
// Get all products
const getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 50, sort = '-createdAt' } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const sortFields = new Set(['createdAt', '-createdAt', 'price', '-price', 'name', '-name', 'rating', '-rating']);
    if (!Number.isInteger(pageNum) || pageNum < 1 || !Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100 || !sortFields.has(String(sort)) || String(search || '').length > 100) {
      return errorResponse(res, 'Invalid page, limit, sort, or search value', 400);
    }

    const query = { isActive: { $ne: false } };

    if (category) {
      query.$or = [
        { category: category },
        { categoryId: category }
      ];
    }

    if (search) {
      const safeSearch = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const filters = [{ name: { $regex: safeSearch, $options: 'i' } }, { description: { $regex: safeSearch, $options: 'i' } }, { origin: { $regex: safeSearch, $options: 'i' } }];
      const categoryFilter = query.$or ? { $or: query.$or } : null;
      delete query.$or;
      query.$and = [categoryFilter, { $or: filters }].filter(Boolean);
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .exec();

    const count = await Product.countDocuments(query);

    const productsWithReviewStats = await withLiveReviewStats(products);

    return successResponse(res, {
      products: productsWithReviewStats,
      totalProducts: count,
      currentPage: pageNum,
      totalPages: Math.ceil(count / limitNum),
    }, 'Products fetched successfully');
  } catch (error) {
    console.error('getProducts error:', error.message);
    return errorResponse(res, error.message);
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: { $ne: false } }).populate(relatedProductsPopulate);

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
    const product = await Product.findOne({ slug: req.params.slug, isActive: { $ne: false } }).populate(relatedProductsPopulate);

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
    delete productData.catalogRating;
    delete productData.thumbnailImagePath;
    delete productData.thumbnailImageFileIndex;
    if (productData.isNew !== undefined) {
      productData.newArrival = productData.isNew === true || productData.isNew === 'true';
      delete productData.isNew;
    }

    const related = await validateRelatedProducts(productData.relatedProducts);
    if (related.error) return errorResponse(res, related.error, 400);
    if (related.ids !== undefined) productData.relatedProducts = related.ids;

    const galleryPaths = getGalleryPaths(req.body.galleryImages);
    const uploadedPaths = (req.files || []).map((file) => file.path);
    if (galleryPaths !== undefined || uploadedPaths.length > 0) {
      productData.images = getProductImages(galleryPaths || [], uploadedPaths, req.body);
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
    const requestedStock = productData.stockQuantity !== undefined
      ? productData.stockQuantity
      : productData.stock;
    delete productData.stock;
    if (requestedStock !== undefined) {
      const stockQuantity = Number(requestedStock);
      if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
        return errorResponse(res, 'Stock must be a non-negative number.', 400);
      }
      productData.stockQuantity = stockQuantity;
      productData.inStock = stockQuantity > 0;
    }

    if (productData.tastingNotes && typeof productData.tastingNotes === 'string') {
      productData.tastingNotes = productData.tastingNotes.split(',').map(t => t.trim());
    }

    const product = await Product.create(productData);
    await MediaAsset.updateMany({ url: { $in: productData.images || [] } }, { $addToSet: { productIds: product._id }, $set: { usage: 'product' } });
    const [responseProduct] = await withLiveReviewStats(product);

    return successResponse(res, { product: responseProduct }, 'Product created successfully', 201);
  } catch (error) {
    console.error('createProduct error:', error.message);
    return errorResponse(res, error.message);
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    delete productData.catalogRating;
    delete productData.thumbnailImagePath;
    delete productData.thumbnailImageFileIndex;
    if (productData.isNew !== undefined) {
      productData.newArrival = productData.isNew === true || productData.isNew === 'true';
      delete productData.isNew;
    }

    const related = await validateRelatedProducts(productData.relatedProducts, req.params.id);
    if (related.error) return errorResponse(res, related.error, 400);
    if (related.ids !== undefined) productData.relatedProducts = related.ids;

    // if (req.files && req.files.length > 0) {
    //   productData.images = req.files.map((file) => `/uploads/${file.filename}`);
    // }

    const galleryPaths = getGalleryPaths(req.body.galleryImages);
    const uploadedPaths = (req.files || []).map((file) => file.path);
    if (galleryPaths !== undefined || uploadedPaths.length > 0) {
      productData.images = getProductImages(galleryPaths || [], uploadedPaths, req.body);
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
    const requestedStock = productData.stockQuantity !== undefined
      ? productData.stockQuantity
      : productData.stock;
    delete productData.stock;
    if (requestedStock !== undefined) {
      const stockQuantity = Number(requestedStock);
      if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
        return errorResponse(res, 'Stock must be a non-negative number.', 400);
      }
      productData.stockQuantity = stockQuantity;
      productData.inStock = stockQuantity > 0;
    }

    if (productData.tastingNotes && typeof productData.tastingNotes === 'string') {
      productData.tastingNotes = productData.tastingNotes.split(',').map(t => t.trim());
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: false }
    );

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    if (productData.images) {
      await MediaAsset.updateMany({ productIds: product._id }, { $pull: { productIds: product._id } });
      await MediaAsset.updateMany({ url: { $in: productData.images } }, { $addToSet: { productIds: product._id }, $set: { usage: 'product' } });
    }

    const [responseProduct] = await withLiveReviewStats(product);

    return successResponse(res, { product: responseProduct }, 'Product updated successfully');
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

    await MediaAsset.updateMany({ productIds: product._id }, { $pull: { productIds: product._id } });

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
