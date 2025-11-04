/**
 * Support Service
 * Handles feedback, contact messages, and help tickets
 */

import { API_ENDPOINTS, buildApiUrl } from '@/config/api';

// ==================== TYPES ====================

export interface FeedbackData {
  feedback_type: 'feature_request' | 'bug_report' | 'general_feedback' | 'improvement_suggestion';
  subject?: string;
  message: string;
  rating?: number;
  email?: string;
  name?: string;
}

export interface ContactMessageData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  message_type?: 'general' | 'sales' | 'support' | 'partnership' | 'enterprise';
}

export interface HelpTicketData {
  category: 'getting_started' | 'api_integration' | 'billing_subscriptions' | 'troubleshooting' | 
           'security_privacy' | 'account_management' | 'technical_issue' | 'feature_request' | 'other';
  subject: string;
  description: string;
  email?: string;
  name?: string;
}

export interface TicketResponse {
  message: string;
  email?: string;
  name?: string;
}

// ==================== SERVICE ====================

class SupportService {
  /**
   * Submit feedback
   */
  async submitFeedback(data: FeedbackData) {
    try {
      const response = await fetch(API_ENDPOINTS.support.feedback, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit feedback');
      }

      return await response.json();
    } catch (error) {
      console.error('Feedback submission error:', error);
      throw error;
    }
  }

  /**
   * Submit contact message
   */
  async submitContactMessage(data: ContactMessageData) {
    try {
      const response = await fetch(API_ENDPOINTS.support.contact, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit contact message');
      }

      return await response.json();
    } catch (error) {
      console.error('Contact message submission error:', error);
      throw error;
    }
  }

  /**
   * Create help ticket
   */
  async createHelpTicket(data: HelpTicketData) {
    try {
      const response = await fetch(API_ENDPOINTS.support.helpTickets, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create help ticket');
      }

      return await response.json();
    } catch (error) {
      console.error('Help ticket creation error:', error);
      throw error;
    }
  }

  /**
   * Get user's help tickets
   */
  async getUserTickets(email?: string) {
    try {
      const url = new URL(buildApiUrl('/api/support/help/tickets/me'));
      if (email) {
        url.searchParams.append('email', email);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch tickets');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch tickets error:', error);
      throw error;
    }
  }

  /**
   * Get specific ticket details
   */
  async getTicketDetails(ticketNumber: string) {
    try {
      const response = await fetch(buildApiUrl(`/api/support/help/tickets/${ticketNumber}`));

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch ticket details');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch ticket details error:', error);
      throw error;
    }
  }

  /**
   * Add response to ticket
   */
  async addTicketResponse(ticketNumber: string, data: TicketResponse) {
    try {
      const response = await fetch(buildApiUrl(`/api/support/help/tickets/${ticketNumber}/responses`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add response');
      }

      return await response.json();
    } catch (error) {
      console.error('Add ticket response error:', error);
      throw error;
    }
  }

  /**
   * Get help articles
   */
  async getHelpArticles(params?: { category?: string; search?: string; limit?: number }) {
    try {
      const url = new URL(API_ENDPOINTS.support.helpArticles);
      
      if (params?.category) url.searchParams.append('category', params.category);
      if (params?.search) url.searchParams.append('search', params.search);
      if (params?.limit) url.searchParams.append('limit', params.limit.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch help articles');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch help articles error:', error);
      throw error;
    }
  }

  /**
   * Get single help article
   */
  async getHelpArticle(slug: string) {
    try {
      const response = await fetch(buildApiUrl(`/api/support/help/articles/${slug}`));

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch help article');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch help article error:', error);
      throw error;
    }
  }

  /**
   * Rate help article
   */
  async rateHelpArticle(slug: string, helpful: boolean) {
    try {
      const response = await fetch(buildApiUrl(`/api/support/help/articles/${slug}/rate`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ helpful }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to rate article');
      }

      return await response.json();
    } catch (error) {
      console.error('Rate article error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const supportService = new SupportService();
