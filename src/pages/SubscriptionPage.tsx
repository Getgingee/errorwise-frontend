import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../services/api';
import Navigation from '../components/Navigation';
import { CheckCircle, X, TrendingUp, Users, Zap, Shield, Clock, Star, Loader2, Calendar, CreditCard, History as HistoryIcon, BarChart3 } from 'lucide-react';
import { TierComparison, NewFeaturesHighlight } from '../components/TierFeatures';
import ReferralDashboard from '../components/subscription/ReferralDashboard';
import ComparePlansModal from '../components/subscription/ComparePlansModal';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  trialDays?: number;
  popular?: boolean;
  displayFeatures?: Array<{ text: string; available: boolean; highlight?: boolean; badge?: string }>;
  features: {
    dailyQueries?: number;
    monthlyQueries?: number;
    errorExplanation?: boolean;
    fixSuggestions?: boolean;
    codeExamples?: boolean;
    preventionTips?: boolean;
    documentationLinks?: boolean;
    exportHistory?: boolean;
    errorHistory?: string;
    urlScrapingContext?: boolean;
    multiLanguage?: boolean;
    advancedAnalysis?: boolean;
    teamFeatures?: boolean;
    sharedHistory?: boolean;
    teamDashboard?: boolean;
    teamMembers?: number;
    prioritySupport?: boolean;
    apiAccess?: boolean;
    maxTokens?: number;
    aiModel?: string;
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
  
  // Helper function to get the price for a tier from the plans data
  const getPriceForTier = (tier: string): string => {
    const plan = plans.find(p => p.id === tier);
    if (plan) return `$${plan.price}`;
    // Fallback prices if plans not loaded yet
    switch (tier) {
      case 'pro': return '$3';
      case 'team': return '$9';
      default: return '$0';
    }
  };

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
    console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ fetchData started...');
    try {
      setLoading(true);
      console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³ Loading set to TRUE');

      // Fetch plans
      console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ Fetching plans from API...');
      const plansResponse = await apiClient.get<{ plans: Plan[] }>('/subscriptions/plans');
      console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Plans API Response:', plansResponse);
      
      // apiClient.get() already returns response.data, so plansResponse IS the data
      const responseData = plansResponse as any;
      console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦ Response data:', responseData);
      console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¹ Plans array:', responseData.plans);
      console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â  Plans count:', responseData.plans?.length);
      
      const plansData = responseData.plans || [];
      console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ Setting plans to state. Count:', plansData.length);
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
      console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ No errors - clearing error state');
    } catch (err: any) {
      console.error('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ Error fetching subscription data:', err);
      console.error('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ Error details:', err.response?.data);
      setError(err.response?.data?.error || 'Failed to load subscription data');
    } finally {
      console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â FINALLY block executing...');
      setLoading(false);
      console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Loading set to FALSE');
      // Note: plans.length here shows OLD state due to closure
      console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â  Plans will render on next render cycle');
    }
  };

  const handleSelectPlan = async (planId: string) => {
    try {
      setProcessingPlanId(planId);
      setError(null);

      console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ Creating checkout for plan:', planId);
      
      const response = await apiClient.post<{ success?: boolean; data?: { url?: string; sessionUrl?: string }; sessionUrl?: string }>('/subscriptions/checkout', {
        planId,
        successUrl: `${window.location.origin}/subscription?success=true`,
        cancelUrl: `${window.location.origin}/subscription?cancelled=true`
      });

      console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦ Checkout response:', response);

      const responseData = response as any;
      // Handle different response formats
      const redirectUrl = responseData.data?.url || responseData.sessionUrl || responseData.data?.sessionUrl;
      
      if (redirectUrl) {
        console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Redirecting to:', redirectUrl);
        window.location.href = redirectUrl;
      } else {
        console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ Dev mode - reloading to show upgrade');
        // In dev mode, just reload to show the updated subscription
        window.location.reload();
      }
    } catch (err: any) {
      console.error('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ Checkout error:', err);
      console.error('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ Error response:', err.response);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create subscription');
      setProcessingPlanId(null);
    }
  };

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showComparePlansModal, setShowComparePlansModal] = useState(false);
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

  // USE BACKEND DISPLAYFEATURES - Single Source of Truth
  const getFeaturesList = (plan: Plan): Array<{ text: string; available: boolean }> => {
    // Use displayFeatures from backend if available (single source of truth)
    if (plan.displayFeatures && plan.displayFeatures.length > 0) {
      return plan.displayFeatures;
    }
    
    // Fallback only if backend didn't send displayFeatures (shouldn't happen)
    console.warn('Warning: Plan missing displayFeatures from backend:', plan.id);
    return [];
  };

  const getButtonText = (plan: Plan): string => {
    if (!currentSubscription || currentSubscription.tier === 'free') {
      if (plan.id === 'free') return 'Current Plan';
      return `Upgrade to ${plan.name}`; 
    }

    if (currentSubscription.tier === plan.id) {
      // Show Cancel button for current active subscription (except free)
      if (currentSubscription.status === 'active') {
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
    console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚ÂÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ RENDERING: Loading state is TRUE - showing spinner');
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

  console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ RENDERING: Loading FALSE - showing main content');

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
          <div className="max-w-7xl mx-auto px-5 mb-16">
            {/* New Features Highlight */}
            <NewFeaturesHighlight />
            
            {/* Tier Comparison */}
            <TierComparison 
              currentTier={currentSubscription?.tier as 'free' | 'pro' | 'team'}
              onUpgrade={async (tier) => {
                await handleSelectPlan(tier);
              }}
            />
            
            {/* Original plan cards below for fallback */}
            <div className="mt-12 text-center text-gray-400 text-sm">
              <p>Or view detailed plan breakdown below</p>
            </div>
          </div>
        )}

        {/* Keep original plans rendering for compatibility */}
        {activeTab === 'plans' && false && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-5 mb-16">
            
            {plans.length === 0 && !loading && (
              <div className="col-span-full text-center py-16">
                <div className="glass-card border border-white/10 rounded-2xl p-12">
                  <p className="text-white text-2xl mb-4 font-bold">ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â No plans available</p>
                  <p className="text-gray-400 mb-6">The plans API returned empty data</p>
                  <button
                    onClick={() => {
                      console.log('ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚ÂÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ Manual refresh triggered');
                      fetchData();
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚ÂÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ Retry Loading Plans
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
                      <li key={index} className={`flex items-center gap-3 text-sm ${feature.highlight ? 'py-1' : ''}`}>
                        {feature.available ? (
                          <CheckCircle className={`h-4 w-4 flex-shrink-0 ${feature.highlight ? 'text-cyan-400' : 'text-green-400'}`} />
                        ) : (
                          <X className="h-4 w-4 text-gray-600 flex-shrink-0" />
                        )}
                        <span className={`${feature.available ? (feature.highlight ? 'text-white font-semibold' : 'text-gray-200') : 'text-gray-600 line-through'}`}>
                          {feature.text}
                        </span>
                        {feature.badge && (
                          <span className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${
                            feature.badge === 'NEW' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                            feature.badge === 'Live' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          }`}>
                            {feature.badge}
                          </span>
                        )}
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
                      {billingInfo.currentPlan.name} - {billingInfo.currentPlan.status === 'trial' ? 'Free Trial' : `$${billingInfo.currentPlan.price}/${billingInfo.currentPlan.interval}`}
                    </p>
                    <p className={`text-sm mt-1 ${billingInfo.currentPlan.status === 'trial' ? 'text-green-400' : 'text-gray-400'}`}>
                      Status: {billingInfo.currentPlan.status === 'trial' ? '🎉 Free Trial Active' : billingInfo.currentPlan.status}
                    </p>
                  </div>

                  {/* Show trial end date for trial users */}
                  {billingInfo.currentPlan.status === 'trial' && billingInfo.subscription.trialEndsAt && (
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">Trial Ends</p>
                      <p className="text-green-400 text-lg font-medium">
                        {new Date(billingInfo.subscription.trialEndsAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">Add a payment method to continue after trial</p>
                    </div>
                  )}

                  {/* Show next billing date for paid active users */}
                  {billingInfo.currentPlan.status === 'active' && billingInfo.billing.nextBillingDate && (
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
                      {billingInfo.currentPlan.status === 'trial' 
                        ? 'Not required during trial' 
                        : (billingInfo.billing.paymentMethod || 'Not set')}
                    </p>
                  </div>

                  {/* Show subscription start date for trial, last payment for paid */}
                  {billingInfo.billing.lastPaymentDate && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">
                        {billingInfo.currentPlan.status === 'trial' ? 'Trial Started' : 'Last Payment Date'}
                      </p>
                      <p className="text-white text-lg">
                        {new Date(billingInfo.billing.lastPaymentDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}

                  {/* Only show billing amount for paid users */}
                  {billingInfo.currentPlan.status !== 'trial' && billingInfo.currentPlan.status !== 'free' && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Billing Amount</p>
                      <p className="text-white text-lg">
                        ${billingInfo.billing.amount} {billingInfo.billing.currency} / {billingInfo.billing.interval}
                      </p>
                    </div>
                  )}

                  {billingInfo.subscription.cancelAtPeriodEnd && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-yellow-400">
                        ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â Your subscription will be cancelled at the end of the current billing period
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Your Current Plan</p>
                        <p className="text-2xl font-bold text-white capitalize">{currentSubscription?.tier || 'Free'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm mb-1">Monthly Cost</p>
                        <p className="text-2xl font-bold text-cyan-400">{getPriceForTier(currentSubscription?.tier || 'free')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-gray-400 text-sm mb-2">Payment Method</p>
                      <p className="text-white font-medium">{currentSubscription?.tier === 'free' || !currentSubscription ? 'No payment required' : 'Card on file'}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-gray-400 text-sm mb-2">Billing Cycle</p>
                      <p className="text-white font-medium">{currentSubscription?.tier === 'free' || !currentSubscription ? 'N/A' : 'Monthly'}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-gray-400 text-sm mb-2">Next Billing Date</p>
                      <p className="text-white font-medium">{currentSubscription?.tier === 'free' || !currentSubscription ? 'N/A' : '1st of next month'}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-gray-400 text-sm mb-2">Status</p>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">Active</span>
                    </div>
                  </div>
                  {(!currentSubscription || currentSubscription?.tier === 'free') && (
                    <div className="p-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div><p className="text-white font-semibold mb-1">Upgrade to Pro</p><p className="text-gray-400 text-sm">Get unlimited queries & premium features</p></div>
                        <button onClick={() => setActiveTab('plans')} className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all">View Plans</button>
                      </div>
                    </div>
                  )}
                </div>
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
                        {usageStats.usage.queriesUsed} / {usageStats.usage.queriesLimit === -1 ? '8' : usageStats.usage.queriesLimit}
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
                            <p className="text-red-400 font-semibold mb-2">?? Almost out of queries!</p>
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
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Current Plan</p>
                        <p className="text-2xl font-bold text-white capitalize">{currentSubscription?.tier || 'Free'}</p>
                      </div>
                      {(!currentSubscription || currentSubscription?.tier !== 'team') && (
                        <button onClick={() => setActiveTab('plans')} className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all">Upgrade</button>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div><h3 className="text-lg font-semibold text-white">Query Usage</h3><p className="text-gray-400 text-sm">Monthly limit resets on the 1st</p></div>
                      <span className="text-white font-bold text-xl">0 / {currentSubscription?.tier === 'pro' ? '' : currentSubscription?.tier === 'team' ? '' : '50'}</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-4 mb-3 overflow-hidden">
                      <div className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500" style={{ width: '0%' }} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">0% used</span>
                      <span className="text-gray-400">{currentSubscription?.tier === 'pro' || currentSubscription?.tier === 'team' ? 'Unlimited remaining' : '50 remaining'}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Available Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border bg-green-500/10 border-green-500/30"><div className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-400" /><span className="font-medium text-white">Error Explanations</span></div></div>
                      <div className="p-4 rounded-xl border bg-green-500/10 border-green-500/30"><div className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-400" /><span className="font-medium text-white">Fix Suggestions</span></div></div>
                      <div className={`p-4 rounded-xl border ${currentSubscription?.tier !== 'free' ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-700/30 border-gray-600/30'}`}><div className="flex items-center gap-3">{currentSubscription?.tier !== 'free' ? <CheckCircle className="h-5 w-5 text-green-400" /> : <X className="h-5 w-5 text-gray-500" />}<span className={`font-medium ${currentSubscription?.tier !== 'free' ? 'text-white' : 'text-gray-500'}`}>Web Search</span></div></div>
                      <div className={`p-4 rounded-xl border ${currentSubscription?.tier !== 'free' ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-700/30 border-gray-600/30'}`}><div className="flex items-center gap-3">{currentSubscription?.tier !== 'free' ? <CheckCircle className="h-5 w-5 text-green-400" /> : <X className="h-5 w-5 text-gray-500" />}<span className={`font-medium ${currentSubscription?.tier !== 'free' ? 'text-white' : 'text-gray-500'}`}>Follow-up Questions</span></div></div>
                      <div className={`p-4 rounded-xl border ${currentSubscription?.tier !== 'free' ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-700/30 border-gray-600/30'}`}><div className="flex items-center gap-3">{currentSubscription?.tier !== 'free' ? <CheckCircle className="h-5 w-5 text-green-400" /> : <X className="h-5 w-5 text-gray-500" />}<span className={`font-medium ${currentSubscription?.tier !== 'free' ? 'text-white' : 'text-gray-500'}`}>Export History</span></div></div>
                      <div className={`p-4 rounded-xl border ${currentSubscription?.tier === 'team' ? 'bg-green-500/10 border-green-500/30' : 'bg-gray-700/30 border-gray-600/30'}`}><div className="flex items-center gap-3">{currentSubscription?.tier === 'team' ? <CheckCircle className="h-5 w-5 text-green-400" /> : <X className="h-5 w-5 text-gray-500" />}<span className={`font-medium ${currentSubscription?.tier === 'team' ? 'text-white' : 'text-gray-500'}`}>Team Features</span></div></div>
                    </div>
                  </div>
                  {(!currentSubscription || currentSubscription?.tier === 'free') && (
                    <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                      <div className="flex items-start gap-4">
                        <Star className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-lg mb-2">Unlock Premium Features</h4>
                          <p className="text-gray-300 mb-4">Upgrade to Pro for unlimited queries, web search, follow-ups, and more - just $3/month.</p>
                          <button onClick={() => setActiveTab('plans')} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg">Upgrade to Pro Now</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
                            {item.fromPlan} ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ {item.toPlan}
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
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">Account Created</p>
                        <p className="text-gray-400 text-sm">Started with Free plan</p>
                      </div>
                      <p className="text-gray-500 text-sm">Today</p>
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-500/10 rounded-xl text-center">
                    <HistoryIcon className="w-12 h-12 text-blue-400/50 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">Your subscription changes will appear here</p>
                    <p className="text-gray-500 text-sm">Upgrades, downgrades, and billing events</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Referral Dashboard - F3: Earn free months */}
      <div className="mt-8">
        <div className="max-w-4xl mx-auto px-5">
          <ReferralDashboard />
        </div>
      </div>

      {/* Compare Plans Modal - E2: Side-by-side comparison */}
      <ComparePlansModal 
        isOpen={showComparePlansModal} 
        onClose={() => setShowComparePlansModal(false)}
        currentPlan={currentSubscription?.tier || 'free'}
      />

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























