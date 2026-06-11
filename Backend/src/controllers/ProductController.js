// // // const Product = require('../models/ProductModel');
// // // const Review = require('../models/ReviewModel');
// // // const { successResponse, errorResponse } = require('../utils/ResponseHandler');
// // // const { validationResult } = require('express-validator');
// // // const slugify = require('slugify');

// // // const listProducts = async (req, res) => {
// // //   try {
// // //     const {
// // //       category,
// // //       search,
// // //       sort,
// // //       page = 1,
// // //       limit = 10,
// // //       featured,
// // //       bestSeller
// // //     } = req.query;

// // //     const filter = {};

// // //     if (category) {
// // //       filter.category = new RegExp(category, 'i');
// // //     }

// // //     if (search) {
// // //       filter.$text = { $search: search };
// // //     }

// // //     if (featured === 'true') {
// // //       filter.featured = true;
// // //     }

// // //     if (bestSeller === 'true') {
// // //       filter.bestSeller = true;
// // //     }

// // //     const pageNum = parseInt(page, 10);
// // //     const limitNum = parseInt(limit, 10);
// // //     const skip = (pageNum - 1) * limitNum;

// // //     let sortOption = { createdAt: -1 };
// // //     if (sort === 'price_asc') sortOption = { price: 1 };
// // //     else if (sort === 'price_desc') sortOption = { price: -1 };
// // //     else if (sort === 'name_asc') sortOption = { name: 1 };
// // //     else if (sort === 'name_desc') sortOption = { name: -1 };
// // //     else if (sort === 'rating') sortOption = { rating: -1 };
// // //     else if (sort === 'newest') sortOption = { createdAt: -1 };

// // //     const total = await Product.countDocuments(filter);
// // //     const products = await Product.find(filter)
// // //       .sort(sortOption)
// // //       .skip(skip)
// // //       .limit(limitNum);

// // //     const result = {
// // //       docs: products,
// // //       total,
// // //       page: pageNum,
// // //       limit: limitNum,
// // //       totalPages: Math.ceil(total / limitNum)
// // //     };

// // //     return successResponse(res, result, 'Products fetched successfully');
// // //   } catch (error) {
// // //     return errorResponse(res, error.message || 'Failed to fetch products', 500);
// // //   }
// // // };

// // // const getProduct = async (req, res) => {
// // //   try {
// // //     const product = await Product.findById(req.params.id);
// // //     if (!product) {
// // //       return errorResponse(res, 'Product not found', 404);
// // //     }
// // //     return successResponse(res, product, 'Product fetched successfully');
// // //   } catch (error) {
// // //     return errorResponse(res, error.message || 'Failed to fetch product', 500);
// // //   }
// // // };

// // // const createProduct = async (req, res) => {
// // //   const errors = validationResult(req);
// // //   if (!errors.isEmpty()) {
// // //     return errorResponse(res, errors.array()[0].msg, 400);
// // //   }

// // //   try {
// // //     const productData = { ...req.body };
// // //     productData.slug = slugify(productData.name, { lower: true, strict: true });

// // //     const product = await Product.create(productData);
// // //     return successResponse(res, product, 'Product created successfully', 201);
// // //   } catch (error) {
// // //     if (error.code === 11000) {
// // //       return errorResponse(res, 'Product with this name already exists', 400);
// // //     }
// // //     return errorResponse(res, error.message || 'Failed to create product', 500);
// // //   }
// // // };

// // // const updateProduct = async (req, res) => {
// // //   const errors = validationResult(req);
// // //   if (!errors.isEmpty()) {
// // //     return errorResponse(res, errors.array()[0].msg, 400);
// // //   }

// // //   try {
// // //     const productData = { ...req.body };
// // //     if (productData.name) {
// // //       productData.slug = slugify(productData.name, { lower: true, strict: true });
// // //     }

// // //     const product = await Product.findByIdAndUpdate(
// // //       req.params.id,
// // //       productData,
// // //       { new: true, runValidators: true }
// // //     );

// // //     if (!product) {
// // //       return errorResponse(res, 'Product not found', 404);
// // //     }

// // //     return successResponse(res, product, 'Product updated successfully');
// // //   } catch (error) {
// // //     if (error.code === 11000) {
// // //       return errorResponse(res, 'Product with this name already exists', 400);
// // //     }
// // //     return errorResponse(res, error.message || 'Failed to update product', 500);
// // //   }
// // // };

// // // const deleteProduct = async (req, res) => {
// // //   try {
// // //     const product = await Product.findByIdAndDelete(req.params.id);
// // //     if (!product) {
// // //       return errorResponse(res, 'Product not found', 404);
// // //     }

// // //     await Review.deleteMany({ productId: req.params.id });

// // //     return successResponse(res, null, 'Product deleted successfully');
// // //   } catch (error) {
// // //     return errorResponse(res, error.message || 'Failed to delete product', 500);
// // //   }
// // // };

// // // module.exports = {
// // //   listProducts,
// // //   getProduct,
// // //   createProduct,
// // //   updateProduct,
// // //   deleteProduct
// // // };
// // import Product from '../models/ProductModel.js';
// // import { successResponse, errorResponse } from '../utils/ResponseHandler.js';

// // // Get all products
// // export const getProducts = async (req, res) => {
// //   try {
// //     const { category, search, page = 1, limit = 50, sort = '-createdAt' } = req.query;

// //     let query = {};

// //     // Filter by category
// //     if (category) {
// //       query.category = category;
// //     }

// //     // Search by name
// //     if (search) {
// //       query.name = { $regex: search, $options: 'i' };
// //     }

// //     const products = await Product.find(query)
// //       .populate('category', 'name slug')
// //       .sort(sort)
// //       .limit(limit * 1)
// //       .skip((page - 1) * limit)
// //       .exec();

// //     const count = await Product.countDocuments(query);

// //     return successResponse(res, {
// //       products,
// //       totalProducts: count,
// //       currentPage: page,
// //       totalPages: Math.ceil(count / limit),
// //     }, 'Products fetched successfully');
// //   } catch (error) {
// //     return errorResponse(res, error.message);
// //   }
// // };

// // // Get single product
// // export const getProductById = async (req, res) => {
// //   try {
// //     const product = await Product.findById(req.params.id).populate('category', 'name slug');

// //     if (!product) {
// //       return errorResponse(res, 'Product not found', 404);
// //     }

// //     return successResponse(res, { product }, 'Product fetched successfully');
// //   } catch (error) {
// //     return errorResponse(res, error.message);
// //   }
// // };

// // // Create product
// // export const createProduct = async (req, res) => {
// //   try {
// //     const productData = { ...req.body };

// //     // Handle uploaded images
// //     if (req.files && req.files.length > 0) {
// //       productData.images = req.files.map((file) => `/uploads/${file.filename}`);
// //     } else if (req.body.images) {
// //       // Images might be passed as JSON strings
// //       if (typeof req.body.images === 'string') {
// //         try {
// //           productData.images = JSON.parse(req.body.images);
// //         } catch {
// //           productData.images = [req.body.images];
// //         }
// //       }
// //     }

// //     // Convert numeric fields
// //     if (productData.price) productData.price = Number(productData.price);
// //     if (productData.comparePrice) productData.comparePrice = Number(productData.comparePrice);
// //     if (productData.stock !== undefined) productData.stock = Number(productData.stock);

// //     const product = await Product.create(productData);
// //     await product.populate('category', 'name slug');

// //     return successResponse(res, { product }, 'Product created successfully', 201);
// //   } catch (error) {
// //     return errorResponse(res, error.message);
// //   }
// // };

// // // Update product
// // export const updateProduct = async (req, res) => {
// //   try {
// //     const productData = { ...req.body };

// //     // Handle uploaded images
// //     if (req.files && req.files.length > 0) {
// //       productData.images = req.files.map((file) => `/uploads/${file.filename}`);
// //     }

// //     // Convert numeric fields
// //     if (productData.price) productData.price = Number(productData.price);
// //     if (productData.comparePrice) productData.comparePrice = Number(productData.comparePrice);
// //     if (productData.stock !== undefined) productData.stock = Number(productData.stock);

// //     const product = await Product.findByIdAndUpdate(
// //       req.params.id,
// //       productData,
// //       { new: true, runValidators: true }
// //     ).populate('category', 'name slug');

// //     if (!product) {
// //       return errorResponse(res, 'Product not found', 404);
// //     }

// //     return successResponse(res, { product }, 'Product updated successfully');
// //   } catch (error) {
// //     return errorResponse(res, error.message);
// //   }
// // };

// // // Delete product
// // export const deleteProduct = async (req, res) => {
// //   try {
// //     const product = await Product.findByIdAndDelete(req.params.id);

// //     if (!product) {
// //       return errorResponse(res, 'Product not found', 404);
// //     }

// //     return successResponse(res, null, 'Product deleted successfully');
// //   } catch (error) {
// //     return errorResponse(res, error.message);
// //   }
// // };


// const Product = require('../models/ProductModel');
// const { successResponse, errorResponse } = require('../utils/ResponseHandler');

// // Get all products
// const getProducts = async (req, res) => {
//   try {
//     const { category, search, page = 1, limit = 50, sort = '-createdAt' } = req.query;

//     let query = {};

//     if (category) {
//       query.category = category;
//     }

//     if (search) {
//       query.name = { $regex: search, $options: 'i' };
//     }

//     const products = await Product.find(query)
//       .sort(sort)
//       .limit(Number(limit))
//       .skip((Number(page) - 1) * Number(limit))
//       .exec();

//     const count = await Product.countDocuments(query);

//     return successResponse(res, {
//       products,
//       totalProducts: count,
//       currentPage: Number(page),
//       totalPages: Math.ceil(count / Number(limit)),
//     }, 'Products fetched successfully');
//   } catch (error) {
//     return errorResponse(res, error.message);
//   }
// };

// // Get single product
// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return errorResponse(res, 'Product not found', 404);
//     }

//     return successResponse(res, { product }, 'Product fetched successfully');
//   } catch (error) {
//     return errorResponse(res, error.message);
//   }
// };

// // Create product
// const createProduct = async (req, res) => {
//   try {
//     const productData = { ...req.body };

//     // Handle uploaded images
//     if (req.files && req.files.length > 0) {
//       productData.images = req.files.map((file) => `/uploads/${file.filename}`);
//     }

//     // Convert numeric fields
//     if (productData.price) productData.price = Number(productData.price);
//     if (productData.comparePrice) productData.comparePrice = Number(productData.comparePrice);
//     if (productData.stockQuantity) productData.stockQuantity = Number(productData.stockQuantity);
//     if (productData.stock) productData.stock = Number(productData.stock);

//     const product = await Product.create(productData);

//     return successResponse(res, { product }, 'Product created successfully', 201);
//   } catch (error) {
//     return errorResponse(res, error.message);
//   }
// };

// // Update product
// const updateProduct = async (req, res) => {
//   try {
//     const productData = { ...req.body };

//     // Handle uploaded images
//     if (req.files && req.files.length > 0) {
//       productData.images = req.files.map((file) => `/uploads/${file.filename}`);
//     }

//     // Convert numeric fields
//     if (productData.price) productData.price = Number(productData.price);
//     if (productData.comparePrice) productData.comparePrice = Number(productData.comparePrice);
//     if (productData.stockQuantity) productData.stockQuantity = Number(productData.stockQuantity);
//     if (productData.stock) productData.stock = Number(productData.stock);

//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       productData,
//       { new: true, runValidators: true }
//     );

//     if (!product) {
//       return errorResponse(res, 'Product not found', 404);
//     }

//     return successResponse(res, { product }, 'Product updated successfully');
//   } catch (error) {
//     return errorResponse(res, error.message);
//   }
// };

// // Delete product
// const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);

//     if (!product) {
//       return errorResponse(res, 'Product not found', 404);
//     }

//     return successResponse(res, null, 'Product deleted successfully');
//   } catch (error) {
//     return errorResponse(res, error.message);
//   }
// };

// module.exports = {
//   getProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// };
const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');

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

    return successResponse(res, {
      products,
      totalProducts: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
    }, 'Products fetched successfully');
  } catch (error) {
    console.error('getProducts error:', error.message);
    return errorResponse(res, error.message);
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    return successResponse(res, { product }, 'Product fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    // Look up category name from categoryId
    if (productData.category && !productData.categoryId) {
      // If category is an ObjectId, look it up
      if (productData.category.match(/^[0-9a-fA-F]{24}$/)) {
        const cat = await Category.findById(productData.category);
        if (cat) {
          productData.categoryId = productData.category;
          productData.category = cat.name;
        }
      }
    }

    // Convert numeric fields
    if (productData.price) productData.price = Number(productData.price);
    if (productData.comparePrice) productData.comparePrice = Number(productData.comparePrice);
    if (productData.stockQuantity) productData.stockQuantity = Number(productData.stockQuantity);
    if (productData.stock) productData.stock = Number(productData.stock);

    // Handle tastingNotes from FormData
    if (productData.tastingNotes && typeof productData.tastingNotes === 'string') {
      productData.tastingNotes = productData.tastingNotes.split(',').map(t => t.trim());
    }

    // Set inStock based on stockQuantity
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

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    // Look up category name from categoryId
    if (productData.category && !productData.categoryId) {
      if (productData.category.match(/^[0-9a-fA-F]{24}$/)) {
        const cat = await Category.findById(productData.category);
        if (cat) {
          productData.categoryId = productData.category;
          productData.category = cat.name;
        }
      }
    }

    // Convert numeric fields
    if (productData.price) productData.price = Number(productData.price);
    if (productData.comparePrice) productData.comparePrice = Number(productData.comparePrice);
    if (productData.stockQuantity) productData.stockQuantity = Number(productData.stockQuantity);
    if (productData.stock) productData.stock = Number(productData.stock);

    // Handle tastingNotes from FormData
    if (productData.tastingNotes && typeof productData.tastingNotes === 'string') {
      productData.tastingNotes = productData.tastingNotes.split(',').map(t => t.trim());
    }

    // Set inStock based on stockQuantity
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
  createProduct,
  updateProduct,
  deleteProduct,
};