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
    
    const allowedOrigins = [
      'http://31.97.207.250',
      'http://31.97.207.250:80',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  optionsSuccessStatus: 200
}));

// Additional CORS headers for all routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://31.97.207.250',
    'http://31.97.207.250:80',
    'http://localhost:3000',
    'http://localhost:5173'
  ];
  
  console.log('CORS Debug - Origin:', origin, 'Method:', req.method, 'Path:', req.path);
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    console.log('CORS: Allowed origin:', origin);
  } else if (!origin) {
    console.log('CORS: No origin header');
  } else {
    console.log('CORS: Blocked origin:', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('CORS: Handling preflight request');
    res.sendStatus(200);
  } else {
    next();
  }
});

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
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    cors: {
      origin: req.headers.origin,
      method: req.method,
      headers: req.headers
    }
  });
});

// Test endpoint to debug routing
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    headers: req.headers
  });
});



// Simple image serving with CORS headers
app.use('/api/images', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({ error: 'Route not found', method: req.method, path: req.originalUrl });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    await initDatabase();
    await insertDefaultData();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on ${config.API_BASE_URL}`);
      console.log(`📊 API endpoints:`);
      console.log(`   - Testimonials: ${config.API_BASE_URL}/api/testimonials`);
      console.log(`   - Projects: ${config.API_BASE_URL}/api/projects`);
      console.log(`   - Blog Posts: ${config.API_BASE_URL}/api/blog`);
      console.log(`   - Health Check: ${config.API_BASE_URL}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 