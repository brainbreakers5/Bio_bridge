const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
const DEVICE_API_KEY = process.env.DEVICE_API_KEY;

/**
 * Verifies Supabase JWT
 */
const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access این route' });
  }

  try {
    // Verify JWT using Supabase secret
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

/**
 * Verifies Device API Key
 */
const deviceAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;

  if (!apiKey || apiKey !== DEVICE_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid device API key' });
  }

  next();
};

module.exports = {
  protect,
  deviceAuth
};
