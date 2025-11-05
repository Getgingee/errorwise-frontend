import React from 'react';

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  subscription_tier: string;
  plan?: string;
  created_at?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// Error explanation types
export interface ErrorExplanationRequest {
  errorMessage: string;
  context?: {
    language?: string;
    framework?: string;
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
  };
}

export interface ErrorExplanationResponse {
  id: string;
  errorMessage: string;
  explanation: string;
  category: string;
  subcategory?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  solutions?: string[];
  prevention?: string[];
  subscriptionTier: 'free' | 'pro' | 'team';
  aiModel: string;
  aiProvider: 'openai' | 'gemini';
  responseTime: number;
  upgradeMessage?: string;
  created_at: string;
}

// Subscription types - Updated for Dodo Payments
export interface SubscriptionPlan {
  id: 'free' | 'pro' | 'team';
  name: string;
  price: number;
  dodoProductId?: string; // Updated for Dodo Payments
  features: string[];
  limits: {
    daily_queries: number; // -1 for unlimited
  };
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'expired';
  start_date: string;
  end_date?: string;
  details?: string;
  created_at: string;
  updated_at: string;
}

export interface BillingInfo {
  currentPlan: SubscriptionPlan;
  subscription?: Subscription;
  dodoCustomerId?: string; // Updated for Dodo Payments
  availablePlans: SubscriptionPlan[];
  dodoSubscription?: { // Updated for Dodo Payments
    id: string;
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  };
}

// Error history types
export interface ErrorHistoryItem {
  id: string;
  errorMessage: string;
  explanation: string;
  category: string;
  severity: string;
  aiModel: string;
  responseTime: number;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// User settings types
export interface UserSettings {
  id: string;
  user_id: string;
  ai_model_preference: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4o' | 'gemini-pro';
  explanation_detail_level: 'basic' | 'detailed' | 'comprehensive';
  email_notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'es' | 'fr' | 'de';
  created_at: string;
  updated_at: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

// UI state types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  requiresAuth?: boolean;
  requiresPro?: boolean;
}

// Component props types
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}



export interface InputProps {
  label?: string;
  error?: string;
  helperText?: string; // Added helperText support
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Feature flags
export interface FeatureFlags {
  enableAdvancedAnalytics: boolean;
  enableTeamFeatures: boolean;
  enableCodeSuggestions: boolean;
  enableRealTimeCollaboration: boolean;
}

// Dodo Payments specific types
export interface DodoCheckoutSession {
  sessionId: string;
  url: string;
}

export interface DodoPaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  };
}

export default {};

