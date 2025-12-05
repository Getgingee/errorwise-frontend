import React from 'react';
import { API_ENDPOINTS } from '../../config/api';
import { X, Check, Zap, Star, Crown, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PricingInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: any;
  popular?: boolean;
  description?: string;
  trialDays?: number;
}

const PricingInfoModal: React.FC<PricingInfoModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [plans, setPlans] = React.useState<PricingPlan[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Handle plan selection and redirect
  const handlePlanClick = (plan: any) => {
    const planNameLower = plan.name.toLowerCase();
    
    // Close the modal first
    onClose();
    
    // Redirect based on plan
    if (plan.price === 0) {
      // Free plan - redirect to registration
      navigate('/register');
    } else if (planNameLower.includes('pro')) {
      // Pro plan - redirect to login with plan parameter for post-auth flow
      navigate('/login?plan=pro');
    } else if (planNameLower.includes('team')) {
      // Team plan - redirect to login with plan parameter
      navigate('/login?plan=team');
    } else {
      // Default - redirect to registration
      navigate('/register');
    }
  };

  // Fetch pricing plans from backend
  React.useEffect(() => {
    if (!isOpen) return;

    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(API_ENDPOINTS.subscriptions.plans);
        
        if (!response.ok) {
          throw new Error('Failed to fetch pricing plans');
        }
        
        const data = await response.json();
        setPlans(data.plans || []);
      } catch (err) {
        console.error('Error fetching pricing plans:', err);
        setError('Failed to load pricing. Please try again later.');
        // Fallback to hardcoded plans
        setPlans([
          {
            id: 'free',
            name: 'Free',
            price: 0,
            interval: 'month',
            features: {
              monthlyQueries: 50,
              errorExplanation: true,
              fixSuggestions: false,
              codeExamples: false,
              errorHistory: '7 days',
              supportLevel: 'community'
            },
            description: 'Perfect for trying out ErrorWise'
          },
          {
            id: 'pro',
            name: 'Pro',
            price: 3,
            interval: 'month',
            features: {
              dailyQueries: -1,
              errorExplanation: true,
              fixSuggestions: true,
              codeExamples: true,
              errorHistory: '30 days',
              supportLevel: 'email'
            },
            description: 'For serious developers',
            popular: true,
            trialDays: 7
          },
          {
            id: 'team',
            name: 'Team',
            price: 8,
            interval: 'month',
            features: {
              dailyQueries: -1,
              errorExplanation: true,
              fixSuggestions: true,
              codeExamples: true,
              errorHistory: 'unlimited',
              supportLevel: 'priority',
              teamFeatures: true
            },
            description: 'For teams & collaboration',
            trialDays: 7
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [isOpen]);

  if (!isOpen) return null;

  // Format features from backend data structure
  const formatFeatures = (features: any): string[] => {
    if (!features) return [];
    
    const featureList: string[] = [];
    
    // Monthly/Daily queries
    if (features.monthlyQueries !== undefined) {
      if (features.monthlyQueries === -1) {
        featureList.push('Unlimited queries per month');
      } else {
        featureList.push(`${features.monthlyQueries} queries per month`);
      }
    } else if (features.dailyQueries !== undefined) {
      if (features.dailyQueries === -1) {
        featureList.push('Unlimited queries');
      } else {
        featureList.push(`${features.dailyQueries} queries per day`);
      }
    }
    
    // Core features
    if (features.errorExplanation) featureList.push('AI error explanations');
    if (features.fixSuggestions) featureList.push('Fix suggestions');
    if (features.codeExamples) featureList.push('Code examples');
    if (features.documentationLinks) featureList.push('Documentation links');
    
    // History
    if (features.errorHistory) {
      featureList.push(`${features.errorHistory} error history`);
    }
    
    // Support
    if (features.supportLevel) {
      const supportMap: Record<string, string> = {
        community: 'Community support',
        email: 'Email support',
        priority: 'Priority support',
        dedicated: 'Dedicated support'
      };
      featureList.push(supportMap[features.supportLevel] || `${features.supportLevel} support`);
    }
    
    // Advanced features
    if (features.advancedAnalysis) featureList.push('Advanced analysis');
    if (features.priorityQueue) featureList.push('Priority queue');
    if (features.multiLanguageSupport) featureList.push('Multi-language support');
    if (features.teamFeatures) featureList.push('Team features');
    if (features.exportHistory) featureList.push('Export history');
    
    return featureList;
  };

  // Map plan names to icons
  const getIconForPlan = (planName: string) => {
    const nameLower = planName.toLowerCase();
    if (nameLower.includes('free')) return Zap;
    if (nameLower.includes('pro')) return Star;
    if (nameLower.includes('team') || nameLower.includes('enterprise')) return Crown;
    return Star;
  };

  // Get appropriate CTA button text based on plan
  const getCTAText = (plan: PricingPlan): string => {
    const planNameLower = plan.name.toLowerCase();
    
    // Free plan
    if (plan.price === 0) {
      return 'Get Started';
    }
    
    // Pro plan with trial
    if (plan.trialDays) {
      return 'Upgrade';
    }
    
    // Pro plan without trial
    if (planNameLower.includes('pro') && plan.price) {
      return 'Upgrade to Pro';
    }
    
    // Team/Enterprise plan (custom pricing)
    if (!plan.price || plan.price > 10) {
      return 'Sign Up Required';
    }
    
    // Default
    return 'Upgrade';
  };

  // Convert backend plans to display format
  const displayPlans = plans.map(plan => ({
    name: plan.name,
    price: plan.price === 0 ? '$0' : plan.price ? `$${plan.price}` : 'Custom',
    period: plan.price === 0 ? 'forever' : plan.price ? `per ${plan.interval}` : 'contact us',
    icon: getIconForPlan(plan.name),
    description: plan.description || 'No description available',
    features: formatFeatures(plan.features),
    cta: getCTAText(plan),
    popular: plan.popular || false
  }));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 scrollbar-hide">
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 border border-white/20 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="sticky top-0 bg-white/10 backdrop-blur-md border-b border-white/10 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Pricing Plans</h2>
            <p className="text-blue-100 mt-1">Choose the perfect plan for your needs</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 backdrop-blur-sm rounded-lg transition-colors"
            aria-label="Close pricing modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin text-blue-300" size={48} />
              <span className="ml-3 text-gray-600 dark:text-gray-300">Loading pricing...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Plans Grid */}
          {!loading && displayPlans.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              {displayPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative p-6 rounded-xl border ${
                    plan.popular
                      ? 'border-blue-500/50 shadow-xl shadow-blue-500/20 scale-105 bg-white/10 backdrop-blur-md'
                      : 'border-white/20 bg-white/5 backdrop-blur-sm'
                  } transition-all duration-300 hover:scale-105 hover:border-blue-400/50 hover:shadow-2xl`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="inline-flex p-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-4 shadow-lg">
                      <plan.icon className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-gray-300 ml-2">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-gray-200 text-sm">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="text-green-400 mr-2 flex-shrink-0" size={20} />
                        <span className="text-gray-200 text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePlanClick(plan)}
                    className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-xl hover:scale-105'
                        : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* FAQ Section */}
          <div className="mt-8 p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-white dark:text-white">Can I change plans later?</p>
                <p className="text-gray-300">Yes, you can upgrade or downgrade anytime.</p>
              </div>
              <div>
                <p className="font-semibold text-white dark:text-white">Is there a free trial?</p>
                <p className="text-gray-300">You can upgrade anytime and start using premium features immediately.</p>
              </div>
              <div>
                <p className="font-semibold text-white dark:text-white">What payment methods do you accept?</p>
                <p className="text-gray-300">We accept all major credit cards via Dodo Payments.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingInfoModal;








