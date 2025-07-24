// Environment Configuration for AA Designers Backend
// This file centralizes all environment variable handling

const config = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,
  API_BASE_URL: process.env.API_BASE_URL || 'http://98.130.15.198:3001',
  
  // Authentication
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-jwt-secret-change-in-production',
  SESSION_SECRET: process.env.SESSION_SECRET || 'fallback-session-secret-change-in-production',
  
  // Security
  CORS_ORIGINS: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*'],
  
  // Database
  DATABASE_PATH: process.env.DATABASE_PATH || './database.db',
  
  // File Uploads
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '10mb',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 100,
  ADMIN_RATE_LIMIT_MAX: process.env.ADMIN_RATE_LIMIT_MAX || 5,
  
  // Session
  SESSION_MAX_AGE: process.env.SESSION_MAX_AGE || 24 * 60 * 60 * 1000, // 24 hours
  SESSION_SECURE: process.env.NODE_ENV === 'production' && process.env.API_BASE_URL?.startsWith('https'),
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

// Validation
const validateConfig = () => {
  const warnings = [];
  
  if (config.NODE_ENV === 'production') {
    if (config.ADMIN_PASSWORD === 'admin123') {
      warnings.push('ADMIN_PASSWORD should be changed in production');
    }
    if (config.JWT_SECRET.includes('fallback')) {
      warnings.push('JWT_SECRET should be changed in production');
    }
    if (config.SESSION_SECRET.includes('fallback')) {
      warnings.push('SESSION_SECRET should be changed in production');
    }
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️  Configuration warnings:');
    warnings.forEach(warning => console.warn(`   - ${warning}`));
  }
  
  return config;
};

// Export validated config
module.exports = validateConfig(); 