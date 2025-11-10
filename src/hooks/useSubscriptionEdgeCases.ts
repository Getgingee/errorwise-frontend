import { useState } from 'react';
import {
  getProrationPreview,
  upgradeSubscription,
  downgradeSubscription,
  pauseSubscription,
  resumeSubscription,
  triggerPaymentFailure,
  ProrationPreview,
} from '../services/subscriptionEdgeCases';

export const useSubscriptionEdgeCases = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProration = async (newTier: string): Promise<ProrationPreview | null> => {
    setLoading(true);
    setError(null);
    try {
      const preview = await getProrationPreview(newTier);
      return preview;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to get proration preview');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const upgrade = async (newTier: 'pro' | 'team') => {
    setLoading(true);
    setError(null);
    try {
      const result = await upgradeSubscription(newTier);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upgrade subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downgrade = async (newTier: 'free' | 'pro', immediate: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await downgradeSubscription(newTier, immediate);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to downgrade subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const pause = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await pauseSubscription();
      return result;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to pause subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resume = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await resumeSubscription();
      return result;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resume subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentFailure = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await triggerPaymentFailure();
      return result;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to trigger payment failure');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getProration,
    upgrade,
    downgrade,
    pause,
    resume,
    handlePaymentFailure,
  };
};
