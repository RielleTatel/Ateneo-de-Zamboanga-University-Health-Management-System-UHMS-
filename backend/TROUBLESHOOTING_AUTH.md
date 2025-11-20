# Authentication Troubleshooting Guide

## Common Issue: 500 Error on `/api/auth/me`

### Symptoms
- User can sign in successfully
- Auth state changes to `SIGNED_IN`
- `/api/auth/me` endpoint returns 500 Internal Server Error
- Console shows "Failed to fetch user profile"

### Root Cause
This typically happens when:
1. User exists in Supabase Auth but not in the `users` database table
2. User registration didn't complete properly (Auth user created but database insertion failed)
3. Database connection issues or missing email field

---

## Solution 1: Sync Existing Auth Users to Database

If you have users in Supabase Auth that aren't in the database, run the sync script:

```bash
cd backend
node src/scripts/syncAuthUsers.js
```

This script will:
- List all users in Supabase Auth
- List all users in the database
- Identify users missing from the database
- Sync them to the database (with `status: false` - requires admin approval)

---

## Solution 2: Check Specific User Status

Use the debugging endpoint to check if a user exists in both Auth and database:

```bash
# Replace {userId} with the actual user ID from Supabase Auth
curl http://localhost:3001/api/debugging/check-user/{userId}
```

Or in production:
```bash
curl https://your-domain.vercel.app/api/debugging/check-user/{userId}
```

The response will show:
- Whether user exists in Auth
- Whether user exists in database
- User details from both sources
- Any sync issues

---

## Solution 3: Create Verified User Manually

To create a new verified user (for admin/staff):

```bash
cd backend
node src/scripts/createVerifiedUser.js
```

This creates a user with:
- Entry in Supabase Auth
- Entry in database
- `status: true` (already verified)

---

## Solution 4: Test Database Connection

Check if the backend can connect to Supabase:

```bash
curl http://localhost:3001/api/debugging/test-supabase
```

Or in production:
```bash
curl https://your-domain.vercel.app/api/debugging/test-supabase
```

---

## Recent Fixes Applied

### 1. Added Email Field to User Creation
**Problem:** `insertUser()` was not saving the email to the database  
**Fix:** Updated `UserModel.insertUser()` to include email field

### 2. Improved Error Handling
**Problem:** Generic 500 errors without details  
**Fix:** Added detailed logging in `getMe()` endpoint to show:
- User ID being looked up
- Database query results
- Error stack traces in development mode

### 3. Better Database Error Handling
**Problem:** `findById()` returning null for all errors  
**Fix:** Now distinguishes between "not found" and other database errors

### 4. Added Missing Method
**Problem:** `getAllUsers()` was called but didn't exist  
**Fix:** Added `getAllUsers()` method to UserModel

---

## Prevention

### For New Registrations
The registration flow now properly includes email:

```javascript
// In authController.js
const { data: userData, error: dbError } = await UserModel.insertUser(
  authData.user.id,
  email,        // ✅ Now included
  full_name,
  role
);
```

### Database Schema
Ensure your `users` table has these columns:
- `uuid` (text, primary key) - matches Supabase Auth user ID
- `email` (text, unique)
- `full_name` (text)
- `role` (text) - e.g., 'admin', 'doctor', 'nurse', 'staff', 'student'
- `status` (boolean) - true for verified, false for pending approval
- `created_at` (timestamp)
- `updated_at` (timestamp)

---

## Getting User ID

If you need to find a user's ID:

1. **From browser console after login:**
```javascript
// In your app after sign in
console.log(session.user.id);
```

2. **From Supabase dashboard:**
- Go to Authentication > Users
- Click on the user
- Copy the User ID

3. **From backend logs:**
- Look for `[getMe] Fetching user data for: <user-id>`
- Look for `[login] Authentication successful for user: <user-id>`

---

## Still Having Issues?

1. Check backend logs for detailed error messages
2. Verify Supabase credentials in `.env`:
   - `SUPABASE_URL`
   - `SUPABASE_KEY` (service role key for scripts)
3. Check Supabase RLS (Row Level Security) policies
4. Ensure database table exists and is accessible
5. Try the sync script: `node src/scripts/syncAuthUsers.js`

