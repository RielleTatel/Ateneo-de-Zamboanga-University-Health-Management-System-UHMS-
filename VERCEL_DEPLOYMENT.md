# Vercel Deployment Guide

## 🚀 Deploying Frontend + Backend to Vercel

This guide explains how to deploy both the React frontend and Express backend to Vercel as serverless functions.

---

## 📋 Prerequisites

1. Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed: `npm i -g vercel`
3. Git repository connected to Vercel

---

## 🏗️ Project Structure

```
.
├── api/
│   ├── index.js          # Serverless function wrapper
│   └── package.json      # API dependencies
├── backend/
│   └── src/              # Backend source code
├── client/
│   └── dist/             # Built frontend (generated)
├── vercel.json           # Vercel configuration
└── package.json          # Root package.json
```

---

## ⚙️ Configuration Files

### **vercel.json**
- Builds frontend from `client/` directory
- Routes `/api/*` requests to serverless function
- Routes all other requests to frontend

### **api/index.js**
- Wraps Express app as serverless function
- Handles all API routes
- Configured with CORS for frontend access

---

## 🔧 Setup Steps

### **1. Install Dependencies Locally (Optional)**

```bash
# Install all dependencies
npm run install:all

# Or manually:
cd backend && npm install
cd ../client && npm install
cd ../api && npm install
```

### **2. Configure Environment Variables in Vercel**

Go to your Vercel project → Settings → Environment Variables

Add these variables:

#### **For Backend/API:**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret
NODE_ENV=production
```

#### **For Frontend:**
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### **Optional:**
```
FRONTEND_URL=https://your-vercel-app.vercel.app
NEXT_PUBLIC_FRONTEND_URL=https://your-vercel-app.vercel.app
```

### **3. Deploy to Vercel**

#### **Option A: Via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `./` (root)
   - **Build Command:** `cd client && npm install && npm run build`
   - **Output Directory:** `client/dist`
5. Add environment variables
6. Click "Deploy"

#### **Option B: Via CLI**
```bash
# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod
```

---

## 🔍 How It Works

### **Request Flow:**

```
User Request: https://yourapp.vercel.app/api/auth/login
   ↓
Vercel Router
   ↓
Matches: /api/(.*)
   ↓
Routes to: /api/index.js (serverless function)
   ↓
Express app handles request
   ↓
Returns response
```

```
User Request: https://yourapp.vercel.app/dashboard
   ↓
Vercel Router
   ↓
Matches: /(.*)
   ↓
Routes to: /index.html (frontend)
   ↓
React Router handles routing
```

---

## 📝 Build Process

When Vercel builds your project:

1. **Install Dependencies:**
   ```bash
   npm install --prefix backend
   npm install --prefix client
   npm install --prefix api
   ```

2. **Build Frontend:**
   ```bash
   cd client && npm run build
   ```
   Creates `client/dist/` with static files

3. **Package API Function:**
   - Vercel packages `api/index.js` as serverless function
   - Includes dependencies from `api/package.json`
   - Makes backend code available via imports

---

## 🔐 Environment Variables

### **Backend Variables (API Function):**
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Service role key (for backend)
- `JWT_SECRET` - Secret for JWT signing
- `NODE_ENV` - Set to "production"

### **Frontend Variables (Build Time):**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Anon/public key (for frontend)

**Note:** Variables starting with `VITE_` are embedded in the frontend build at build time.

---

## 🌐 CORS Configuration

The API function is configured to allow requests from:
- `http://localhost:5173` (local development)
- `https://your-vercel-app.vercel.app` (production)
- Any URL set in `FRONTEND_URL` or `NEXT_PUBLIC_FRONTEND_URL`

To add more allowed origins, update `api/index.js`:

```javascript
const getAllowedOrigins = () => {
  return [
    'http://localhost:5173',
    'https://your-app.vercel.app',
    // Add more origins here
  ];
};
```

---

## 🐛 Troubleshooting

### **"Module not found" errors**
- Ensure `api/package.json` includes all backend dependencies
- Check that import paths in `api/index.js` are correct
- Verify backend code is accessible from `api/` directory

### **CORS errors**
- Check that frontend URL is in allowed origins
- Verify `FRONTEND_URL` environment variable is set
- Check browser console for specific CORS error

### **Environment variables not working**
- Frontend variables must start with `VITE_`
- Backend variables are available in API function
- Rebuild after adding new environment variables

### **API routes returning 404**
- Verify `vercel.json` rewrites are correct
- Check that `api/index.js` exports Express app correctly
- Ensure routes are registered in Express app

### **Build fails**
- Check that all dependencies are in package.json files
- Verify Node.js version (should be >= 18)
- Check build logs in Vercel dashboard

---

## 📊 Monitoring

### **View Logs:**
```bash
vercel logs
```

Or in Vercel Dashboard → Your Project → Functions → View Logs

### **Check Function Performance:**
- Vercel Dashboard → Analytics
- Monitor API response times
- Check error rates

---

## 🔄 Updating Deployment

### **Automatic (Recommended):**
- Push to Git repository
- Vercel automatically deploys on push to main branch

### **Manual:**
```bash
vercel --prod
```

---

## ⚡ Performance Tips

1. **API Function Timeout:**
   - Default: 10 seconds
   - Max: 60 seconds (Pro plan)
   - Configured in `vercel.json` as 30 seconds

2. **Cold Starts:**
   - First request may be slower (cold start)
   - Subsequent requests are faster
   - Keep functions warm with health checks

3. **Frontend Optimization:**
   - Vite build optimizes automatically
   - Static assets served via CDN
   - Code splitting for faster loads

---

## ✅ Deployment Checklist

- [ ] Environment variables configured in Vercel
- [ ] `vercel.json` configured correctly
- [ ] `api/index.js` properly exports Express app
- [ ] `api/package.json` has all dependencies
- [ ] Frontend builds successfully
- [ ] CORS configured for production URL
- [ ] Test API endpoints after deployment
- [ ] Test frontend routing
- [ ] Verify authentication flow

---

## 🎯 Next Steps

After deployment:

1. **Update Frontend API URL:**
   - Update `axiosInstance.js` to use Vercel URL in production
   - Or use environment variable

2. **Test Authentication:**
   - Try logging in
   - Verify session persistence
   - Test protected routes

3. **Monitor:**
   - Check Vercel logs
   - Monitor API performance
   - Set up error tracking

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review function logs in dashboard
3. Verify environment variables
4. Test API endpoints directly
5. Check browser console for errors

---

**Your app should now be live on Vercel!** 🎉

