@echo off
echo Stopping existing containers...
docker-compose down

echo Building and starting containers with new configuration...
docker-compose up --build -d

echo Waiting for services to start...
timeout /t 10 /nobreak

echo Checking container status...
docker-compose ps

echo.
echo Backend logs:
docker-compose logs backend

echo.
echo Frontend logs:
docker-compose logs frontend

echo.
echo Redis logs:
docker-compose logs redis 