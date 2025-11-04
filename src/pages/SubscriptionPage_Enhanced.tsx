import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import Navigation from '../components/Navigation';
import { CheckCircle, X, TrendingUp, Users, Zap, Shield, Clock, Star, Loader2, Calendar, CreditCard, History as HistoryIcon, BarChart3 } from 'lucide-react';

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

interface BillingInfo {
  currentPlan: {
    name: string;
    price: number;
    interval: string;
  };
  nextBillingDate: string | null;
  paymentMethod: {
    type: string;
    last4: string;
  } | null;
  billingHistory: Array<{
    date: string;
    amount: number;
    status: string;
    invoiceUrl?: string;
  }>;
}

interface UsageStats {
  tier: string;
  usage: {
    queriesUsed: number;
    queriesLimit: number;
    percentage: number;
  };
  features: {
    errorExplanation: boolean;
    fixSuggestions: boolean;
    codeExamples: boolean;
    exportHistory: boolean;
    teamFeatures: boolean;
  };
}

interface HistoryItem {
  id: string;
  type: 'upgrade' | 'downgrade' | 'cancelled' | 'renewed';
  fromPlan: string;
  toPlan: string;
  date: string;
  amount?: number;
}

type TabType = 'plans' | 'billing' | 'usage' | 'history';

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('plans');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
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

      // Fetch plans
      const plansResponse = await apiClient.get('/subscriptions/plans');
      setPlans(Array.isArray(plansResponse.data) ? plansResponse.data : []);

      // Fetch current subscription
      try {
        const subscriptionResponse = await apiClient.get('/subscriptions');
        const subscriptionData = subscriptionResponse.data;
        setCurrentSubscription(subscriptionData && Object.keys(subscriptionData).length > 0 ? subscriptionData as Subscription : null);
      } catch (subError) {
        console.log('No active subscription');
      }

      // Fetch billing info
      try {
        const billingResponse = await apiClient.get('/subscriptions/billing');
        setBillingInfo(billingResponse.data as BillingInfo);
      } catch (billingError) {
        console.log('Could not fetch billing info');
      }

      // Fetch usage stats
      try {
        const usageResponse = await apiClient.get('/subscriptions/usage');
        setUsageStats(usageResponse.data as UsageStats);
      } catch (usageError) {
        console.log('Could not fetch usage stats');
      }

      // Fetch history
      try {
        const historyResponse = await apiClient.get('/subscriptions/history');
        setHistory(Array.isArray(historyResponse.data) ? historyResponse.data : []);
      } catch (historyError) {
        console.log('Could not fetch subscription history');
      }

      setError(null);
    } catch (err: any) {
      console.error('Error fetching subscription data:', err);
      setError(err.response?.data?.error || 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  interface CheckoutResponse {
    sessionUrl: string;
    [key: string]: any;
  }

  const handleSelectPlan = async (planId: string) => {
    try {
      setProcessingPlanId(planId);
      setError(null);

      const response = await apiClient.post<CheckoutResponse>('/subscriptions/checkout', {
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
        { text: 'Claude Haiku AI (1200 tokens)', available: true },
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
        { text: 'Claude Sonnet AI (2000 tokens)', available: true },
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-white text-lg">Loading subscription data...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
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
        `}</style>

        {/* Success Banner */}
        {success && (
          <div className="bg-green-500 rounded-xl p-5 mx-auto my-5 max-w-3xl flex items-center gap-4">
            <CheckCircle className="h-6 w-6 text-white" />
            <div>
              <h3 className="text-white text-xl font-bold">Payment Successful!</h3>
              <p className="text-white/90">Your subscription has been activated.</p>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500 rounded-xl p-5 mx-auto my-5 max-w-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <X className="h-6 w-6 text-white" />
              <p className="text-white">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-white"
              title="Dismiss error"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="text-center pt-16 pb-10 px-5 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-5 bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
            Subscription Management
          </h1>
          {currentSubscription && (
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/50 px-5 py-2.5 rounded-full mb-6">
              <Shield className="h-4 w-4 text-blue-400" />
              <span className="text-white text-sm">
                Current: {currentSubscription.tier.toUpperCase()}
                {currentSubscription.status === 'trial' && ' (Trial)'}
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-5 mb-10">
          <div className="flex gap-2 glass-card border border-white/10 rounded-xl p-2">
            <button
              onClick={() => setActiveTab('plans')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'plans'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <Calendar className="inline h-5 w-5 mr-2" />
              Plans
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'billing'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <CreditCard className="inline h-5 w-5 mr-2" />
              Billing
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'usage'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <BarChart3 className="inline h-5 w-5 mr-2" />
              Usage
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <HistoryIcon className="inline h-5 w-5 mr-2" />
              History
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-5">
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
                    isPopular ? 'border-blue-500 scale-105' :
                    isCurrentPlan ? 'border-green-500' :
                    'border-white/10'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 right-5 bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5">
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

                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white mb-2">{plan.name}</h2>
                    <p className="text-gray-400 text-sm mb-5">{plan.description}</p>
                    
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-2xl font-bold text-white">$</span>
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      {plan.interval && <span className="text-xl text-gray-400">/{plan.interval}</span>}
                    </div>

                    {plan.trialDays && !isCurrentPlan && (
                      <div className="inline-flex items-center gap-1.5 bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 rounded-full text-sm text-purple-300">
                        <Clock className="h-3.5 w-3.5" />
                        {plan.trialDays} days free trial
                      </div>
                    )}
                  </div>

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

                  <button
                    onClick={() => !isDisabled && handleSelectPlan(plan.id)}
                    disabled={isDisabled}
                    className={`w-full py-4 px-6 rounded-xl font-bold transition-all ${
                      isCurrentPlan ? 'bg-green-500 text-white cursor-default' :
                      isDisabled ? 'bg-gray-700 text-gray-400 cursor-not-allowed' :
                      'bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white shadow-lg'
                    }`}
                  >
                    {processingPlanId === plan.id ? (
                      <>
                        <Loader2 className="inline h-5 w-5 animate-spin mr-2" />
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
        )}

        {activeTab === 'billing' && (
          <div className="max-w-4xl mx-auto px-5">
            <div className="glass-card border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Billing Information</h2>
              
              {billingInfo ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Current Plan</p>
                    <p className="text-white text-xl font-bold">
                      {billingInfo.currentPlan.name} - ${billingInfo.currentPlan.price}/{billingInfo.currentPlan.interval}
                    </p>
                  </div>

                  {billingInfo.nextBillingDate && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Next Billing Date</p>
                      <p className="text-white text-lg">
                        {new Date(billingInfo.nextBillingDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}

                  {billingInfo.paymentMethod && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Payment Method</p>
                      <p className="text-white text-lg">
                        {billingInfo.paymentMethod.type} ending in {billingInfo.paymentMethod.last4}
                      </p>
                    </div>
                  )}

                  {billingInfo.billingHistory.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm mb-4">Billing History</p>
                      <div className="space-y-2">
                        {billingInfo.billingHistory.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                            <div>
                              <p className="text-white">
                                {new Date(item.date).toLocaleDateString()}
                              </p>
                              <p className="text-gray-400 text-sm">{item.status}</p>
                            </div>
                            <p className="text-white font-bold">${item.amount}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400">No billing information available</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="max-w-4xl mx-auto px-5">
            <div className="glass-card border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Usage Statistics</h2>
              
              {usageStats ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Queries Used</span>
                      <span className="text-white font-bold">
                        {usageStats.usage.queriesUsed} / {usageStats.usage.queriesLimit === -1 ? 'Unlimited' : usageStats.usage.queriesLimit}
                      </span>
                    </div>
                    {usageStats.usage.queriesLimit !== -1 && (
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-blue-500 h-3 rounded-full transition-all"
                          style={{ width: `${Math.min(usageStats.usage.percentage, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm mb-4">Available Features</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        {usageStats.features.errorExplanation ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <X className="h-4 w-4 text-red-400" />
                        )}
                        <span className="text-white text-sm">Error Explanations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {usageStats.features.fixSuggestions ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <X className="h-4 w-4 text-red-400" />
                        )}
                        <span className="text-white text-sm">Fix Suggestions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {usageStats.features.codeExamples ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <X className="h-4 w-4 text-red-400" />
                        )}
                        <span className="text-white text-sm">Code Examples</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {usageStats.features.exportHistory ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <X className="h-4 w-4 text-red-400" />
                        )}
                        <span className="text-white text-sm">Export History</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {usageStats.features.teamFeatures ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <X className="h-4 w-4 text-red-400" />
                        )}
                        <span className="text-white text-sm">Team Features</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No usage data available</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto px-5">
            <div className="glass-card border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Subscription History</h2>
              
              {history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div key={item.id} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-semibold capitalize">{item.type}</p>
                          <p className="text-gray-400 text-sm">
                            {item.fromPlan} → {item.toPlan}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(item.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {item.amount !== undefined && (
                          <p className="text-white font-bold">${item.amount}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No subscription history available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SubscriptionPage;
