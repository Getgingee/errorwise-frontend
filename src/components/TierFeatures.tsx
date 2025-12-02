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

// New Features Highlight Component - Enhanced for AI SaaS Essentials
export const NewFeaturesHighlight: React.FC = () => {
  const essentialFeatures = [
    {
      icon: Zap,
      title: 'Unlimited AI Solutions',
      description: 'No monthly limits - solve as many problems as you need',
      tier: 'Pro',
      gradient: 'from-yellow-500 to-orange-500',
      stat: ''
    },
    {
      icon: MessageCircle,
      title: 'Smart Follow-Ups',
      description: 'Ask 5 clarifying questions per query for deeper help',
      tier: 'Pro',
      gradient: 'from-blue-500 to-cyan-500',
      stat: '5x'
    },
    {
      icon: Search,
      title: 'Live Web Search',
      description: 'AI searches the internet for the latest solutions',
      tier: 'Pro',
      gradient: 'from-green-500 to-emerald-500',
      stat: 'Live'
    },
    {
      icon: Globe,
      title: 'Multi-Language',
      description: 'Get help in 10+ languages including Hindi',
      tier: 'Pro',
      gradient: 'from-purple-500 to-pink-500',
      stat: '10+'
    },
    {
      icon: BookOpen,
      title: 'Solution Library',
      description: 'Save and organize your fixes for quick access',
      tier: 'Pro',
      gradient: 'from-cyan-500 to-blue-500',
      stat: 'Save'
    },
    {
      icon: Users,
      title: 'Team Dashboard',
      description: 'Share with 10 members, track usage & analytics',
      tier: 'Team',
      gradient: 'from-violet-500 to-purple-600',
      stat: '10'
    },
  ];

  return (
    <div className="mb-10">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-1">
           Upgrade Essentials
        </h2>
        <p className="text-gray-400 text-sm">
          What you unlock with Pro & Team
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {essentialFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:border-white/25 hover:bg-white/10 transition-all cursor-default"
            >
              {/* Stat Badge */}
              <div className="absolute -top-2 -right-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${feature.gradient} text-white shadow-lg`}>
                  {feature.stat}
                </span>
              </div>
              
              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="font-semibold text-white text-sm mb-1 leading-tight">
                {feature.title}
              </h3>
              <p className="text-[11px] text-gray-400 leading-snug mb-2">
                {feature.description}
              </p>
              
              {/* Tier Badge */}
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                feature.tier === 'Pro' 
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              }`}>
                {feature.tier}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TierComparison;
