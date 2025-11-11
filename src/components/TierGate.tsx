import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Zap, Users } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

interface TierGateProps {
  children: ReactNode;
  requiredTier: 'free' | 'pro' | 'team';
  fallback?: ReactNode;
  showUpgrade?: boolean;
}

const TIER_HIERARCHY = {
  free: 0,
  pro: 1,
  team: 2,
};

const TIER_INFO = {
  pro: {
    name: 'Pro',
    icon: Zap,
    color: 'blue',
    price: '$3/month',
  },
  team: {
    name: 'Team',
    icon: Users,
    color: 'purple',
    price: '$8/month',
  },
};

/**
 * TierGate component - Shows content only if user has required subscription tier
 * Displays upgrade prompt for users with insufficient tier
 */
export const TierGate: React.FC<TierGateProps> = ({
  children,
  requiredTier,
  fallback,
  showUpgrade = true,
}) => {
  const { subscription, loading } = useSubscription();

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-20"></div>
    );
  }

  const userTier = subscription?.tier || 'free';
  const userTierLevel = TIER_HIERARCHY[userTier as keyof typeof TIER_HIERARCHY] || 0;
  const requiredTierLevel = TIER_HIERARCHY[requiredTier];

  // User has access
  if (userTierLevel >= requiredTierLevel) {
    return <>{children}</>;
  }

  // Show custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show upgrade prompt
  if (showUpgrade && requiredTier !== 'free') {
    const tierInfo = TIER_INFO[requiredTier as 'pro' | 'team'];
    const Icon = tierInfo.icon;

    return (
      <div className={`border-2 border-dashed border-${tierInfo.color}-300 dark:border-${tierInfo.color}-700 rounded-lg p-6 bg-${tierInfo.color}-50 dark:bg-${tierInfo.color}-900/10`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 bg-${tierInfo.color}-100 dark:bg-${tierInfo.color}-900/30 rounded-lg`}>
            <Lock className={`w-6 h-6 text-${tierInfo.color}-600 dark:text-${tierInfo.color}-400`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-5 h-5 text-${tierInfo.color}-600 dark:text-${tierInfo.color}-400`} />
              <h3 className={`font-semibold text-${tierInfo.color}-900 dark:text-${tierInfo.color}-100`}>
                {tierInfo.name} Feature
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              This feature is available for {tierInfo.name} subscribers. Upgrade to unlock advanced capabilities and get more from ErrorWise.
            </p>
            <Link
              to="/subscription"
              className={`inline-flex items-center gap-2 px-4 py-2 bg-${tierInfo.color}-600 hover:bg-${tierInfo.color}-700 text-white rounded-lg transition-colors`}
            >
              <Zap className="w-4 h-4" />
              <span>Upgrade to {tierInfo.name} - {tierInfo.price}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Don't show anything
  return null;
};

/**
 * FeatureGate component - Shows/hides individual features based on tier
 * More lightweight than TierGate, just hides content without upgrade prompt
 */
export const FeatureGate: React.FC<{
  children: ReactNode;
  feature: string;
  tier: 'free' | 'pro' | 'team';
}> = ({ children, tier }) => {
  const { subscription, loading } = useSubscription();

  if (loading) return null;

  const userTier = subscription?.tier || 'free';
  const userTierLevel = TIER_HIERARCHY[userTier as keyof typeof TIER_HIERARCHY] || 0;
  const requiredTierLevel = TIER_HIERARCHY[tier];

  if (userTierLevel >= requiredTierLevel) {
    return <>{children}</>;
  }

  return null;
};

/**
 * Hook to check if user has access to a specific tier
 */
export const useTierAccess = (requiredTier: 'free' | 'pro' | 'team'): boolean => {
  const { subscription } = useSubscription();
  const userTier = subscription?.tier || 'free';
  const userTierLevel = TIER_HIERARCHY[userTier as keyof typeof TIER_HIERARCHY] || 0;
  const requiredTierLevel = TIER_HIERARCHY[requiredTier];
  return userTierLevel >= requiredTierLevel;
};

/**
 * Hook to get current user's tier
 */
export const useCurrentTier = (): 'free' | 'pro' | 'team' => {
  const { subscription } = useSubscription();
  return (subscription?.tier as 'free' | 'pro' | 'team') || 'free';
};
