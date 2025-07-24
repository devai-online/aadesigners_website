# Docker Deployment Guide

## Quick Start

1. **Build and run the entire application:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:3001

## Individual Services

### Backend Only
```bash
cd backend
docker build -t aadesigners-backend .
docker run -p 3001:3001 -v $(pwd)/uploads:/app/uploads aadesigners-backend
```

### Frontend Only
```bash
docker build -t aadesigners-frontend .
docker run -p 80:80 aadesigners-frontend
```

## Environment Variables

### Backend (.env)
```
ADMIN_PASSWORD=aadesigner2025
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret
API_BASE_URL=http://localhost:3001
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3001
```

## Production Deployment

1. **Update environment variables** in docker-compose.yml
2. **Set production URLs** for your domain
3. **Run with production settings:**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build -d

# Access backend container
docker exec -it aadesigners-backend sh

# Access frontend container
docker exec -it aadesigners-frontend sh
```

## Volumes

- **uploads**: Project images are persisted in `./backend/uploads`
- **database**: SQLite database is persisted in `./backend/database.db`

## Network

Services communicate via the `aadesigners-network` bridge network. 