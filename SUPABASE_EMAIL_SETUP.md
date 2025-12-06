# Supabase Email Configuration Guide

## Issue: Admin Password Reset Emails Not Sending

If you're not receiving password reset emails when using the admin password reset feature, follow these steps to configure Supabase email properly.

---

## Option 1: Enable Supabase Email Service (Recommended for Production)

### Step 1: Configure SMTP Settings in Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Settings** → **Authentication** → **SMTP Settings**
4. Enable custom SMTP and configure with your email provider:

**For Gmail:**
- SMTP Host: `smtp.gmail.com`
- SMTP Port: `587` or `465`
- SMTP Username: Your Gmail address
- SMTP Password: App-specific password (not your regular Gmail password)
- Sender Email: Your Gmail address
- Sender Name: `AdZU Health System`

**For Other Providers:**
- Use your email provider's SMTP settings
- Popular options: SendGrid, Mailgun, AWS SES, Postmark

### Step 2: Generate App Password (for Gmail)

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** → **App Passwords**
3. Create a new app password for "Mail"
4. Copy the 16-character password
5. Use this password in Supabase SMTP settings

### Step 3: Test Email Configuration

1. In Supabase Dashboard → **Authentication** → **SMTP Settings**
2. Click **Send Test Email** to verify configuration
3. Check if you receive the test email

---

## Option 2: Use Supabase Default Email (Development Only)

Supabase provides a default email service for development:

### Limitations:
- Emails may go to spam
- Rate limited (few emails per hour)
- Not reliable for production
- May not work in some regions

### How to Use:
1. In Supabase Dashboard → **Authentication** → **Email Templates**
2. Ensure "Enable email confirmations" is turned ON
3. Verify **"Confirm email"** is enabled
4. Check the **"Reset password"** template is configured

---

## Option 3: Alternative - Use Magic Link (Temporary Solution)

If email isn't working, you can temporarily use Supabase magic links:

### Implementation:
1. In `Login.jsx`, replace the password reset with:
```javascript
const { error } = await supabase.auth.signInWithOtp({
    email: resetEmail,
    options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/reset-password`
    }
});
```

2. This sends a one-time login link instead of a password reset link

---

## Option 4: Backend-Initiated Reset (Most Reliable)

Use the backend to send emails via a proper email service:

### Step 1: Install Email Package (Backend)
```bash
cd backend
npm install nodemailer
```

### Step 2: Create Email Service
Create `backend/src/services/emailService.js`:
```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await transporter.sendMail({
        from: '"AdZU Health System" <noreply@adzu.edu.ph>',
        to: email,
        subject: 'Password Reset Request',
        html: `
            <h2>Password Reset Request</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link will expire in 1 hour.</p>
        `
    });
};
```

### Step 3: Update Backend Environment Variables
Add to `backend/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

---

## Troubleshooting

### Check if Email is Working:
1. Open browser console (F12)
2. Trigger password reset
3. Look for logs:
   - `[Password Reset] Sending reset email to admin: ...`
   - `[Password Reset] Email sent successfully`
   - Or any error messages

### Common Issues:

**1. "Email not confirmed" error**
- Solution: Disable email confirmation in Supabase → Authentication → Settings
- Set "Enable email confirmations" to OFF

**2. Email goes to spam**
- Solution: Use a verified email domain or SMTP service
- Configure SPF, DKIM records for your domain

**3. "Rate limit exceeded"**
- Solution: Wait 1 hour or upgrade Supabase plan
- Use custom SMTP to avoid rate limits

**4. No error but no email**
- Check Supabase logs: Dashboard → Logs → Auth Logs
- Verify email templates are configured
- Test with a different email address

---

## Quick Fix for Testing

If you need to test immediately without email:

1. In Supabase Dashboard → Authentication → Settings
2. Disable "Enable email confirmations"
3. Create a temporary admin password reset via SQL:

```sql
-- Get admin user ID
SELECT id, email FROM auth.users WHERE email = 'admin@adzu.edu.ph';

-- Manually update password (replace USER_ID and NEW_HASHED_PASSWORD)
-- Note: Supabase will auto-hash if you use the dashboard UI
```

Or use Supabase Dashboard → Authentication → Users → Select user → Reset Password

---

## Recommended Solution

For production, use **Option 1 (Custom SMTP)** or **Option 4 (Backend Email Service)** for reliability.

For development/testing, **Option 2** works but may be unreliable.

---

## Need Help?

Check these resources:
- Supabase Email Docs: https://supabase.com/docs/guides/auth/auth-email
- Supabase SMTP: https://supabase.com/docs/guides/auth/auth-smtp
- Gmail App Passwords: https://support.google.com/accounts/answer/185833
