// // const Category = require('../models/CategoryModel');
// // const Product = require('../models/ProductModel');
// // const { successResponse, errorResponse } = require('../utils/ResponseHandler');
// // const { validationResult } = require('express-validator');

// // const listCategories = async (req, res) => {
// //   try {
// //     const categories = await Category.find().sort({ sortOrder: 1, name: 1 });
// //     return successResponse(res, categories, 'Categories fetched successfully');
// //   } catch (error) {
// //     return errorResponse(res, error.message || 'Failed to fetch categories', 500);
// //   }
// // };

// // const getCategory = async (req, res) => {
// //   try {
// //     const category = await Category.findById(req.params.id);
// //     if (!category) {
// //       return errorResponse(res, 'Category not found', 404);
// //     }
// //     return successResponse(res, category, 'Category fetched successfully');
// //   } catch (error) {
// //     return errorResponse(res, error.message || 'Failed to fetch category', 500);
// //   }
// // };

// // const createCategory = async (req, res) => {
// //   const errors = validationResult(req);
// //   if (!errors.isEmpty()) {
// //     return errorResponse(res, errors.array()[0].msg, 400);
// //   }

// //   try {
// //     const category = await Category.create(req.body);
// //     return successResponse(res, category, 'Category created successfully', 201);
// //   } catch (error) {
// //     if (error.code === 11000) {
// //       return errorResponse(res, 'Category with this name already exists', 400);
// //     }
// //     return errorResponse(res, error.message || 'Failed to create category', 500);
// //   }
// // };

// // const updateCategory = async (req, res) => {
// //   const errors = validationResult(req);
// //   if (!errors.isEmpty()) {
// //     return errorResponse(res, errors.array()[0].msg, 400);
// //   }

// //   try {
// //     const category = await Category.findByIdAndUpdate(
// //       req.params.id,
// //       req.body,
// //       { new: true, runValidators: true }
// //     );

// //     if (!category) {
// //       return errorResponse(res, 'Category not found', 404);
// //     }

// //     return successResponse(res, category, 'Category updated successfully');
// //   } catch (error) {
// //     if (error.code === 11000) {
// //       return errorResponse(res, 'Category with this name already exists', 400);
// //     }
// //     return errorResponse(res, error.message || 'Failed to update category', 500);
// //   }
// // };

// // const deleteCategory = async (req, res) => {
// //   try {
// //     const category = await Category.findByIdAndDelete(req.params.id);
// //     if (!category) {
// //       return errorResponse(res, 'Category not found', 404);
// //     }

// //     await Product.updateMany(
// //       { categoryId: req.params.id },
// //       { $unset: { categoryId: 1 } }
// //     );

// //     return successResponse(res, null, 'Category deleted successfully');
// //   } catch (error) {
// //     return errorResponse(res, error.message || 'Failed to delete category', 500);
// //   }
// // };

// // module.exports = {
// //   listCategories,
// //   getCategory,
// //   createCategory,
// //   updateCategory,
// //   deleteCategory
// // };
// import Category from '../models/CategoryModel.js';
// import { successResponse, errorResponse } from '../utils/ResponseHandler.js';

// // Get all categories
// export const getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find().sort({ name: 1 }).exec();
//     return successResponse(res, { categories }, 'Categories fetched successfully');
//   } catch (error) {
//     return errorResponse(res, error.message);
//   }
// };

// // Get single category
// export const getCategoryById = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);

//     if (!category) {
//       return errorResponse(res, 'Category not found', 404);
//     }

//     return successResponse(res, { category }, 'Category fetched successfully');
//   } catch (error) {
//     return errorResponse(res, error.message);
//   }
// };

// // Create category
// export const createCategory = async (req, res) => {
//   try {
//     const { name, description, slug } = req.body;

//     // Auto-generate slug if not provided
//     const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

//     const category = await Category.create({
//       name,
//       description,
//       slug: categorySlug,
//     });

//     return successResponse(res, { category }, 'Category created successfully', 201);
//   } catch (error) {
//     return errorResponse(res, error.message);
//   }
// };

// // Update category
// export const updateCategory = async (req, res) => {
//   try {
//     const { name, description, slug } = req.body;

//     const updateData = {};
//     if (name) updateData.name = name;
//     if (description) updateData.description = description;
//     if (slug) updateData.slug = slug;
//     else if (name) updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

//     const category = await Category.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!category) {
//       return errorResponse(res, 'Category not found', 404);
//     }

//     return successResponse(res, { category }, 'Category updated successfully');
//   } catch (error) {
//     return errorResponse(res, error.message);
//   }
// };

// // Delete category
// export const deleteCategory = async (req, res) => {
//   try {
//     const category = await Category.findByIdAndDelete(req.params.id);

//     if (!category) {
//       return errorResponse(res, 'Category not found', 404);
//     }

//     return successResponse(res, null, 'Category deleted successfully');
//   } catch (error) {
//     return errorResponse(res, error.message);
//   }
// };
const Category = require('../models/CategoryModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).exec();
    return successResponse(res, { categories }, 'Categories fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// Get single category
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    return successResponse(res, { category }, 'Category fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// Create category
const createCategory = async (req, res) => {
  try {
    const { name, description, slug } = req.body;

    const categorySlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const category = await Category.create({
      name,
      description,
      slug: categorySlug,
    });

    return successResponse(res, { category }, 'Category created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { name, description, slug } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (slug) {
      updateData.slug = slug;
    } else if (name) {
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    return successResponse(res, { category }, 'Category updated successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    return successResponse(res, null, 'Category deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};