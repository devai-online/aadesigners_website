const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

console.log('🧪 Testing delete functionality...\n');

const testDeleteFunctionality = () => {
  return new Promise((resolve, reject) => {
    // Get all projects with their image information
    db.all("SELECT id, title, image_path, images FROM projects", (err, rows) => {
      if (err) {
        console.error('❌ Database error:', err);
        reject(err);
        return;
      }

      console.log(`📊 Found ${rows.length} projects in database:\n`);

      rows.forEach((project, index) => {
        console.log(`${index + 1}. ${project.title} (ID: ${project.id})`);
        console.log(`   Main image: ${project.image_path || 'None'}`);
        
        // Check if main image file exists
        if (project.image_path) {
          const mainImagePath = path.join(__dirname, project.image_path);
          const mainImageExists = fs.existsSync(mainImagePath);
          console.log(`   Main image exists: ${mainImageExists ? '✅' : '❌'}`);
        }

        // Check images array
        if (project.images) {
          try {
            const imagesArray = JSON.parse(project.images);
            console.log(`   Gallery images: ${imagesArray.length} images`);
            
            imagesArray.forEach((imgPath, i) => {
              const fullPath = path.join(__dirname, imgPath);
              const exists = fs.existsSync(fullPath);
              console.log(`     ${i + 1}. ${imgPath} - ${exists ? '✅' : '❌'}`);
            });
          } catch (e) {
            console.log(`   ❌ Error parsing images JSON: ${e.message}`);
          }
        }
        
        console.log('');
      });

      // Check uploads folder
      const uploadsPath = path.join(__dirname, 'uploads');
      if (fs.existsSync(uploadsPath)) {
        const files = fs.readdirSync(uploadsPath);
        console.log(`📁 Uploads folder contains ${files.length} files:`);
        files.forEach(file => {
          console.log(`   - ${file}`);
        });
      } else {
        console.log('📁 Uploads folder not found');
      }

      console.log('\n🎯 To test delete functionality:');
      console.log('1. Go to admin dashboard: http://localhost:5173/admin');
      console.log('2. Create a new project with multiple images');
      console.log('3. Delete the project');
      console.log('4. Check that all image files are removed from uploads folder');
      console.log('5. Run cleanup script if needed: node cleanup-orphaned-files.js');

      db.close();
      resolve();
    });
  });
};

// Run test
testDeleteFunctionality()
  .then(() => {
    console.log('\n✅ Test completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }); 