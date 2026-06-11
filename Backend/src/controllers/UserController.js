const User = require('../models/UserModel');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');
const { validationResult } = require('express-validator');

const listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const result = {
      docs: users,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    };

    return successResponse(res, result, 'Users fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch users', 500);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    if (req.user.role === 'customer' && req.user.userId !== req.params.id) {
      return errorResponse(res, 'Not authorized to view this user', 403);
    }

    return successResponse(res, user, 'User fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch user', 500);
  }
};

const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400);
  }

  try {
    if (req.user.role === 'customer' && req.user.userId !== req.params.id) {
      return errorResponse(res, 'Not authorized to update this user', 403);
    }

    const allowedFields = ['name', 'image', 'phone', 'address', 'city', 'state', 'zip', 'country', 'emailVerified'];
    if (req.user.role === 'super_admin' || req.user.role === 'admin') {
      allowedFields.push('role', 'email');
    }

    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, user, 'User updated successfully');
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 'Email already in use', 400);
    }
    return errorResponse(res, error.message || 'Failed to update user', 500);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, null, 'User deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to delete user', 500);
  }
};

module.exports = {
  listUsers,
  getUser,
  updateUser,
  deleteUser
};
