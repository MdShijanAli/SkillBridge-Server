# Brevo Setup Guide for SkillBridge

## Why Brevo?

Render (and most cloud platforms) **block outbound SMTP connections** on ports 465/587 to prevent spam. Brevo (formerly Sendinblue) is a free transactional email service that works perfectly on these platforms.

## Free Tier Benefits ✨

- **300 emails/day** FREE (3x more than SendGrid!)
- No credit card required for signup
- Production-ready email delivery
- 99.9% deliverability rate
- Real-time email tracking

---

## Setup Steps (5 minutes)

### 1. Create Brevo Account

1. Go to [https://www.brevo.com/](https://www.brevo.com/)
2. Click **Sign up free**
3. Fill in your details and verify your email
4. Choose the **FREE plan** (no credit card needed)

### 2. Get Your API Key

1. Log in to Brevo dashboard
2. Click on your **profile name** (top right)
3. Go to **SMTP & API** → **API Keys**
4. Click **Generate a new API key**
5. Name it: `SkillBridge Production`
6. Click **Generate**
7. **COPY THE KEY** immediately (starts with `xkeysib-...`)

### 3. Add Sender Email

Brevo requires you to verify your sender email:

1. In Brevo dashboard, go to **Senders**
2. Click **Add a new sender**
3. Enter your email (same as `APP_USER`)
4. Enter your name: **SkillBridge**
5. Click **Create**
6. Check your email and click the verification link

### 4. Add to Render Environment Variables

1. Go to your Render dashboard
2. Select your **SkillBridge-Server** service
3. Go to **Environment** tab
4. Add new environment variable:
   ```
   BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxx
   ```
5. Click **Save Changes**
6. Render will automatically redeploy

### 5. Keep Existing Variables

Make sure these are also set in Render:

```
APP_USER=your-email@gmail.com
APP_PASSWORD=your-gmail-app-password (not needed for Brevo, but keep for local dev)
APP_URL=https://skill-bridge-client-by-shijan.netlify.app
BETTER_AUTH_URL=https://skillbridge-server-s2ql.onrender.com
CLIENT_URL=https://skill-bridge-client-by-shijan.netlify.app
```

---

## Testing

After deployment, register a new user and check:

1. **Server Logs** should show:

   ```
   ✅ Brevo configured for email delivery (300 emails/day free)
   ✅ Email sent via Brevo: 201
   ```

2. **Email should arrive** within 1-2 seconds (check spam folder first time)

3. **Brevo Dashboard** → **Statistics** to see delivery stats

---

## Local Development

For local development without Brevo:

1. Don't set `BREVO_API_KEY` in your `.env`
2. The app will use SMTP (Gmail) instead
3. Make sure `APP_USER` and `APP_PASSWORD` are set

---

## Troubleshooting

### Email not sending?

**Check server logs for:**

- `✅ Brevo configured` - Good, Brevo is active
- `⚠️ No Brevo API key` - Missing environment variable

**Common errors:**

- `401 Unauthorized` - Wrong API key or expired
- `403 Forbidden` - Sender email not verified
- `400 Bad Request` - Invalid email format

### Sender email not verified?

1. Go to Brevo → **Senders**
2. Look for green checkmark next to your email
3. If not verified, click **Resend verification email**
4. The sender email MUST match `APP_USER` environment variable

### Still not working?

Check Render logs:

```bash
# Look for these messages
✅ Brevo configured for email delivery
✅ Email sent via Brevo: 201
```

If you see errors:

1. Verify API key is correct (no extra spaces)
2. Sender email is verified in Brevo
3. Render has redeployed after adding the variable
4. Check Brevo dashboard → Logs for detailed error messages

---

## Brevo vs SendGrid

| Feature          | Brevo FREE   | SendGrid FREE |
| ---------------- | ------------ | ------------- |
| Daily emails     | **300**      | 100           |
| Email tracking   | ✅ Yes       | ✅ Yes        |
| Templates        | ✅ Yes       | ✅ Yes        |
| Setup difficulty | ⭐ Easy      | ⭐⭐ Medium   |
| Deliverability   | 99.9%        | 99.9%         |
| Support          | Chat + Email | Email only    |

---

## Cost (if you scale)

- **FREE**: 300 emails/day forever
- **Starter**: $25/mo for 20,000 emails/month
- **Business**: $65/mo for 100,000 emails/month
- **Enterprise**: Custom pricing

For SkillBridge, the free tier should handle:

- ~9,000 registrations/month
- Perfect for MVP and early growth

---

## Additional Features (FREE)

1. **Email Templates** - Design beautiful emails in Brevo
2. **Contact Lists** - Manage subscribers
3. **Email Campaigns** - Send newsletters
4. **Analytics** - Track opens, clicks, bounces
5. **SMS** (pay-as-you-go)

---

## Next Steps

1. Install dependencies: `npm install`
2. Add `BREVO_API_KEY` to Render
3. Deploy and test registration
4. Monitor email delivery in Brevo dashboard

Enjoy 300 free emails per day! 🎉
