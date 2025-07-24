const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const MAX_WIDTH = 1200; // Maximum width for images
const MAX_HEIGHT = 1200; // Maximum height for images
const QUALITY = 80; // JPEG quality (0-100)
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Function to optimize a single image
async function optimizeImage(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const originalSize = stats.size;
    
    console.log(`Optimizing: ${path.basename(filePath)} (${(originalSize / 1024 / 1024).toFixed(2)} MB)`);
    
    // Optimize image
    await sharp(filePath)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: QUALITY, progressive: true })
      .png({ quality: QUALITY, progressive: true })
      .toFile(filePath + '.optimized');
    
    // Replace original with optimized version
    fs.unlinkSync(filePath);
    fs.renameSync(filePath + '.optimized', filePath);
    
    const newStats = fs.statSync(filePath);
    const newSize = newStats.size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ Optimized: ${path.basename(filePath)} - ${reduction}% smaller (${(newSize / 1024 / 1024).toFixed(2)} MB)`);
    
  } catch (error) {
    console.error(`❌ Error optimizing ${filePath}:`, error.message);
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
  console.log('🚀 Starting image optimization...');
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
  } catch (error) {
    console.error('❌ Error during optimization:', error);
  }
}

// Run the script
main(); 