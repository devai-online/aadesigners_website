# Deployment Guide for AA Designer Studio Website

## 🚀 Frontend Deployment (Vercel)

### 1. Frontend Setup
The frontend is configured to deploy on Vercel with the following files:

- `vercel.json` - Vercel configuration for client-side routing
- `public/_redirects` - Alternative redirects file
- `vite.config.ts` - Vite configuration for production builds

### 2. Deploy to Vercel

1. **Connect your repository to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite project

2. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables** (if needed):
   - Add any environment variables in Vercel dashboard
   - For API calls, you'll need to update the backend URL

### 3. Client-Side Routing Fix

The `vercel.json` file ensures that all routes (like `/admin`, `/projects`, etc.) are handled by your React app:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This tells Vercel to serve `index.html` for all routes, allowing React Router to handle the routing.

## 🔧 Backend Deployment

### Option 1: Separate Backend Hosting (Recommended)

Since Vercel is primarily for frontend, deploy your backend separately:

1. **Railway** (Recommended):
   - Go to [railway.app](https://railway.app)
   - Connect your repository
   - Set the root directory to `backend`
   - Add environment variables if needed

2. **Render**:
   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Connect your repository
   - Set root directory to `backend`
   - Build command: `npm install`
   - Start command: `node server.js`

3. **Heroku**:
   - Create a new app
   - Connect your repository
   - Set buildpack to Node.js
   - Add a `Procfile` in the backend directory: `web: node server.js`

### Option 2: Update Frontend API URLs

After deploying the backend, update the API base URL in your frontend:

```typescript
// src/services/api.ts
const API_BASE_URL = 'https://your-backend-url.com/api';
```

## 📁 File Structure for Deployment

```
your-project/
├── frontend/ (deploy to Vercel)
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
└── backend/ (deploy separately)
    ├── server.js
    ├── routes/
    ├── uploads/
    └── package.json
```

## 🔍 Troubleshooting

### "Page Not Found" on Direct Routes

If you still get "Page Not Found" on routes like `/admin`:

1. **Check vercel.json**: Make sure it exists and has the correct rewrites
2. **Clear Vercel cache**: Redeploy with "Clear cache and deploy"
3. **Check build output**: Ensure `index.html` is in the `dist` folder

### API Calls Not Working

1. **Update API URL**: Change from `localhost:3001` to your backend URL
2. **CORS Issues**: Make sure your backend allows requests from your Vercel domain
3. **Environment Variables**: Set the correct backend URL in Vercel

### Build Errors

1. **Check dependencies**: Ensure all packages are in `package.json`
2. **Node version**: Vercel uses Node.js 18.x by default
3. **Build logs**: Check Vercel build logs for specific errors

## 🎯 Quick Deployment Checklist

- [ ] Frontend builds successfully locally (`npm run build`)
- [ ] `vercel.json` is in the root directory
- [ ] Backend is deployed and accessible
- [ ] API URLs are updated to production backend
- [ ] Environment variables are set in Vercel
- [ ] All routes work when accessed directly

## 📞 Support

If you encounter issues:
1. Check Vercel build logs
2. Verify your backend is running
3. Test API endpoints directly
4. Check browser console for errors 