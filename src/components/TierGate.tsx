import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Zap, Users, ArrowRight, Crown } from 'lucide-react';
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
    color: 'purple',
    price: '$3/month',
  },
  team: {
    name: 'Team',
    icon: Users,
    color: 'blue',
    price: '$8/month',
  },
};

/**
 * TierGate component - Shows content only if user has required subscription tier
 * Displays upgrade prompt for users with insufficient tier
 * Clicking the upgrade prompt navigates to pricing page
 */
export const TierGate: React.FC<TierGateProps> = ({
  children,
  requiredTier,
  fallback,
  showUpgrade = true,
}) => {
  const { subscription, loading } = useSubscription();
  const navigate = useNavigate();

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

  const handleUpgradeClick = () => {
    navigate(`/pricing?trial=${requiredTier}`);
  };

  // Show upgrade prompt
  if (showUpgrade && requiredTier !== 'free') {
    const tierInfo = TIER_INFO[requiredTier as 'pro' | 'team'];
    const Icon = tierInfo.icon;

    return (
      <div 
        onClick={handleUpgradeClick}
        className="border border-purple-500/30 rounded-xl p-5 bg-gradient-to-r from-purple-500/10 to-blue-500/10 cursor-pointer hover:from-purple-500/20 hover:to-blue-500/20 hover:border-purple-500/50 transition-all group"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleUpgradeClick()}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform">
            <Icon className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 p-1 bg-amber-500 rounded-full">
              <Lock className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-white text-lg">
                {tierInfo.name} Feature
              </h3>
              <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                {tierInfo.name.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              This feature is available for {tierInfo.name} subscribers. Upgrade to unlock advanced capabilities and get more from ErrorWise.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpgradeClick();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all shadow-lg group-hover:scale-105"
            >
              <Zap className="w-4 h-4" />
              <span>Upgrade to {tierInfo.name} - {tierInfo.price}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
