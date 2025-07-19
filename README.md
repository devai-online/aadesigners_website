# AA Designer Studio Website

A modern portfolio website for AA Designer Studio with a full-stack admin dashboard.

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite
- **File Storage**: Local file system

## 📁 Project Structure

```
aadesigners_website/
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── ...
├── backend/               # Node.js backend
│   ├── routes/            # API routes
│   ├── uploads/           # Image uploads
│   ├── database.db        # SQLite database
│   ├── server.js          # Express server
│   └── database.js        # Database setup
└── ...
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3001`

### 3. Start the Frontend

```bash
# In a new terminal
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔐 Admin Access

- **URL**: `http://localhost:5173/admin`
- **Password**: `aadesigner2024`

## 📊 API Endpoints

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Create new testimonial
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Blog Posts
- `GET /api/blog` - Get all blog posts
- `POST /api/blog` - Create new blog post
- `PUT /api/blog/:id` - Update blog post
- `DELETE /api/blog/:id` - Delete blog post

### Health Check
- `GET /api/health` - Server health status

## 🗄️ Database Schema

### Testimonials Table
```sql
CREATE TABLE testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_path TEXT,
  rating INTEGER DEFAULT 5,
  text TEXT NOT NULL,
  project TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_path TEXT,
  description TEXT NOT NULL,
  year TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Blog Posts Table
```sql
CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_path TEXT,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time TEXT NOT NULL,
  tags TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🖼️ Image Storage

- Images are stored in `backend/uploads/`
- File paths are stored in the database
- Images are served via `/uploads/` endpoint
- Automatic cleanup when items are deleted

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend Development
```bash
npm run dev  # Starts Vite dev server
```

### Database Reset
```bash
# Delete the database file to reset
rm backend/database.db
# Restart the backend server
```

## 📦 Production Deployment

### Option 1: Traditional Hosting
1. Build the frontend: `npm run build`
2. Upload the `dist/` folder to your web server
3. Upload the entire `backend/` folder to your server
4. Install backend dependencies on server
5. Start the backend: `npm start`

### Option 2: Vercel/Netlify (Frontend) + Railway/Render (Backend)
1. Deploy frontend to Vercel/Netlify
2. Deploy backend to Railway/Render
3. Update API_BASE_URL in `src/services/api.ts`

## 🔒 Security Features

- Admin authentication with session storage
- File upload validation (images only)
- SQL injection protection with parameterized queries
- CORS enabled for development

## 📝 Environment Variables

Create a `.env` file in the backend folder:

```env
PORT=3001
NODE_ENV=development
```

## 🐛 Troubleshooting

### Backend Won't Start
- Check if port 3001 is available
- Ensure all dependencies are installed
- Check Node.js version (requires 16+)

### Frontend Can't Connect to Backend
- Ensure backend is running on port 3001
- Check CORS settings
- Verify API_BASE_URL in `src/services/api.ts`

### Images Not Loading
- Check if `backend/uploads/` directory exists
- Verify file permissions
- Check image paths in database

### Database Issues
- Delete `backend/database.db` to reset
- Check SQLite installation
- Verify database file permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.

