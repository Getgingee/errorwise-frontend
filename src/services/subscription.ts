import { apiClient } from './api';

export interface Plan {
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

export interface ApiResponse<T> {  plans?: T;
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CheckoutSession {
  url: string;
  sessionId: string;
}


// Additional interfaces
export interface SubscriptionData {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
  tier?: 'free' | 'pro' | 'team'; // Added tier field for frontend usage
  subscription?: any;
  plan?: any;
  usage?: Usage;
  canUpgrade?: boolean;
  canDowngrade?: boolean;
}

export interface Usage {
  daily_queries_used: number;
  daily_queries_limit: number;
  period_start: string;
  period_end: string;
  queriesUsed: number;
  dailyLimit: number;
  queriesRemaining: number;
  resetTime?: string;
  limitReached?: boolean;
}
export class SubscriptionService {

  /**
   * Get subscription details
   */
  async getSubscription(): Promise<any> {
    try {
      const response = await apiClient.get<any>('/subscriptions');
      // Backend returns data directly (user, subscription, plan, usage)
      // NOT wrapped in {success, data}
      return response;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }

  /**
   * Create subscription/checkout
   */
  async createSubscription(planId: string): Promise<ApiResponse<CheckoutSession>> {
    return this.createCheckoutSession(planId);
  }

  /**
   * Verify payment after checkout
   */
  async verifyPayment(sessionId: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post('/subscriptions/verify-payment', { sessionId });
      return response;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return { success: false, error: 'Failed to verify payment' };
    }
  }
  /**
   * Get all available subscription plans
   */
  async getPlans(): Promise<ApiResponse<Plan[]>> {
    try {
      const response = await apiClient.get<Plan[]>('/subscriptions/plans');
  return response.data as unknown as ApiResponse<Plan[]>;
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
      const response = await apiClient.get('/subscriptions/current');
  return response.data as unknown as ApiResponse<any>;
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
      const response = await apiClient.post<CheckoutSession>('/subscriptions/checkout', {
        planId,
        successUrl: `${window.location.origin}/dashboard?payment=success`,
        cancelUrl: `${window.location.origin}/subscriptions`
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
      const response = await apiClient.post('/subscriptions/upgrade', {
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
      const response = await apiClient.post('/subscriptions/cancel');
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
      const response = await apiClient.get('/subscriptions/billing');
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
      const response = await apiClient.get('/subscriptions/usage');
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
      const response = await apiClient.get('/subscriptions/history');
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
      const response = await apiClient.get('/subscriptions/upgrade-options');
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








