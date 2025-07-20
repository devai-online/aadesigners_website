const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database connection
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

const updateSchema = () => {
  return new Promise((resolve, reject) => {
    console.log('🔄 Updating database schema...');
    
    // Add location column if it doesn't exist
    db.run("ALTER TABLE projects ADD COLUMN location TEXT", (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('❌ Error adding location column:', err);
      } else {
        console.log('✅ Location column added/verified');
      }
      
      // Add images column if it doesn't exist
      db.run("ALTER TABLE projects ADD COLUMN images TEXT", (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.error('❌ Error adding images column:', err);
        } else {
          console.log('✅ Images column added/verified');
        }
        
        console.log('🎉 Database schema updated successfully');
        resolve();
      });
    });
  });
};

// Run schema update
updateSchema()
  .then(() => {
    console.log('✅ Schema update completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Schema update failed:', err);
    process.exit(1);
  }); 