import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
    tier: string;
    price: number;
    interval: string;
    status: string;
  };
  billing: {
    nextBillingDate: string | null;
    amount: number;
    currency: string;
    interval: string;
    paymentMethod: string;
    lastPaymentDate: string | null;
  };
  subscription: {
    startDate: string | null;
    endDate: string | null;
    trialEndsAt: string | null;
    cancelAtPeriodEnd: boolean;
  };
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
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPlan = searchParams.get('selectedPlan');
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
    console.log('ðŸš€ fetchData started...');
    try {
      setLoading(true);
      console.log('â³ Loading set to TRUE');

      // Fetch plans
      console.log('ðŸ“¡ Fetching plans from API...');
      const plansResponse = await apiClient.get<{ plans: Plan[] }>('/subscriptions/plans');
      console.log('âœ… Plans API Response:', plansResponse);
      
      // apiClient.get() already returns response.data, so plansResponse IS the data
      const responseData = plansResponse as any;
      console.log('ðŸ“¦ Response data:', responseData);
      console.log('ðŸ“‹ Plans array:', responseData.plans);
      console.log('ðŸ“Š Plans count:', responseData.plans?.length);
      
      const plansData = responseData.plans || [];
      console.log('ðŸ’¾ Setting plans to state. Count:', plansData.length);
      setPlans(plansData);

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
        const billingResponse = await apiClient.get<BillingInfo>('/subscriptions/billing');
        const billingData = (billingResponse as any).data || billingResponse;
        setBillingInfo(billingData as any);
      } catch (billingError) {
        console.log('Could not fetch billing info');
      }

      // Fetch usage stats
      try {
        const usageResponse = await apiClient.get<UsageStats>('/subscriptions/usage');
        setUsageStats(usageResponse as any);
      } catch (usageError) {
        console.log('Could not fetch usage stats');
      }

      // Fetch history
      try {
        const historyResponse = await apiClient.get<{ history: HistoryItem[] }>('/subscriptions/history');
        const responseData = historyResponse as any;
        setHistory(responseData.history || []);
      } catch (historyError) {
        console.log('Could not fetch subscription history');
      }

      setError(null);
      console.log('âœ… No errors - clearing error state');
    } catch (err: any) {
      console.error('âŒ Error fetching subscription data:', err);
      console.error('âŒ Error details:', err.response?.data);
      setError(err.response?.data?.error || 'Failed to load subscription data');
    } finally {
      console.log('ðŸ FINALLY block executing...');
      setLoading(false);
      console.log('âœ… Loading set to FALSE');
      // Note: plans.length here shows OLD state due to closure
      console.log('ðŸ“Š Plans will render on next render cycle');
    }
  };

  const handleSelectPlan = async (planId: string) => {
    try {
      setProcessingPlanId(planId);
      setError(null);

      console.log('ðŸš€ Creating checkout for plan:', planId);
      
      const response = await apiClient.post<{ success?: boolean; data?: { url?: string; sessionUrl?: string }; sessionUrl?: string }>('/subscriptions/checkout', {
        planId,
        successUrl: `${window.location.origin}/subscription?success=true`,
        cancelUrl: `${window.location.origin}/subscription?cancelled=true`
      });

      console.log('ðŸ“¦ Checkout response:', response);

      const responseData = response as any;
      // Handle different response formats
      const redirectUrl = responseData.data?.url || responseData.sessionUrl || responseData.data?.sessionUrl;
      
      if (redirectUrl) {
        console.log('âœ… Redirecting to:', redirectUrl);
        window.location.href = redirectUrl;
      } else {
        console.log('âœ… Dev mode - reloading to show upgrade');
        // In dev mode, just reload to show the updated subscription
        window.location.reload();
      }
    } catch (err: any) {
      console.error('âŒ Checkout error:', err);
      console.error('âŒ Error response:', err.response);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create subscription');
      setProcessingPlanId(null);
    }
  };

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelFeedback, setCancelFeedback] = useState('');
  const [processingCancel, setProcessingCancel] = useState(false);

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const confirmCancelSubscription = async () => {
    if (!currentSubscription) return;
    
    try {
      setProcessingCancel(true);
      setError(null);

      await apiClient.post('/subscriptions/cancel', {
        reason: cancelReason,
        feedback: cancelFeedback
      });

      setShowCancelModal(false);
      setSuccess(true);
      
      // Refresh data
      await fetchData();
      
      // Show success message
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      console.error('Cancel error:', err);
      setError(err.response?.data?.error || 'Failed to cancel subscription');
    } finally {
      setProcessingCancel(false);
    }
  };

  const handleDowngradeInstead = () => {
    setShowCancelModal(false);
    // Downgrade to free plan instead of canceling
    if (currentSubscription?.tier === 'team') {
      handleSelectPlan('pro'); // Team -> Pro
    } else if (currentSubscription?.tier === 'pro') {
      setActiveTab('plans'); // Show plans to consider free
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
        { text: 'Email support', available: true }
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
        { text: 'Custom integrations', available: true }
      );
}

    return features;
  };

  const getButtonText = (plan: Plan): string => {
    if (!currentSubscription || currentSubscription.tier === 'free') {
      if (plan.id === 'free') return 'Current Plan';
      return `Upgrade to ${plan.name}`; 
    }

    if (currentSubscription.tier === plan.id) {
      // Show Cancel button for current active subscription (except free)
      if (plan.id !== 'free' && currentSubscription.status === 'active') {
        return 'Cancel Subscription';
      }
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
    // Don't disable current plan if it's active paid subscription (allow cancel)
    if (currentSubscription.tier === plan.id && plan.id !== 'free' && currentSubscription.status === 'active') {
      return false; // Allow clicking to cancel
    }
    return currentSubscription.tier === plan.id;
  };

  if (loading) {
    console.log('ðŸ”„ RENDERING: Loading state is TRUE - showing spinner');
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-16">
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-white text-lg">Loading subscription data...</p>
            <p className="text-gray-400 text-sm">Check browser console for details (F12)</p>
          </div>
        </div>
      </>
    );
  }

  console.log('âœ¨ RENDERING: Loading FALSE - showing main content');

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
            <button onClick={() => setError(null)} className="text-white" aria-label="Close error message">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-5 mb-16">
            {console.log('ðŸŽ¨ Rendering plans tab. Plans count:', plans.length, 'Plans:', plans)}
            {plans.length === 0 && !loading && (
              <div className="col-span-full text-center py-16">
                <div className="glass-card border border-white/10 rounded-2xl p-12">
                  <p className="text-white text-2xl mb-4 font-bold">âš ï¸ No plans available</p>
                  <p className="text-gray-400 mb-6">The plans API returned empty data</p>
                  <button
                    onClick={() => {
                      console.log('ðŸ”„ Manual refresh triggered');
                      fetchData();
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    ðŸ”„ Retry Loading Plans
                  </button>
                </div>
              </div>
            )}
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

                  <div className="text-center mb-6">


                    <h3 className="text-2xl font-bold text-white mb-2">


                      {plan.name}


                    </h3>


                    <div className="mb-2">


                      <span className="text-4xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">


                        ${plan.price}


                      </span>


                      <span className="text-gray-300 ml-2">


                        {plan.price === 0 ? 'forever' : plan.interval ? `per ${plan.interval}` : ''}


                      </span>


                    </div>


                    <p className="text-gray-200 text-sm">


                      {plan.description}


                    </p>


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
                    onClick={() => {
                      if (isDisabled) return;
                      // Check if this is current plan with cancel button
                      if (currentSubscription?.tier === plan.id && buttonText === 'Cancel Subscription') {
                        handleCancelSubscription();
                      } else {
                        handleSelectPlan(plan.id);
                      }
                    }}
                    disabled={isDisabled}
                    className={`w-full py-4 px-6 rounded-xl font-bold transition-all ${
                      buttonText === 'Cancel Subscription' ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg' :
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
                    <p className="text-gray-400 text-sm mt-1">Status: {billingInfo.currentPlan.status}</p>
                  </div>

                  {billingInfo.billing.nextBillingDate && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Next Billing Date</p>
                      <p className="text-white text-lg">
                        {new Date(billingInfo.billing.nextBillingDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-gray-400 text-sm mb-2">Payment Method</p>
                    <p className="text-white text-lg">
                      {billingInfo.billing.paymentMethod || 'Not set'}
                    </p>
                  </div>

                  {billingInfo.billing.lastPaymentDate && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Last Payment Date</p>
                      <p className="text-white text-lg">
                        {new Date(billingInfo.billing.lastPaymentDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-gray-400 text-sm mb-2">Billing Amount</p>
                    <p className="text-white text-lg">
                      ${billingInfo.billing.amount} {billingInfo.billing.currency} / {billingInfo.billing.interval}
                    </p>
                  </div>

                  {billingInfo.subscription.cancelAtPeriodEnd && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-yellow-400">
                        âš ï¸ Your subscription will be cancelled at the end of the current billing period
                      </p>
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
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <BarChart3 className="w-7 h-7 mr-3 text-blue-400" />
                Usage Statistics
              </h2>
              
              {usageStats ? (
                <div className="space-y-8">
                  {/* Current Plan Display */}
                  <div className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-300 text-sm mb-1">Current Plan</p>
                        <p className="text-2xl font-bold text-white capitalize">{usageStats.tier}</p>
                      </div>
                      {usageStats.tier !== 'team' && (
                        <button
                          onClick={() => setActiveTab('plans')}
                          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all shadow-lg"
                        >
                          Upgrade Plan
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Query Usage with Enhanced Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Query Usage</h3>
                        <p className="text-gray-400 text-sm">Monthly limit resets on the 1st</p>
                      </div>
                      <span className="text-white font-bold text-xl">
                        {usageStats.usage.queriesUsed} / {usageStats.usage.queriesLimit === -1 ? '∞' : usageStats.usage.queriesLimit}
                      </span>
                    </div>
                    
                    {usageStats.usage.queriesLimit !== -1 && (
                      <>
                        <div className="w-full bg-gray-700/50 rounded-full h-4 mb-3 overflow-hidden">
                          <div
                            className={`h-4 rounded-full transition-all duration-500 ${
                              usageStats.usage.percentage >= 90 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                              usageStats.usage.percentage >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                              'bg-gradient-to-r from-blue-500 to-cyan-400'
                            }`}
                            style={{ width: `${Math.min(usageStats.usage.percentage, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">{usageStats.usage.percentage.toFixed(0)}% used</span>
                          <span className="text-gray-400">
                            {usageStats.usage.queriesLimit - usageStats.usage.queriesUsed} remaining
                          </span>
                        </div>
                      </>
                    )}

                    {usageStats.usage.queriesLimit === -1 && (
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center">
                        <Zap className="w-5 h-5 text-green-400 mr-3" />
                        <span className="text-green-400 font-semibold">Unlimited queries - no restrictions!</span>
                      </div>
                    )}

                    {/* Quota Warnings */}
                    {usageStats.usage.queriesLimit !== -1 && usageStats.usage.percentage >= 90 && (
                      <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex items-start">
                          <Shield className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-red-400 font-semibold mb-2">⚠️ Almost out of queries!</p>
                            <p className="text-gray-300 text-sm mb-3">
                              You've used {usageStats.usage.percentage.toFixed(0)}% of your monthly limit. Upgrade now to get unlimited queries.
                            </p>
                            <button
                              onClick={() => setActiveTab('plans')}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all text-sm"
                            >
                              Upgrade to Pro - $3/month
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {usageStats.usage.queriesLimit !== -1 && usageStats.usage.percentage >= 70 && usageStats.usage.percentage < 90 && (
                      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-start">
                          <Clock className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-yellow-400 font-semibold mb-1">Approaching your limit</p>
                            <p className="text-gray-300 text-sm">
                              Consider upgrading to Pro for unlimited queries and advanced features.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Available Features */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Available Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-xl border ${usageStats.features.errorExplanation ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-700/30 border-gray-600/30'}`}>
                        <div className="flex items-center gap-3">
                          {usageStats.features.errorExplanation ? (
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                          <span className={`font-medium ${usageStats.features.errorExplanation ? 'text-white' : 'text-gray-500'}`}>
                            Error Explanations
                          </span>
                        </div>
                      </div>
                      
                      <div className={`p-4 rounded-xl border ${usageStats.features.fixSuggestions ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-700/30 border-gray-600/30'}`}>
                        <div className="flex items-center gap-3">
                          {usageStats.features.fixSuggestions ? (
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                          <span className={`font-medium ${usageStats.features.fixSuggestions ? 'text-white' : 'text-gray-500'}`}>
                            Fix Suggestions
                          </span>
                        </div>
                      </div>
                      
                      <div className={`p-4 rounded-xl border ${usageStats.features.codeExamples ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-700/30 border-gray-600/30'}`}>
                        <div className="flex items-center gap-3">
                          {usageStats.features.codeExamples ? (
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                          <span className={`font-medium ${usageStats.features.codeExamples ? 'text-white' : 'text-gray-500'}`}>
                            Code Examples
                          </span>
                        </div>
                      </div>
                      
                      <div className={`p-4 rounded-xl border ${usageStats.features.exportHistory ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-700/30 border-gray-600/30'}`}>
                        <div className="flex items-center gap-3">
                          {usageStats.features.exportHistory ? (
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                          <span className={`font-medium ${usageStats.features.exportHistory ? 'text-white' : 'text-gray-500'}`}>
                            Export History
                          </span>
                        </div>
                      </div>
                      
                      <div className={`p-4 rounded-xl border ${usageStats.features.teamFeatures ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-700/30 border-gray-600/30'}`}>
                        <div className="flex items-center gap-3">
                          {usageStats.features.teamFeatures ? (
                            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-500 flex-shrink-0" />
                          )}
                          <span className={`font-medium ${usageStats.features.teamFeatures ? 'text-white' : 'text-gray-500'}`}>
                            Team Features
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upgrade CTA for Free Users */}
                  {usageStats.tier === 'free' && (
                    <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl">
                      <div className="flex items-start">
                        <Star className="w-6 h-6 text-yellow-400 mr-4 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-lg mb-2">Unlock Premium Features</h4>
                          <p className="text-gray-300 mb-4">
                            Upgrade to Pro and get unlimited queries, advanced AI, code examples, and export capabilities for just $3/month.
                          </p>
                          <button
                            onClick={() => setActiveTab('plans')}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg"
                          >
                            Upgrade to Pro Now
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
                            {item.fromPlan} â†’ {item.toPlan}
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

      {/* Enhanced Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Cancel Subscription?</h2>
                <p className="text-gray-400">We'd hate to see you go! Let's explore your options.</p>
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Retention Offer - Downgrade Option */}
            <div className="mb-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Consider Downgrading Instead
              </h3>
              <p className="text-gray-300 mb-4">
                Not ready to commit? You can downgrade to a {currentSubscription?.tier === 'team' ? 'Pro or Free' : 'Free'} plan and keep access to ErrorWise.
              </p>
              <button
                onClick={handleDowngradeInstead}
                className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all"
              >
                {currentSubscription?.tier === 'team' ? 'Downgrade to Pro ($3/month)' : 'Downgrade to Free Plan'}
              </button>
            </div>

            {/* Reason Selection */}
            <div className="mb-6">
              <label htmlFor="cancel-reason" className="block text-white font-semibold mb-3">
                Why are you canceling? (Optional)
              </label>
              <select
                id="cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select a reason...</option>
                <option value="too_expensive">Too expensive</option>
                <option value="not_using">Not using it enough</option>
                <option value="missing_features">Missing features I need</option>
                <option value="found_alternative">Found a better alternative</option>
                <option value="technical_issues">Technical issues</option>
                <option value="temporary">Taking a break (temporary)</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Feedback */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-3">
                Any feedback to help us improve? (Optional)
              </label>
              <textarea
                value={cancelFeedback}
                onChange={(e) => setCancelFeedback(e.target.value)}
                placeholder="We'd love to hear your thoughts..."
                rows={4}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            {/* Warning */}
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm">
                <strong>Note:</strong> You'll lose access to {currentSubscription?.tier === 'team' ? 'team features, advanced AI, and priority support' : 'unlimited queries, code examples, and premium AI'} at the end of your billing period.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 px-6 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all"
              >
                Keep Subscription
              </button>
              <button
                onClick={confirmCancelSubscription}
                disabled={processingCancel}
                className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingCancel ? (
                  <>
                    <Loader2 className="inline w-4 h-4 animate-spin mr-2" />
                    Canceling...
                  </>
                ) : (
                  'Confirm Cancellation'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionPage;




















