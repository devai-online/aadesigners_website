const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../database');
const { requireAuth } = require('../middleware/auth');
const { optimizeImage, validateImageSize } = require('../middleware/imageOptimizer');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    console.log('Upload destination:', uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'project-' + uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log('Processing file:', file.originalname, 'MIME type:', file.mimetype);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      console.log('Rejected file:', file.originalname, 'Invalid MIME type:', file.mimetype);
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit per file (will be automatically compressed)
    files: 20 // Maximum 20 files
  }
});

// Get all projects
router.get('/', (req, res) => {
  db.all("SELECT * FROM projects ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single project
router.get('/:id', (req, res) => {
  db.get("SELECT * FROM projects WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(row);
  });
});

// Create new project
router.post('/', requireAuth, (req, res, next) => {
  upload.array('images', 20)(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, optimizeImage, (req, res) => {
  try {
    console.log('Creating new project with data:', req.body);
    console.log('Uploaded files:', req.files);
    
    const { title, category, description, year, location } = req.body;
    
    // Handle multiple uploaded images
    let imagesArray = [];
    if (req.files && req.files.length > 0) {
      imagesArray = req.files.map(file => `/uploads/${file.filename}`);
      console.log('Processed images array:', imagesArray);
    }
    
    // Use first image as main image_path
    const image_path = imagesArray.length > 0 ? imagesArray[0] : null;

    if (!title || !category || !description || !year) {
      console.log('Missing required fields:', { title, category, description, year });
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const sql = `
      INSERT INTO projects (title, category, image_path, description, year, location, images)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [title, category, image_path, description, year, location, JSON.stringify(imagesArray)];
    console.log('SQL parameters:', params);

    db.run(sql, params, function(err) {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
        return;
      }
      
      console.log('Project created with ID:', this.lastID);
      
      // Get the created project
      db.get("SELECT * FROM projects WHERE id = ?", [this.lastID], (err, row) => {
        if (err) {
          console.error('Error fetching created project:', err);
          res.status(500).json({ error: err.message });
          return;
        }
        console.log('Created project:', row);
        res.status(201).json(row);
      });
    });
  } catch (error) {
    console.error('Unexpected error in project creation:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Update project
router.put('/:id', requireAuth, (req, res, next) => {
  upload.array('images', 20)(req, res, (err) => {
    if (err) {
      console.error('Multer error in update:', err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, (req, res) => {
  try {
    console.log('Updating project with data:', req.body);
    console.log('Uploaded files:', req.files);
    
    const { title, category, description, year, location } = req.body;
    
    // Handle multiple uploaded images
    let imagesArray = [];
    if (req.files && req.files.length > 0) {
      imagesArray = req.files.map(file => `/uploads/${file.filename}`);
      console.log('Processed images array:', imagesArray);
    }
    
    // Use first image as main image_path
    const image_path = imagesArray.length > 0 ? imagesArray[0] : req.body.image_path;

    if (!title || !category || !description || !year) {
      console.log('Missing required fields:', { title, category, description, year });
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

  // First get the current project to check if there are old images to delete
  db.get("SELECT image_path, images FROM projects WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Delete old images if new ones are uploaded
    if (req.files && req.files.length > 0) {
      try {
        const oldImages = JSON.parse(row.images || '[]');
        oldImages.forEach(oldImagePath => {
          if (oldImagePath) {
            const fullPath = path.join(__dirname, '..', oldImagePath);
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          }
        });
      } catch (e) {
        console.error('Error deleting old images:', e);
      }
    }

    // Update the project
    const sql = `
      UPDATE projects 
      SET title = ?, category = ?, image_path = ?, description = ?, year = ?, location = ?, images = ?
      WHERE id = ?
    `;

    db.run(sql, [title, category, image_path, description, year, location, JSON.stringify(imagesArray), req.params.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Get the updated project
      db.get("SELECT * FROM projects WHERE id = ?", [req.params.id], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(row);
      });
    });
  });
  } catch (error) {
    console.error('Unexpected error in project update:', error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

// Delete project
router.delete('/:id', requireAuth, (req, res) => {
  // First get the project to check if there are images to delete
  db.get("SELECT image_path, images FROM projects WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Delete all associated image files
    try {
      // Delete main image if it exists
      if (row.image_path) {
        const imagePath = path.join(__dirname, '..', row.image_path);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`Deleted main image: ${imagePath}`);
        }
      }

      // Delete all images from the images array
      if (row.images) {
        const imagesArray = JSON.parse(row.images);
        imagesArray.forEach(imagePath => {
          if (imagePath && imagePath !== row.image_path) { // Don't delete main image twice
            const fullPath = path.join(__dirname, '..', imagePath);
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
              console.log(`Deleted image: ${fullPath}`);
            }
          }
        });
      }
    } catch (e) {
      console.error('Error deleting image files:', e);
    }

    // Delete the project from database
    db.run("DELETE FROM projects WHERE id = ?", [req.params.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Project and all associated images deleted successfully' });
    });
  });
});

module.exports = router; 