import React from 'react';
import { Check, Sparkles, Globe, Code, FileJson, MessageCircle, Users, BarChart, Lock, Zap, Search, BookOpen, Shield, Clock, Star, Heart, HelpCircle } from 'lucide-react';

// Comprehensive tier feature definitions - For everyday non-tech users
export const TIER_FEATURES = {
  free: {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with basic error help. 50 problems solved per month.',
    tagline: 'Try ErrorWise free',
    color: 'gray',
    mostPopular: false,
    features: [
      { name: '50 error solutions/month', included: true, icon: MessageCircle },
      { name: '10 queries per day', included: true, icon: Clock },
      { name: 'Plain English explanations', included: true, icon: MessageCircle },
      { name: 'Basic step-by-step fixes', included: true, icon: Code },
      { name: '7-day history', included: true, icon: BarChart },
      { name: 'Works with any error type', included: true, icon: Globe },
      { name: 'Community support', included: true, icon: Users },
      { name: 'Unlimited queries', included: false },
      { name: 'Web search for solutions', included: false },
      { name: 'Follow-up questions', included: false },
      { name: 'Export history', included: false },
    ],
  },
  pro: {
    name: 'Pro',
    price: '$3',
    period: 'month',
    description: 'Unlimited help with any tech problem. Best for individuals.',
    tagline: '7-day free trial',
    color: 'blue',
    mostPopular: true,
    features: [
      { name: 'UNLIMITED error solutions', included: true, icon: Zap, highlight: true },
      { name: 'Ask anything about tech', included: true, icon: Sparkles, highlight: true },
      { name: 'Web search for latest solutions', included: true, icon: Search, highlight: true },
      { name: '5 follow-up questions per query', included: true, icon: MessageCircle, highlight: true },
      { name: 'Visual guides & screenshots', included: true, icon: Code },
      { name: 'How-to tutorials', included: true, icon: BookOpen },
      { name: 'Prevention tips', included: true, icon: Shield },
      { name: 'Detailed explanations', included: true, icon: MessageCircle },
      { name: 'Multi-language support (10+)', included: true, icon: Globe, highlight: true },
      { name: 'Unlimited history storage', included: true, icon: BarChart },
      { name: 'Export to JSON/CSV', included: true, icon: FileJson },
      { name: 'Save solutions to library', included: true, icon: BookOpen, highlight: true },
      { name: 'Faster AI responses', included: true, icon: Zap },
      { name: 'Email support', included: true, icon: HelpCircle },
      { name: 'India-specific solutions', included: true, icon: Globe },
    ],
  },
  team: {
    name: 'Team',
    price: '$8',
    period: 'month',
    description: 'Share tech support with your team, office, or family.',
    tagline: '14-day free trial',
    color: 'purple',
    mostPopular: false,
    features: [
      { name: 'Everything in Pro', included: true, icon: Check, highlight: true },
      { name: 'Up to 10 team members', included: true, icon: Users, highlight: true },
      { name: 'Team dashboard & analytics', included: true, icon: BarChart, highlight: true },
      { name: 'Shared solution library', included: true, icon: BookOpen, highlight: true },
      { name: 'Help teammates with errors', included: true, icon: Heart },
      { name: 'Member usage reports', included: true, icon: BarChart },
      { name: 'Best AI model (Claude Sonnet)', included: true, icon: Sparkles },
      { name: '10 follow-up questions per query', included: true, icon: MessageCircle },
      { name: 'Priority support queue', included: true, icon: Star },
      { name: 'API access', included: true, icon: Code },
      { name: 'Custom integrations', included: true, icon: Code },
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
    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
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
            className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 ${colorClasses[tier.color as keyof typeof colorClasses]} p-6 lg:p-8 ${tier.mostPopular ? 'shadow-xl scale-[1.02]' : 'shadow-lg'} transition-all hover:shadow-2xl hover:scale-[1.01]`}
          >
            {tier.mostPopular && (
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
                  {tier.price}
                </span>
                <span className="text-gray-600 dark:text-gray-400">/{tier.period}</span>
              </div>
              {tier.tagline && (
                <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm rounded-full font-medium">
                  {tier.tagline}
                </span>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                {tier.description}
              </p>
            </div>

            <div className="space-y-2.5 mb-8">
              {tier.features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${!feature.included ? 'opacity-40' : ''} ${feature.highlight ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-2.5 rounded-lg -mx-2' : ''}`}
                  >
                    {feature.included ? (
                      <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 flex-1">
                      {Icon && <Icon className={`w-4 h-4 ${feature.included ? 'text-blue-500' : 'text-gray-400'}`} />}
                      <span className={`text-sm ${feature.included ? 'text-gray-800 dark:text-gray-100 font-medium' : 'text-gray-500 dark:text-gray-500 line-through'}`}>
                        {feature.name}
                      </span>
                      {feature.highlight && feature.included && (
                        <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 px-1.5 py-0.5 rounded font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {!isCurrentTier && tierKey !== 'free' && onUpgrade && (
              <button
                onClick={() => onUpgrade(tierKey as 'pro' | 'team')}
                className={`w-full py-3.5 rounded-xl font-bold transition-all transform hover:scale-[1.02] ${tier.mostPopular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'}`}
              >
                {tierKey === 'pro' ? 'Start Free Trial' : `Upgrade to ${tier.name}`}
              </button>
            )}

            {isCurrentTier && (
              <div className="w-full py-3.5 rounded-xl font-bold text-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-2 border-green-200 dark:border-green-800">
                <Check className="w-5 h-5 inline mr-2" />
                Active Plan
              </div>
            )}

            {tierKey === 'free' && !isCurrentTier && (
              <div className="w-full py-3.5 rounded-xl font-bold text-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                Free Forever
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
      title: 'Ask Follow-Up Questions',
      description: 'Get clarifications and more help - just like chatting with tech support',
      tier: 'Pro'
    },
    {
      icon: Search,
      title: 'Web Search for Solutions',
      description: 'We search the internet for the latest fixes and solutions',
      tier: 'Pro'
    },
    {
      icon: BookOpen,
      title: 'Save Your Solutions',
      description: 'Build your personal library of fixes for future reference',
      tier: 'Pro'
    },
    {
      icon: Users,
      title: 'Team Sharing',
      description: 'Share solutions with your team, office, or family members',
      tier: 'Team'
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
        What is New in Pro and Team
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Features that make solving problems even easier
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {newFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${feature.tier === 'Pro' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                  {feature.tier}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TierComparison;
