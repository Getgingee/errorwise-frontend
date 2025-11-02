# Development Guide

> **Comprehensive development guide including code style, naming conventions, component patterns, and best practices for ErrorWise development.**

---

## 📚 Table of Contents

1. [Development Setup](#development-setup)
2. [Code Style Guide](#code-style-guide)
3. [Naming Conventions](#naming-conventions)
4. [Component Patterns](#component-patterns)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Testing Standards](#testing-standards)
8. [Git Workflow](#git-workflow)

---

## 🚀 Development Setup

### Prerequisites
```bash
# Required
Node.js >= 18.0.0
npm >= 9.0.0
PostgreSQL >= 14
Redis >= 6.0

# Optional (for development)
VS Code
Git
Postman or similar API testing tool
```

### Installation

#### Frontend Setup
```bash
# Clone repository
git clone https://github.com/CooeyHealth/errorwise-frontend.git
cd errorwise-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

#### Backend Setup
```bash
# Clone repository
git clone https://github.com/CooeyHealth/errorwise-backend.git
cd errorwise-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Run database migrations
npm run migrate

# Start development server
npm start
```

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
VITE_APP_NAME=ErrorWise
VITE_APP_VERSION=1.0.0
```

#### Backend (.env)
```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/errorwise

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email (Optional for dev)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## 📝 Code Style Guide

### TypeScript/JavaScript

#### File Structure
```typescript
// 1. Imports - grouped by type
import React, { useState, useEffect } from 'react';  // React imports
import { useNavigate } from 'react-router-dom';      // Third-party imports
import { Button } from '../components/UI';            // Local imports
import { UserService } from '../services';            // Service imports
import type { User } from '../types';                 // Type imports

// 2. Type definitions
interface Props {
  user: User;
  onUpdate: (user: User) => void;
}

// 3. Component/function
export const UserProfile: React.FC<Props> = ({ user, onUpdate }) => {
  // 4. Hooks
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // 5. Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // 6. Event handlers
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 7. Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

#### Formatting Rules
```typescript
// ✅ GOOD - Use 2 spaces for indentation
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ BAD - Don't use tabs or 4 spaces
function calculateTotal(items: Item[]): number {
    return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ GOOD - Use single quotes for strings
const message = 'Hello, world!';

// ❌ BAD - Don't use double quotes unless necessary
const message = "Hello, world!";

// ✅ GOOD - Use trailing commas
const config = {
  api: 'http://localhost:3001',
  timeout: 5000,
  retries: 3,
};

// ✅ GOOD - Use optional chaining
const userName = user?.profile?.name;

// ❌ BAD - Avoid nested ternaries
const status = user ? user.active ? 'active' : 'inactive' : 'unknown';

// ✅ GOOD - Use early returns
function processUser(user: User | null) {
  if (!user) return null;
  if (!user.isActive) return null;
  
  return user.name;
}
```

#### Comments
```typescript
/**
 * Analyzes error message and returns detailed explanation
 * 
 * @param errorMessage - The error message to analyze
 * @param options - Optional configuration
 * @returns Promise resolving to analysis result
 * @throws {ApiError} When API request fails
 * 
 * @example
 * const result = await analyzeError('TypeError: undefined');
 */
async function analyzeError(
  errorMessage: string,
  options?: AnalysisOptions
): Promise<AnalysisResult> {
  // Implementation
}

// Use inline comments for complex logic
const normalizedData = data
  .filter(item => item.isValid) // Remove invalid items
  .map(item => ({
    ...item,
    // Convert timestamp to ISO format for consistency
    timestamp: new Date(item.timestamp).toISOString(),
  }));
```

---

## 🏷️ Naming Conventions

### Files and Folders
```
✅ GOOD
components/UserProfile.tsx      # PascalCase for components
services/authService.ts         # camelCase for services
hooks/useLocalStorage.ts        # camelCase with 'use' prefix
types/user.ts                   # lowercase for types
utils/formatDate.ts             # camelCase for utilities
constants/API_ENDPOINTS.ts      # UPPER_CASE for constants

❌ BAD
components/user-profile.tsx     # Don't use kebab-case
services/AuthService.ts         # Don't use PascalCase for services
hooks/LocalStorage.ts           # Don't omit 'use' prefix
```

### Variables and Functions
```typescript
// ✅ GOOD - camelCase for variables and functions
const userProfile = getUserProfile();
const isAuthenticated = checkAuth();

// ✅ GOOD - PascalCase for components and classes
class UserService {}
const UserProfile: React.FC = () => {};

// ✅ GOOD - UPPER_CASE for constants
const API_BASE_URL = 'http://localhost:3001';
const MAX_RETRY_ATTEMPTS = 3;

// ✅ GOOD - Boolean prefixes
const isLoading = true;
const hasError = false;
const canEdit = checkPermissions();

// ✅ GOOD - Event handler prefixes
const handleClick = () => {};
const handleSubmit = () => {};
const handleChange = () => {};

// ❌ BAD - Unclear names
const data = fetchData();        // Too generic
const temp = calculate();        // Abbreviations
const x = getUser();            // Single letters
```

### Types and Interfaces
```typescript
// ✅ GOOD - PascalCase with descriptive names
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

// ✅ GOOD - Props suffix for component props
interface UserCardProps {
  user: User;
  onEdit: () => void;
}

// ✅ GOOD - Enum values in UPPER_CASE
enum SubscriptionTier {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}
```

---

## 🎨 Component Patterns

### Functional Components
```typescript
// ✅ GOOD - Use FC type and explicit props interface
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  onClick,
  children,
  disabled = false,
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

### Custom Hooks
```typescript
// ✅ GOOD - Hook pattern with cleanup
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // State to store value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}
```

### Container/Presenter Pattern
```typescript
// Container - Handles logic and data
export const UserProfileContainer: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const data = await userService.getProfile();
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (updates: Partial<User>) => {
    try {
      const updated = await userService.updateProfile(updates);
      setUser(updated);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <ErrorMessage />;

  return <UserProfilePresenter user={user} onUpdate={handleUpdate} />;
};

// Presenter - Pure presentation
interface UserProfilePresenterProps {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
}

export const UserProfilePresenter: React.FC<UserProfilePresenterProps> = ({
  user,
  onUpdate,
}) => {
  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={() => onUpdate({ name: 'New Name' })}>
        Edit Profile
      </button>
    </div>
  );
};
```

---

## 🗄️ State Management

### Zustand Store Pattern
```typescript
// stores/authStore.ts
interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Actions
  login: async (credentials) => {
    try {
      const response = await authService.login(credentials);
      set({
        user: response.user,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isLoading: false });
        return;
      }

      const user = await authService.getProfile();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateUser: (updates) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, ...updates } });
    }
  },
}));
```

### Using Stores in Components
```typescript
// ✅ GOOD - Select only needed state
const DashboardPage: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  // Component logic
};

// ❌ BAD - Don't select entire store
const DashboardPage: React.FC = () => {
  const authStore = useAuthStore(); // Causes unnecessary re-renders
};
```

---

## 🌐 API Integration

### Service Pattern
```typescript
// services/errorService.ts
class ErrorService {
  /**
   * Analyze error message
   */
  async analyzeError(data: AnalysisRequest): Promise<AnalysisResult> {
    const response = await apiClient.post<AnalysisResult>(
      '/errors/analyze',
      data
    );
    return response.data;
  }

  /**
   * Get error analysis history
   */
  async getHistory(params?: HistoryParams): Promise<AnalysisHistory> {
    const response = await apiClient.get<AnalysisHistory>(
      '/errors/history',
      params
    );
    return response.data;
  }

  /**
   * Delete analysis
   */
  async deleteAnalysis(id: string): Promise<void> {
    await apiClient.delete(`/errors/${id}`);
  }
}

export const errorService = new ErrorService();
```

### Error Handling
```typescript
// ✅ GOOD - Proper error handling with user feedback
const handleAnalyze = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const result = await errorService.analyzeError({
      errorMessage: input,
      errorType: 'runtime',
    });
    
    setResult(result);
    toast.success('Analysis complete!');
  } catch (error) {
    const message = error instanceof ApiError
      ? error.message
      : 'Failed to analyze error';
    
    setError(message);
    toast.error(message);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🧪 Testing Standards

### Unit Tests
```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button onClick={() => {}} disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Integration Tests
```typescript
// authService.test.ts
import { authService } from './authService';
import { apiClient } from './api';

jest.mock('./api');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('logs in successfully with valid credentials', async () => {
      const mockResponse = {
        data: {
          user: { id: '1', email: 'test@example.com' },
          token: 'token123',
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.user.email).toBe('test@example.com');
      expect(localStorage.getItem('token')).toBe('token123');
    });
  });
});
```

---

## 🔀 Git Workflow

### Branch Naming
```bash
# Feature branches
feature/user-authentication
feature/error-analysis-page

# Bug fixes
fix/login-redirect-issue
fix/api-timeout-handling

# Hotfixes
hotfix/security-vulnerability
hotfix/payment-processing

# Chores
chore/update-dependencies
chore/refactor-auth-service
```

### Commit Messages
```bash
# Format: <type>(<scope>): <subject>

# ✅ GOOD
feat(auth): add password reset functionality
fix(api): handle network timeout errors
docs(readme): update installation instructions
style(dashboard): apply glassmorphic design
refactor(stores): simplify auth state management
test(button): add unit tests for Button component

# ❌ BAD
updated files
fix bug
WIP
asdf
```

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] No console errors

## Screenshots
[Add screenshots if UI changes]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

---

## 📋 Code Review Checklist

### For Authors
- [ ] Code is self-documenting with clear variable/function names
- [ ] Complex logic has explanatory comments
- [ ] No console.log statements in production code
- [ ] Error handling is comprehensive
- [ ] Types are properly defined (no `any` unless necessary)
- [ ] Tests cover new functionality
- [ ] Documentation is updated

### For Reviewers
- [ ] Code meets style guidelines
- [ ] Logic is sound and efficient
- [ ] Edge cases are handled
- [ ] Security concerns addressed
- [ ] Performance implications considered
- [ ] Tests are meaningful
- [ ] Changes don't break existing functionality

---

*Last Updated: October 29, 2025*
