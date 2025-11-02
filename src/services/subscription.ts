/**
 * Subscription API Client
 * Handles all subscription-related API calls
 */

import axios, { AxiosError } from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Types
export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  trialDays: number;
  features: {
    dailyQueries: number;
    monthlyQueries?: number;
    errorExplanation: boolean;
    fixSuggestions: boolean;
    codeExamples: boolean;
    documentationLinks: boolean;
    errorHistory: string;
    teamFeatures: boolean;
    aiProvider: string;
    maxTokens: number;
    supportLevel: string;
    advancedAnalysis: boolean;
    priorityQueue: boolean;
    multiLanguageSupport?: boolean;
    exportHistory?: boolean;
    apiAccess?: boolean;
    customIntegrations?: boolean;
  };
  popular?: boolean;
  description?: string;
  dodo_plan_id?: string;
}

export interface Subscription {
  tier: 'free' | 'pro' | 'team';
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'past_due';
  startDate: string;
  endDate: string;
  trialEndsAt?: string;
  isActive: boolean;
  isTrial: boolean;
}

export interface Usage {
  queriesUsed: number;
  queriesRemaining: number | 'unlimited';
  dailyLimit: number | 'unlimited';
  resetTime: string | null;
  planType: string;
  limitReached?: boolean;
}

export interface SubscriptionData {
  user: {
    id: string;
    email: string;
    username: string;
  };
  subscription: Subscription;
  plan: {
    name: string;
    price: number;
    interval: string;
    features: Plan['features'];
  };
  usage: Usage;
  canUpgrade: boolean;
  canDowngrade: boolean;
}

export interface CreateSubscriptionPayload {
  planId: 'pro' | 'team';
  successUrl: string;
  cancelUrl: string;
  skipPayment?: boolean; // For development only
}

export interface CreateSubscriptionResponse {
  message: string;
  sessionId: string;
  sessionUrl: string;
  plan: {
    id: string;
    name: string;
    price: number;
    interval: string;
    trialDays: number;
  };
}

export interface VerifyPaymentResponse {
  success: boolean;
  subscription: Subscription & {
    features: Plan['features'];
  };
}

class SubscriptionService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Get all available subscription plans
   */
  async getPlans(): Promise<{ plans: Plan[] }> {
    try {
      const { data } = await axios.get(`${API_BASE}/api/subscriptions/plans`);
      return data;
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get current user's subscription details
   */
  async getSubscription(): Promise<SubscriptionData> {
    try {`n      console.log(' API Request: GET', `${API_BASE}/api/subscriptions);`n      const token = localStorage.getItem('token');`n      console.log(' Token present:', !!token);
      const { data } = await axios.get(`${API_BASE}/api/subscriptions`, {
        headers: this.getAuthHeaders()
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create a new subscription (upgrade)
   */
  async createSubscription(payload: CreateSubscriptionPayload): Promise<CreateSubscriptionResponse> {
    try {
      const { data } = await axios.post(
        `${API_BASE}/api/subscriptions`,
        payload,
        { headers: this.getAuthHeaders() }
      );
      return data;
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Cancel current subscription
   */
  async cancelSubscription(): Promise<{
    message: string;
    subscription: Subscription;
  }> {
    try {
      const { data } = await axios.delete(`${API_BASE}/api/subscriptions`, {
        headers: this.getAuthHeaders()
      });
      return data;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Verify payment after redirect from Dodo
   */
  async verifyPayment(sessionId: string): Promise<VerifyPaymentResponse> {
    try {
      const { data } = await axios.post(
        `${API_BASE}/api/subscriptions/verify-payment`,
        { sessionId },
        { headers: this.getAuthHeaders() }
      );
      return data;
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get usage statistics
   */
  async getUsage(): Promise<{
    tier: string;
    usage: Usage;
    features: Plan['features'];
  }> {
    try {
      const { data } = await axios.get(`${API_BASE}/api/subscriptions/usage`, {
        headers: this.getAuthHeaders()
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch usage:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Error handler
   */
  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error: string; message: string }>;
      const message = axiosError.response?.data?.message || 
                     axiosError.response?.data?.error || 
                     axiosError.message;
      return new Error(message);
    }
    return error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
