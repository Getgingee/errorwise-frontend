# Architecture Documentation

> **Comprehensive overview of ErrorWise system architecture, component structure, and data flow patterns.**

---

## 📐 System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │    Mobile    │  │   Desktop    │          │
│  │  (React SPA) │  │   (Future)   │  │   (Future)   │          │
│  └──────┬───────┘  └──────────────┘  └──────────────┘          │
└─────────┼───────────────────────────────────────────────────────┘
          │
          │ HTTPS/WSS
          │
┌─────────▼───────────────────────────────────────────────────────┐
│                      Frontend Layer                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              React 18 + TypeScript + Vite               │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │    │
│  │  │  Pages  │  │Components│  │ Services│  │  Store  │   │    │
│  │  └────┬────┘  └────┬─────┘  └────┬────┘  └────┬────┘   │    │
│  │       └────────────┴─────────────┴────────────┘        │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────┬───────────────────────────────────────────────────────┘
          │
          │ REST API (Axios)
          │
┌─────────▼───────────────────────────────────────────────────────┐
│                       Backend Layer                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │            Node.js + Express.js + Sequelize             │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │    │
│  │  │ Routes  │  │Controllers│ │Services │  │ Models  │   │    │
│  │  └────┬────┘  └────┬─────┘  └────┬────┘  └────┬────┘   │    │
│  │       └────────────┴─────────────┴────────────┘        │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────┬──────────────────────┬──────────────────────────────┘
          │                      │
          │                      │
┌─────────▼─────────┐   ┌────────▼──────────┐
│   PostgreSQL      │   │      Redis        │
│   (Primary DB)    │   │   (Sessions)      │
└───────────────────┘   └───────────────────┘
```

---

## 🎨 Frontend Architecture

### Component Hierarchy

```
App.tsx
├── Router
│   ├── Public Routes
│   │   ├── LandingPage
│   │   │   ├── Navbar
│   │   │   ├── Hero Section
│   │   │   ├── Features Section
│   │   │   ├── LiveDemoModal
│   │   │   └── Footer
│   │   ├── LoginPage
│   │   │   └── OTPInput
│   │   ├── RegisterPage
│   │   ├── ForgotPasswordPage
│   │   └── ResetPasswordPage
│   │
│   └── Protected Routes
│       ├── Layout
│       │   ├── Navigation (Sidebar)
│       │   │   ├── ThemeToggle
│       │   │   └── User Menu
│       │   └── Main Content
│       │       ├── DashboardPage
│       │       ├── ErrorAnalysisPage
│       │       ├── SubscriptionPage
│       │       ├── ProfilePage
│       │       └── AccountSettings
```

### State Management (Zustand)

```typescript
// Store Structure
stores/
├── authStore.ts          // Authentication state
│   ├── user              // Current user data
│   ├── isAuthenticated   // Auth status
│   ├── login()           // Login action
│   ├── logout()          // Logout action
│   └── checkAuth()       // Validate session
│
├── errorStore.ts         // Error analysis state
│   ├── analyses          // Error history
│   ├── currentAnalysis   // Active analysis
│   ├── analyzeError()    // Create analysis
│   └── getHistory()      // Fetch history
│
├── themeStore.ts         // UI theme state
│   ├── isDarkMode        // Theme preference
│   └── toggleTheme()     // Switch theme
│
└── uiStore.ts            // UI state
    ├── modals            // Modal visibility
    ├── toasts            // Toast messages
    └── loading           // Loading states
```

---

## 🔄 Data Flow

### Authentication Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Submit credentials
     ▼
┌──────────────────┐
│  LoginPage       │
└────┬─────────────┘
     │ 2. authService.login()
     ▼
┌──────────────────┐
│  API Client      │
└────┬─────────────┘
     │ 3. POST /api/auth/login
     ▼
┌──────────────────┐
│  Backend API     │
│  - Validate      │
│  - Generate JWT  │
│  - Set cookies   │
└────┬─────────────┘
     │ 4. Return tokens + user
     ▼
┌──────────────────┐
│  authStore       │
│  - Save tokens   │
│  - Update state  │
└────┬─────────────┘
     │ 5. Redirect to /dashboard
     ▼
┌──────────────────┐
│  Protected Route │
└──────────────────┘
```

### Error Analysis Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Submit error message
     ▼
┌──────────────────┐
│  DashboardPage   │
└────┬─────────────┘
     │ 2. errorStore.analyzeError()
     ▼
┌──────────────────┐
│  Error Service   │
└────┬─────────────┘
     │ 3. POST /api/errors/analyze
     │    Headers: Authorization: Bearer <token>
     ▼
┌──────────────────┐
│  Backend API     │
│  - Verify JWT    │
│  - Check tier    │
│  - Call AI       │
└────┬─────────────┘
     │ 4. Return analysis
     ▼
┌──────────────────┐
│  errorStore      │
│  - Save analysis │
│  - Update UI     │
└────┬─────────────┘
     │ 5. Display results
     ▼
┌──────────────────┐
│  UI Components   │
└──────────────────┘
```

### Demo Session Flow (Public)

```
┌──────────┐
│ Visitor  │
└────┬─────┘
     │ 1. Click "Try Live Demo"
     ▼
┌──────────────────┐
│ LiveDemoModal    │
└────┬─────────────┘
     │ 2. POST /api/public/demo/analyze
     │    (No authentication)
     ▼
┌──────────────────┐
│  Backend API     │
│  - Get/create    │
│    session ID    │
│  - Check limit   │
│  - Use PRO AI    │
└────┬─────────────┘
     │ 3. Return analysis + demo info
     │    Set-Cookie: demo_session_id
     ▼
┌──────────────────┐
│ LiveDemoModal    │
│  - Show results  │
│  - Show counter  │
│  - CTA banner    │
└──────────────────┘
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  subscription_tier VARCHAR(20) DEFAULT 'free',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Error Analyses Table
```sql
CREATE TABLE error_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  error_message TEXT NOT NULL,
  error_type VARCHAR(50),
  explanation TEXT,
  solution TEXT,
  code_example TEXT,
  category VARCHAR(50),
  confidence FLOAT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  plan_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Security Architecture

### Authentication Strategy

1. **JWT Access Tokens**
   - Short-lived (15 minutes)
   - Stored in localStorage
   - Sent in Authorization header

2. **Refresh Tokens**
   - Long-lived (7 days)
   - Stored in HttpOnly cookies
   - Used to obtain new access tokens

3. **Session Management**
   - Redis for session storage
   - IP-based rate limiting
   - Session ID hashing (SHA-256)

### Authorization Layers

```
Request Flow:
1. Client sends request with JWT
2. API Gateway validates token signature
3. Middleware checks token expiration
4. Authorization layer checks user permissions
5. Route handler executes business logic
```

---

## 🚀 Performance Optimizations

### Frontend
- **Code Splitting**: React.lazy() for route-based splitting
- **Memoization**: React.memo() for expensive components
- **Bundle Optimization**: Vite's built-in tree-shaking
- **Asset Optimization**: Image lazy loading, CDN delivery

### Backend
- **Caching**: Redis for session and frequent queries
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Sequelize connection pool management
- **Rate Limiting**: Prevents abuse and ensures fair usage

---

## 📊 Monitoring & Observability

### Key Metrics
- **API Response Time**: Target < 200ms
- **Error Rate**: Target < 1%
- **Uptime**: Target 99.9%
- **Cache Hit Ratio**: Target > 80%

### Logging Strategy
```typescript
// Structured logging format
{
  timestamp: "2025-10-29T10:30:00Z",
  level: "info",
  service: "api",
  endpoint: "/api/errors/analyze",
  user_id: "uuid",
  duration_ms: 150,
  status: 200
}
```

---

## 🔄 Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Load balancer (NGINX)
- Multiple backend instances
- Shared Redis cache

### Vertical Scaling
- Database query optimization
- AI service response caching
- CDN for static assets
- Efficient bundle sizes

---

## 📝 Technology Decisions

### Why React 18?
- Modern hooks API
- Concurrent features
- Excellent TypeScript support
- Large ecosystem

### Why Zustand over Redux?
- Simpler API
- Less boilerplate
- Better TypeScript inference
- Smaller bundle size

### Why Vite over CRA?
- Faster development server
- Instant HMR
- Better build performance
- Modern tooling

### Why PostgreSQL?
- ACID compliance
- JSON support for flexible schemas
- Robust ecosystem
- Excellent performance

---

*Last Updated: October 29, 2025*
