# API Configuration Guide

## Overview
All API calls use a dynamic base URL that can be configured via environment variables. This allows the frontend to work with any backend port or domain.

---

## Environment Configuration

### Development (.env.local or .env)
```env
VITE_API_URL=http://localhost:3001
```

### Production
```env
VITE_API_URL=https://api.errorwise.com
```

### Custom Port
```env
VITE_API_URL=http://localhost:5000
```

---

## File Structure

```
src/
├── config/
│   └── api.ts                    # API configuration & endpoints
├── services/
│   ├── contentService.ts         # Content API (privacy, terms, about, community)
│   ├── newsletterService.ts      # Newsletter subscription API
│   └── supportService.ts         # Support API (feedback, contact, tickets)
├── hooks/
│   └── useNewsletter.ts          # React hook for newsletter
└── components/
    └── forms/
        └── NewsletterForm.tsx    # Example newsletter form component
```

---

## Usage Examples

### 1. Content Service

```typescript
import { contentService } from '@/services/contentService';

// Fetch privacy policy
const privacy = await contentService.getPrivacyPolicy();

// Fetch terms
const terms = await contentService.getTermsOfService();

// Fetch about content
const about = await contentService.getAboutContent();

// Fetch community info
const community = await contentService.getCommunityInfo();
```

### 2. Newsletter Service

```typescript
import { newsletterService } from '@/services/newsletterService';

// Subscribe to newsletter
const response = await newsletterService.subscribe({
  email: 'user@example.com',
  name: 'John Doe',
  subscription_type: 'all',
  source: 'footer'
});

// Check subscription status
const status = await newsletterService.checkStatus('user@example.com');

// Unsubscribe
await newsletterService.unsubscribe(token, 'Too many emails');
```

### 3. Support Service

```typescript
import { supportService } from '@/services/supportService';

// Submit feedback
await supportService.submitFeedback({
  feedback_type: 'feature_request',
  subject: 'Add dark mode',
  message: 'Would love to see a dark mode option',
  rating: 5,
  email: 'user@example.com'
});

// Submit contact message
await supportService.submitContactMessage({
  name: 'Jane Smith',
  email: 'jane@company.com',
  subject: 'Partnership inquiry',
  message: 'We would like to discuss...',
  message_type: 'sales'
});

// Create help ticket
await supportService.createHelpTicket({
  category: 'api_integration',
  subject: 'Error connecting to API',
  description: 'I am getting 401 errors...',
  email: 'user@example.com'
});
```

### 4. Using React Hook

```typescript
import { useNewsletter } from '@/hooks/useNewsletter';

function MyComponent() {
  const { subscribe, loading, error, success } = useNewsletter();

  const handleSubscribe = async () => {
    try {
      await subscribe({
        email: 'user@example.com',
        source: 'modal'
      });
    } catch (err) {
      console.error('Subscription failed:', err);
    }
  };

  return (
    <div>
      <button onClick={handleSubscribe} disabled={loading}>
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
      {success && <p>✅ Subscribed successfully!</p>}
      {error && <p>❌ {error}</p>}
    </div>
  );
}
```

### 5. Using Newsletter Form Component

```typescript
import { NewsletterForm } from '@/components/forms/NewsletterForm';

function Footer() {
  return (
    <footer>
      <h3>Subscribe to our newsletter</h3>
      <NewsletterForm source="footer" />
    </footer>
  );
}
```

---

## API Endpoints Reference

All endpoints are automatically configured with the correct base URL:

### Content Endpoints
- `GET /api/content/privacy` - Privacy Policy
- `GET /api/content/terms` - Terms of Service
- `GET /api/content/about` - About page
- `GET /api/content/community` - Community info

### Newsletter Endpoints
- `POST /api/support/newsletter/subscribe` - Subscribe
- `POST /api/support/newsletter/unsubscribe/:token` - Unsubscribe
- `GET /api/support/newsletter/status?email=...` - Check status

### Support Endpoints
- `POST /api/support/feedback` - Submit feedback
- `POST /api/support/contact` - Submit contact message
- `POST /api/support/help/tickets` - Create help ticket
- `GET /api/support/help/articles` - Get help articles

---

## Changing the Backend Port

### Option 1: Environment Variable (Recommended)
Create `.env.local` file:
```env
VITE_API_URL=http://localhost:8080
```

### Option 2: Update api.ts directly
```typescript
// src/config/api.ts
export const API_BASE_URL = 'http://localhost:8080';
```

### Option 3: Runtime Configuration
The app will automatically use `import.meta.env.VITE_API_URL` if set, otherwise defaults to `http://localhost:3001`.

---

## Testing Different Ports

```bash
# Start backend on custom port
cd errorwise-backend
PORT=5000 npm start

# Update frontend environment
cd errorwise-frontend
echo "VITE_API_URL=http://localhost:5000" > .env.local
npm run dev
```

---

## Production Deployment

### Frontend Environment
```env
VITE_API_URL=https://api.errorwise.com
```

### Backend Environment
Set `PORT` in backend `.env`:
```env
PORT=3001
```

---

## Error Handling

All services include proper error handling:

```typescript
try {
  const response = await newsletterService.subscribe({
    email: 'user@example.com'
  });
  
  console.log('✅ Success:', response.message);
} catch (error) {
  console.error('❌ Error:', error.message);
  // Handle error (show toast, alert, etc.)
}
```

---

## TypeScript Support

All services are fully typed with TypeScript interfaces:

```typescript
import { 
  NewsletterSubscription, 
  NewsletterResponse 
} from '@/services/newsletterService';

const data: NewsletterSubscription = {
  email: 'user@example.com',
  name: 'John Doe',
  subscription_type: 'all',
  source: 'footer'
};

const response: NewsletterResponse = await newsletterService.subscribe(data);
```

---

## Benefits of Dynamic Base URL

✅ **Flexibility**: Change backend port without modifying code  
✅ **Environment-specific**: Different URLs for dev/staging/production  
✅ **Easy testing**: Quickly switch between backend instances  
✅ **Maintainability**: Single source of truth for API configuration  
✅ **Type-safe**: Full TypeScript support for all endpoints  

---

## Summary

All API calls now use **dynamic base URLs** configured through:
1. Environment variable: `VITE_API_URL`
2. Centralized config: `src/config/api.ts`
3. Service layer: Clean separation of concerns
4. React hooks: Easy integration with components

No more hardcoded URLs! 🎉
