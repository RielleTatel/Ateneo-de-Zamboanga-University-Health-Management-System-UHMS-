# 🚨 Fix Vercel 500 Error - Step by Step

## Problem
Your Vercel deployment is failing with:
```
500: INTERNAL_SERVER_ERROR
Code: FUNCTION_INVOCATION_FAILED
```

This means the serverless function is **crashing during startup** because environment variables are not configured.

---

## ✅ Solution: Configure Environment Variables in Vercel

### Step 1: Go to Supabase Dashboard

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Settings** (gear icon in sidebar)
4. Click **API** section

### Step 2: Copy Your Keys

You need to copy these values:

| Item | Where to find it | What to use it for |
|------|------------------|-------------------|
| **Project URL** | Top of API page | `SUPABASE_URL` and `VITE_SUPABASE_URL` |
| **anon public** key | "Project API keys" section, labeled `anon` `public` | `VITE_SUPABASE_ANON_KEY` |
| **service_role** key | "Project API keys" section, labeled `service_role` `secret` | `SUPABASE_KEY` |

**Example:**
```
Project URL: https://abcdefghijklmnop.supabase.co
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9...
```

### Step 3: Add Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project: **ateneo-de-zamboanga-university-heal**
3. Click **Settings** tab at the top
4. Click **Environment Variables** in the left sidebar
5. Add these 5 variables **ONE BY ONE**:

#### Variable 1: SUPABASE_URL (Backend)
- **Name:** `SUPABASE_URL`
- **Value:** Your Supabase Project URL (paste it)
- **Environment:** Select **All** (Production, Preview, Development)
- Click **Save**

#### Variable 2: SUPABASE_KEY (Backend - IMPORTANT!)
- **Name:** `SUPABASE_KEY`
- **Value:** Your Supabase **service_role** key (paste it)
- **Environment:** Select **All**
- Click **Save**

⚠️ **Make sure you use the `service_role` key here, NOT the `anon` key!**

#### Variable 3: VITE_SUPABASE_URL (Frontend)
- **Name:** `VITE_SUPABASE_URL`
- **Value:** Your Supabase Project URL (same as Variable 1)
- **Environment:** Select **All**
- Click **Save**

#### Variable 4: VITE_SUPABASE_ANON_KEY (Frontend)
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** Your Supabase **anon** key (paste it)
- **Environment:** Select **All**
- Click **Save**

#### Variable 5: NODE_ENV (Optional)
- **Name:** `NODE_ENV`
- **Value:** `production`
- **Environment:** Select **Production** only
- Click **Save**

### Step 4: Redeploy Your Application

**Important:** Environment variables are only applied during build/deployment. You MUST redeploy!

#### Option A: Redeploy via Dashboard (Recommended)
1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the three dots (**...**) on the right
4. Click **Redeploy**
5. Keep **Use existing Build Cache** checked
6. Click **Redeploy** button
7. Wait for deployment to complete (2-3 minutes)

#### Option B: Push a New Commit
```bash
# Make any small change (or use this script)
git add .
git commit -m "Configure environment variables"
git push origin main
```

### Step 5: Verify the Fix

After deployment completes:

#### Test 1: Check Diagnostic Endpoint
Open in your browser:
```
https://ateneo-de-zamboanga-university-heal.vercel.app/api/diagnostic
```

You should see:
```json
{
  "status": "READY",
  "message": "All required environment variables are configured",
  "checks": {
    "SUPABASE_URL": {
      "configured": true
    },
    "SUPABASE_KEY": {
      "configured": true
    },
    ...
  }
}
```

❌ **If you see `"configured": false` for any variable, go back to Step 3 and check that variable.**

#### Test 2: Check Health Endpoint
```
https://ateneo-de-zamboanga-university-heal.vercel.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "All systems operational"
}
```

#### Test 3: Try Logging In
1. Go to your app: `https://ateneo-de-zamboanga-university-heal.vercel.app`
2. Try logging in with your credentials
3. Should work without 500 errors!

---

## 🔍 Still Having Issues?

### Check Vercel Logs

1. Go to Vercel Dashboard → **Deployments**
2. Click your latest deployment
3. Click **Functions** tab
4. Click **View Logs** on `api/index.js`
5. Look for error messages

Or use CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# View logs
vercel logs --follow
```

### Common Issues

#### Issue: Variable names have typos
- ❌ `SUPABASE_URI` (wrong)
- ✅ `SUPABASE_URL` (correct)
- Names must match EXACTLY

#### Issue: Used wrong key
- Backend needs `service_role` key (has full access)
- Frontend needs `anon` key (public access)

#### Issue: Forgot to redeploy
- Environment variables only apply after redeployment
- Click **Redeploy** in Deployments tab

#### Issue: Selected wrong environment
- Make sure variables are enabled for **Production**
- Best to select **All Environments**

---

## 📝 Checklist

Before testing:
- [ ] Copied all 5 variables from Supabase
- [ ] Added all 5 variables in Vercel
- [ ] Used `service_role` key for `SUPABASE_KEY`
- [ ] Used `anon` key for `VITE_SUPABASE_ANON_KEY`
- [ ] Selected correct environments (All or Production)
- [ ] Redeployed the application
- [ ] Waited for deployment to complete
- [ ] Checked `/api/diagnostic` endpoint returns "READY"
- [ ] Checked `/api/health` endpoint returns "ok"

---

## ✅ Success!

Once all tests pass, your app should be fully functional on Vercel! 🎉

The 500 errors should be completely gone, and you should be able to:
- ✅ Log in successfully
- ✅ Access protected routes
- ✅ Fetch user profiles
- ✅ Use all app features

