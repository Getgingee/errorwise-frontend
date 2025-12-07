// Compare Plans Modal (E2)
// Free vs Pro vs Team comparison modal with tracking

import React, { useState, useEffect } from 'react';
import { X, Check, Crown, Users, Zap, Sparkles } from 'lucide-react';
import apiClient from '../../services/api';

interface Plan {
  id: string;
  name: string;
  price: number;
  yearlyPrice?: number;
  priceLabel: string;
  yearlyPriceLabel?: string;
  description: string;
  queryLimit: number;
  popular?: boolean;
  isCurrent?: boolean;
  disabled?: boolean;
  features: Array<{
    text: string;
    included: boolean;
    highlight?: boolean;
  }>;
  cta: string;
  ctaVariant: string;
}

interface QueryPack {
  id: string;
  queries: number;
  price: number;
  priceLabel: string;
  pricePerQuery: string;
  popular?: boolean;
  description: string;
}

interface ComparePlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}

const ComparePlansModal: React.FC<ComparePlansModalProps> = ({
  isOpen,
  onClose,
  source = 'unknown'
}) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [queryPacks, setQueryPacks] = useState<QueryPack[]>([]);
  const [currentTier, setCurrentTier] = useState('free');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [showPacks, setShowPacks] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
      trackModalOpen();
    }
  }, [isOpen]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/plans/compare');
      const data = (response as any).data || response;
      setPlans(data.plans || []);
      setQueryPacks(data.queryPacks || []);
      setCurrentTier(data.currentTier || 'free');
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackModalOpen = async () => {
    try {
      await apiClient.post('/plans/track-modal-open', {
        source,
        page: window.location.pathname
      });
    } catch (error) {
      console.error('Failed to track modal open:', error);
    }
  };

  const handleSelectPlan = async (planId: string) => {
    try {
      await apiClient.post('/plans/track-select', { planId, billingCycle });
    } catch (error) {
      console.error('Failed to track plan selection:', error);
    }
  };

  const handleUpgradeClick = async (planId: string) => {
    try {
      await apiClient.post('/plans/track-upgrade-click', { 
        planId, 
        billingCycle,
        isQueryPack: false 
      });
    } catch (error) {
      console.error('Failed to track upgrade click:', error);
    }
    // Navigate to checkout
    window.location.href = `/subscription?plan=${planId}&cycle=${billingCycle}`;
  };

  const handlePackClick = async (packId: string) => {
    try {
      await apiClient.post('/plans/track-upgrade-click', { 
        planId: packId,
        isQueryPack: true,
        packId 
      });
    } catch (error) {
      console.error('Failed to track pack click:', error);
    }
    window.location.href = `/subscription?pack=${packId}`;
  };

  if (!isOpen) return null;

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'pro': return <Crown className="w-6 h-6 text-purple-400" />;
      case 'team': return <Users className="w-6 h-6 text-blue-400" />;
      default: return <Zap className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-5xl bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div>
              <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
              <p className="text-gray-400 mt-1">Unlock more power with Pro or Team</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center p-4">
            <div className="inline-flex items-center bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yearly <span className="text-green-400 ml-1">Save 17%</span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`relative rounded-xl border-2 p-6 transition-all cursor-pointer ${
                      plan.popular
                        ? 'border-purple-500 bg-purple-500/10'
                        : plan.isCurrent
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                        MOST POPULAR
                      </div>
                    )}
                    
                    {plan.isCurrent && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                        CURRENT PLAN
                      </div>
                    )}

                    {plan.id === 'team' && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                         COMING SOON
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      {getPlanIcon(plan.id)}
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    </div>

                    <div className="mb-4">
                      <span className="text-3xl font-bold text-white">
                        {billingCycle === 'yearly' && plan.yearlyPrice
                          ? `$${plan.yearlyPrice}`
                          : plan.price === 0
                          ? 'Free'
                          : `$${plan.price}`}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-400 ml-1">
                          /{billingCycle === 'yearly' ? 'year' : 'month'}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                    <ul className="space-y-3 mb-6">
                      {plan.features.slice(0, 6).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className={`w-5 h-5 flex-shrink-0 ${
                            feature.included
                              ? feature.highlight
                                ? 'text-green-400'
                                : 'text-gray-400'
                              : 'text-gray-600'
                          }`} />
                          <span className={`text-sm ${
                            feature.included
                              ? feature.highlight
                                ? 'text-green-300'
                                : 'text-gray-300'
                              : 'text-gray-600 line-through'
                          }`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!plan.disabled) handleUpgradeClick(plan.id);
                      }}
                      disabled={plan.disabled}
                      className={`w-full py-3 rounded-lg font-medium transition-all ${
                        plan.disabled
                          ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                          : plan.popular
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-white'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Query Packs Section */}
          <div className="p-6 border-t border-slate-700">
            <button
              onClick={() => setShowPacks(!showPacks)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              <span>Or buy one-time query packs</span>
              <span className={`transform transition-transform ${showPacks ? 'rotate-180' : ''}`}>
                
              </span>
            </button>

            {showPacks && queryPacks.length > 0 && (
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                {queryPacks.map((pack) => (
                  <div
                    key={pack.id}
                    onClick={() => handlePackClick(pack.id)}
                    className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                      pack.popular
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {pack.popular && (
                      <span className="absolute -top-2 right-2 px-2 py-0.5 bg-amber-500 text-black text-xs font-bold rounded">
                        BEST VALUE
                      </span>
                    )}
                    <div className="text-2xl font-bold text-white mb-1">
                      {pack.queries} queries
                    </div>
                    <div className="text-lg text-blue-400 font-medium">
                      {pack.priceLabel}
                    </div>
                    <div className="text-sm text-gray-500">
                      {pack.pricePerQuery}/query
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePlansModal;
