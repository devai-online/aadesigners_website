const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const imageOptimizer = (req, res, next) => {
  const imagePath = req.path;
  
  // Only process image files
  if (!imagePath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return next();
  }

  const fullPath = path.join(__dirname, '..', 'uploads', imagePath);
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: 'Image not found' });
  }

  // Get query parameters for resizing
  const width = parseInt(req.query.w) || null;
  const height = parseInt(req.query.h) || null;
  const quality = parseInt(req.query.q) || 80;
  const format = req.query.f || 'webp'; // Default to WebP for better compression

  // Create optimized image
  let sharpInstance = sharp(fullPath);

  // Resize if dimensions provided
  if (width || height) {
    sharpInstance = sharpInstance.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  // Set quality and format
  switch (format.toLowerCase()) {
    case 'webp':
      sharpInstance = sharpInstance.webp({ quality });
      res.set('Content-Type', 'image/webp');
      break;
    case 'jpeg':
    case 'jpg':
      sharpInstance = sharpInstance.jpeg({ quality });
      res.set('Content-Type', 'image/jpeg');
      break;
    case 'png':
      sharpInstance = sharpInstance.png({ quality });
      res.set('Content-Type', 'image/png');
      break;
    default:
      sharpInstance = sharpInstance.webp({ quality });
      res.set('Content-Type', 'image/webp');
  }

  // Add caching headers
  res.set('Cache-Control', 'public, max-age=31536000');
  res.set('Expires', new Date(Date.now() + 31536000000).toUTCString());

  // Stream the optimized image
  sharpInstance.pipe(res);
};

module.exports = imageOptimizer; 