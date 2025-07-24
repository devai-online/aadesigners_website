require('dotenv').config();
console.log('Environment variables loaded:', {
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'Set' : 'Not set',
  PORT: process.env.PORT || 'Using default (3001)',
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3001',
  JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set'
});
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initDatabase, insertDefaultData } = require('./database');

// Import routes
const testimonialsRoutes = require('./routes/testimonials');
const projectsRoutes = require('./routes/projects');
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware - completely disable helmet for development
// app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Admin-specific rate limiting
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many admin requests from this IP, please try again later.'
});
app.use('/api/admin', adminLimiter);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware - Allow all origins for development
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Import authentication middleware
const { requireAuth } = require('./middleware/auth');

// Routes
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});



// Simple image serving with CORS headers
app.use('/api/images', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    await insertDefaultData();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API endpoints:`);
      console.log(`   - Testimonials: http://localhost:${PORT}/api/testimonials`);
      console.log(`   - Projects: http://localhost:${PORT}/api/projects`);
      console.log(`   - Blog Posts: http://localhost:${PORT}/api/blog`);
      console.log(`   - Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 