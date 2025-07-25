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
    cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
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
    fileSize: 20 * 1024 * 1024, // 20MB limit (will be compressed by middleware)
    files: 1 // Only one file
  }
});

// Get all blog posts
router.get('/', (req, res) => {
  db.all("SELECT * FROM blog_posts ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single blog post
router.get('/:id', (req, res) => {
  db.get("SELECT * FROM blog_posts WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }
    res.json(row);
  });
});

// Create new blog post
router.post('/', requireAuth, upload.single('image'), optimizeImage, (req, res) => {
  const { title, excerpt, content, author, date, category, read_time, tags } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !excerpt || !content || !author || !date || !category || !read_time) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const sql = `
    INSERT INTO blog_posts (title, excerpt, content, image_path, author, date, category, read_time, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [title, excerpt, content, image_path, author, date, category, read_time, tags || '[]'], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Get the created blog post
    db.get("SELECT * FROM blog_posts WHERE id = ?", [this.lastID], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json(row);
    });
  });
});

// Update blog post
router.put('/:id', requireAuth, upload.single('image'), optimizeImage, (req, res) => {
  const { title, excerpt, content, author, date, category, read_time, tags } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : req.body.image_path;

  if (!title || !excerpt || !content || !author || !date || !category || !read_time) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // First get the current blog post to check if there's an old image to delete
  db.get("SELECT image_path FROM blog_posts WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    // Delete old image if it exists and we're uploading a new one
    if (row.image_path && req.file && row.image_path !== image_path) {
      const oldImagePath = path.join(__dirname, '..', row.image_path);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update the blog post
    const sql = `
      UPDATE blog_posts 
      SET title = ?, excerpt = ?, content = ?, image_path = ?, author = ?, date = ?, category = ?, read_time = ?, tags = ?
      WHERE id = ?
    `;

    db.run(sql, [title, excerpt, content, image_path, author, date, category, read_time, tags || '[]', req.params.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Get the updated blog post
      db.get("SELECT * FROM blog_posts WHERE id = ?", [req.params.id], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(row);
      });
    });
  });
});

// Delete blog post
router.delete('/:id', requireAuth, (req, res) => {
  // First get the blog post to check if there's an image to delete
  db.get("SELECT image_path FROM blog_posts WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    // Delete the image file if it exists
    if (row.image_path) {
      const imagePath = path.join(__dirname, '..', row.image_path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the blog post from database
    db.run("DELETE FROM blog_posts WHERE id = ?", [req.params.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Blog post deleted successfully' });
    });
  });
});

module.exports = router; 