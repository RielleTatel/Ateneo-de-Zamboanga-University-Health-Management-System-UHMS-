# Vercel Environment Variables Setup

## 🚨 Critical: These Must Be Set in Vercel Dashboard

Your 500 errors are likely caused by missing environment variables. Follow these steps:

---

## Step 1: Access Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **ateneo-de-zamboanga-university-heal**
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

---

## Step 2: Add Required Environment Variables

Add these **EXACT** environment variables:

### Backend/API Variables (REQUIRED):

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `SUPABASE_URL` | Your Supabase project URL (e.g., `https://xxxxx.supabase.co`) | Production, Preview, Development |
| `SUPABASE_KEY` | Your Supabase **SERVICE ROLE** key (NOT anon key) | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

### Frontend Variables (REQUIRED):

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase **ANON** key (public key) | Production, Preview, Development |

---

## Step 3: Where to Find These Keys

### Get Supabase Keys:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **Settings** (gear icon) → **API**
4. Copy:
   - **Project URL** → Use for `SUPABASE_URL` and `VITE_SUPABASE_URL`
   - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → Use for `SUPABASE_KEY` (⚠️ Keep secret!)

---

## Step 4: Configure in Vercel

For each variable:

1. Click **Add New** in Vercel Environment Variables section
2. Enter the **Name** (e.g., `SUPABASE_URL`)
3. Enter the **Value** (paste your key)
4. Select **All Environments** (Production, Preview, Development)
5. Click **Save**

Repeat for all 5 variables above.

---

## Step 5: Redeploy Your Application

After adding all environment variables:

### Option A: Trigger Redeploy from Dashboard
1. Go to **Deployments** tab
2. Click the three dots (...) on your latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (faster)
5. Click **Redeploy**

### Option B: Push a Commit
```bash
git add .
git commit -m "Update environment variable configuration"
git push origin main
```

---

## Step 6: Verify the Fix

After redeployment completes:

### 1. Check Health Endpoint
Visit: `https://your-app.vercel.app/api/health`

Should return:
```json
{
  "status": "ok",
  "environment": {
    "SUPABASE_URL": true,
    "SUPABASE_KEY": true,
    "NODE_ENV": "production"
  },
  "message": "All systems operational"
}
```

### 2. Try Logging In
Go to your app and attempt to log in. The errors should be gone.

### 3. Check Function Logs (if still issues)
1. Vercel Dashboard → **Deployments** tab
2. Click on your latest deployment
3. Click **Functions** tab
4. Click **View Logs** on `api/index.js`
5. Look for error messages

---

## 🔍 Troubleshooting

### Still Getting 500 Errors?

**Check Function Logs:**
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login
vercel login

# View real-time logs
vercel logs
```

### Common Issues:

1. **Wrong Key Type:**
   - Backend needs `service_role` key (full access)
   - Frontend needs `anon` key (public access)

2. **Typo in Variable Names:**
   - Must match EXACTLY: `SUPABASE_URL` not `SUPABASE_URI`
   - Must match EXACTLY: `VITE_SUPABASE_URL` not `REACT_APP_SUPABASE_URL`

3. **Didn't Redeploy:**
   - Environment variables are only applied during build/deployment
   - Must redeploy after adding variables

4. **Wrong Environment Selected:**
   - Make sure to select **All Environments** when adding variables
   - Or at least select **Production**

---

## 📋 Checklist

Before moving forward, verify:

- [ ] All 5 environment variables are added in Vercel
- [ ] Variables are enabled for **Production** environment
- [ ] You've redeployed the application
- [ ] Health endpoint returns `status: "ok"`
- [ ] No console errors when accessing the site
- [ ] Can successfully log in

---

## 🆘 Still Having Issues?

If you're still getting errors after following all steps:

1. **Check the exact error in Vercel logs:**
   - Go to Vercel Dashboard → Deployments → Functions → View Logs
   - Look for the actual error message from the `/api/auth/me` endpoint

2. **Verify Supabase is working:**
   - Try accessing your Supabase project directly
   - Check if your user exists in the auth.users table
   - Verify the user also exists in your custom users table

3. **Check if it's a database issue:**
   - The error might be in `UserModel.findById()`
   - Verify your database schema matches the code

---

**After setting up the environment variables and redeploying, everything should work! 🎉**

