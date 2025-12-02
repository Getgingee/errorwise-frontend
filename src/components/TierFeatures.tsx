import React, { useEffect, useState } from 'react';
import { Check, Sparkles, Globe, Code, FileJson, MessageCircle, Users, BarChart, Lock, Zap, Search, BookOpen, Shield, Clock, Star, Heart, HelpCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../services/api';

// Types for backend data
interface TierData {
  id: string;
  name: string;
  price: { monthly: number; yearly: number };
  priceLabel: string;
  yearlyPriceLabel?: string;
  description: string;
  badge: string;
  color: string;
  popular?: boolean;
  limits: {
    queriesPerMonth: number;
    queriesPerDay: number;
    maxFollowUps: number;
    historyRetentionDays: number;
  };
  featureHighlights: Array<{ text: string; icon: string; highlight?: boolean }>;
}

interface ConfigData {
  tiers: TierData[];
  comparisonTable: {
    headers: string[];
    categories: Array<{
      name: string;
      rows: Array<{ feature: string; free: string; pro: string; team: string }>;
    }>;
  };
}

// Fallback data if backend fails (should rarely be used)
const FALLBACK_TIERS: Record<string, TierData> = {
  free: {
    id: 'free',
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    priceLabel: 'Free forever',
    description: 'Perfect for getting started',
    badge: 'FREE',
    color: '#6b7280',
    limits: { queriesPerMonth: 50, queriesPerDay: 10, maxFollowUps: 3, historyRetentionDays: 7 },
    featureHighlights: [
      { text: '50 queries/month', icon: 'chart' },
      { text: 'Conversational AI', icon: 'message', highlight: true },
      { text: '3 follow-ups per chat', icon: 'help' },
      { text: 'Basic AI analysis', icon: 'search' },
      { text: '7-day history', icon: 'book' }
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 3, yearly: 30 },
    priceLabel: '$3/month',
    description: 'For serious developers',
    badge: 'PRO',
    color: '#3b82f6',
    popular: true,
    limits: { queriesPerMonth: -1, queriesPerDay: -1, maxFollowUps: 10, historyRetentionDays: -1 },
    featureHighlights: [
      { text: 'Unlimited queries', icon: 'zap', highlight: true },
      { text: 'Conversational AI', icon: 'message', highlight: true },
      { text: 'Auto + Smart models', icon: 'sparkles', highlight: true },
      { text: 'Follow-up questions', icon: 'help' },
      { text: 'Unlimited history', icon: 'book' },
      { text: 'Email support', icon: 'mail' }
    ]
  },
  team: {
    id: 'team',
    name: 'Team',
    price: { monthly: 8, yearly: 80 },
    priceLabel: '$8/month',
    description: 'For teams up to 10',
    badge: 'TEAM',
    color: '#8b5cf6',
    limits: { queriesPerMonth: -1, queriesPerDay: -1, maxFollowUps: -1, historyRetentionDays: -1 },
    featureHighlights: [
      { text: 'Everything in Pro', icon: 'star' },
      { text: 'Up to 10 team members', icon: 'users', highlight: true },
      { text: 'Shared solution library', icon: 'folder', highlight: true },
      { text: 'Genius AI model', icon: 'zap', highlight: true },
      { text: 'Team analytics', icon: 'chart' },
      { text: 'Priority support', icon: 'shield' }
    ]
  }
};

interface TierComparisonProps {
  currentTier?: 'free' | 'pro' | 'team';
  onUpgrade?: (tier: 'pro' | 'team') => void;
}

export const TierComparison: React.FC<TierComparisonProps> = ({
  currentTier = 'free',
  onUpgrade
}) => {
  const [tiers, setTiers] = useState<TierData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await apiClient.get<{ success: boolean; data: ConfigData }>('/config');
        const data = response as any;
        if (data.success && data.data?.tiers) {
          setTiers(data.data.tiers);
        } else {
          // Use fallback if response format is unexpected
          setTiers(Object.values(FALLBACK_TIERS));
        }
      } catch (error) {
        console.warn('Failed to fetch config, using fallback:', error);
        setTiers(Object.values(FALLBACK_TIERS));
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const colorClasses: Record<string, string> = {
    '#6b7280': 'border-gray-300 dark:border-gray-600',
    '#3b82f6': 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20',
    '#8b5cf6': 'border-purple-500 dark:border-purple-400',
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
      {tiers.map((tier) => {
        const isCurrentTier = tier.id === currentTier;
        const borderClass = colorClasses[tier.color] || colorClasses['#6b7280'];

        return (
          <div
            key={tier.id}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 ${borderClass} p-6 lg:p-8 ${tier.popular ? 'shadow-xl scale-[1.02]' : 'shadow-lg'} transition-all hover:shadow-2xl hover:scale-[1.01]`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" />
                  Most Popular
                </span>
              </div>
            )}

            {isCurrentTier && (
              <div className="absolute -top-3 right-4">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Current Plan
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {tier.name}
              </h3>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ${tier.price.monthly}
                </span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                {tier.description}
              </p>
            </div>

            <div className="space-y-2.5 mb-8">
              {tier.featureHighlights.map((feature, index) => {
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${feature.highlight ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-2.5 rounded-lg -mx-2' : ''}`}
                  >
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className={`text-sm ${feature.highlight ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {!isCurrentTier && tier.id !== 'free' && onUpgrade && (
              <button
                onClick={() => onUpgrade(tier.id as 'pro' | 'team')}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                  tier.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Upgrade to {tier.name}
              </button>
            )}

            {isCurrentTier && (
              <div className="w-full py-3 px-6 rounded-xl font-semibold text-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                Current Plan
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// NewFeaturesHighlight - Static component about AI
export const NewFeaturesHighlight: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Powered by Claude AI
        </h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        ErrorWise uses Anthropic Claude for all AI-powered features - the same AI that powers enterprise applications.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Fast Mode: Claude Haiku</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Smart Mode: Claude Sonnet</span>
        </div>
      </div>
    </div>
  );
};

// Export TIER_FEATURES for backwards compatibility (deprecated - use backend API instead)
export const TIER_FEATURES = FALLBACK_TIERS;

export default TierComparison;
