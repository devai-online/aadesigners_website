// Load environment variables (dotenv for local development, Docker env for production)
require('dotenv').config();

// Load centralized configuration
const config = require('./env-config');

console.log('🚀 AA Designers Backend Starting...');
console.log('Environment:', config.NODE_ENV);
console.log('Port:', config.PORT);
console.log('API Base URL:', config.API_BASE_URL);

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
const PORT = config.PORT;

// Security middleware - completely disable helmet for development
// app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW,
  max: config.RATE_LIMIT_MAX,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Admin-specific rate limiting
const adminLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW,
  max: config.ADMIN_RATE_LIMIT_MAX,
  message: 'Too many admin requests from this IP, please try again later.'
});
app.use('/api/admin', adminLimiter);

// Note: Using MemoryStore for sessions (Redis can be added later for production)
console.log('ℹ️  Using MemoryStore for sessions (Redis can be added later for production)');

// Session configuration
app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: config.SESSION_SECURE,
    httpOnly: true,
    maxAge: config.SESSION_MAX_AGE,
    sameSite: 'lax' // Better for cross-domain requests
  }
}));

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all origins for now (you can restrict this later)
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: config.MAX_FILE_SIZE }));
app.use(express.urlencoded({ extended: true, limit: config.MAX_FILE_SIZE }));

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
    // Initialize database
    await initDatabase();
    await insertDefaultData();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
      console.log(`📊 API endpoints:`);
      console.log(`   - Testimonials: http://0.0.0.0:${PORT}/api/testimonials`);
      console.log(`   - Projects: http://0.0.0.0:${PORT}/api/projects`);
      console.log(`   - Blog Posts: http://0.0.0.0:${PORT}/api/blog`);
      console.log(`   - Health Check: http://0.0.0.0:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 