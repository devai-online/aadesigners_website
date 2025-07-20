const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

console.log('🧹 Cleaning up orphaned image files...\n');

const cleanupOrphanedFiles = () => {
  return new Promise((resolve, reject) => {
    // Get all image paths from database
    db.all("SELECT image_path, images FROM projects", (err, rows) => {
      if (err) {
        console.error('❌ Database error:', err);
        reject(err);
        return;
      }

      // Collect all valid image paths from database
      const validImagePaths = new Set();
      
      rows.forEach(row => {
        if (row.image_path) {
          validImagePaths.add(row.image_path);
        }
        
        if (row.images) {
          try {
            const imagesArray = JSON.parse(row.images);
            imagesArray.forEach(imgPath => {
              if (imgPath) {
                validImagePaths.add(imgPath);
              }
            });
          } catch (e) {
            console.error('Error parsing images JSON:', e);
          }
        }
      });

      console.log(`📊 Found ${validImagePaths.size} valid image paths in database`);

      // Scan uploads folder for orphaned files
      const uploadsPath = path.join(__dirname, 'uploads');
      let deletedCount = 0;
      let errorCount = 0;

      if (fs.existsSync(uploadsPath)) {
        const files = fs.readdirSync(uploadsPath);
        
        files.forEach(file => {
          const filePath = `/uploads/${file}`;
          
          if (!validImagePaths.has(filePath)) {
            const fullPath = path.join(uploadsPath, file);
            try {
              fs.unlinkSync(fullPath);
              console.log(`🗑️  Deleted orphaned file: ${file}`);
              deletedCount++;
            } catch (e) {
              console.error(`❌ Error deleting ${file}:`, e.message);
              errorCount++;
            }
          }
        });
      }

      console.log(`\n✅ Cleanup complete!`);
      console.log(`   - Deleted ${deletedCount} orphaned files`);
      console.log(`   - ${errorCount} errors encountered`);
      console.log(`   - ${validImagePaths.size} valid files preserved`);

      db.close();
      resolve();
    });
  });
};

// Run cleanup
cleanupOrphanedFiles()
  .then(() => {
    console.log('\n🎉 Cleanup completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Cleanup failed:', err);
    process.exit(1);
  }); 