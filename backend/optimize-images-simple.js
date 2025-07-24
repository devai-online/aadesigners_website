const fs = require('fs');
const path = require('path');

// Configuration
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Function to get file size in MB
function getFileSizeMB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024 / 1024).toFixed(2);
}

// Function to check if image needs optimization
function needsOptimization(filePath) {
  const sizeMB = parseFloat(getFileSizeMB(filePath));
  return sizeMB > 2; // Optimize if larger than 2MB
}

// Function to log file info
function logFileInfo(filePath, action = 'Found') {
  const sizeMB = getFileSizeMB(filePath);
  const fileName = path.basename(filePath);
  console.log(`${action}: ${fileName} (${sizeMB} MB)`);
}

// Function to recursively find large images
function findLargeImages(dirPath) {
  const items = fs.readdirSync(dirPath);
  const largeImages = [];
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      largeImages.push(...findLargeImages(fullPath));
    } else if (stats.isFile()) {
      const ext = path.extname(item).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        if (needsOptimization(fullPath)) {
          largeImages.push(fullPath);
        }
      }
    }
  }
  
  return largeImages;
}

// Main function
function main() {
  console.log('🔍 Scanning for large images...');
  console.log(`📁 Directory: ${UPLOADS_DIR}`);
  console.log(`⚙️  Threshold: Images larger than 2MB will be flagged`);
  console.log('');
  
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.error('❌ Uploads directory not found!');
    return;
  }
  
  try {
    const largeImages = findLargeImages(UPLOADS_DIR);
    
    if (largeImages.length === 0) {
      console.log('✅ No large images found! Your images are already optimized.');
      return;
    }
    
    console.log(`📊 Found ${largeImages.length} large images that need optimization:`);
    console.log('');
    
    let totalSize = 0;
    largeImages.forEach((filePath, index) => {
      const sizeMB = parseFloat(getFileSizeMB(filePath));
      totalSize += sizeMB;
      console.log(`${index + 1}. ${path.basename(filePath)} (${sizeMB} MB)`);
    });
    
    console.log('');
    console.log(`📈 Total size: ${totalSize.toFixed(2)} MB`);
    console.log('');
    console.log('💡 RECOMMENDATIONS:');
    console.log('1. Use online tools like TinyPNG (tinypng.com)');
    console.log('2. Resize images to max 1200x1200 pixels');
    console.log('3. Save as JPEG with 80% quality');
    console.log('4. Target file size: 500KB - 2MB per image');
    console.log('');
    console.log('🚀 This will make your images load 5-10x faster!');
    
  } catch (error) {
    console.error('❌ Error during scan:', error);
  }
}

// Run the script
main(); 