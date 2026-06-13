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

// Get product by ID
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

// ============================================================
// Get product by slug (PUBLIC — used by Frontend product pages)
// ============================================================
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

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

    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

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

    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

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