import React from 'react';
import { Check, Sparkles, Globe, Code, FileJson, MessageCircle, Users, BarChart, Lock } from 'lucide-react';

// Comprehensive tier feature definitions matching pricing page and backend
export const TIER_FEATURES = {
  free: {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out ErrorWise. Get 50 error explanations per month with 7-day history.',
    color: 'gray',
    mostPopular: false,
    features: [
      { name: 'Up to 50 queries/month', included: true, icon: MessageCircle },
      { name: 'Basic error explanations', included: true, icon: MessageCircle },
      { name: '7-day error history', included: true, icon: BarChart },
      { name: 'AI Model: Gemini Flash', included: true, icon: Sparkles },
      { name: 'Full error explanations', included: false },
      { name: 'Fix suggestions', included: false },
      { name: 'Code examples', included: false },
      { name: 'Web scraping & context', included: false },
      { name: 'Export to JSON/CSV', included: false },
    ],
  },
  pro: {
    name: 'Pro',
    price: '$3',
    period: 'month',
    description: 'Unlimited error queries with fixes, documentation links, and complete history.',
    color: 'blue',
    mostPopular: true,
    features: [
      { name: 'Unlimited queries', included: true, icon: MessageCircle, highlight: true },
      { name: 'Full error explanations', included: true, icon: MessageCircle },
      { name: 'Fix suggestions with steps', included: true, icon: Code, highlight: true },
      { name: 'Code examples', included: true, icon: Code },
      { name: 'Prevention tips', included: true, icon: Sparkles },
      { name: 'Documentation links', included: true, icon: Globe },
      { name: 'Web scraping & context', included: true, icon: Globe, highlight: true },
      { name: 'Multi-language support', included: true, icon: Sparkles, highlight: true },
      { name: 'Export to JSON/CSV', included: true, icon: FileJson },
      { name: 'Unlimited error history', included: true, icon: BarChart },
      { name: 'AI Model: Claude Haiku', included: true, icon: Sparkles },
      { name: 'Conversational AI', included: true, icon: MessageCircle, highlight: true },
      { name: 'Follow-up questions', included: true, icon: MessageCircle, highlight: true },
      { name: 'Indian context awareness', included: true, icon: Globe, highlight: true },
    ],
  },
  team: {
    name: 'Team',
    price: '$8',
    period: 'month',
    description: 'Everything in Pro plus shared team history, team dashboard, and collaborative features.',
    color: 'purple',
    mostPopular: false,
    features: [
      { name: 'Everything in Pro', included: true, icon: Check, highlight: true },
      { name: 'Team dashboard', included: true, icon: BarChart, highlight: true },
      { name: 'Shared error history', included: true, icon: Users, highlight: true },
      { name: 'Team collaboration', included: true, icon: Users },
      { name: 'Advanced debugging tools', included: true, icon: Code },
      { name: 'Priority support', included: true, icon: Sparkles },
      { name: 'API access', included: true, icon: Code },
      { name: 'Custom integrations', included: true, icon: Code },
      { name: 'AI Model: Claude Sonnet', included: true, icon: Sparkles },
      { name: 'Team analytics', included: true, icon: BarChart },
    ],
  },
};

interface TierComparisonProps {
  currentTier?: 'free' | 'pro' | 'team';
  onUpgrade?: (tier: 'pro' | 'team') => void;
}

export const TierComparison: React.FC<TierComparisonProps> = ({ 
  currentTier = 'free',
  onUpgrade 
}) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {Object.entries(TIER_FEATURES).map(([tierKey, tier]) => {
        const isCurrentTier = tierKey === currentTier;
        const colorClasses = {
          gray: 'border-gray-300 dark:border-gray-600',
          blue: 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20',
          purple: 'border-purple-500 dark:border-purple-400',
        };

        return (
          <div
            key={tierKey}
            className={`relative bg-white dark:bg-gray-800 rounded-xl border-2 ${
              colorClasses[tier.color as keyof typeof colorClasses]
            } p-6 ${tier.mostPopular ? 'shadow-xl' : 'shadow-lg'} transition-all hover:shadow-2xl`}
          >
            {/* Most Popular Badge */}
            {tier.mostPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  ⭐ Most Popular
                </span>
              </div>
            )}

            {/* Current Plan Badge */}
            {isCurrentTier && (
              <div className="absolute -top-3 right-4">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Current Plan
                </span>
              </div>
            )}

            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {tier.name}
              </h3>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {tier.price}
                </span>
                <span className="text-gray-600 dark:text-gray-400">/{tier.period}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tier.description}
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3 mb-6">
              {tier.features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      !feature.included ? 'opacity-40' : ''
                    } ${feature.highlight ? 'bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg' : ''}`}
                  >
                    {feature.included ? (
                      <div className="flex-shrink-0 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 flex-1">
                      {Icon && <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                      <span className={`text-sm ${
                        feature.included 
                          ? 'text-gray-900 dark:text-white font-medium' 
                          : 'text-gray-500 dark:text-gray-500 line-through'
                      }`}>
                        {feature.name}
                      </span>
                      {feature.highlight && (
                        <span className="text-xs bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded font-semibold">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            {!isCurrentTier && tierKey !== 'free' && onUpgrade && (
              <button
                onClick={() => onUpgrade(tierKey as 'pro' | 'team')}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  tier.mostPopular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                }`}
              >
                Upgrade to {tier.name}
              </button>
            )}

            {isCurrentTier && (
              <div className="w-full py-3 rounded-lg font-semibold text-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                ✓ Active Plan
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// New Features Highlight Component
export const NewFeaturesHighlight: React.FC = () => {
  const newFeatures = [
    {
      icon: MessageCircle,
      title: 'Conversational AI',
      description: 'Google Assistant-like experience with context-aware responses and follow-up questions',
      tier: 'Pro',
      color: 'blue',
    },
    {
      icon: Globe,
      title: 'Web Scraping & Context',
      description: 'Automatically scrapes Stack Overflow, Reddit, and manufacturer forums for real solutions',
      tier: 'Pro',
      color: 'purple',
    },
    {
      icon: Sparkles,
      title: 'Indian Context Awareness',
      description: 'Understands Indian culture, searches Indian tech forums (digit.in, techenclave.com)',
      tier: 'Pro',
      color: 'yellow',
    },
    {
      icon: Code,
      title: 'Multi-Language Support',
      description: 'Get error explanations and solutions in your preferred language',
      tier: 'Pro',
      color: 'green',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          ✨ New Pro Features Available!
        </h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {newFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-blue-600"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h4>
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      {feature.tier}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
