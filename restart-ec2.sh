#!/bin/bash

echo "========================================"
echo "RESTARTING WITH EC2 IP (98.130.50.198)"
echo "========================================"

# Stop containers
echo "Stopping containers..."
docker compose down

# Start containers (will use default EC2 IP)
echo "Starting containers with default EC2 IP..."
docker compose up -d

echo "Waiting for services to start..."
sleep 10

echo "Testing API..."
curl -s http://98.130.50.198:3001/api/health

echo ""
echo "========================================"
echo "DONE! Your website should now work at:"
echo "http://98.130.50.198"
echo "========================================" 