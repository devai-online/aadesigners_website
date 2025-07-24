# AA Designers Website - Universal Deployment Guide

## 🚀 Quick Start (Auto-Detection)

The easiest way to deploy is using the auto-detection script:

```bash
# Make script executable
chmod +x start.sh

# Run with auto-detection
./start.sh
```

This will automatically:
- ✅ Detect EC2 public IP
- ✅ Detect local network IP
- ✅ Fallback to localhost
- ✅ Configure all services
- ✅ Test the setup

## 🌐 Manual Configuration

### Option 1: Environment Variable
```bash
# Set your domain/IP
export API_BASE_URL=http://yourdomain.com:3001

# Start services
docker compose up --build -d
```

### Option 2: Direct docker-compose
```bash
# Start with specific domain
API_BASE_URL=http://yourdomain.com:3001 docker compose up --build -d
```

### Option 3: Custom domain
```bash
# Use custom domain
DOMAIN=yourdomain.com ./start.sh
```

## 📋 Supported Deployment Scenarios

### 1. **Local Development**
```bash
./start.sh
# Uses: http://localhost:3001
```

### 2. **EC2 Instance**
```bash
./start.sh
# Auto-detects: http://98.130.50.198:3001
```

### 3. **Custom Domain**
```bash
DOMAIN=aadesigners.com ./start.sh
# Uses: http://aadesigners.com:3001
```

### 4. **Load Balancer/Proxy**
```bash
API_BASE_URL=https://api.aadesigners.com ./start.sh
# Uses: https://api.aadesigners.com
```

## 🔧 Configuration Examples

### For EC2:
```bash
API_BASE_URL=http://98.130.50.198:3001 ./start.sh
```

### For Custom Domain:
```bash
API_BASE_URL=http://aadesigners.com:3001 ./start.sh
```

### For HTTPS:
```bash
API_BASE_URL=https://api.aadesigners.com ./start.sh
```

### For Local Network:
```bash
API_BASE_URL=http://192.168.1.100:3001 ./start.sh
```

## 🛡️ Security Considerations

### For Production:
1. **Change default passwords:**
   ```bash
   ADMIN_PASSWORD=your-secure-password
   JWT_SECRET=your-very-long-random-secret
   SESSION_SECRET=your-very-long-random-secret
   ```

2. **Restrict CORS origins:**
   ```javascript
   // In backend/server.js, replace the CORS config with:
   origin: ['https://yourdomain.com', 'http://yourdomain.com']
   ```

3. **Use HTTPS in production**

## 📊 Monitoring

### Check Status:
```bash
docker compose ps
```

### View Logs:
```bash
docker compose logs -f
```

### Test API:
```bash
curl http://yourdomain.com:3001/api/health
curl http://yourdomain.com:3001/api/projects
```

## 🔄 Updating Configuration

To change the domain/IP after deployment:

1. **Stop services:**
   ```bash
   docker compose down
   ```

2. **Start with new config:**
   ```bash
   API_BASE_URL=http://newdomain.com:3001 ./start.sh
   ```

## 🆘 Troubleshooting

### Connection Issues:
- Check security group/firewall rules
- Verify ports 80 and 3001 are open
- Test API directly: `curl http://yourdomain.com:3001/api/health`

### CORS Errors:
- Backend is configured to allow all origins
- Check browser console for specific errors

### Container Issues:
- Check logs: `docker compose logs`
- Restart: `docker compose restart`

## 🌍 Multi-Environment Support

The setup now supports:
- ✅ Local development
- ✅ EC2 instances
- ✅ Custom domains
- ✅ Load balancers
- ✅ Reverse proxies
- ✅ HTTPS/SSL
- ✅ Auto-detection

Your website will work on any domain or IP address! 🎯 