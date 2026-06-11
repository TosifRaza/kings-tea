const { getTokenFromCookies, getTokenFromHeaders, verifyToken } = require('../utils/TokenUtils');
const { errorResponse } = require('../utils/ResponseHandler');
const User = require('../models/UserModel');

const protect = async (req, res, next) => {
  let token = getTokenFromCookies(req) || getTokenFromHeaders(req);

  if (!token) {
    return errorResponse(res, 'Not authorized, no token provided', 401);
  }

  try {
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return errorResponse(res, 'Not authorized, user not found', 401);
    }

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    return errorResponse(res, 'Not authorized, invalid token', 401);
  }
};

module.exports = { protect };
