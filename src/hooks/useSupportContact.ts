import { useState, useEffect } from 'react';
import axios from 'axios';

export interface SupportCategory {
  name: string;
  email: string;
  description: string;
}

export interface ResponseTimesByTier {
  free: string;
  pro: string;
  team: string;
}

export interface SupportHours {
  weekdays: string;
  weekends: string;
  timezone: string;
}

export interface HelpResource {
  title: string;
  url: string;
  category: string;
}

export interface SupportContactInfo {
  supportEmail: string;
  categories: SupportCategory[];
  responseTimes: ResponseTimesByTier;
  supportHours: SupportHours;
  helpResources: HelpResource[];
  ticketSystem: {
    enabled: boolean;
    prefix: string;
    autoReplyMessage: string;
  };
}

interface UseSupportContactState {
  data: SupportContactInfo | null;
  loading: boolean;
  error: Error | null;
}

/**
 * React hook to fetch and manage support contact information
 * Fetches from GET /api/support/contact-info endpoint
 * 
 * @returns {UseSupportContactState} Object containing data, loading, and error states
 * 
 * @example
 * const { data: supportInfo, loading, error } = useSupportContact();
 * 
 * if (loading) return <div>Loading support info...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * 
 * return <div>Email: {supportInfo?.supportEmail}</div>;
 */
export const useSupportContact = (): UseSupportContactState => {
  const [state, setState] = useState<UseSupportContactState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchSupportContact = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const response = await axios.get<SupportContactInfo>(
          '/api/support/contact-info',
          {
            timeout: 5000, // 5 second timeout
          }
        );

        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error('Failed to fetch support contact information');

        setState({
          data: null,
          loading: false,
          error,
        });

        // Log error for debugging
        console.error('useSupportContact error:', error);
      }
    };

    fetchSupportContact();
  }, []);

  return state;
};

/**
 * Get support email for a specific category
 * @param {SupportCategory[] | undefined} categories - Array of categories
 * @param {string} categoryName - Name of the category to find
 * @returns {string} Email for the category, or default support email
 */
export const getSupportEmailByCategory = (
  categories: SupportCategory[] | undefined,
  categoryName: string
): string => {
  if (!categories) return 'hi@getgingee.com';
  
  const category = categories.find(
    (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
  );
  
  return category?.email || 'hi@getgingee.com';
};

/**
 * Get response time for a specific user tier
 * @param {ResponseTimesByTier | undefined} responseTimes - Response times by tier
 * @param {string} tier - User tier (free, pro, team)
 * @returns {string} Response time for the tier
 */
export const getResponseTimeByTier = (
  responseTimes: ResponseTimesByTier | undefined,
  tier: string = 'free'
): string => {
  if (!responseTimes) return 'Contact support for details';
  
  const tierKey = (tier.toLowerCase() as keyof ResponseTimesByTier) || 'free';
  return responseTimes[tierKey] || responseTimes.free;
};

/**
 * Get display text for support hours
 * @param {SupportHours | undefined} supportHours - Support hours configuration
 * @returns {string} Formatted support hours text
 */
export const getFormattedSupportHours = (
  supportHours: SupportHours | undefined
): string => {
  if (!supportHours) return 'Available during business hours';
  
  return `Weekdays: ${supportHours.weekdays} ${supportHours.timezone}\nWeekends/Holidays: ${supportHours.weekends}`;
};
