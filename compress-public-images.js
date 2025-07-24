import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const MAX_WIDTH = 1920; // Maximum width for images
const MAX_HEIGHT = 1080; // Maximum height for images
const QUALITY = 60; // JPEG quality (0-100)
const PUBLIC_DIR = path.join(__dirname, 'public');

// Function to optimize a single image
async function optimizeImage(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const originalSize = stats.size;
    
    console.log(`📁 Processing: ${path.basename(filePath)} (${(originalSize / 1024 / 1024).toFixed(2)} MB)`);
    
    // Create backup of original file
    const backupPath = filePath + '.backup';
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
      console.log(`  💾 Backup created: ${path.basename(backupPath)}`);
    }
    
    // Get image info
    const imageInfo = await sharp(filePath).metadata();
    const originalWidth = imageInfo.width;
    const originalHeight = imageInfo.height;
    
    // Resize if image is too large
    if (originalWidth > MAX_WIDTH || originalHeight > MAX_HEIGHT) {
      console.log(`  🔄 Resizing from ${originalWidth}x${originalHeight} to max ${MAX_WIDTH}x${MAX_HEIGHT}`);
    }
    
    // Optimize image
    const optimizedBuffer = await sharp(filePath)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: QUALITY, progressive: true })
      .png({ quality: QUALITY, progressive: true })
      .toBuffer();
    
    // Write optimized image back to original file
    fs.writeFileSync(filePath, optimizedBuffer);
    
    const newStats = fs.statSync(filePath);
    const newSize = newStats.size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(2);
    
    console.log(`  ✅ Compressed: ${(newSize / 1024 / 1024).toFixed(2)} MB (${reduction}% reduction)`);
    
    return {
      originalSize,
      compressedSize: newSize,
      compressionRatio: parseFloat(reduction)
    };
    
  } catch (error) {
    console.error(`  ❌ Error processing ${path.basename(filePath)}:`, error.message);
    return null;
  }
}

// Function to find and optimize images in public directory
async function optimizeImagesInPublic() {
  console.log('🚀 Starting image compression for public folder...\n');
  
  try {
    if (!fs.existsSync(PUBLIC_DIR)) {
      console.error('❌ Public directory not found!');
      return;
    }
    
    const items = fs.readdirSync(PUBLIC_DIR);
    const imageFiles = items.filter(item => {
      const ext = path.extname(item).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && !item.endsWith('.backup');
    });
    
    if (imageFiles.length === 0) {
      console.log('📭 No supported image files found in public folder');
      return;
    }
    
    console.log(`📊 Found ${imageFiles.length} image files to compress\n`);
    console.log(`⚙️  Settings: Max ${MAX_WIDTH}x${MAX_HEIGHT}, Quality: ${QUALITY}%\n`);
    
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    let processedCount = 0;
    
    // Process each image
    for (const file of imageFiles) {
      const filePath = path.join(PUBLIC_DIR, file);
      const result = await optimizeImage(filePath);
      
      if (result) {
        totalOriginalSize += result.originalSize;
        totalCompressedSize += result.compressedSize;
        processedCount++;
      }
      
      console.log(''); // Add spacing between files
    }
    
    // Summary
    console.log('📈 Compression Summary:');
    console.log(`  Files processed: ${processedCount}/${imageFiles.length}`);
    console.log(`  Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Total compressed size: ${(totalCompressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Total space saved: ${((totalOriginalSize - totalCompressedSize) / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Average compression: ${((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(2)}%`);
    
    console.log('\n🎉 Image compression completed successfully!');
    console.log('💡 Original files are backed up with .backup extension');
    
  } catch (error) {
    console.error('❌ Error during compression:', error);
  }
}

// Run the optimization
optimizeImagesInPublic(); 