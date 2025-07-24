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
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'testimonial-' + uniqueSuffix + path.extname(file.originalname));
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
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit (reduced for better performance)
    files: 1 // Only one file
  }
});

// Get all testimonials
router.get('/', (req, res) => {
  db.all("SELECT * FROM testimonials ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single testimonial
router.get('/:id', (req, res) => {
  db.get("SELECT * FROM testimonials WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }
    res.json(row);
  });
});

// Create new testimonial
router.post('/', requireAuth, upload.single('image'), optimizeImage, (req, res) => {
  const { name, role, rating, text, project } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !role || !text || !project) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const sql = `
    INSERT INTO testimonials (name, role, image_path, rating, text, project)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, role, image_path, rating || 5, text, project], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Get the created testimonial
    db.get("SELECT * FROM testimonials WHERE id = ?", [this.lastID], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json(row);
    });
  });
});

// Update testimonial
router.put('/:id', requireAuth, upload.single('image'), optimizeImage, (req, res) => {
  const { name, role, rating, text, project } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : req.body.image_path;

  if (!name || !role || !text || !project) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // First get the current testimonial to check if there's an old image to delete
  db.get("SELECT image_path FROM testimonials WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }

    // Delete old image if it exists and we're uploading a new one
    if (row.image_path && req.file && row.image_path !== image_path) {
      const oldImagePath = path.join(__dirname, '..', row.image_path);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update the testimonial
    const sql = `
      UPDATE testimonials 
      SET name = ?, role = ?, image_path = ?, rating = ?, text = ?, project = ?
      WHERE id = ?
    `;

    db.run(sql, [name, role, image_path, rating || 5, text, project, req.params.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Get the updated testimonial
      db.get("SELECT * FROM testimonials WHERE id = ?", [req.params.id], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(row);
      });
    });
  });
});

// Delete testimonial
router.delete('/:id', requireAuth, (req, res) => {
  // First get the testimonial to check if there's an image to delete
  db.get("SELECT image_path FROM testimonials WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Testimonial not found' });
      return;
    }

    // Delete the image file if it exists
    if (row.image_path) {
      const imagePath = path.join(__dirname, '..', row.image_path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the testimonial from database
    db.run("DELETE FROM testimonials WHERE id = ?", [req.params.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Testimonial deleted successfully' });
    });
  });
});

module.exports = router; 