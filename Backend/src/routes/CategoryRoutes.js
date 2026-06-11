// // const express = require('express');
// // const router = express.Router();
// // const { body } = require('express-validator');
// // const { listCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/CategoryController');
// // const { protect } = require('../middleware/AuthenticationMiddleware');
// // const { authorize } = require('../middleware/AuthorizationMiddleware');

// // router.get('/', listCategories);

// // router.get('/:id', getCategory);

// // router.post(
// //   '/',
// //   protect,
// //   authorize('super_admin', 'admin', 'manager'),
// //   [
// //     body('name').trim().notEmpty().withMessage('Category name is required')
// //   ],
// //   createCategory
// // );

// // router.put(
// //   '/:id',
// //   protect,
// //   authorize('super_admin', 'admin', 'manager'),
// //   [
// //     body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty')
// //   ],
// //   updateCategory
// // );

// // router.delete(
// //   '/:id',
// //   protect,
// //   authorize('super_admin', 'admin'),
// //   deleteCategory
// // );

// // module.exports = router;
// import express from 'express';
// import { body } from 'express-validator';
// import {
//   getCategories,
//   getCategoryById,
//   createCategory,
//   updateCategory,
//   deleteCategory,
// } from '../controllers/CategoryController.js';
// import { protect } from '../middleware/AuthenticationMiddleware.js';

// const router = express.Router();

// // Public routes
// router.get('/', getCategories);
// router.get('/:id', getCategoryById);

// // Protected admin routes
// router.post(
//   '/',
//   protect,
//   [
//     body('name').trim().notEmpty().withMessage('Category name is required'),
//     body('slug').trim().optional(),
//   ],
//   createCategory
// );

// router.put(
//   '/:id',
//   protect,
//   updateCategory
// );

// router.delete('/:id', protect, deleteCategory);

// export default router;
const express = require('express');
const { body } = require('express-validator');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/CategoryController');
const { protect } = require('../middleware/AuthenticationMiddleware');

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Protected admin routes
router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Category name is required'),
  ],
  createCategory
);

router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;