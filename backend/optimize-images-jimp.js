const fs = require('fs');
const path = require('path');
const Jimp = require('jimp').default;

// Configuration
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const QUALITY = 85; // High quality to maintain visual appeal
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Function to get file size in MB
function getFileSizeMB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024 / 1024).toFixed(2);
}

// Function to optimize a single image
async function optimizeImage(filePath) {
  try {
    const originalSize = parseFloat(getFileSizeMB(filePath));
    const fileName = path.basename(filePath);
    
    console.log(`🔄 Optimizing: ${fileName} (${originalSize} MB)`);
    
    // Read the image
    const image = await Jimp.read(filePath);
    
    // Get original dimensions
    const originalWidth = image.getWidth();
    const originalHeight = image.getHeight();
    
    // Calculate new dimensions while maintaining aspect ratio
    let newWidth = originalWidth;
    let newHeight = originalHeight;
    
    if (originalWidth > MAX_WIDTH || originalHeight > MAX_HEIGHT) {
      if (originalWidth > originalHeight) {
        newWidth = MAX_WIDTH;
        newHeight = Math.round((originalHeight * MAX_WIDTH) / originalWidth);
      } else {
        newHeight = MAX_HEIGHT;
        newWidth = Math.round((originalWidth * MAX_HEIGHT) / originalHeight);
      }
    }
    
    // Resize if needed
    if (newWidth !== originalWidth || newHeight !== originalHeight) {
      image.resize(newWidth, newHeight);
      console.log(`   📏 Resized: ${originalWidth}x${originalHeight} → ${newWidth}x${newHeight}`);
    }
    
    // Save with high quality
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') {
      await image.quality(QUALITY).writeAsync(filePath);
    } else if (ext === '.png') {
      await image.quality(QUALITY).writeAsync(filePath);
    } else {
      // For other formats, convert to JPEG
      await image.quality(QUALITY).writeAsync(filePath.replace(ext, '.jpg'));
      // Remove original if converted
      if (ext !== '.jpg') {
        fs.unlinkSync(filePath);
      }
    }
    
    // Get new file size
    const newSize = parseFloat(getFileSizeMB(filePath));
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ Optimized: ${fileName} - ${reduction}% smaller (${newSize} MB)`);
    
  } catch (error) {
    console.error(`❌ Error optimizing ${path.basename(filePath)}:`, error.message);
  }
}

// Function to recursively find and optimize images
async function optimizeImagesInDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      await optimizeImagesInDirectory(fullPath);
    } else if (stats.isFile()) {
      const ext = path.extname(item).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        await optimizeImage(fullPath);
      }
    }
  }
}

// Main function
async function main() {
  console.log('🚀 Starting image optimization with Jimp...');
  console.log(`📁 Processing directory: ${UPLOADS_DIR}`);
  console.log(`⚙️  Settings: Max ${MAX_WIDTH}x${MAX_HEIGHT}, Quality: ${QUALITY}%`);
  console.log('');
  
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.error('❌ Uploads directory not found!');
    return;
  }
  
  try {
    await optimizeImagesInDirectory(UPLOADS_DIR);
    console.log('');
    console.log('✅ Image optimization completed!');
    console.log('🎉 Your images should now load much faster!');
  } catch (error) {
    console.error('❌ Error during optimization:', error);
  }
}

// Run the script
main(); 