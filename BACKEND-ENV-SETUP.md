# Backend Environment Configuration Guide

## ✅ **Backend is Now Universal!**

The backend has been completely updated to work with any domain/IP. Here's what's been improved:

### **🔧 Centralized Configuration (`env-config.js`)**
- ✅ **All environment variables** in one place
- ✅ **Automatic validation** and warnings
- ✅ **Production-ready** defaults
- ✅ **Flexible** for any deployment

### **🌍 Universal Compatibility**
- ✅ **Any domain/IP** - automatically adapts
- ✅ **HTTPS detection** - auto-configures secure cookies
- ✅ **CORS handling** - works with any origin
- ✅ **Session management** - cross-domain compatible

## 📋 **Environment Variables**

### **Required (with fallbacks):**
```bash
# Server
NODE_ENV=production
PORT=3001
API_BASE_URL=http://yourdomain.com:3001

# Authentication
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-very-long-random-secret
SESSION_SECRET=your-very-long-random-secret
```

### **Optional (with smart defaults):**
```bash
# Security
CORS_ORIGINS=https://yourdomain.com,http://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW=900000  # 15 minutes
RATE_LIMIT_MAX=100
ADMIN_RATE_LIMIT_MAX=5

# File Uploads
MAX_FILE_SIZE=10mb
UPLOAD_PATH=./uploads

# Session
SESSION_MAX_AGE=86400000  # 24 hours
```

## 🚀 **Deployment Examples**

### **1. EC2 Instance (98.130.50.198):**
```bash
API_BASE_URL=http://98.130.50.198:3001 ./start.sh
```

### **2. Custom Domain:**
```bash
API_BASE_URL=http://aadesigners.com:3001 ./start.sh
```

### **3. HTTPS Domain:**
```bash
API_BASE_URL=https://api.aadesigners.com ./start.sh
```

### **4. Local Development:**
```bash
./start.sh
# Uses: http://localhost:3001
```

## 🔒 **Security Features**

### **Automatic HTTPS Detection:**
- ✅ **Secure cookies** when using HTTPS
- ✅ **Session security** auto-configured
- ✅ **CORS protection** built-in

### **Production Warnings:**
- ⚠️ **Warns** if using default passwords
- ⚠️ **Warns** if using fallback secrets
- ⚠️ **Validates** environment setup

## 📊 **Configuration Validation**

The backend now automatically:
- ✅ **Validates** all environment variables
- ✅ **Shows warnings** for production issues
- ✅ **Uses fallbacks** for missing variables
- ✅ **Logs configuration** on startup

## 🛠️ **What's Changed**

### **Before:**
```javascript
// Hardcoded values
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### **After:**
```javascript
// Universal configuration
const config = require('./env-config');
app.listen(config.PORT, '0.0.0.0', () => {
  console.log(`Server running on ${config.API_BASE_URL}`);
});
```

## 🎯 **Benefits**

1. **Universal Deployment** - Works on any server/domain
2. **Auto-Configuration** - Detects HTTPS, environment, etc.
3. **Production Ready** - Security warnings and validation
4. **Flexible** - Easy to customize for any setup
5. **Maintainable** - Centralized configuration

## 🔄 **Migration**

No changes needed! The backend will:
- ✅ **Auto-detect** your environment
- ✅ **Use existing** Docker environment variables
- ✅ **Fallback gracefully** if variables are missing
- ✅ **Warn** about production security issues

Your backend is now completely universal and will work with any domain or IP address! 🎉 