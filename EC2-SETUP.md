# EC2 Deployment Setup Guide

## Quick Fix for Connection Issues

### Step 1: Get Your EC2 Public IP
```bash
# Get your EC2 public IP
curl http://169.254.169.254/latest/meta-data/public-ipv4
```

### Step 2: Update docker-compose.yml
Replace `YOUR_EC2_IP` with your actual EC2 public IP in the frontend environment:

```yaml
frontend:
  environment:
    - VITE_API_BASE_URL=http://YOUR_EC2_IP:3001
```

### Step 3: Rebuild and Start
```bash
# Stop containers
docker compose down

# Rebuild with new config
docker compose up --build -d
```

## Alternative: Use the Setup Script
```bash
# Make script executable
chmod +x setup-ec2.sh

# Run the setup script
./setup-ec2.sh
```

## Manual Configuration

If you prefer to do it manually:

1. **Edit docker-compose.yml** and change:
   ```yaml
   environment:
     - VITE_API_BASE_URL=http://YOUR_EC2_IP:3001
   ```

2. **Rebuild containers:**
   ```bash
   docker compose down
   docker compose up --build -d
   ```

## Security Group Requirements

Make sure your EC2 security group allows:
- Port 80 (HTTP)
- Port 3001 (Backend API)
- Port 22 (SSH)

## Testing

After setup, test:
- Website: `http://YOUR_EC2_IP`
- API Health: `http://YOUR_EC2_IP:3001/api/health`
- Projects API: `http://YOUR_EC2_IP:3001/api/projects`

## Troubleshooting

### Check if containers are running:
```bash
docker compose ps
```

### Check logs:
```bash
docker compose logs frontend
docker compose logs backend
```

### Test API directly:
```bash
curl http://YOUR_EC2_IP:3001/api/projects
```

## Common Issues

1. **Connection Refused**: Make sure ports are open in security group
2. **CORS Errors**: Backend CORS is configured to allow all origins
3. **Container Not Starting**: Check logs for errors
4. **IP Not Resolving**: Use public IP, not private IP 