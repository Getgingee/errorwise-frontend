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
      const response = await subscriptionService.getCurrentSubscription();
      if (response.success && response.data) {
        setSubscription(response.data as SubscriptionData);
      } else {
        setSubscription(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load subscription');
      setSubscription(null);
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
