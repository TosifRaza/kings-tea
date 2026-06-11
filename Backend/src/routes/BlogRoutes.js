const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { listBlogPosts, getBlogPost, createBlogPost, updateBlogPost, deleteBlogPost } = require('../controllers/BlogController');
const { protect } = require('../middleware/AuthenticationMiddleware');
const { authorize } = require('../middleware/AuthorizationMiddleware');

router.get('/', listBlogPosts);

router.get('/:id', getBlogPost);

router.post(
  '/',
  protect,
  authorize('super_admin', 'admin', 'manager'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required')
  ],
  createBlogPost
);

router.put(
  '/:id',
  protect,
  authorize('super_admin', 'admin', 'manager'),
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().trim().notEmpty().withMessage('Content cannot be empty')
  ],
  updateBlogPost
);

router.delete(
  '/:id',
  protect,
  authorize('super_admin', 'admin'),
  deleteBlogPost
);

module.exports = router;
