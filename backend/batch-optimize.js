const fs = require('fs');
const path = require('path');

// Configuration
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const LARGE_FILE_THRESHOLD = 5 * 1024 * 1024; // 5MB

// Function to get file size in MB
function getFileSizeMB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024 / 1024).toFixed(2);
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
        const sizeMB = parseFloat(getFileSizeMB(fullPath));
        if (sizeMB > 5) { // Files larger than 5MB
          largeImages.push({
            path: fullPath,
            name: item,
            size: sizeMB,
            relativePath: fullPath.replace(UPLOADS_DIR, '')
          });
        }
      }
    }
  }
  
  return largeImages;
}

// Main function
function main() {
  console.log('🔍 Scanning for large images in uploads directory...');
  console.log(`📁 Directory: ${UPLOADS_DIR}`);
  console.log(`⚙️  Threshold: Images larger than 5MB`);
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
    largeImages.forEach((file, index) => {
      totalSize += file.size;
      console.log(`${index + 1}. ${file.name} (${file.size} MB) - ${file.relativePath}`);
    });
    
    console.log('');
    console.log(`📈 Total size: ${totalSize.toFixed(2)} MB`);
    console.log('');
    console.log('🚀 QUICK OPTIMIZATION OPTIONS:');
    console.log('');
    console.log('1️⃣  ONLINE TOOLS (Recommended):');
    console.log('   • TinyPNG: https://tinypng.com');
    console.log('   • Squoosh: https://squoosh.app');
    console.log('   • Compressor.io: https://compressor.io');
    console.log('');
    console.log('2️⃣  DESKTOP APPS:');
    console.log('   • ImageOptim (Mac): https://imageoptim.com');
    console.log('   • FileOptimizer (Windows): https://nikkhokkho.sourceforge.io/static.php?page=FileOptimizer');
    console.log('   • JPEGOptim (Linux): sudo apt install jpegoptim');
    console.log('');
    console.log('3️⃣  MANUAL PROCESS:');
    console.log('   • Resize to max 1200x1200 pixels');
    console.log('   • Save as JPEG with 80-85% quality');
    console.log('   • Target file size: 500KB - 2MB per image');
    console.log('');
    console.log('💡 TIPS:');
    console.log('   • Process images in batches of 10-20');
    console.log('   • Keep original files as backup');
    console.log('   • Test a few images first');
    console.log('');
    console.log('🎯 EXPECTED RESULTS:');
    console.log('   • File sizes: 90% smaller');
    console.log('   • Loading time: 5-10x faster');
    console.log('   • Quality: Still professional');
    console.log('');
    console.log('📝 NEXT STEPS:');
    console.log('   1. Choose an optimization method above');
    console.log('   2. Process the large images listed above');
    console.log('   3. Replace original files with optimized versions');
    console.log('   4. Test your website - images should load much faster!');
    
  } catch (error) {
    console.error('❌ Error during scan:', error);
  }
}

// Run the script
main(); 