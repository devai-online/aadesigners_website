@echo off
echo ========================================
echo VERIFYING DOCKER NETWORK CONFIGURATION
echo ========================================

echo.
echo 1. Stopping existing containers...
docker compose down

echo.
echo 2. Rebuilding containers with proper network config...
docker compose up --build -d

echo.
echo 3. Waiting for services to start...
timeout /t 15 /nobreak

echo.
echo 4. Checking container status...
docker compose ps

echo.
echo 5. Verifying network connectivity...
echo Testing backend from host:
curl -s http://localhost:3001/api/health

echo.
echo Testing backend from frontend container:
docker compose exec frontend curl -s http://backend:3001/api/health

echo.
echo 6. Testing API endpoints from frontend container:
echo.
echo Projects endpoint:
docker compose exec frontend curl -s http://backend:3001/api/projects

echo.
echo Testimonials endpoint:
docker compose exec frontend curl -s http://backend:3001/api/testimonials

echo.
echo 7. Checking network details:
docker network ls | findstr aadesigners
docker network inspect aadesigners_website_aadesigners-network

echo.
echo ========================================
echo NETWORK VERIFICATION COMPLETE
echo ========================================
echo.
echo If all tests passed, your website should now work at:
echo http://localhost
echo.
echo Backend API is available at:
echo http://localhost:3001/api/health 