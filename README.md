# ErrorWise Frontend

## Overview
A modern React TypeScript frontend for the ErrorWise error analysis platform.

## Technology Stack
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router v6** for navigation
- **Zustand** for state management
- **Axios** for API communication

## Project Structure

### Core Files
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main application component with routing
- `src/index.css` - Global styles with Tailwind

### Type Definitions (`src/types/`)
- `auth.ts` - Authentication types (User, LoginRequest, RegisterRequest)
- `error.ts` - Error analysis types (ErrorAnalysis, AnalysisRequest)
- `subscription.ts` - Subscription types (Subscription, Plan)
- `api.ts` - API response types

### Services (`src/services/`)
- `auth.ts` - Authentication API calls
- `error.ts` - Error analysis API calls
- `subscription.ts` - Subscription API calls
- `user.ts` - User management API calls

### State Management (`src/store/`)
- `authStore.ts` - Authentication state (login, register, logout)
- `errorStore.ts` - Error history and analysis state
- `uiStore.ts` - UI state (theme, modals, toasts)

### UI Components (`src/components/UI/`)
- `Button.tsx` - Reusable button component with variants
- `Input.tsx` - Form input component with validation
- `Modal.tsx` - Modal component with backdrop
- `Toast.tsx` - Toast notification component
- `LoadingSpinner.tsx` - Loading spinner component

### Pages (`src/pages/`)
- `LoginPage.tsx` - User login with form validation
- `RegisterPage.tsx` - User registration
- `DashboardPage.tsx` - Main dashboard with error analysis

### Hooks (`src/hooks/`)
- `useToast.ts` - Toast notification management
- `useLocalStorage.ts` - LocalStorage state persistence

## Features

### Authentication
- JWT-based authentication
- Login/Register forms with validation
- Protected routes
- Automatic token refresh
- Persistent login state

### Error Analysis
- Paste error messages for AI analysis
- View detailed explanations and solutions
- Error categorization and severity levels
- History of analyzed errors

### UI/UX
- Responsive design with Tailwind CSS
- Dark/light theme support
- Toast notifications
- Loading states
- Form validation with error messages
- Modal dialogs

### State Management
- Zustand stores for different app domains
- Persistent authentication state
- Error history management
- UI state (modals, toasts, theme)

## Configuration

### Vite Configuration
- TypeScript support
- React plugin
- Development server setup

### Tailwind Configuration
- Custom color scheme
- Font configuration (Inter)
- Component utilities

### TypeScript Configuration
- Strict type checking
- Path mapping
- JSX configuration

## Next Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## API Integration
The frontend is configured to work with the ErrorWise backend API:
- Base URL: `http://localhost:5000/api`
- JWT token handling
- Request/response interceptors
- Error handling

## Development Notes
- All TypeScript errors shown are due to missing dependencies
- Components follow React best practices
- State management with Zustand for simplicity
- Comprehensive type definitions for type safety
- Modular component architecture
- Responsive design patterns