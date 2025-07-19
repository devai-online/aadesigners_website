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
router.post('/', upload.single('image'), (req, res) => {
  const { title, category, description, year } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !category || !description || !year) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const sql = `
    INSERT INTO projects (title, category, image_path, description, year)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [title, category, image_path, description, year], function(err) {
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
router.put('/:id', upload.single('image'), (req, res) => {
  const { title, category, description, year } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : req.body.image_path;

  if (!title || !category || !description || !year) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // First get the current project to check if there's an old image to delete
  db.get("SELECT image_path FROM projects WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Delete old image if it exists and we're uploading a new one
    if (row.image_path && req.file && row.image_path !== image_path) {
      const oldImagePath = path.join(__dirname, '..', row.image_path);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update the project
    const sql = `
      UPDATE projects 
      SET title = ?, category = ?, image_path = ?, description = ?, year = ?
      WHERE id = ?
    `;

    db.run(sql, [title, category, image_path, description, year, req.params.id], function(err) {
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
  // First get the project to check if there's an image to delete
  db.get("SELECT image_path FROM projects WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Delete the image file if it exists
    if (row.image_path) {
      const imagePath = path.join(__dirname, '..', row.image_path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the project from database
    db.run("DELETE FROM projects WHERE id = ?", [req.params.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Project deleted successfully' });
    });
  });
});

module.exports = router; 