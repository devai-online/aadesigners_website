const express = require('express');
const jwt = require('jsonwebtoken');
const { checkNotAuthenticated } = require('../middleware/auth');
const router = express.Router();

// Admin authentication endpoint
router.post('/login', checkNotAuthenticated, (req, res) => {
  console.log('Admin login attempt:', { 
    body: req.body, 
    method: req.method, 
    path: req.path,
    headers: req.headers 
  });
  
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (password === adminPassword) {
    // Create JWT token
    const token = jwt.sign(
      { admin: true, timestamp: Date.now() },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Store token in session
    req.session.adminToken = token;
    
    res.json({ 
      success: true, 
      message: 'Authentication successful',
      token: token
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid password' 
    });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  const token = req.session.adminToken || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated: true });
  } catch (error) {
    res.status(401).json({ authenticated: false });
  }
});

module.exports = router; 