const express = require('express');
const router = express.Router();

// Admin authentication endpoint
router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  console.log('Environment variable ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? 'Loaded' : 'Not loaded');
  
  if (password === adminPassword) {
    res.json({ 
      success: true, 
      message: 'Authentication successful' 
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid password' 
    });
  }
});

module.exports = router; 