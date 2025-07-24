#!/bin/bash

echo "========================================"
echo "EC2 DOCKER SETUP SCRIPT"
echo "========================================"

# Get EC2 public IP
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

if [ -z "$EC2_IP" ]; then
    echo "Could not get EC2 IP automatically. Please enter your EC2 public IP:"
    read EC2_IP
fi

echo "Using EC2 IP: $EC2_IP"

# Create EC2-specific docker-compose file
cat > docker-compose.ec2.yml << EOF
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: aadesigners-backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - API_BASE_URL=http://$EC2_IP:3001
      - ADMIN_PASSWORD=admin123
      - JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
      - SESSION_SECRET=your-super-secret-session-key-change-this-in-production
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/database.db:/app/database.db
    networks:
      - aadesigners-network
    restart: unless-stopped

  frontend:
    build: .
    container_name: aadesigners-frontend
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://$EC2_IP:3001
    depends_on:
      - backend
    networks:
      - aadesigners-network
    restart: unless-stopped

networks:
  aadesigners-network:
    driver: bridge

volumes:
  uploads:
    driver: local
EOF

echo "Created docker-compose.ec2.yml with IP: $EC2_IP"

# Stop existing containers
echo "Stopping existing containers..."
docker compose down

# Build and start with EC2 config
echo "Building and starting containers with EC2 configuration..."
docker compose -f docker-compose.ec2.yml up --build -d

echo "Waiting for services to start..."
sleep 15

# Test the setup
echo "Testing API endpoints..."
echo "Backend health check:"
curl -s http://$EC2_IP:3001/api/health

echo ""
echo "Projects endpoint:"
curl -s http://$EC2_IP:3001/api/projects

echo ""
echo "========================================"
echo "SETUP COMPLETE!"
echo "========================================"
echo "Your website should be available at:"
echo "http://$EC2_IP"
echo ""
echo "Backend API:"
echo "http://$EC2_IP:3001/api/health"
echo ""
echo "To check logs:"
echo "docker compose -f docker-compose.ec2.yml logs -f" 