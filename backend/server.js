require('dotenv').config();
console.log('Environment variables loaded:', {
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'Set' : 'Not set',
  PORT: process.env.PORT || 'Using default (3001)'
});
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase, insertDefaultData } = require('./database');

// Import routes
const testimonialsRoutes = require('./routes/testimonials');
const projectsRoutes = require('./routes/projects');
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

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