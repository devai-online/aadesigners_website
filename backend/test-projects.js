const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Testing Projects Data...\n');

// Test 1: Check database projects
db.all("SELECT id, title, category, image_path, images FROM projects", (err, rows) => {
  if (err) {
    console.error('❌ Database error:', err);
    return;
  }
  
  console.log(`✅ Found ${rows.length} projects in database:\n`);
  
  rows.forEach((project, index) => {
    console.log(`${index + 1}. ${project.title} (${project.category})`);
    console.log(`   Main Image: ${project.image_path}`);
    
    // Test image file existence
    if (project.image_path) {
      const imagePath = path.join(__dirname, project.image_path);
      const exists = fs.existsSync(imagePath);
      console.log(`   Image exists: ${exists ? '✅' : '❌'} (${imagePath})`);
    }
    
    // Test images array
    if (project.images) {
      try {
        const images = JSON.parse(project.images);
        console.log(`   Gallery images: ${images.length} images`);
        
        // Test first few images
        images.slice(0, 3).forEach((img, i) => {
          const imgPath = path.join(__dirname, img);
          const exists = fs.existsSync(imgPath);
          console.log(`     ${i + 1}. ${img} - ${exists ? '✅' : '❌'}`);
        });
        
        if (images.length > 3) {
          console.log(`     ... and ${images.length - 3} more`);
        }
      } catch (e) {
        console.log(`   ❌ Error parsing images JSON: ${e.message}`);
      }
    }
    
    console.log('');
  });
  
  // Test 2: Check uploads directory
  console.log('📁 Checking uploads directory structure...\n');
  const uploadsPath = path.join(__dirname, 'uploads', 'projects');
  
  if (fs.existsSync(uploadsPath)) {
    const folders = fs.readdirSync(uploadsPath);
    console.log(`✅ Found ${folders.length} project folders in uploads/projects:\n`);
    
    folders.forEach(folder => {
      const folderPath = path.join(uploadsPath, folder);
      const files = fs.readdirSync(folderPath);
      const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
      console.log(`📂 ${folder}: ${imageFiles.length} images`);
    });
  } else {
    console.log('❌ uploads/projects directory not found');
  }
  
  console.log('\n🎯 Frontend should be able to access:');
  console.log('- API: http://localhost:3001/api/projects');
  console.log('- Images: http://localhost:3001/uploads/projects/...');
  
  db.close();
}); 