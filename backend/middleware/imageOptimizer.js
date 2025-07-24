const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Advanced image optimization middleware using Sharp
const optimizeImage = async (req, res, next) => {
  try {
    if (req.files && req.files.length > 0) {
      console.log('🔄 Processing uploaded images for automatic optimization...');
      
      for (const file of req.files) {
        const filePath = file.path;
        const originalSize = file.size;
        const originalSizeMB = (originalSize / 1024 / 1024).toFixed(2);
        
        console.log(`📁 Processing: ${file.originalname} (${originalSizeMB} MB)`);
        
        try {
          // Get image metadata
          const metadata = await sharp(filePath).metadata();
          console.log(`📐 Original dimensions: ${metadata.width}x${metadata.height}`);
          
          // Determine target dimensions (max 1920px width/height)
          const maxDimension = 1920;
          let targetWidth = metadata.width;
          let targetHeight = metadata.height;
          
          if (metadata.width > maxDimension || metadata.height > maxDimension) {
            if (metadata.width > metadata.height) {
              targetWidth = maxDimension;
              targetHeight = Math.round((metadata.height * maxDimension) / metadata.width);
            } else {
              targetHeight = maxDimension;
              targetWidth = Math.round((metadata.width * maxDimension) / metadata.height);
            }
            console.log(`📏 Resizing to: ${targetWidth}x${targetHeight}`);
          }
          
          // Determine quality based on original file size
          let quality = 85; // Default quality
          if (originalSize > 5 * 1024 * 1024) { // > 5MB
            quality = 75;
          } else if (originalSize > 2 * 1024 * 1024) { // > 2MB
            quality = 80;
          }
          
          // Create optimized image
          const optimizedBuffer = await sharp(filePath)
            .resize(targetWidth, targetHeight, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .jpeg({ 
              quality: quality,
              progressive: true,
              mozjpeg: true
            })
            .png({ 
              quality: quality,
              progressive: true,
              compressionLevel: 9
            })
            .webp({ 
              quality: quality,
              effort: 6
            })
            .toBuffer();
          
          // Write optimized image back to file
          fs.writeFileSync(filePath, optimizedBuffer);
          
          // Update file size
          const optimizedSize = optimizedBuffer.length;
          const optimizedSizeMB = (optimizedSize / 1024 / 1024).toFixed(2);
          const compressionRatio = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
          
          console.log(`✅ Automatically optimized: ${file.originalname}`);
          console.log(`📊 Size reduction: ${originalSizeMB} MB → ${optimizedSizeMB} MB (${compressionRatio}% smaller)`);
          console.log(`🎯 Final dimensions: ${targetWidth}x${targetHeight}`);
          console.log(`⚙️  Quality setting: ${quality}%`);
          
          // Update the file object with new size
          file.size = optimizedSize;
          
        } catch (error) {
          console.error(`❌ Failed to optimize ${file.originalname}:`, error.message);
          // Continue with other files even if one fails
        }
      }
    }
  } catch (error) {
    console.error('❌ Image optimization error:', error);
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

// Function to compress existing images
const compressExistingImage = async (filePath) => {
  try {
    const originalSize = getFileInfo(filePath).size;
    const originalSizeMB = (originalSize / 1024 / 1024).toFixed(2);
    
    console.log(`🔄 Compressing existing image: ${path.basename(filePath)} (${originalSizeMB} MB)`);
    
    const optimizedBuffer = await sharp(filePath)
      .resize(1920, 1920, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ 
        quality: 85,
        progressive: true,
        mozjpeg: true
      })
      .png({ 
        quality: 85,
        progressive: true,
        compressionLevel: 9
      })
      .webp({ 
        quality: 85,
        effort: 6
      })
      .toBuffer();
    
    fs.writeFileSync(filePath, optimizedBuffer);
    
    const optimizedSize = optimizedBuffer.length;
    const optimizedSizeMB = (optimizedSize / 1024 / 1024).toFixed(2);
    const compressionRatio = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ Compressed: ${path.basename(filePath)}`);
    console.log(`📊 Size reduction: ${originalSizeMB} MB → ${optimizedSizeMB} MB (${compressionRatio}% smaller)`);
    
    return {
      success: true,
      originalSize: originalSizeMB,
      optimizedSize: optimizedSizeMB,
      compressionRatio: compressionRatio
    };
    
  } catch (error) {
    console.error(`❌ Failed to compress ${path.basename(filePath)}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  optimizeImage,
  getFileInfo,
  validateImageSize,
  compressExistingImage
}; 