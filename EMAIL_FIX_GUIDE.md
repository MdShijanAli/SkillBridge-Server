# Email Connection Fix for Render Deployment 📧

## Problem Summary

The error `Connection timeout (ETIMEDOUT)` occurred because **Render blocks outbound SMTP connections on port 587** to prevent spam. This is a common security measure on cloud platforms.

## ✅ Fixes Applied

### 1. **Changed SMTP Port Configuration**

- **Before:** Port 587 with `secure: false` (TLS/STARTTLS)
- **After:** Port 465 with `secure: true` (SSL/TLS)

### 2. **Added Connection Pooling & Timeout Settings**

```typescript
{
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1000,
  rateLimit: 5,
  connectionTimeout: 60000,  // 60 seconds
  greetingTimeout: 30000,     // 30 seconds
  socketTimeout: 60000,       // 60 seconds
}
```

### 3. **Added SMTP Connection Verification**

The server now verifies the email connection on startup and logs the status.

### 4. **Implemented Retry Logic**

Automatic retry with exponential backoff (3 attempts: 2s, 4s, 8s delays).

### 5. **Enhanced Error Logging**

Better error messages to help debug email issues quickly.

---

## 🔧 Steps to Deploy the Fix

### Step 1: Rebuild and Deploy

```bash
cd SkillBridge-Server

# Build the project
npm run build

# Deploy to Render (or push to git if using auto-deploy)
git add .
git commit -m "Fix: Update SMTP configuration for Render deployment"
git push origin main
```

### Step 2: Verify Environment Variables on Render

Go to your Render dashboard and ensure these variables are set:

- `APP_USER` = Your Gmail address (e.g., `your-email@gmail.com`)
- `APP_PASSWORD` = Your Gmail App Password (NOT your regular password)
- `APP_URL` = Your frontend URL (e.g., `https://skill-bridge-client-by-shijan.netlify.app`)
- `BETTER_AUTH_URL` = Your backend URL (e.g., `https://your-app.onrender.com`)
- `CLIENT_URL` = Your frontend URL

### Step 3: Generate Gmail App Password (If Not Done)

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (required)
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Create a new app password for "Mail"
5. Copy the 16-character password
6. Update `APP_PASSWORD` in Render with this password

---

## 🧪 Testing the Fix

### Check Server Logs on Render

After deployment, look for these messages:

**Success:**

```
✅ SMTP server is ready to send emails
Database connected successfully.
Server is running on http://localhost:5050
```

**Failure:**

```
❌ SMTP connection failed: [error details]
Please check your email configuration:
- APP_USER: ✓ Set / ✗ Not set
- APP_PASSWORD: ✓ Set / ✗ Not set
```

### Test Registration

1. Go to your deployed client
2. Try to register a new account
3. Check Render logs for:
   ```
   ✅ Email sent successfully (attempt 1/3): <message-id>
   ✅ Verification email sent: <message-id>
   ```

---

## 🔍 Alternative Solutions (If Port 465 Still Doesn't Work)

If Render blocks both ports 587 and 465, consider these alternatives:

### Option 1: Use a Transactional Email Service (Recommended)

Switch from Gmail SMTP to a dedicated email service:

#### **Resend** (Free tier: 100 emails/day)

```bash
npm install resend
```

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// In sendVerificationEmail:
await resend.emails.send({
  from: "SkillBridge <onboarding@yourdomain.com>",
  to: user.email,
  subject: "✨ Verify your email address",
  html: htmlTemplate,
});
```

#### **SendGrid** (Free tier: 100 emails/day)

```bash
npm install @sendgrid/mail
```

#### **Mailgun** (Free tier: 5,000 emails/month first 3 months)

### Option 2: Use Gmail OAuth2 (More Secure)

Instead of app passwords, use OAuth2 tokens:

```bash
npm install googleapis
```

---

## 📊 Monitoring & Debugging

### Enable Debug Mode

The server now includes debug logging. Check Render logs for:

- SMTP connection details
- Email sending attempts
- Retry information
- Detailed error messages

### Common Issues

**Issue 1: "Invalid login" error**

- ✅ Ensure you're using an **App Password**, not your Gmail password
- ✅ App Passwords require **2-Step Verification** to be enabled

**Issue 2: "Connection timeout" persists**

- ✅ Render may block all SMTP ports
- ✅ Switch to a transactional email service (see Option 1)

**Issue 3: "535 Authentication failed"**

- ✅ Check if APP_USER matches the email exactly
- ✅ Regenerate the App Password
- ✅ Ensure no spaces in the password

**Issue 4: Emails go to spam**

- ✅ Use a custom domain with proper SPF/DKIM records
- ✅ Switch to a transactional email service
- ✅ Avoid promotional language in subject lines

---

## 🚀 Next Steps

1. **Deploy the changes** to Render
2. **Monitor the logs** for SMTP connection success
3. **Test user registration** from your frontend
4. **Check spam folder** if emails don't arrive
5. **Consider switching** to Resend/SendGrid if issues persist

---

## 📞 Support

If you continue to experience issues:

1. **Check Render logs** for detailed error messages
2. **Verify all environment variables** are set correctly
3. **Test Gmail connection** from your local machine first
4. **Consider using alternative email services** for production

---

## 🔐 Security Best Practices

- ✅ Never commit `.env` files with real credentials
- ✅ Use App Passwords, never your main Gmail password
- ✅ Rotate credentials regularly
- ✅ Use environment variables for all sensitive data
- ✅ Enable 2FA on your Gmail account
- ✅ Monitor email sending logs for suspicious activity

---

**Last Updated:** February 20, 2026
**Status:** ✅ Fixed and ready for deployment
