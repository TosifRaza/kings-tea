const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const getTokenFromCookies = (req) => {
  if (req.cookies && req.cookies.kings_tea_token) {
    return req.cookies.kings_tea_token;
  }
  return null;
};

const getTokenFromHeaders = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};

const setTokenCookie = (res, token) => {
  const cookieExpire = parseInt(process.env.COOKIE_EXPIRE, 10) || 7;
  const maxAge = cookieExpire * 24 * 60 * 60 * 1000;

  res.cookie('kings_tea_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: maxAge,
    path: '/'
  });
};

const clearTokenCookie = (res) => {
  res.cookie('kings_tea_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 0,
    path: '/'
  });
};

module.exports = {
  generateToken,
  verifyToken,
  getTokenFromCookies,
  getTokenFromHeaders,
  setTokenCookie,
  clearTokenCookie
};
