import { apiClient } from './api';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  limits: {
    daily_queries: number;
    explanation_type: string;
    solutions_provided: boolean;
    team_features: boolean;
    video_chat: boolean;
    video_session_duration?: number;
    max_team_members?: number;
    min_team_members?: number;
  };
  popular?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface CheckoutSession {
  url: string;
  sessionId: string;
}

export class SubscriptionService {
  /**
   * Get all available subscription plans
   */
  async getPlans(): Promise<ApiResponse<Plan[]>> {
    try {
      const response = await apiClient.get<Plan[]>('/subscription/plans');
      return response;
    } catch (error) {
      console.error('Error fetching plans:', error);
      return { 
        success: false, 
        error: 'Failed to fetch subscription plans',
        data: []
      };
    }
  }

  /**
   * Get current user's subscription
   */
  async getCurrentSubscription(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get('/subscription');
      return response;
    } catch (error) {
      console.error('Error fetching current subscription:', error);
      return { 
        success: false, 
        error: 'Failed to fetch subscription' 
      };
    }
  }

  /**
   * Create checkout session for plan upgrade
   */
  async createCheckoutSession(planId: string): Promise<ApiResponse<CheckoutSession>> {
    try {
      const response = await apiClient.post<CheckoutSession>('/subscription/checkout', {
        planId,
        successUrl: `${window.location.origin}/dashboard?upgraded=true`,
        cancelUrl: `${window.location.origin}/subscription`
      });
      return response;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return { 
        success: false, 
        error: 'Failed to create checkout session' 
      };
    }
  }

  /**
   * Upgrade subscription to a new plan
   */
  async upgradePlan(planId: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post('/subscription/upgrade', {
        planId
      });
      return response;
    } catch (error) {
      console.error('Error upgrading plan:', error);
      return { 
        success: false, 
        error: 'Failed to upgrade plan' 
      };
    }
  }

  /**
   * Cancel current subscription
   */
  async cancelSubscription(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post('/subscription/cancel');
      return response;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return { 
        success: false, 
        error: 'Failed to cancel subscription' 
      };
    }
  }

  /**
   * Get billing information
   */
  async getBillingInfo(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get('/subscription/billing');
      return response;
    } catch (error) {
      console.error('Error fetching billing info:', error);
      return { 
        success: false, 
        error: 'Failed to fetch billing information' 
      };
    }
  }

  /**
   * Get subscription usage statistics
   */
  async getUsageStats(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get('/subscription/usage');
      return response;
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      return { 
        success: false, 
        error: 'Failed to fetch usage statistics' 
      };
    }
  }

  /**
   * Get subscription history
   */
  async getSubscriptionHistory(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get('/subscription/history');
      return response;
    } catch (error) {
      console.error('Error fetching subscription history:', error);
      return { 
        success: false, 
        error: 'Failed to fetch subscription history' 
      };
    }
  }

  /**
   * Get upgrade options for current user
   */
  async getUpgradeOptions(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get('/subscription/upgrade-options');
      return response;
    } catch (error) {
      console.error('Error fetching upgrade options:', error);
      return { 
        success: false, 
        error: 'Failed to fetch upgrade options' 
      };
    }
  }

  /**
   * Format price for display
   */
  formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  }

  /**
   * Check if user is on a specific plan
   */
  isOnPlan(userPlan: string, targetPlan: string): boolean {
    return userPlan === targetPlan;
  }

  /**
   * Get plan display name
   */
  getPlanDisplayName(planId: string): string {
    const planNames: { [key: string]: string } = {
      free: 'Free',
      pro: 'Pro',
      team: 'Team'
    };
    return planNames[planId] || planId;
  }
}

export const subscriptionService = new SubscriptionService();
export default subscriptionService;
