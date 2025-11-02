# 🧪 ErrorWise Manual Testing Checklist

**Date**: November 3, 2025  
**Testing Complete User Journey**: Landing → Registration → Verification → Login → Dashboard → Subscription

---

## ✅ Pre-Test Setup

- [ ] **Backend Running**: http://localhost:3001 (check console for "✅ Email service initialized")
- [ ] **Frontend Running**: http://localhost:3000 (Vite dev server)
- [ ] **Database**: PostgreSQL `errorwise_db` connected
- [ ] **Email Service**: SendGrid configured and initialized
- [ ] **Browser**: Open in incognito/private mode (fresh session)

---

## 1️⃣ LANDING PAGE (`/`)

**URL**: http://localhost:3000/

### Visual Checks:
- [ ] ErrorWise logo/brand visible
- [ ] Hero section with tagline
- [ ] Features section displayed
- [ ] Pricing/plans section visible
- [ ] Footer with links
- [ ] Navigation bar present

### Interactive Elements:
- [ ] "Get Started" button works
- [ ] "Sign In" button navigates to `/login`
- [ ] "Sign Up" button navigates to `/register`
- [ ] All navigation links work
- [ ] Smooth scrolling (if implemented)
- [ ] Responsive design (try mobile view)

### Expected Behavior:
✅ Clean, professional landing page  
✅ All CTAs (Call-to-Action) buttons working  
✅ No console errors  

---

## 2️⃣ REGISTRATION PAGE (`/register`)

**URL**: http://localhost:3000/register

### Test Account:
- **Email**: `test_[timestamp]@example.com` (use unique email)
- **Password**: `TestPass123!` (8+ chars, includes number/special char)
- **Confirm Password**: `TestPass123!` (must match)

### Form Validation Tests:

#### Test 2.1: Empty Form Submission
- [ ] Click "Sign Up" without filling anything
- [ ] **Expected**: Validation errors shown for required fields

#### Test 2.2: Invalid Email
- [ ] Enter: `invalidemail`
- [ ] **Expected**: "Invalid email format" error

#### Test 2.3: Short Password (< 8 chars)
- [ ] Email: `test@example.com`
- [ ] Password: `short`
- [ ] **Expected**: "Password must be at least 8 characters" error

#### Test 2.4: Password Mismatch
- [ ] Password: `TestPass123!`
- [ ] Confirm Password: `TestPass456!`
- [ ] **Expected**: "Passwords do not match" error

#### Test 2.5: Duplicate Email
- [ ] Use existing email: `pankaj@getgingee.com`
- [ ] **Expected**: "Email already registered" error

#### Test 2.6: Successful Registration ✅
- [ ] Email: `test_nov3@example.com` (unique)
- [ ] Password: `TestPass123!`
- [ ] Confirm Password: `TestPass123!`
- [ ] Click "Sign Up"
- [ ] **Expected**: 
  - Success message: "Registration successful! Please check your email"
  - Redirect to `/verify-email-pending` or show verification message
  - Email sent to inbox

### Visual Checks:
- [ ] Password toggle (show/hide) works
- [ ] Loading state shown during submission
- [ ] Error messages displayed in red
- [ ] Success messages displayed in green
- [ ] "Already have an account? Sign In" link works

---

## 3️⃣ EMAIL VERIFICATION

### Step 3.1: Check Email Inbox
- [ ] Open email client (Gmail, Outlook, etc.)
- [ ] Look for email from ErrorWise
- [ ] **Subject**: "Verify Your Email - ErrorWise"
- [ ] **From**: noreply@errorwise.com (or your SendGrid sender)

### Email Content Checks:
- [ ] Welcome message present
- [ ] "Verify Email" button visible
- [ ] Verification link present (backup)
- [ ] Professional formatting
- [ ] Company branding/logo

### Step 3.2: Click Verification Link
- [ ] Click "Verify Email" button in email
- [ ] **Expected**: Opens browser to verification page

### Step 3.3: Verification Page (`/verify-email?token=...`)
- [ ] Page shows "Verifying..." loading state
- [ ] Backend validates token
- [ ] **Success Case**:
  - [ ] "Email verified successfully!" message
  - [ ] Auto-redirect to `/dashboard` in 2 seconds (if token returned)
  - [ ] OR redirect to `/login` (if no auto-login)
- [ ] **Failure Cases**:
  - [ ] Invalid token: "Invalid verification link"
  - [ ] Expired token: "Verification link expired"
  - [ ] Already verified: "Email already verified"

---

## 4️⃣ LOGIN PAGE (`/login`)

**URL**: http://localhost:3000/login

### Test Credentials:
- **Email**: `test_nov3@example.com` (the one you just registered)
- **Password**: `TestPass123!`

### Test 4.1: Invalid Credentials
- [ ] Email: `wrong@example.com`
- [ ] Password: `wrongpass`
- [ ] Click "Sign In"
- [ ] **Expected**: "Invalid email or password" error

### Test 4.2: Unverified Email
- [ ] Use email that's not verified
- [ ] **Expected**: 
  - [ ] Yellow warning box: "Email Not Verified"
  - [ ] Message: "Please verify your email address before logging in"
  - [ ] "Resend Verification Email" button shown
  - [ ] Click resend → "Verification email sent! Check your inbox."

### Test 4.3: Correct Credentials - OTP Flow ✨ (NEW!)

#### Step 1: Email/Password
- [ ] Email: `test_nov3@example.com`
- [ ] Password: `TestPass123!`
- [ ] Click "Sign In"
- [ ] **Expected**:
  - [ ] Email/password form DISAPPEARS
  - [ ] Blue info box appears: "Check Your Email!"
  - [ ] Message: "We've sent a 6-digit OTP to test_nov3@example.com"
  - [ ] **NEW**: 6 separate input boxes shown (not basic text input!)
  - [ ] Timer countdown: "Time remaining: 10:00"
  - [ ] "← Back to login" button shown

#### Step 2: OTP Input Testing 🎨
- [ ] **Box Navigation**:
  - [ ] Type first digit → cursor auto-moves to box 2 ✓
  - [ ] Type second digit → cursor auto-moves to box 3 ✓
  - [ ] Continue typing → cursor auto-advances each time ✓
  - [ ] After 6th digit → all boxes filled ✓

- [ ] **Backspace Testing**:
  - [ ] Press Backspace → moves to previous box ✓
  - [ ] Deletes current digit ✓
  - [ ] Can navigate backwards ✓

- [ ] **Arrow Key Navigation**:
  - [ ] Press Left Arrow → moves to previous box ✓
  - [ ] Press Right Arrow → moves to next box ✓

- [ ] **Validation**:
  - [ ] Try typing letters → blocked (numeric only) ✓
  - [ ] Try typing special chars → blocked ✓
  - [ ] Only accepts digits 0-9 ✓

- [ ] **Visual Appearance**:
  - [ ] 6 separate boxes displayed
  - [ ] Each box shows one digit
  - [ ] Active box highlighted
  - [ ] Professional, modern look
  - [ ] Matches modern auth UX (like banking apps)

#### Step 3: Check Email for OTP
- [ ] Open email inbox
- [ ] Look for "Your OTP Code - ErrorWise"
- [ ] Find 6-digit code (e.g., `123456`)
- [ ] **Email Content**:
  - [ ] OTP code clearly displayed
  - [ ] Large, readable font
  - [ ] Expiry time mentioned (10 minutes)
  - [ ] Warning about not sharing code

#### Step 4: Enter OTP
- [ ] Type the 6-digit code from email
- [ ] Watch auto-focus between boxes
- [ ] **Verify Button**:
  - [ ] Disabled when less than 6 digits
  - [ ] Enabled when all 6 digits entered
  - [ ] Click "Verify OTP"
  - [ ] Shows "Verifying..." loading state

#### Step 5: OTP Success
- [ ] **Expected**:
  - [ ] "OTP verified successfully" (brief message)
  - [ ] Redirect to `/dashboard`
  - [ ] JWT token stored in localStorage
  - [ ] User logged in

### Test 4.4: OTP Error Cases

#### Invalid OTP
- [ ] Enter wrong code: `999999`
- [ ] Click "Verify OTP"
- [ ] **Expected**: "Invalid OTP code" error in red box

#### Expired OTP
- [ ] Wait for timer to reach 0:00
- [ ] **Expected**: 
  - [ ] "OTP expired" message in red
  - [ ] "Resend OTP" button appears
  - [ ] Verify button disabled

#### Resend OTP
- [ ] Click "Resend OTP"
- [ ] **Expected**:
  - [ ] New OTP sent to email
  - [ ] Timer resets to 10:00
  - [ ] Success message shown
  - [ ] Check email for new code

#### Back to Login
- [ ] Click "← Back to login"
- [ ] **Expected**:
  - [ ] Return to email/password form
  - [ ] OTP state cleared
  - [ ] Can re-enter credentials

### Visual Checks:
- [ ] Responsive layout (mobile-friendly)
- [ ] Password toggle (show/hide) works
- [ ] "Forgot password?" link navigates to `/forgot-password`
- [ ] "Don't have an account? Sign Up" link works
- [ ] No console errors

---

## 5️⃣ DASHBOARD (`/dashboard`)

**URL**: http://localhost:3000/dashboard (requires authentication)

### Access Control Tests:

#### Test 5.1: Authenticated Access
- [ ] Login successfully (complete OTP flow)
- [ ] **Expected**: Redirected to dashboard automatically

#### Test 5.2: Direct URL Access (No Auth)
- [ ] Open new incognito tab
- [ ] Go directly to http://localhost:3000/dashboard
- [ ] **Expected**: Redirected to `/login`

#### Test 5.3: Expired Token
- [ ] Manually clear localStorage token
- [ ] Refresh dashboard page
- [ ] **Expected**: Redirected to `/login`

### Dashboard Content Checks:

#### Header/Navigation
- [ ] User name/email displayed
- [ ] Profile picture or avatar
- [ ] Logout button present
- [ ] Navigation menu (sidebar or top nav)

#### Main Dashboard Area
- [ ] Welcome message: "Welcome back, [Name]!"
- [ ] Key metrics/stats displayed (if applicable)
- [ ] Recent activity section
- [ ] Quick actions/shortcuts
- [ ] Error logs/monitoring (main feature)

#### Sidebar/Menu Items
- [ ] Dashboard (active/highlighted)
- [ ] Projects
- [ ] Errors/Logs
- [ ] Settings
- [ ] Subscription/Billing
- [ ] Support/Help

#### Subscription Banner (if not subscribed)
- [ ] "Upgrade to Premium" banner visible
- [ ] Shows current plan (Free/Trial)
- [ ] "Upgrade Now" button present
- [ ] Click navigates to `/subscription` or `/pricing`

### Functionality Tests:

#### Test 5.4: Navigation Between Pages
- [ ] Click "Projects" → loads projects page
- [ ] Click "Settings" → loads settings page
- [ ] Click "Dashboard" → returns to main dashboard
- [ ] All routes work without page reload (SPA behavior)

#### Test 5.5: Logout
- [ ] Click "Logout" or user menu → "Sign Out"
- [ ] **Expected**:
  - [ ] Confirmation dialog (optional)
  - [ ] Token cleared from localStorage
  - [ ] Redirect to `/login` or landing page
  - [ ] Cannot access dashboard after logout

#### Test 5.6: Data Loading
- [ ] Dashboard loads user-specific data
- [ ] Shows correct user information
- [ ] Error logs display (if any)
- [ ] No 401/403 errors in console

### Visual Checks:
- [ ] Clean, modern UI
- [ ] Consistent branding (colors, fonts)
- [ ] Responsive layout (try mobile view)
- [ ] Loading states for data fetching
- [ ] Empty states (if no data)
- [ ] Icons and imagery load correctly

---

## 6️⃣ SUBSCRIPTION PAGE (`/subscription` or `/pricing`)

**URL**: http://localhost:3000/subscription

### Page Content Checks:

#### Pricing Plans Display
- [ ] **Free/Trial Plan**:
  - [ ] Plan name visible
  - [ ] Price: $0/month or "Free"
  - [ ] Features list
  - [ ] Limitations shown
  - [ ] "Current Plan" badge (if applicable)

- [ ] **Premium/Pro Plan**:
  - [ ] Plan name visible
  - [ ] Price clearly displayed (e.g., $29/month)
  - [ ] Features list (more than free)
  - [ ] "Upgrade" or "Subscribe" button
  - [ ] Popular/Recommended badge (optional)

- [ ] **Enterprise Plan** (if available):
  - [ ] Plan details
  - [ ] "Contact Sales" button
  - [ ] Custom pricing

#### Features Comparison
- [ ] Feature comparison table/grid
- [ ] Checkmarks for included features
- [ ] X or dash for excluded features
- [ ] Tooltips/info icons for details
- [ ] Clear differentiation between plans

### Subscription Flow Tests:

#### Test 6.1: View Plans (Unauthenticated)
- [ ] Logout first
- [ ] Go to pricing page
- [ ] **Expected**: Can view plans without login
- [ ] "Get Started" or "Sign Up" buttons shown
- [ ] Clicking redirects to `/register`

#### Test 6.2: View Plans (Authenticated)
- [ ] Login to account
- [ ] Navigate to subscription page
- [ ] **Expected**: 
  - [ ] Current plan highlighted
  - [ ] "Upgrade" buttons for higher plans
  - [ ] "Current Plan" or "Manage" for active plan

#### Test 6.3: Upgrade to Premium

**Note**: Since Dodo Payments integration is mentioned, check for payment provider.

- [ ] Click "Upgrade to Premium" on Pro plan
- [ ] **Expected**:
  - [ ] Redirect to payment page
  - [ ] OR show payment modal/form
  - [ ] Payment details form (Dodo Payments / Stripe / Other)

#### Payment Form Checks:
- [ ] Plan details summary
- [ ] Price breakdown
- [ ] Billing cycle (monthly/yearly)
- [ ] Card details fields (if applicable)
- [ ] Secure payment indicator (SSL/lock icon)
- [ ] Terms & conditions checkbox
- [ ] "Pay Now" or "Subscribe" button

#### Test 6.4: Complete Payment (Test Mode)

**Use Test Card** (if payment provider supports):
- Card Number: `4242 4242 4242 4242` (Stripe test)
- Expiry: Any future date
- CVC: Any 3 digits

Steps:
- [ ] Enter test payment details
- [ ] Click "Pay Now"
- [ ] **Expected**:
  - [ ] Payment processing indicator
  - [ ] Success message: "Subscription activated!"
  - [ ] Redirect to dashboard or subscription success page
  - [ ] Email confirmation sent

#### Test 6.5: Verify Subscription Active
- [ ] Go to dashboard
- [ ] Check subscription status
- [ ] **Expected**:
  - [ ] Shows "Premium" or "Pro" plan
  - [ ] "Upgrade" banner removed
  - [ ] Access to premium features enabled
  - [ ] Subscription end date shown (if applicable)

#### Test 6.6: Manage Subscription
- [ ] Navigate to subscription page
- [ ] **Expected Options**:
  - [ ] View current plan details
  - [ ] "Cancel Subscription" button
  - [ ] "Change Plan" option
  - [ ] Billing history
  - [ ] Payment method management

### Edge Cases:

#### Payment Failure
- [ ] Use invalid card: `4000 0000 0000 0002` (decline card)
- [ ] **Expected**: 
  - [ ] "Payment failed" error message
  - [ ] Reason displayed (insufficient funds, etc.)
  - [ ] Can retry payment
  - [ ] Subscription not activated

#### Already Subscribed
- [ ] Try to subscribe again while active
- [ ] **Expected**: 
  - [ ] Message: "You already have an active subscription"
  - [ ] Show current plan details
  - [ ] Option to upgrade/downgrade only

---

## 7️⃣ PASSWORD RESET (`/forgot-password`)

**URL**: http://localhost:3000/forgot-password

### Test 7.1: Request Password Reset

#### Form Validation:
- [ ] Empty email field
- [ ] **Expected**: "Email is required" error

- [ ] Invalid email format: `notanemail`
- [ ] **Expected**: "Invalid email format" error

#### Valid Email:
- [ ] Enter: `test_nov3@example.com`
- [ ] Click "Send Reset Link"
- [ ] **Expected**:
  - [ ] "Reset link sent! Check your email" success message
  - [ ] Redirect to login or show confirmation page
  - [ ] Email sent to inbox

### Test 7.2: Check Reset Email
- [ ] Open email inbox
- [ ] Look for "Reset Your Password - ErrorWise"
- [ ] **Email Content**:
  - [ ] "Reset Password" button visible
  - [ ] Reset link present (backup)
  - [ ] Expiry time mentioned (1 hour)
  - [ ] Professional formatting

### Test 7.3: Click Reset Link
- [ ] Click "Reset Password" button in email
- [ ] **Expected**: Opens `/reset-password?token=...` page

### Test 7.4: Reset Password Page

#### Page Content:
- [ ] "Reset Your Password" heading
- [ ] New password field
- [ ] Confirm password field
- [ ] Password strength indicator (optional)
- [ ] "Reset Password" button

#### Form Validation Tests:

**Test 7.4.1: Empty Fields**
- [ ] Submit empty form
- [ ] **Expected**: "Password is required" errors

**Test 7.4.2: Short Password (< 8 chars)** ✅ FIXED!
- [ ] Password: `short`
- [ ] **Expected**: "Password must be at least 8 characters" error
- [ ] Frontend validation: 8 chars minimum ✓
- [ ] Backend validation: 8 chars minimum ✓
- [ ] **Both match now!** ✅

**Test 7.4.3: Password Mismatch**
- [ ] New Password: `NewPass123!`
- [ ] Confirm Password: `Different123!`
- [ ] **Expected**: "Passwords do not match" error

**Test 7.4.4: Successful Reset** ✅ TESTED!
- [ ] New Password: `NewPass2025!` (8+ chars)
- [ ] Confirm Password: `NewPass2025!`
- [ ] Click "Reset Password"
- [ ] **Expected**:
  - [ ] "Password reset successful!" message
  - [ ] Backend returns 200 OK ✓
  - [ ] Confirmation email sent ✓
  - [ ] Redirect to `/login` page
  - [ ] Can login with new password

### Test 7.5: Reset Link Edge Cases

**Invalid Token:**
- [ ] Modify token in URL: `?token=invalid123`
- [ ] **Expected**: "Invalid or expired reset link" error

**Expired Token:**
- [ ] Use token older than 1 hour
- [ ] **Expected**: "Reset link has expired" error
- [ ] Option to request new link

**Already Used Token:**
- [ ] Use same token twice
- [ ] **Expected**: "This reset link has already been used" error

### Test 7.6: Login with New Password
- [ ] Go to `/login`
- [ ] Email: `test_nov3@example.com`
- [ ] Password: `NewPass2025!` (new password)
- [ ] Complete OTP flow
- [ ] **Expected**: Successfully login and reach dashboard ✓

---

## 📊 TESTING RESULTS SUMMARY

### Critical Paths to Test:
1. ✅ **Registration → Verification → Login → Dashboard** (Happy Path)
2. ✅ **Password Reset → Login** (Recovery Path)
3. ✅ **OTP Login Flow** (New 6-box input) (Security Path)
4. ⏳ **Subscription Upgrade** (Monetization Path)

### Known Issues Fixed:
✅ Password reset validation: Frontend 8 chars ↔ Backend 8 chars (FIXED!)  
✅ OTP login: Basic input → 6-box fancy input (ENHANCED!)  
✅ Email verification: Auto-login enabled (IMPROVED!)  
✅ Backend column mapping: Sequelize underscored (FIXED!)  

### Browser Compatibility:
Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile browsers (Chrome Mobile, Safari iOS)

### Performance Checks:
- [ ] Pages load in < 2 seconds
- [ ] Images optimized (not too large)
- [ ] No unnecessary API calls
- [ ] Smooth transitions/animations
- [ ] No memory leaks (check DevTools)

---

## 🐛 BUG REPORTING TEMPLATE

If you find issues, document them:

**Bug #**: ___  
**Page**: ___  
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**: ___  
**Actual Behavior**: ___  
**Screenshots**: (attach if possible)  
**Console Errors**: (check browser console)  
**Severity**: Critical / High / Medium / Low  

---

## ✅ COMPLETION CHECKLIST

When all tests pass:
- [ ] All 7 sections tested thoroughly
- [ ] No critical bugs found
- [ ] User journey smooth and intuitive
- [ ] Email notifications working
- [ ] Authentication secure (OTP, tokens)
- [ ] Subscription flow functional
- [ ] Responsive design confirmed
- [ ] No console errors
- [ ] Performance acceptable

---

**Tester**: ___________________  
**Date Completed**: ___________  
**Overall Status**: ⏳ In Progress / ✅ Passed / ❌ Failed  

**Notes**: 
_____________________________________________
_____________________________________________
