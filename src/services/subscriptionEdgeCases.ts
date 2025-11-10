import { apiClient } from './api';

// ============================================================================
// SUBSCRIPTION EDGE CASE SERVICES
// ============================================================================

export interface ProrationPreview {
  currentTier: string;
  newTier: string;
  prorationAmount: number;
  daysRemaining: number;
  nextBillingDate: string;
}

export interface SubscriptionUpgradeRequest {
  newTier: 'pro' | 'team';
}

export interface SubscriptionDowngradeRequest {
  newTier: 'free' | 'pro';
  immediate?: boolean;
}

/**
 * Get proration preview for subscription upgrade/downgrade
 */
export const getProrationPreview = async (newTier: string): Promise<ProrationPreview> => {
  const response = await apiClient.get<ProrationPreview>(
    `/api/subscriptions/proration-preview?newTier=``
  );
  return response.data;
};

/**
 * Upgrade subscription tier with proration
 */
export const upgradeSubscription = async (newTier: 'pro' | 'team'): Promise<any> => {
  const response = await apiClient.post('/api/subscriptions/upgrade', { newTier });
  return response.data;
};

/**
 * Downgrade subscription tier (immediate or scheduled)
 */
export const downgradeSubscription = async (
  newTier: 'free' | 'pro',
  immediate: boolean = false
): Promise<any> => {
  const response = await apiClient.post('/api/subscriptions/downgrade', {
    newTier,
    immediate,
  });
  return response.data;
};

/**
 * Pause subscription (stops billing, retains access until period end)
 */
export const pauseSubscription = async (): Promise<any> => {
  const response = await apiClient.post('/api/subscriptions/pause');
  return response.data;
};

/**
 * Resume paused subscription
 */
export const resumeSubscription = async (): Promise<any> => {
  const response = await apiClient.post('/api/subscriptions/resume');
  return response.data;
};

/**
 * Handle payment failure manually (for testing)
 */
export const triggerPaymentFailure = async (): Promise<any> => {
  const response = await apiClient.post('/api/subscriptions/payment-failure');
  return response.data;
};
