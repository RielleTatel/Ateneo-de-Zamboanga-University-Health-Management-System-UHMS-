# Admin Approval Workflow Fix Guide

## 🐛 Issues Identified

### Issue 1: Premature Redirect After Registration
**Problem:** Users are redirected to dashboard immediately after registration, even though admin hasn't approved their account yet.

**Error:** `AuthApiError: Email not confirmed`

**Root Cause:** Supabase has **Email Confirmation** enabled in the project settings, which conflicts with the custom admin approval workflow.

### Issue 2: Persistent Login After Browser Restart
**Problem:** Users remain logged in after closing and reopening the browser.

**Root Cause:** `persistSession: true` in AuthContext causes sessions to be stored in localStorage.

## ✅ Solutions Implemented

### 1. Disable Session Persistence (Issue 2 - FIXED ✓)

**File:** `client/src/context/AuthContext.jsx`

**Changed:**
```javascript
// Before:
persistSession: true

// After:
persistSession: false  // Don't persist sessions - require login after browser restart
```

**Result:** Users must log in again after closing the browser.

### 2. Improve Backend Registration (Issue 1 - PARTIAL FIX ✓)

**File:** `backend/src/controllers/authController.js`

**Changed:** Added `emailRedirectTo: null` to prevent auto-confirmation redirects.

**Result:** Prevents automatic email confirmation redirects, but Supabase settings still need adjustment.

### 3. Better Error Messages (ALREADY IMPLEMENTED ✓)

**File:** `client/src/pages/Login.jsx`

**Status:** Already has proper error handling that shows:
- "Your account is pending admin approval" for unconfirmed emails
- "Invalid email or password" for wrong credentials
- "No account found with this email" for non-existent accounts

## 🚀 Critical: Supabase Configuration Fix

### The Main Issue

Your Supabase project has **"Confirm email" enabled**, which means:
1. When users register, Supabase automatically sends a confirmation email
2. Users must click the confirmation link before they can log in
3. This conflicts with your admin approval workflow

### Solution: Disable Email Confirmation

You have **TWO options**:

#### Option A: Disable Email Confirmation (RECOMMENDED)

This allows your custom admin approval workflow to work properly.

**Steps:**

1. Go to your **Supabase Dashboard**
2. Select your project
3. Navigate to **Authentication** → **Settings** → **Auth Providers**
4. Scroll to **Email**
5. **UNCHECK** the box that says "**Confirm email**"
6. Click **Save**

![Supabase Email Settings](https://supabase.com/docs/img/auth-confirm-email.png)

**Result:** 
- ✅ Users can register but won't receive confirmation emails
- ✅ They cannot log in until admin approves (status = true)
- ✅ Your custom approval workflow works as intended

#### Option B: Keep Email Confirmation + Add Admin Approval

If you want BOTH email confirmation AND admin approval:

1. Keep "Confirm email" enabled
2. Update your workflow to require:
   - User confirms email (Supabase handles this)
   - Admin approves account (your custom logic)
   - User can only access after BOTH are complete

**Changes needed:**
- Check both `email_confirmed` AND `status` before allowing login
- Update UI messages to reflect both requirements

## 📋 Testing After Fix

### Test 1: Registration Flow

1. **Register a new account**
   ```
   Email: test@adzu.edu.ph
   Password: testpass123
   Name: Test User
   Role: Nurse
   ```

2. **Expected behavior:**
   - ✅ See "Registration successful! Awaiting admin approval"
   - ✅ Redirected to login page after 3 seconds
   - ✅ NOT automatically logged in
   - ✅ NO confirmation email sent (if Option A chosen)

3. **Try to login immediately:**
   - ❌ Should show: "Your account is pending admin approval"
   - ❌ Login should fail

4. **Admin approves the account:**
   - Go to Admin panel → Pending Registrations
   - Click "Approve" for the test user

5. **Try to login again:**
   - ✅ Should succeed
   - ✅ Redirected to appropriate dashboard

### Test 2: Browser Restart Persistence

1. **Login successfully**
   - Login with an approved account
   - Verify you're redirected to dashboard

2. **Close the browser completely**
   - Not just the tab, but the entire browser application
   - Wait a few seconds

3. **Reopen the browser and go to the app:**
   - ✅ Should show LOGIN PAGE
   - ❌ Should NOT be automatically logged in
   - ✅ Must enter credentials again

### Test 3: Error Messages

Test that proper error messages appear:

| Scenario | Expected Message |
|----------|------------------|
| Unconfirmed email | "Your account is pending admin approval" |
| Wrong password | "Invalid email or password" |
| Non-existent email | "No account found with this email" |
| Account not approved | "Your account is pending admin approval" |

## 🔍 Debugging

### If Issue 1 Persists (Still auto-redirecting after registration)

**Check:**
1. Supabase "Confirm email" setting - Must be **DISABLED**
2. Browser cache - Clear it and try again
3. Backend logs - Look for session creation errors

**Console commands to check:**
```javascript
// In browser console after registration
localStorage.getItem('supabase.auth.token')  // Should be null
```

### If Issue 2 Persists (Still logged in after browser restart)

**Check:**
1. `persistSession: false` in AuthContext.jsx
2. Clear browser's localStorage:
   ```javascript
   // In browser console
   localStorage.clear()
   sessionStorage.clear()
   ```
3. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### Common Problems

#### Problem: "Email rate limit exceeded"
**Solution:** Wait 60 seconds between registration attempts for the same email.

#### Problem: Users in Supabase Auth but not in users table
**Solution:** Run the orphaned users cleanup script:
```bash
cd backend
node src/scripts/cleanupOrphanedAuthUsers.js
```

#### Problem: Admin panel doesn't show pending users
**Solution:** Check that:
- User was successfully created in the `users` table
- User's `status` field is `false`
- Admin is logged in and has admin role

## 📊 System Flow (After Fix)

### Registration Flow
```
User fills form
    ↓
Frontend validates
    ↓
Backend creates auth user (email NOT confirmed)
    ↓
Backend inserts into users table (status = false)
    ↓
Any auto-created session is cleared
    ↓
User sees: "Registration successful! Awaiting approval"
    ↓
User redirected to login page
    ↓
User CANNOT log in yet (account pending)
```

### Login Flow
```
User enters credentials
    ↓
Supabase validates email + password
    ↓
[IF email confirmation enabled]
    Check: Email confirmed? 
    → NO: Show "Email not confirmed" error
    → YES: Continue
    ↓
Backend checks user status
    ↓
[IF status = false]
    Show: "Account pending admin approval"
    Sign out user
    ↓
[IF status = true]
    Allow login
    Set session (NOT persisted)
    Redirect to dashboard
```

### Browser Restart
```
User closes browser
    ↓
Session is NOT saved to localStorage
    ↓
User reopens browser
    ↓
No session found
    ↓
User sees login page
    ↓
Must login again
```

## 🎯 Expected Behavior Summary

### ✅ What SHOULD Happen

1. **After Registration:**
   - Success message shown
   - Redirected to login page
   - **NO automatic login**
   - User cannot access dashboard

2. **After Login (Unapproved):**
   - Error message: "Account pending admin approval"
   - User cannot access system

3. **After Admin Approval:**
   - User can log in successfully
   - User can access appropriate dashboard

4. **After Browser Restart:**
   - User must log in again
   - No automatic authentication

### ❌ What SHOULD NOT Happen

1. ❌ Auto-redirect to dashboard after registration
2. ❌ Login success for unapproved accounts
3. ❌ Automatic login after browser restart
4. ❌ Generic error messages

## 🔧 Additional Improvements (Optional)

### 1. Add Email Notifications

Notify users when their account is approved:

```javascript
// In backend after admin approves user
await sendEmail({
  to: user.email,
  subject: "Account Approved",
  body: "Your ADZU HMS account has been approved. You can now log in."
});
```

### 2. Add Admin Notification

Notify admins when new registrations need approval:

```javascript
// In backend after registration
await sendEmail({
  to: "admin@adzu.edu.ph",
  subject: "New Registration Pending",
  body: `${full_name} (${email}) has registered as ${role}`
});
```

### 3. Add Session Timeout

Automatically log out users after inactivity:

```javascript
// In AuthContext.jsx
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

useEffect(() => {
  let timeout;
  const resetTimeout = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      logout();
    }, SESSION_TIMEOUT);
  };
  
  // Reset on user activity
  window.addEventListener('click', resetTimeout);
  window.addEventListener('keypress', resetTimeout);
  
  return () => {
    window.removeEventListener('click', resetTimeout);
    window.removeEventListener('keypress', resetTimeout);
    clearTimeout(timeout);
  };
}, []);
```

### 4. Remember Me Feature

If you want to optionally persist sessions:

```javascript
// Add checkbox in login form
const [rememberMe, setRememberMe] = useState(false);

// Update AuthContext to accept this parameter
const login = async (email, password, persist = false) => {
  // Temporarily change persist setting
  await supabase.auth.signInWithPassword({
    email,
    password,
    options: { persistSession: persist }
  });
};
```

## 📞 Support

If issues persist after following this guide:

1. Check Supabase dashboard for auth user status
2. Check database for user records (status field)
3. Review backend logs for errors
4. Clear browser cache and storage completely
5. Try in incognito/private browsing mode

---

**Status:** ✅ Fixes Applied  
**Testing Required:** Yes - Follow testing steps above  
**Critical Action:** Disable "Confirm email" in Supabase Dashboard

**Last Updated:** November 26, 2025

