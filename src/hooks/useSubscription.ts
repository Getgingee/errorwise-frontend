import { useState, useEffect } from 'react';
import subscriptionService, { SubscriptionData } from '../services/subscription';

interface UseSubscriptionResult {
  subscription: SubscriptionData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to get current user's subscription data
 */
export const useSubscription = (): UseSubscriptionResult => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use getSubscription() which calls /subscriptions endpoint
      // Backend returns data directly: { user, subscription, plan, usage }
      const response = await subscriptionService.getSubscription();
      
      if (response && response.subscription) {
        // Extract tier from subscription object and map to SubscriptionData format
        const subscriptionData: SubscriptionData = {
          id: response.subscription.id || '',
          user_id: response.user.id,
          plan_id: response.subscription.tier,
          status: response.subscription.status,
          current_period_start: response.subscription.startDate,
          current_period_end: response.subscription.endDate,
          created_at: response.subscription.startDate,
          updated_at: new Date().toISOString(),
          tier: response.subscription.tier, // This is the critical field!
          subscription: response.subscription,
          plan: response.plan,
          usage: response.usage,
          canUpgrade: response.canUpgrade,
          canDowngrade: response.canDowngrade
        };
        setSubscription(subscriptionData);
      } else {
        // Default to free tier
        setSubscription({
          id: '',
          user_id: '',
          plan_id: 'free',
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tier: 'free',
        } as SubscriptionData);
      }
    } catch (err: any) {
      console.error('useSubscription error:', err);
      setError(err.message || 'Failed to load subscription');
      // Set free tier as fallback
      setSubscription({
        id: '',
        user_id: '',
        plan_id: 'free',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tier: 'free',
      } as SubscriptionData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscription,
  };
};
