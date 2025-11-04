import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import Navigation from '../components/Navigation';
import { CheckCircle, X, TrendingUp, Users, Zap, Shield, Clock, Star, Loader2 } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  trialDays?: number;
  features: {
    dailyQueries: number;
    errorExplanation: boolean;
    fixSuggestions: boolean;
    codeExamples?: boolean;
    preventionTips?: boolean;
    documentationLinks: boolean;
    exportHistory?: boolean;
    errorHistory: boolean;
    urlScrapingContext?: boolean;
    multiLanguage?: boolean;
    advancedAnalysis?: boolean;
    teamFeatures?: boolean;
    sharedHistory?: boolean;
    teamDashboard?: boolean;
    teamMembers?: number;
    prioritySupport?: boolean;
    apiAccess?: boolean;
  };
  description: string;
}

interface Subscription {
  tier: 'free' | 'pro' | 'team';
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'past_due';
  endDate?: string | null;
  startDate?: string;
}

interface PlansResponse {
  plans: Plan[];
}

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setSuccess(true);
      setTimeout(() => {
        navigate('/subscription', { replace: true });
      }, 3000);
    }
    
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const plansResponse = await apiClient.get<PlansResponse>('/subscriptions/plans');
      setPlans(plansResponse.data?.plans || []);      try {
        const subscriptionResponse = await apiClient.get('/subscriptions');
        const subscriptionData = subscriptionResponse.data;
        setCurrentSubscription(subscriptionData && Object.keys(subscriptionData).length > 0 ? subscriptionData as Subscription : null);
      } catch (subError) {
        console.log('No active subscription');
      }

      setError(null);
    } catch (err: any) {
      console.error('Error fetching subscription data:', err);
      setError(err.response?.data?.error || 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (planId: string) => {
    try {
      setProcessingPlanId(planId);
      setError(null);

      const response = await apiClient.post<{ sessionUrl?: string }>('/subscriptions/checkout', {
        planId,
        successUrl: `${window.location.origin}/subscription?success=true`,
        cancelUrl: `${window.location.origin}/subscription?cancelled=true`
      });

      if (response.data?.sessionUrl) {
        window.location.href = response.data.sessionUrl;
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create subscription');
      setProcessingPlanId(null);
    }
  };

  const getFeaturesList = (plan: Plan): Array<{ text: string; available: boolean }> => {
    const features = [];
    
    if (plan.id === 'free') {
      features.push(
        { text: '50 queries per month', available: true },
        { text: 'Basic error explanations', available: true },
        { text: 'Gemini 2.0 Flash AI (800 tokens)', available: true },
        { text: '7-day error history', available: true },
        { text: 'Community support', available: true },
        { text: 'Code examples & fixes', available: false },
        { text: 'Unlimited queries', available: false },
        { text: 'Export history', available: false }
      );
    } else if (plan.id === 'pro') {
      features.push(
        { text: 'Unlimited queries', available: true },
        { text: 'Full error explanations + fixes', available: true },
        { text: 'Code examples & prevention tips', available: true },
        { text: 'GPT-3.5 Turbo AI (1200 tokens)', available: true },
        { text: 'Unlimited error history', available: true },
        { text: 'Export to JSON/CSV', available: true },
        { text: 'URL scraping context', available: true },
        { text: 'Multi-language support', available: true },
        { text: 'Email support', available: true },
        { text: `${plan.trialDays}-day free trial`, available: true }
      );
    } else if (plan.id === 'team') {
      features.push(
        { text: 'Everything in Pro', available: true },
        { text: 'Team features (10 members)', available: true },
        { text: 'Shared error history', available: true },
        { text: 'Team dashboard & analytics', available: true },
        { text: 'GPT-4 AI (2000 tokens)', available: true },
        { text: 'Advanced debugging tools', available: true },
        { text: 'Priority support', available: true },
        { text: 'API access', available: true },
        { text: 'Custom integrations', available: true },
        { text: `${plan.trialDays}-day free trial`, available: true }
      );
    }

    return features;
  };

  const getButtonText = (plan: Plan): string => {
    if (!currentSubscription || currentSubscription.tier === 'free') {
      if (plan.id === 'free') return 'Current Plan';
      return plan.trialDays ? `Start ${plan.trialDays}-day Trial` : 'Get Started';
    }

    if (currentSubscription.tier === plan.id) {
      return currentSubscription.status === 'trial' ? 'Current (Trial)' : 'Current Plan';
    }

    const tierHierarchy = { free: 0, pro: 1, team: 2 };
    const currentTierLevel = tierHierarchy[currentSubscription.tier];
    const planTierLevel = tierHierarchy[plan.id as keyof typeof tierHierarchy];

    if (planTierLevel > currentTierLevel) return 'Upgrade';
    if (planTierLevel < currentTierLevel) return 'Downgrade';
    
    return 'Get Started';
  };

  const isButtonDisabled = (plan: Plan): boolean => {
    if (processingPlanId === plan.id) return true;
    if (!currentSubscription) return plan.id === 'free';
    return currentSubscription.tier === plan.id;
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 pb-16">
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-white text-lg">Loading subscription plans...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 pb-16">
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .glass-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
          
          .pricing-card {
            transition: all 0.3s ease;
          }
          
          .pricing-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 50px rgba(99, 102, 241, 0.3);
          }
          
          .benefit-card {
            transition: all 0.3s ease;
          }
          
          .benefit-card:hover {
            transform: translateY(-5px);
            border-color: rgba(99, 102, 241, 0.5);
          }
        `}</style>

        {/* Success Banner */}
        {success && (
          <div className="bg-green-500 rounded-xl p-5 mx-auto my-5 max-w-3xl flex items-center gap-4 shadow-lg">
            <CheckCircle className="h-6 w-6 text-white flex-shrink-0" />
            <div>
              <h3 className="text-white text-xl font-bold mb-1">Payment Successful!</h3>
              <p className="text-white/90">Your subscription has been activated. Enjoy your new features!</p>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500 rounded-xl p-5 mx-auto my-5 max-w-3xl flex items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-4">
              <X className="h-6 w-6 text-white flex-shrink-0" />
              <div>
                <h3 className="text-white text-xl font-bold mb-1">Error</h3>
                <p className="text-white/90">{error}</p>
              </div>
            </div>
            <button 
              onClick={() => setError(null)} 
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              aria-label="Close error message"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="text-center pt-16 pb-10 px-5 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-5 bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Affordable solutions that empower developers to solve errors faster
          </p>
          
          {currentSubscription && currentSubscription.tier !== 'free' && (
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/50 px-5 py-2.5 rounded-full">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-white text-sm">
                Current: {currentSubscription.tier.toUpperCase()} 
                {currentSubscription.status === 'trial' && ' (Trial)'}
              </span>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-5 mb-20">
          {plans.map((plan) => {
            const isCurrentPlan = currentSubscription?.tier === plan.id;
            const isPopular = plan.id === 'pro';
            const features = getFeaturesList(plan);
            const buttonText = getButtonText(plan);
            const isDisabled = isButtonDisabled(plan);

            return (
              <div 
                key={plan.id} 
                className={`glass-card border-2 rounded-2xl p-8 relative flex flex-col pricing-card ${
                  isPopular ? 'border-blue-500 scale-105 shadow-2xl' : 
                  isCurrentPlan ? 'border-green-500 shadow-xl' : 
                  'border-white/10'
                }`}
              >
                {/* Badges */}
                {isPopular && (
                  <div className="absolute -top-3 right-5 bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg">
                    <Star className="h-3.5 w-3.5" />
                    Most Popular
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-3 right-5 bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Active
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2">{plan.name}</h2>
                  <p className="text-gray-400 text-sm mb-5">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold text-white">$</span>
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    {plan.interval && plan.interval !== 'lifetime' && (
                      <span className="text-xl text-gray-400">/{plan.interval}</span>
                    )}
                  </div>

                  {plan.trialDays && !isCurrentPlan && (
                    <div className="inline-flex items-center gap-1.5 bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 rounded-full text-sm text-purple-300">
                      <Clock className="h-3.5 w-3.5" />
                      {plan.trialDays} days free trial
                    </div>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8 flex-1">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm">
                      {feature.available ? (
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-gray-600 flex-shrink-0" />
                      )}
                      <span className={feature.available ? 'text-gray-200' : 'text-gray-600 line-through'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => !isDisabled && handleSelectPlan(plan.id)}
                  disabled={isDisabled}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                    isCurrentPlan ? 'bg-green-500 text-white cursor-default' :
                    isDisabled ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-60' :
                    'bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {processingPlanId === plan.id ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    buttonText
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Why Choose ErrorWise */}
        <div className="max-w-7xl mx-auto px-5 mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Why Choose ErrorWise?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card border border-white/10 rounded-2xl p-8 benefit-card">
              <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-5 mx-auto">
                <Zap className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">Lightning Fast</h3>
              <p className="text-gray-400 text-center text-sm">Get instant error analysis and solutions powered by cutting-edge AI technology</p>
            </div>

            <div className="glass-card border border-white/10 rounded-2xl p-8 benefit-card">
              <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-5 mx-auto">
                <Shield className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">Secure & Reliable</h3>
              <p className="text-gray-400 text-center text-sm">Your code and errors are processed securely with enterprise-grade infrastructure</p>
            </div>

            <div className="glass-card border border-white/10 rounded-2xl p-8 benefit-card">
              <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-5 mx-auto">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">Team Collaboration</h3>
              <p className="text-gray-400 text-center text-sm">Work together with your team to solve errors faster and share knowledge</p>
            </div>

            <div className="glass-card border border-white/10 rounded-2xl p-8 benefit-card">
              <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-5 mx-auto">
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">Continuous Learning</h3>
              <p className="text-gray-400 text-center text-sm">AI that learns from your codebase to provide increasingly accurate solutions</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-6xl mx-auto px-5 mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400 text-sm">Yes! You can cancel your subscription at any time. You'll retain access until the end of your billing period.</p>
            </div>

            <div className="glass-card border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">What happens after the trial?</h3>
              <p className="text-gray-400 text-sm">After your trial ends, you'll be automatically charged. Cancel anytime during the trial to avoid charges.</p>
            </div>

            <div className="glass-card border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">Can I upgrade or downgrade?</h3>
              <p className="text-gray-400 text-sm">Absolutely! You can change your plan at any time. Upgrades take effect immediately, downgrades at the next billing cycle.</p>
            </div>

            <div className="glass-card border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400 text-sm">We accept all major credit cards, debit cards, and UPI through our secure payment processor Dodo Payments.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-4xl mx-auto px-5">
          <div className="glass-card border border-blue-500/30 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to solve errors faster?</h2>
            <p className="text-xl text-gray-300 mb-8">Join thousands of developers who trust ErrorWise for their debugging needs</p>
            <button 
              onClick={() => {
                const proPlan = plans.find(p => p.id === 'pro');
                if (proPlan && !isButtonDisabled(proPlan)) {
                  handleSelectPlan('pro');
                }
              }}
              className="px-12 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;

