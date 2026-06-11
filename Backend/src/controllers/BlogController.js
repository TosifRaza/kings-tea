const BlogPost = require('../models/BlogPostModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');
const { validationResult } = require('express-validator');

const listBlogPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const filter = {};

    const isAdmin = req.user && ['super_admin', 'admin', 'manager'].includes(req.user.role);
    if (!isAdmin) {
      filter.published = true;
    }

    if (category) {
      filter.category = new RegExp(category, 'i');
    }

    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { excerpt: new RegExp(search, 'i') }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await BlogPost.countDocuments(filter);
    const posts = await BlogPost.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const result = {
      docs: posts,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    };

    return successResponse(res, result, 'Blog posts fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch blog posts', 500);
  }
};

const getBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return errorResponse(res, 'Blog post not found', 404);
    }

    const isAdmin = req.user && ['super_admin', 'admin', 'manager'].includes(req.user.role);
    if (!post.published && !isAdmin) {
      return errorResponse(res, 'Blog post not found', 404);
    }

    return successResponse(res, post, 'Blog post fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch blog post', 500);
  }
};

const createBlogPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400);
  }

  try {
    const post = await BlogPost.create(req.body);
    return successResponse(res, post, 'Blog post created successfully', 201);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 'Blog post with this title already exists', 400);
    }
    return errorResponse(res, error.message || 'Failed to create blog post', 500);
  }
};

const updateBlogPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400);
  }

  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!post) {
      return errorResponse(res, 'Blog post not found', 404);
    }

    return successResponse(res, post, 'Blog post updated successfully');
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 'Blog post with this title already exists', 400);
    }
    return errorResponse(res, error.message || 'Failed to update blog post', 500);
  }
};

const deleteBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return errorResponse(res, 'Blog post not found', 404);
    }

    return successResponse(res, null, 'Blog post deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to delete blog post', 500);
  }
};

module.exports = {
  listBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
};
