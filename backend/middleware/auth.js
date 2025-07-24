const jwt = require('jsonwebtoken');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  const token = req.session.adminToken || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

// Middleware to check if user is logged in (for login endpoint)
const checkNotAuthenticated = (req, res, next) => {
  const token = req.session.adminToken || req.headers.authorization?.replace('Bearer ', '');
  
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.status(400).json({ error: 'Already authenticated.' });
    } catch (error) {
      // Token is invalid, continue to login
    }
  }
  next();
};

module.exports = { requireAuth, checkNotAuthenticated }; 