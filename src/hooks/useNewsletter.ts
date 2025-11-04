/**
 * Newsletter Hook
 * React hook for newsletter subscription functionality
 */

import { useState } from 'react';
import { newsletterService, NewsletterSubscription } from '@/services/newsletterService';

export const useNewsletter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const subscribe = async (data: NewsletterSubscription) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await newsletterService.subscribe(data);
      setSuccess(true);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to subscribe';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await newsletterService.checkStatus(email);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check status';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    subscribe,
    checkStatus,
    loading,
    error,
    success,
    reset,
  };
};
