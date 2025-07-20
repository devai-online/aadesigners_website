const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../database');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
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
router.post('/', upload.array('images', 10), (req, res) => {
  const { title, category, description, year, location } = req.body;
  
  // Handle multiple uploaded images
  let imagesArray = [];
  if (req.files && req.files.length > 0) {
    imagesArray = req.files.map(file => `/uploads/${file.filename}`);
  }
  
  // Use first image as main image_path
  const image_path = imagesArray.length > 0 ? imagesArray[0] : null;

  if (!title || !category || !description || !year) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const sql = `
    INSERT INTO projects (title, category, image_path, description, year, location, images)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [title, category, image_path, description, year, location, JSON.stringify(imagesArray)], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Get the created project
    db.get("SELECT * FROM projects WHERE id = ?", [this.lastID], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json(row);
    });
  });
});

// Update project
router.put('/:id', upload.array('images', 10), (req, res) => {
  const { title, category, description, year, location } = req.body;
  
  // Handle multiple uploaded images
  let imagesArray = [];
  if (req.files && req.files.length > 0) {
    imagesArray = req.files.map(file => `/uploads/${file.filename}`);
  }
  
  // Use first image as main image_path
  const image_path = imagesArray.length > 0 ? imagesArray[0] : req.body.image_path;

  if (!title || !category || !description || !year) {
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
});

// Delete project
router.delete('/:id', (req, res) => {
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