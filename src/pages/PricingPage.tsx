import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { subscriptionService, Plan } from '../services/subscription';
import { trialService } from '../services/trialService';
import { PlanCard } from '../components/subscription/PlanCard';
import { Loader2, AlertCircle, Check, Sparkles, Shield, CreditCard, Clock, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [startingTrial, setStartingTrial] = useState<string | null>(null);
  const [trialEligible, setTrialEligible] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadPlans();
    checkTrialEligibility();
    
    // Handle trial cancellation redirect
    if (searchParams.get('trial') === 'cancelled') {
      toast.error('Trial checkout was cancelled');
    }
  }, [searchParams]);

  async function loadPlans() {
    try {
      setLoading(true);
      const response = await subscriptionService.getPlans();
      setPlans(response.plans || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load plans:', err);
      setError(err instanceof Error ? err.message : 'Failed to load pricing plans');
    } finally {
      setLoading(false);
    }
  }

  async function checkTrialEligibility() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setTrialEligible(true); // Show trial option to logged-out users
        return;
      }
      const eligibility = await trialService.checkEligibility();
      setTrialEligible(eligibility.eligible);
    } catch (err) {
      console.error('Failed to check trial eligibility:', err);
      setTrialEligible(false);
    }
  }

  async function handleStartTrial(planId: 'pro' | 'team') {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate(`/login?redirect=/pricing&trial=${planId}`);
      return;
    }

    try {
      setStartingTrial(planId);
      const result = await trialService.startTrial(planId);
      
      if (result.success && result.checkoutUrl) {
        toast.loading('Redirecting to secure checkout...', { duration: 2000 });
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (err) {
      console.error('Start trial failed:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to start trial');
      setStartingTrial(null);
    }
  }

  async function handleUpgrade(planId: string) {
    if (planId === 'free') {
      navigate('/dashboard');
      return;
    }

    try {
      setUpgrading(planId);

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login?redirect=/pricing');
        return;
      }

      const response = await subscriptionService.createSubscription(planId as 'pro' | 'team');

      if (response.success && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error(response.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Upgrade failed:', err);
      alert(err instanceof Error ? err.message : 'Failed to start upgrade process');
      setUpgrading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Failed to load pricing</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={loadPlans}
              className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start analyzing errors for free, upgrade for unlimited queries and advanced features
          </p>
        </div>

        {/* Trial Banner */}
        {trialEligible && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Try Pro Free for 7 Days
                    </h2>
                    <p className="text-white/80 mb-3">
                      Get full access to Pro features with no upfront payment
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1.5">
                        <Shield className="h-4 w-4" />
                        No charge during trial
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4" />
                        Cancel anytime
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        Then $3/month
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleStartTrial('pro')}
                    disabled={startingTrial !== null}
                    className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
                  >
                    {startingTrial === 'pro' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      <>
                        Start Free Pro Trial
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                  {/* Team trial temporarily hidden - Coming Soon */}
                  {/*<button
                    onClick={() => handleStartTrial('team')}
                    disabled={startingTrial !== null}
                    className="px-8 py-2 bg-transparent border-2 border-white/50 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-all"
                  >
                    {startingTrial === 'team' ? 'Redirecting...' : 'Or try Team - $8/mo after trial'}
                  </button>*/}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isPopular={plan.popular}
              isLoading={upgrading === plan.id}
              onSelect={() => handleUpgrade(plan.id)}
            />
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mt-20 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Feature Comparison
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Free
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Pro
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Team
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <FeatureRow feature="Monthly Queries" free="50" pro="Unlimited" team="Unlimited" />
                <FeatureRow feature="Error Explanation" free={true} pro={true} team={true} />
                <FeatureRow feature="Fix Suggestions" free={false} pro={true} team={true} />
                <FeatureRow feature="Code Examples" free={false} pro={true} team={true} />
                <FeatureRow feature="Follow-up Questions" free={false} pro={true} team={true} />
                <FeatureRow feature="Error History" free="7 days" pro="30 days" team="Unlimited" />
                <FeatureRow feature="AI Model Selection" free={false} pro={true} team={true} />
                <FeatureRow feature="Team Features" free={false} pro={false} team={true} />
                <FeatureRow feature="Support Level" free="Community" pro="Email" team="Priority" />
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <FAQItem
              question="How does the 7-day free trial work?"
              answer="Start your trial by entering your payment method. You won't be charged until the trial ends. Cancel anytime during the trial period and you won't pay anything."
            />
            <FAQItem
              question="Can I cancel anytime?"
              answer="Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards through our secure payment processor Dodo Payments."
            />
            <FAQItem
              question="What happens after the trial?"
              answer="After your 7-day trial, you'll be automatically charged the monthly rate for your selected plan. You can cancel anytime before the trial ends to avoid being charged."
            />
            <FAQItem
              question="Can I upgrade or downgrade my plan?"
              answer="Yes, you can change your plan at any time. Upgrades are immediate, and downgrades take effect at the end of your billing period."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function FeatureRow({
  feature,
  free,
  pro,
  team
}: {
  feature: string;
  free: boolean | string;
  pro: boolean | string;
  team: boolean | string;
}) {
  return (
    <tr>
      <td className="px-6 py-4 text-sm text-gray-900">{feature}</td>
      <td className="px-6 py-4 text-center">
        <FeatureCell value={free} />
      </td>
      <td className="px-6 py-4 text-center">
        <FeatureCell value={pro} />
      </td>
      <td className="px-6 py-4 text-center">
        <FeatureCell value={team} />
      </td>
    </tr>
  );
}

function FeatureCell({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="w-5 h-5 text-green-500 mx-auto" />
    ) : (
      <span className="text-gray-400"></span>
    );
  }
  return <span className="text-sm text-gray-600">{value}</span>;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}

export default PricingPage;
