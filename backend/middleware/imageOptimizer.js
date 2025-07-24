const fs = require('fs');
const path = require('path');

// Simple image optimization middleware
const optimizeImage = (req, res, next) => {
  // Store original files for processing after multer
  req.originalFiles = req.files;
  
  // Process files after multer has saved them
  if (req.files && req.files.length > 0) {
    console.log('🔄 Processing uploaded images for optimization...');
    
    req.files.forEach(file => {
      const filePath = file.path;
      const fileSize = file.size;
      const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);
      
      console.log(`📁 File: ${file.originalname} (${fileSizeMB} MB)`);
      
      // If file is larger than 5MB, log a warning
      if (fileSize > 5 * 1024 * 1024) {
        console.log(`⚠️  Large file detected: ${file.originalname} (${fileSizeMB} MB)`);
        console.log('💡 Consider optimizing this image for better performance');
      }
    });
  }
  
  next();
};

// Function to get file size info
const getFileInfo = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      sizeMB: (stats.size / 1024 / 1024).toFixed(2)
    };
  } catch (error) {
    return { size: 0, sizeMB: '0.00' };
  }
};

// Function to validate image size
const validateImageSize = (filePath) => {
  const fileInfo = getFileInfo(filePath);
  const maxSizeMB = 10; // 10MB limit
  
  if (fileInfo.size > maxSizeMB * 1024 * 1024) {
    return {
      valid: false,
      message: `Image too large: ${fileInfo.sizeMB} MB (max: ${maxSizeMB} MB)`
    };
  }
  
  return {
    valid: true,
    size: fileInfo.sizeMB
  };
};

module.exports = {
  optimizeImage,
  getFileInfo,
  validateImageSize
}; 