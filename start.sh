#!/bin/bash

echo "========================================"
echo "AA DESIGNERS WEBSITE STARTUP SCRIPT"
echo "========================================"

# Function to detect the best API URL
detect_api_url() {
    # Try to get public IP from EC2 metadata
    EC2_IP=$(curl -s --max-time 2 http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null)
    
    if [ ! -z "$EC2_IP" ]; then
        echo "Detected EC2 public IP: $EC2_IP"
        echo "http://$EC2_IP:3001"
        return
    fi
    
    # Try to get local IP
    LOCAL_IP=$(hostname -I | awk '{print $1}' | head -1)
    if [ ! -z "$LOCAL_IP" ]; then
        echo "Using local IP: $LOCAL_IP"
        echo "http://$LOCAL_IP:3001"
        return
    fi
    
    # Fallback to default API URL
    echo "Using default API URL"
    echo "http://98.130.50.198:3001"
}

# Function to get domain from environment or detect
get_domain() {
    if [ ! -z "$DOMAIN" ]; then
        echo "Using provided domain: $DOMAIN"
        echo "http://$DOMAIN:3001"
        return
    fi
    
    # Try to detect automatically
    detect_api_url
}

# Set API URL
API_URL=$(get_domain)
export API_BASE_URL=$API_URL

echo "Using API URL: $API_BASE_URL"
echo ""

# Stop existing containers
echo "Stopping existing containers..."
docker compose down

# Start containers with detected configuration
echo "Starting containers with API URL: $API_BASE_URL"
docker compose up --build -d

echo ""
echo "Waiting for services to start..."
sleep 15

# Test the setup
echo "Testing API endpoints..."
echo "Backend health check:"
curl -s --max-time 5 "$API_BASE_URL/api/health" || echo "Health check failed"

echo ""
echo "Projects endpoint:"
curl -s --max-time 5 "$API_BASE_URL/api/projects" | head -c 200 || echo "Projects API failed"

echo ""
echo "========================================"
echo "SETUP COMPLETE!"
echo "========================================"
echo ""
echo "Your website should be available at:"
echo "- Local: http://$(hostname -I | awk '{print $1}' | head -1)"
echo "- Network: http://$(hostname -I | awk '{print $1}' | head -1)"
echo "- EC2: http://$(curl -s --max-time 2 http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'Not available')"
echo ""
echo "Backend API: $API_BASE_URL"
echo ""
echo "To check logs:"
echo "docker compose logs -f"
echo ""
echo "To restart with different domain/IP:"
echo "DOMAIN=yourdomain.com ./start.sh" 