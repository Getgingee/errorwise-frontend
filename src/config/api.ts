/**
 * API Configuration
 * Centralized API base URL configuration
 * 
 * CHANGE THIS ONE URL TO UPDATE ENTIRE APP!
 */

// Get base URL from environment variable or use default
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://errorwise-backend-production.up.railway.app/api';

// API endpoints - organized by feature
export const API_ENDPOINTS = {
  // Authentication endpoints
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    profile: `${API_BASE_URL}/users/profile`,
  },

  // Error analysis endpoints
  errors: {
    analyze: `${API_BASE_URL}/errors/analyze`,
    history: `${API_BASE_URL}/errors/history`,
    recent: `${API_BASE_URL}/errors/recent`,
  },

  // Subscription endpoints
  subscriptions: {
    plans: `${API_BASE_URL}/subscriptions/plans`,
    current: `${API_BASE_URL}/subscriptions/current`,
    upgrade: `${API_BASE_URL}/subscriptions`,
  },

  // Content endpoints
  content: {
    privacy: `${API_BASE_URL}/content/privacy`,
    terms: `${API_BASE_URL}/content/terms`,
    about: `${API_BASE_URL}/content/about`,
    community: `${API_BASE_URL}/content/community`,
  },

  // Support endpoints
  support: {
    feedback: `${API_BASE_URL}/support/feedback`,
    contact: `${API_BASE_URL}/support/contact`,
    helpTickets: `${API_BASE_URL}/support/help/tickets`,
    helpArticles: `${API_BASE_URL}/support/help/articles`,
  },

  // Newsletter endpoints
  newsletter: {
    subscribe: `${API_BASE_URL}/support/newsletter/subscribe`,
    unsubscribe: (token: string) => `${API_BASE_URL}/support/newsletter/unsubscribe/${token}`,
    status: `${API_BASE_URL}/support/newsletter/status`,
  },
} as const;

// Helper to build full URL for custom endpoints
export const buildApiUrl = (path: string): string => {
  return `${API_BASE_URL}${path}`;
};
