const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database connection
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

// Project folder mapping
const projectFolders = {
  'VILLA HOUSE - RESI': {
    title: 'Villa House',
    category: 'residential',
    description: 'Luxury villa design with modern amenities and elegant interiors',
    year: '2024',
    location: 'Hyderabad'
  },
  'MC HOUSE - RESI': {
    title: 'MC House',
    category: 'residential',
    description: 'Contemporary residential design with sophisticated styling',
    year: '2024',
    location: 'Hyderabad'
  },
  'LB NAGAR  - OFFICE  - COMM': {
    title: 'LB Nagar Office',
    category: 'commercial',
    description: 'Modern office space design for corporate environment',
    year: '2024',
    location: 'LB Nagar, Hyderabad'
  },
  'KMP SQUARE - COMM': {
    title: 'KMP Square',
    category: 'commercial',
    description: 'Commercial space design with innovative layout',
    year: '2024',
    location: 'Hyderabad'
  },
  'G HOUSE - RESI': {
    title: 'G House',
    category: 'residential',
    description: 'Family home design with comfort and style',
    year: '2024',
    location: 'Hyderabad'
  },
  'FAMILY VILLA - RESI': {
    title: 'Family Villa',
    category: 'residential',
    description: 'Spacious villa design for modern family living',
    year: '2024',
    location: 'Hyderabad'
  },
  'CORNER HOUSE - RESI': {
    title: 'Corner House',
    category: 'residential',
    description: 'Unique corner plot design with optimal space utilization',
    year: '2024',
    location: 'Hyderabad'
  },
  'AK HOUSE - RESI': {
    title: 'AK House',
    category: 'residential',
    description: 'Modern residential design with contemporary aesthetics',
    year: '2024',
    location: 'Hyderabad'
  },
  '4BHK UNIT - RESI': {
    title: '4BHK Unit',
    category: 'residential',
    description: 'Luxury 4-bedroom apartment design with premium finishes',
    year: '2024',
    location: 'Hyderabad'
  },
  '4BHK FAMILY HOUSE - RESI': {
    title: '4BHK Family House',
    category: 'residential',
    description: 'Spacious family home with 4 bedrooms and modern amenities',
    year: '2024',
    location: 'Hyderabad'
  }
};

const getProjectImages = (folderName) => {
  const folderPath = path.join(__dirname, 'uploads', 'projects', folderName);
  
  if (!fs.existsSync(folderPath)) {
    console.log(`⚠️  Folder not found: ${folderPath}`);
    return [];
  }
  
  try {
    const files = fs.readdirSync(folderPath);
    const imageFiles = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .sort((a, b) => {
        // Sort by number if filename contains numbers
        const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
        const bNum = parseInt(b.match(/\d+/)?.[0] || '0');
        return aNum - bNum;
      });
    
    return imageFiles.map(file => `/uploads/projects/${folderName}/${file}`);
  } catch (err) {
    console.error(`❌ Error reading folder ${folderName}:`, err);
    return [];
  }
};

const migrateProjects = () => {
  return new Promise((resolve, reject) => {
    console.log('🔄 Starting project migration from uploads/projects...');
    
    // First, check if projects table exists and has the right schema
    db.get("PRAGMA table_info(projects)", (err, rows) => {
      if (err) {
        console.error('❌ Error checking table schema:', err);
        reject(err);
        return;
      }
      
      console.log('✅ Database schema checked');
      
      // Clear existing projects
      db.run("DELETE FROM projects", (err) => {
        if (err) {
          console.error('❌ Error clearing projects:', err);
          reject(err);
          return;
        }
        
        console.log('✅ Cleared existing projects');
        
        // Insert projects from folders
        const stmt = db.prepare(`
          INSERT INTO projects (title, category, image_path, description, year, location, images)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        let insertedCount = 0;
        let errorCount = 0;
        const totalProjects = Object.keys(projectFolders).length;
        
        Object.entries(projectFolders).forEach(([folderName, projectData]) => {
          const images = getProjectImages(folderName);
          
          if (images.length === 0) {
            console.log(`⚠️  No images found for ${projectData.title}, skipping...`);
            errorCount++;
            if (insertedCount + errorCount === totalProjects) {
              stmt.finalize();
              console.log(`🎉 Migration complete! ${insertedCount} projects migrated, ${errorCount} errors`);
              resolve();
            }
            return;
          }
          
          // Use the first image as the main image_path
          const mainImage = images[0];
          const allImages = JSON.stringify(images);
          
          console.log(`🔄 Inserting: ${projectData.title} with ${images.length} images from ${folderName}`);
          
          stmt.run([
            projectData.title,
            projectData.category,
            mainImage,
            projectData.description,
            projectData.year,
            projectData.location,
            allImages
          ], function(err) {
            if (err) {
              console.error(`❌ Error inserting project ${projectData.title}:`, err);
              errorCount++;
            } else {
              insertedCount++;
              console.log(`✅ Inserted: ${projectData.title} (${images.length} images)`);
            }
            
            // Check if all projects have been processed
            if (insertedCount + errorCount === totalProjects) {
              stmt.finalize();
              console.log(`🎉 Migration complete! ${insertedCount} projects migrated, ${errorCount} errors`);
              resolve();
            }
          });
        });
      });
    });
  });
};

// Run migration
migrateProjects()
  .then(() => {
    console.log('✅ Migration completed successfully');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }); 