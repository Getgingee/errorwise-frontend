/**
 * API Configuration
 * Centralized API base URL configuration
 */

// Get base URL from environment variable or use default
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// API endpoints
export const API_ENDPOINTS = {
  // Content endpoints
  content: {
    privacy: `${API_BASE_URL}/api/content/privacy`,
    terms: `${API_BASE_URL}/api/content/terms`,
    about: `${API_BASE_URL}/api/content/about`,
    community: `${API_BASE_URL}/api/content/community`,
  },
  
  // Support endpoints
  support: {
    feedback: `${API_BASE_URL}/api/support/feedback`,
    contact: `${API_BASE_URL}/api/support/contact`,
    helpTickets: `${API_BASE_URL}/api/support/help/tickets`,
    helpArticles: `${API_BASE_URL}/api/support/help/articles`,
  },
  
  // Newsletter endpoints
  newsletter: {
    subscribe: `${API_BASE_URL}/api/support/newsletter/subscribe`,
    unsubscribe: (token: string) => `${API_BASE_URL}/api/support/newsletter/unsubscribe/${token}`,
    status: `${API_BASE_URL}/api/support/newsletter/status`,
  },
} as const;

// Helper to build full URL
export const buildApiUrl = (path: string): string => {
  return `${API_BASE_URL}${path}`;
};
