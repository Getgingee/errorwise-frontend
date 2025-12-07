import React, { useEffect, useState } from 'react';
import { Check, Sparkles, Globe, Code, FileJson, MessageCircle, Users, BarChart, Lock, Zap, Search, BookOpen, Shield, Clock, Star, Heart, HelpCircle, Loader2, Infinity, Download, History, Mail, Award, Gift, Crown, Lightbulb, TrendingUp } from 'lucide-react';
import { apiClient } from '../services/api';

// Types for backend data
interface FeatureItem {
  text: string;
  icon?: string;
  highlight?: boolean;
  badge?: string;
  available?: boolean;
}

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
  featureHighlights: Array<FeatureItem>;
  displayFeatures?: Array<FeatureItem>;
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
    ],
    displayFeatures: [
      { text: '50 queries per month', available: true },
      { text: '10 queries per day', available: true },
      { text: '3 follow-up questions per conversation', available: true },
      { text: 'Conversational AI help', available: true, highlight: true, badge: 'Live' },
      { text: 'AI-powered error analysis', available: true },
      { text: 'Multi-language support (20+ languages)', available: true },
      { text: 'Code snippet detection', available: true },
      { text: 'Markdown responses', available: true },
      { text: 'Copy & share solutions', available: true },
      { text: '7-day history retention', available: true },
      { text: 'Web access only', available: true }
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
    ],
    displayFeatures: [
      { text: 'Unlimited queries', available: true, highlight: true, badge: 'NEW' },
      { text: 'No daily limits', available: true, highlight: true },
      { text: '10 follow-up questions per conversation', available: true, highlight: true, badge: 'NEW' },
      { text: 'Conversational AI help', available: true, highlight: true, badge: 'Live' },
      { text: 'Advanced AI-powered error analysis', available: true },
      { text: 'Auto + Smart AI modes', available: true, highlight: true, badge: 'NEW' },
      { text: 'Multi-language support (20+ languages)', available: true },
      { text: 'Code snippet detection', available: true },
      { text: 'Markdown responses', available: true },
      { text: 'Copy & share solutions', available: true },
      { text: 'Unlimited history retention', available: true, badge: 'NEW' },
      { text: 'Export history (JSON/CSV)', available: true, highlight: true, badge: 'NEW' },
      { text: 'Web access', available: true },
      { text: 'Email support', available: true },
      { text: 'Priority processing', available: true }
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
    ],
    displayFeatures: [
      { text: 'Everything in Pro, plus:', available: true, highlight: true },
      { text: 'Up to 10 team members', available: true, highlight: true, badge: 'NEW' },
      { text: 'Unlimited follow-up questions', available: true, highlight: true },
      { text: 'Genius AI mode (Claude Sonnet)', available: true, highlight: true, badge: 'NEW' },
      { text: 'Shared solution library', available: true, highlight: true, badge: 'Live' },
      { text: 'Team analytics dashboard', available: true },
      { text: 'Priority support', available: true },
      { text: 'Admin controls', available: true },
      { text: 'Usage reports', available: true },
      { text: 'Custom branding (coming soon)', available: true },
      { text: 'API access (coming soon)', available: true }
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
        // Use displayFeatures if available, otherwise featureHighlights
        const features = tier.displayFeatures || tier.featureHighlights || [];

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

            {tier.id === 'team' && !isCurrentTier && (
              <div className="absolute -top-3 right-4">
                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Coming Soon
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

            <div className="space-y-2.5 mb-8 max-h-96 overflow-y-auto">
              {features.map((feature, index) => {
                const isAvailable = feature.available !== false;
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${feature.highlight ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-2.5 rounded-lg -mx-2' : ''}`}
                  >
                    <div className={`flex-shrink-0 w-5 h-5 ${isAvailable ? 'bg-green-500' : 'bg-gray-400'} rounded-full flex items-center justify-center mt-0.5`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className={`text-sm flex-1 ${feature.highlight ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'} ${!isAvailable ? 'line-through opacity-60' : ''}`}>
                      {feature.text}
                    </span>
                    {feature.badge && (
                      <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-bold rounded-full ${
                        feature.badge === 'NEW' ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30' :
                        feature.badge === 'Live' ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30' :
                        'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                      }`}>
                        {feature.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {!isCurrentTier && tier.id !== 'free' && tier.id !== 'team' && onUpgrade && (
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

            {!isCurrentTier && tier.id === 'team' && (
              <div className="w-full py-3 px-6 rounded-xl font-semibold text-center bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 cursor-not-allowed flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                Coming Soon
              </div>
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

// NewFeaturesHighlight - Feature badges section like Image 2
export const NewFeaturesHighlight: React.FC = () => {
  const features = [
    { text: 'Conversational AI', badge: 'Live', icon: MessageCircle, color: 'green' },
    { text: 'Follow-up Questions', badge: 'NEW', icon: HelpCircle, color: 'cyan' },
    { text: 'Auto + Smart Modes', badge: 'NEW', icon: Sparkles, color: 'cyan' },
    { text: 'Export History', badge: 'NEW', icon: Download, color: 'cyan' },
    { text: 'Team Collaboration', badge: 'NEW', icon: Users, color: 'cyan' },
    { text: 'Shared Library', badge: 'Live', icon: BookOpen, color: 'green' },
  ];

  return (
    <div className="mb-10">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🎉 New Features Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Powered by Claude AI - Anthropic's most advanced language model
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              <div className={`w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center ${
                feature.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-cyan-100 dark:bg-cyan-900/30'
              }`}>
                <Icon className={`w-5 h-5 ${
                  feature.color === 'green' ? 'text-green-600 dark:text-green-400' : 'text-cyan-600 dark:text-cyan-400'
                }`} />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                {feature.text}
              </p>
              <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full ${
                feature.badge === 'NEW' ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30' :
                'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
              }`}>
                {feature.badge}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300"><strong>Fast Mode:</strong> Claude Haiku</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300"><strong>Smart Mode:</strong> Claude Sonnet</span>
        </div>
      </div>
    </div>
  );
};

// Export TIER_FEATURES for backwards compatibility (deprecated - use backend API instead)
export const TIER_FEATURES = FALLBACK_TIERS;

export default TierComparison;
