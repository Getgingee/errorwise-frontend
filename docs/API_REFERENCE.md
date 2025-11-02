# API Reference Documentation

> **Complete API specification for ErrorWise platform, including all endpoints, request/response formats, and authentication methods.**

---

## 📡 Base URLs

### Development
```
Frontend: http://localhost:3000
Backend:  http://localhost:3001/api
```

### Production
```
Frontend: https://errorwise.app
Backend:  https://api.errorwise.app/api
```

---

## 🔐 Authentication

### Authentication Methods

#### 1. JWT Bearer Token
```http
Authorization: Bearer <access_token>
```

#### 2. Refresh Token (HttpOnly Cookie)
```http
Cookie: refreshToken=<refresh_token>
```

### Token Lifecycle
- **Access Token**: 15 minutes expiry
- **Refresh Token**: 7 days expiry
- **Auto-refresh**: Handled by axios interceptor

---

## 📋 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "security_question_1": "What is your favorite color?",
  "security_answer_1": "Blue",
  "security_question_2": "What city were you born in?",
  "security_answer_2": "New York",
  "security_question_3": "What is your pet's name?",
  "security_answer_3": "Max"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "subscription_tier": "free",
      "is_verified": false,
      "created_at": "2025-10-29T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `409 Conflict`: Email already exists

---

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "subscription_tier": "pro",
      "is_verified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account not verified

---

#### Refresh Token
```http
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or expired refresh token

---

#### Forgot Password
```http
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Security questions retrieved",
  "data": {
    "security_questions": [
      "What is your favorite color?",
      "What city were you born in?",
      "What is your pet's name?"
    ]
  }
}
```

---

#### Reset Password
```http
POST /api/auth/reset-password
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "security_answer_1": "Blue",
  "security_answer_2": "New York",
  "security_answer_3": "Max",
  "newPassword": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Error Responses:**
- `400 Bad Request`: Incorrect security answers
- `404 Not Found`: User not found

---

### Error Analysis Endpoints

#### Analyze Error (Authenticated)
```http
POST /api/errors/analyze
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "errorMessage": "TypeError: Cannot read property 'map' of undefined",
  "errorType": "runtime",
  "codeSnippet": "const items = data.items;\nconst list = items.map(item => item.name);"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "explanation": "This error occurs when trying to call .map() on an undefined value...",
    "solution": "1. Check if data.items exists before calling .map()\n2. Add optional chaining...",
    "codeExample": "const items = data?.items || [];\nconst list = items.map(item => item.name);",
    "category": "JavaScript",
    "confidence": 95,
    "created_at": "2025-10-29T10:30:00Z"
  }
}
```

**Rate Limits:**
- **Free**: 10 analyses per day
- **Pro**: Unlimited
- **Enterprise**: Unlimited

**Error Responses:**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid token
- `429 Too Many Requests`: Rate limit exceeded

---

#### Get Error History
```http
GET /api/errors/history?page=1&limit=20
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `category` (optional): Filter by category

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "analyses": [
      {
        "id": "uuid",
        "error_message": "TypeError: Cannot read property...",
        "category": "JavaScript",
        "confidence": 95,
        "created_at": "2025-10-29T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

#### Get Single Analysis
```http
GET /api/errors/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "error_message": "TypeError: Cannot read property 'map' of undefined",
    "error_type": "runtime",
    "explanation": "Detailed explanation...",
    "solution": "Step-by-step solution...",
    "code_example": "Code snippet...",
    "category": "JavaScript",
    "confidence": 95,
    "created_at": "2025-10-29T10:30:00Z"
  }
}
```

**Error Responses:**
- `404 Not Found`: Analysis not found

---

#### Delete Analysis
```http
DELETE /api/errors/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Analysis deleted successfully"
}
```

---

### Public Demo Endpoints

#### Analyze Error (Demo - No Auth)
```http
POST /api/public/demo/analyze
```

**Request Body:**
```json
{
  "errorMessage": "TypeError: Cannot read property 'map' of undefined"
}
```

**Response (200 OK):**
```json
{
  "explanation": "This error occurs when...",
  "solution": "1. Check if data exists...",
  "codeExample": "const items = data?.items || [];",
  "category": "JavaScript",
  "confidence": 95,
  "isDemo": true,
  "demoInfo": {
    "remainingDemos": 2,
    "totalDemos": 3,
    "resetTime": "2025-10-30T10:30:00Z",
    "message": "2 demos remaining today"
  },
  "proFeatures": {
    "withPro": [
      "Unlimited daily analyses",
      "Save and access analysis history",
      "Code examples and documentation",
      "Priority AI processing",
      "Export to PDF/Markdown",
      "Advanced error tracking",
      "Team collaboration features"
    ],
    "demoLimitation": "Demo users get 3 analyses per day. Sign up for unlimited access!"
  }
}
```

**Rate Limits:**
- 3 analyses per session (24 hours)
- Session tracked via HttpOnly cookie

**Error Responses:**
- `429 Too Many Requests`: Demo limit reached
```json
{
  "error": "Free demo limit reached",
  "message": "You've used all 3 free demos. Sign up for unlimited analyses with saved history!",
  "resetTime": "2025-10-30T10:30:00Z",
  "upgradeUrl": "http://localhost:3000/register",
  "proFeatures": [
    "✓ Unlimited analyses per day",
    "✓ Save and access analysis history",
    "✓ Export to PDF/Markdown",
    "✓ Priority AI processing",
    "✓ Advanced error tracking"
  ]
}
```

---

#### Get Demo Examples
```http
GET /api/public/demo/examples
```

**Response (200 OK):**
```json
{
  "examples": [
    "TypeError: Cannot read property of undefined in JavaScript",
    "How to fix 'Module not found' error in React?",
    "Python IndexError: list index out of range",
    "What causes high CPU usage in Node.js applications?",
    "How do I resolve CORS errors in my web application?"
  ]
}
```

---

#### Get Demo Session Stats
```http
GET /api/public/demo/stats
```

**Response (200 OK):**
```json
{
  "used": 1,
  "remaining": 2,
  "limit": 3,
  "resetTime": "2025-10-30T10:30:00Z"
}
```

---

### Subscription Endpoints

#### Get Available Plans
```http
GET /api/subscriptions/plans
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "free",
      "name": "Free",
      "price": 0,
      "interval": "month",
      "features": [
        "10 analyses per day",
        "Basic error explanations",
        "Community support"
      ]
    },
    {
      "id": "pro",
      "name": "Pro",
      "price": 9.99,
      "interval": "month",
      "stripe_price_id": "price_xxx",
      "features": [
        "Unlimited analyses",
        "Code examples included",
        "Priority AI processing",
        "Analysis history",
        "Export to PDF/Markdown",
        "Email support"
      ]
    },
    {
      "id": "enterprise",
      "name": "Enterprise",
      "price": 99.99,
      "interval": "month",
      "stripe_price_id": "price_yyy",
      "features": [
        "Everything in Pro",
        "Team collaboration",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee"
      ]
    }
  ]
}
```

---

#### Get User Subscription
```http
GET /api/subscriptions/current
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "plan_id": "pro",
    "status": "active",
    "current_period_end": "2025-11-29T10:30:00Z",
    "cancel_at_period_end": false,
    "stripe_subscription_id": "sub_xxx"
  }
}
```

---

#### Create Checkout Session
```http
POST /api/subscriptions/create-checkout
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "priceId": "price_xxx",
  "successUrl": "http://localhost:3000/subscription?success=true",
  "cancelUrl": "http://localhost:3000/subscription?canceled=true"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_xxx",
    "url": "https://checkout.stripe.com/pay/cs_test_xxx"
  }
}
```

---

#### Cancel Subscription
```http
POST /api/subscriptions/cancel
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription will be canceled at period end",
  "data": {
    "cancel_at_period_end": true,
    "current_period_end": "2025-11-29T10:30:00Z"
  }
}
```

---

### User Profile Endpoints

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "subscription_tier": "pro",
    "is_verified": true,
    "created_at": "2025-01-01T00:00:00Z",
    "settings": {
      "email_notifications": true,
      "theme": "dark",
      "language": "en"
    }
  }
}
```

---

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "settings": {
    "email_notifications": false,
    "theme": "light"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "name": "John Smith",
    "email": "john@example.com",
    "settings": {
      "email_notifications": false,
      "theme": "light",
      "language": "en"
    }
  }
}
```

---

#### Change Password
```http
POST /api/users/change-password
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Current password incorrect

---

#### Delete Account
```http
DELETE /api/users/account
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "password": "SecurePass123!",
  "confirmation": "DELETE"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## 📊 Rate Limiting

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1635523200
```

### Limits by Tier

| Endpoint | Free | Pro | Enterprise |
|----------|------|-----|------------|
| `/errors/analyze` | 10/day | Unlimited | Unlimited |
| `/public/demo/analyze` | 3/session | N/A | N/A |
| `/subscriptions/*` | 10/hour | 100/hour | Unlimited |
| General API | 100/hour | 1000/hour | Unlimited |

---

## ⚠️ Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": {
    "field": "email",
    "issue": "Invalid email format"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid auth |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## 🔒 Security Headers

All API responses include:
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## 📝 Request Examples

### cURL
```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123!"}'

# Analyze Error
curl -X POST http://localhost:3001/api/errors/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"errorMessage":"TypeError: Cannot read property...", "errorType":"runtime"}'
```

### JavaScript (Axios)
```javascript
// Login
const response = await axios.post('http://localhost:3001/api/auth/login', {
  email: 'john@example.com',
  password: 'SecurePass123!'
});

// Analyze Error
const analysis = await axios.post(
  'http://localhost:3001/api/errors/analyze',
  {
    errorMessage: 'TypeError: Cannot read property...',
    errorType: 'runtime'
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
```

---

*Last Updated: October 29, 2025*
