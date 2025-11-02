# 🔧 Email/OTP Not Working - Complete Fix Guide

## ❌ Problem
You're seeing "OTP sent to mail" and "Verification mail sent" messages, but **NOT receiving** any emails or OTP codes.

## 🎯 Root Causes

### 1. **Backend Server Not Running** ⚠️
The frontend is trying to connect to `http://localhost:3001/api` but the backend server is not running.

### 2. **Environment Variable Mismatch** ⚠️
- `.env` file has: `VITE_API_URL`
- Code expects: `VITE_API_BASE_URL`

### 3. **Email Service Not Configured** ⚠️
The backend needs email service (like SendGrid, Nodemailer, etc.) configured to actually send emails.

---

## ✅ Solutions

### Step 1: Fix Environment Variables

**Update `.env` file:**

```env
# Backend API URL - FIXED
VITE_API_BASE_URL=http://localhost:3001/api
VITE_API_URL=http://localhost:3001  # Keep for backward compatibility
VITE_APP_NAME=ErrorWise
VITE_APP_VERSION=1.0.0

# Environment
NODE_ENV=development
```

### Step 2: Start Backend Server

You need to have your backend server running. If you don't have one, here's what you need:

**Option A: If you have a backend project**
```bash
# Navigate to your backend folder
cd path/to/your/errorwise-backend

# Install dependencies
npm install

# Start the server
npm run dev
# OR
npm start
```

**Option B: If you DON'T have a backend**
You need to create/clone the ErrorWise backend that includes:
- User authentication endpoints
- Email service integration (SendGrid/Nodemailer)
- OTP generation and verification
- Database (MongoDB/PostgreSQL)

### Step 3: Configure Email Service in Backend

Your backend needs email configuration. Example with **Nodemailer**:

**Backend `.env` file should have:**
```env
# Email Configuration
EMAIL_SERVICE=gmail  # or 'sendgrid', 'mailgun', etc.
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password  # Use App Password for Gmail
EMAIL_FROM=noreply@errorwise.com

# For SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key

# Database
MONGODB_URI=mongodb://localhost:27017/errorwise
# OR
DATABASE_URL=postgresql://user:password@localhost:5432/errorwise

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-token-secret

# Server
PORT=3001
NODE_ENV=development
```

### Step 4: Verify Backend Endpoints

Your backend must have these endpoints working:

```
POST /api/auth/register/enhanced       - Register with email
POST /api/auth/login/enhanced          - Login & send OTP
POST /api/auth/login/verify-otp        - Verify OTP code
POST /api/auth/resend-verification     - Resend verification email
POST /api/auth/verify-email            - Verify email with token
POST /api/auth/forgot-password         - Request password reset
POST /api/auth/reset-password          - Reset password with token
POST /api/auth/send-phone-otp          - Send SMS OTP
POST /api/auth/verify-phone-otp        - Verify phone OTP
```

---

## 🧪 Testing the Fix

### 1. Check if Backend is Running
```powershell
# In PowerShell
curl http://localhost:3001/api/health

# Should return something like:
# { "status": "ok", "message": "Server is running" }
```

### 2. Test Email Sending Manually
```powershell
# Test login endpoint
curl -X POST http://localhost:3001/api/auth/login/enhanced `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Check Backend Logs
Look for errors in your backend console:
- Email service connection errors
- SMTP authentication failures
- Missing environment variables
- Database connection issues

---

## 📧 Quick Email Service Setup

### Option 1: Gmail (Development Only)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**: 
   - Go to Google Account → Security → App Passwords
   - Generate password for "Mail"
3. **Add to backend `.env`**:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

### Option 2: SendGrid (Recommended for Production)

1. **Sign up at** https://sendgrid.com (Free tier: 100 emails/day)
2. **Get API Key**: Settings → API Keys → Create API Key
3. **Add to backend `.env`**:
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
   EMAIL_FROM=noreply@errorwise.com
   ```

### Option 3: Mailtrap (Testing Only)

1. **Sign up at** https://mailtrap.io (Free for testing)
2. **Get SMTP credentials** from inbox settings
3. **Add to backend `.env`**:
   ```env
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=your-mailtrap-user
   EMAIL_PASSWORD=your-mailtrap-password
   ```

---

## 🔍 Debugging Checklist

- [ ] Backend server is running on port 3001
- [ ] `.env` file has correct `VITE_API_BASE_URL`
- [ ] Backend `.env` has email service configured
- [ ] Email service credentials are correct
- [ ] Database is connected and running
- [ ] Test endpoint returns successful response
- [ ] Check backend console for error logs
- [ ] Check spam folder for test emails
- [ ] Verify firewall isn't blocking port 3001

---

## 🚀 Quick Start (If Starting Fresh)

### 1. Create Backend Project

```bash
# Create new folder
mkdir errorwise-backend
cd errorwise-backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express mongoose bcryptjs jsonwebtoken nodemailer dotenv cors
npm install -D typescript @types/node @types/express ts-node-dev

# Create basic structure
mkdir src
mkdir src/routes
mkdir src/controllers
mkdir src/models
mkdir src/middleware
mkdir src/services
```

### 2. Basic Server Setup

Create `src/server.ts`:
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

### 3. Start Development

```bash
# Start backend
npm run dev

# In another terminal, start frontend
cd errorwise-frontend
npm run dev
```

---

## 📝 Important Notes

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use App Passwords** for Gmail, not regular password
3. **Check spam folder** when testing emails
4. **Use Mailtrap** for development to avoid sending real emails
5. **Rate limit email sending** to prevent abuse
6. **Implement email queue** (Bull, BullMQ) for production

---

## 🆘 Still Not Working?

### Check Browser Console
```javascript
// Open DevTools → Console → Network tab
// Look for failed requests to localhost:3001
```

### Check Backend Logs
```bash
# Your backend console should show:
# ✅ Email sent to: user@example.com
# ❌ If you see errors, they'll tell you what's wrong
```

### Common Errors

| Error | Solution |
|-------|----------|
| `ECONNREFUSED` | Backend not running - start it! |
| `Invalid login credentials` | Email service not configured |
| `535 Authentication failed` | Wrong email credentials |
| `ENOTFOUND smtp.gmail.com` | No internet or wrong SMTP host |
| `Network Error` | CORS issue - add frontend URL to backend CORS |

---

## 📚 Resources

- [Nodemailer Documentation](https://nodemailer.com/about/)
- [SendGrid API Docs](https://docs.sendgrid.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Mailtrap Testing](https://mailtrap.io/inboxes)

---

**Next Steps:**
1. ✅ Fix environment variables
2. ✅ Start/create backend server
3. ✅ Configure email service
4. ✅ Test email sending
5. ✅ Apply responsive design to other pages

Let me know which step you need help with! 🚀
