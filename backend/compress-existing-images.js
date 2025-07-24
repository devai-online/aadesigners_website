const fs = require('fs');
const path = require('path');
const { compressExistingImage } = require('./middleware/imageOptimizer');

const uploadsDir = path.join(__dirname, 'uploads');

// Function to recursively find all image files
const findImageFiles = (dir) => {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    console.log(`❌ Directory not found: ${dir}`);
    return files;
  }
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findImageFiles(fullPath));
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
};

// Main compression function
const compressAllImages = async () => {
  console.log('🚀 Starting automatic image compression for all existing images...');
  console.log(`📁 Scanning directory: ${uploadsDir}`);
  
  const imageFiles = findImageFiles(uploadsDir);
  
  if (imageFiles.length === 0) {
    console.log('❌ No image files found in uploads directory');
    return;
  }
  
  console.log(`📊 Found ${imageFiles.length} image files to compress`);
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < imageFiles.length; i++) {
    const filePath = imageFiles[i];
    console.log(`\n🔄 Processing ${i + 1}/${imageFiles.length}: ${path.basename(filePath)}`);
    
    try {
      const result = await compressExistingImage(filePath);
      
      if (result.success) {
        successCount++;
        totalOriginalSize += parseFloat(result.originalSize);
        totalOptimizedSize += parseFloat(result.optimizedSize);
      } else {
        failCount++;
        console.log(`❌ Failed: ${result.error}`);
      }
    } catch (error) {
      failCount++;
      console.log(`❌ Error processing ${path.basename(filePath)}:`, error.message);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPRESSION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully compressed: ${successCount} images`);
  console.log(`❌ Failed to compress: ${failCount} images`);
  console.log(`📁 Total original size: ${totalOriginalSize.toFixed(2)} MB`);
  console.log(`📁 Total optimized size: ${totalOptimizedSize.toFixed(2)} MB`);
  
  if (totalOriginalSize > 0) {
    const totalCompressionRatio = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
    const spaceSaved = (totalOriginalSize - totalOptimizedSize).toFixed(2);
    console.log(`💾 Space saved: ${spaceSaved} MB (${totalCompressionRatio}% reduction)`);
  }
  
  console.log('🎉 Image compression completed!');
  console.log('🚀 Your website will now load much faster!');
};

// Run the compression
if (require.main === module) {
  compressAllImages().catch(console.error);
}

module.exports = { compressAllImages }; 