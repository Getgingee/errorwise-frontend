import { apiClient } from './api';

export interface TrialStatus {
  hasActiveTrial: boolean;
  trialStatus: 'none' | 'pending' | 'active' | 'converted' | 'cancelled' | 'expired';
  trialPlan: string | null;
  trialStartDate: string | null;
  trialEndDate: string | null;
  daysRemaining: number;
  hoursRemaining: number;
  canStartTrial: boolean;
  canCancelTrial: boolean;
  willAutoCharge: boolean;
  chargeAmount: number;
  chargeCurrency: string;
  eligibilityReason?: string;
  paymentMethodCaptured?: boolean;
  convertedAt?: string;
  cancelledAt?: string;
}

export interface TrialEligibility {
  eligible: boolean;
  reason: string;
  code: string;
  plans: {
    id: string;
    name: string;
    price: number;
    trialDays: number;
  }[];
}

export interface TrialStartResponse {
  success: boolean;
  message: string;
  checkoutUrl: string;
  sessionId: string;
  plan: {
    id: string;
    name: string;
    price: number;
    trialDays: number;
  };
}

export interface TrialVerifyResponse {
  success: boolean;
  message: string;
  trial?: {
    status: string;
    plan: string;
    startDate: string;
    endDate: string;
    daysRemaining: number;
  };
  status?: string;
}

class TrialService {
  /**
   * Start trial checkout flow
   * Returns a checkout URL to redirect user to Dodo Payments
   */
  async startTrial(planId: 'pro' | 'team' = 'pro'): Promise<TrialStartResponse> {
    try {
      const response = await apiClient.post<TrialStartResponse>('/trial/start', { planId });
      return response.data || response;
    } catch (error: any) {
      console.error('Start trial error:', error);
      throw new Error(error.response?.data?.error || 'Failed to start trial');
    }
  }

  /**
   * Get current trial status
   */
  async getTrialStatus(): Promise<{ trial: TrialStatus; user: { tier: string; status: string } }> {
    try {
      const response = await apiClient.get('/trial/status');
      return response.data || response;
    } catch (error: any) {
      console.error('Get trial status error:', error);
      throw new Error(error.response?.data?.error || 'Failed to get trial status');
    }
  }

  /**
   * Cancel active trial
   */
  async cancelTrial(reason?: string): Promise<{ success: boolean; message: string; newTier: string }> {
    try {
      const response = await apiClient.post('/trial/cancel', { reason });
      return response.data || response;
    } catch (error: any) {
      console.error('Cancel trial error:', error);
      throw new Error(error.response?.data?.error || 'Failed to cancel trial');
    }
  }

  /**
   * Verify trial checkout completion
   */
  async verifyTrialCheckout(sessionId: string): Promise<TrialVerifyResponse> {
    try {
      const response = await apiClient.post('/trial/verify', { sessionId });
      return response.data || response;
    } catch (error: any) {
      console.error('Verify trial error:', error);
      throw new Error(error.response?.data?.error || 'Failed to verify trial');
    }
  }

  /**
   * Check trial eligibility
   */
  async checkEligibility(): Promise<TrialEligibility> {
    try {
      const response = await apiClient.get('/trial/eligibility');
      return response.data || response;
    } catch (error: any) {
      console.error('Check eligibility error:', error);
      throw new Error(error.response?.data?.error || 'Failed to check eligibility');
    }
  }
}

export const trialService = new TrialService();
export default trialService;
