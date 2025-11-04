/**
 * Newsletter Service
 * Handles newsletter subscription operations
 */

import { API_ENDPOINTS } from '@/config/api';

export interface NewsletterSubscription {
  email: string;
  name?: string;
  subscription_type?: 'general' | 'product_updates' | 'tips' | 'all';
  source?: 'website' | 'footer' | 'modal' | 'api';
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  subscription?: {
    id: number;
    email: string;
    name?: string;
    status: string;
    subscription_type: string;
    source: string;
    created_at: string;
  };
  alreadySubscribed?: boolean;
  reactivated?: boolean;
}

export interface NewsletterStatusResponse {
  success: boolean;
  subscribed: boolean;
  subscription?: {
    id: number;
    email: string;
    name?: string;
    status: string;
    subscription_type: string;
    source: string;
    created_at: string;
  };
  message?: string;
}

class NewsletterService {
  /**
   * Subscribe to newsletter
   */
  async subscribe(data: NewsletterSubscription): Promise<NewsletterResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.newsletter.subscribe, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          subscription_type: data.subscription_type || 'general',
          source: data.source || 'website',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to subscribe');
      }

      return await response.json();
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from newsletter
   */
  async unsubscribe(token: string, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.newsletter.unsubscribe(token), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to unsubscribe');
      }

      return await response.json();
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      throw error;
    }
  }

  /**
   * Check subscription status
   */
  async checkStatus(email: string): Promise<NewsletterStatusResponse> {
    try {
      const url = new URL(API_ENDPOINTS.newsletter.status);
      url.searchParams.append('email', email);

      const response = await fetch(url.toString());

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to check status');
      }

      return await response.json();
    } catch (error) {
      console.error('Newsletter status check error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const newsletterService = new NewsletterService();
