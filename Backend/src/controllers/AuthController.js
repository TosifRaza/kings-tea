const User = require('../models/UserModel');
const { generateToken, setTokenCookie, clearTokenCookie } = require('../utils/TokenUtils');
const { successResponse, errorResponse } = require('../utils/ResponseHandler');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400);
  }

  const { email, name, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'Email already registered', 400);
    }

    const user = await User.create({
      email,
      name,
      password,
      role: 'customer'
    });

    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    setTokenCookie(res, token);

    const userResponse = await User.findById(user._id).select('-password');

    return successResponse(res,{ token, user: userResponse }, 'User registered successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message || 'Registration failed', 500);
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg, 400);
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role
    });

    setTokenCookie(res, token);

    const userResponse = await User.findById(user._id).select('-password');

    return successResponse(res, { token, user: userResponse }, 'Login successful');
  } catch (error) {
    return errorResponse(res, error.message || 'Login failed', 500);
  }
};

const logout = async (req, res) => {
  try {
    clearTokenCookie(res);
    return successResponse(res, null, 'Logged out successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Logout failed', 500);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    return successResponse(res, user, 'User fetched successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Failed to fetch user', 500);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe
};
