import React, { useState, useEffect } from 'react';
import { Crown, Clock, ArrowRight, X, Sparkles, CreditCard, Shield, AlertCircle } from 'lucide-react';
import { trialService, TrialStatus } from '../services/trialService';
import { toast } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface TrialBannerProps {
  onTrialStarted?: () => void;
  className?: string;
  variant?: 'compact' | 'full';
}

const TrialBanner: React.FC<TrialBannerProps> = ({
  onTrialStarted,
  className = '',
  variant = 'compact',
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [trialInfo, setTrialInfo] = useState<TrialStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    loadTrialStatus();

    const trialParam = searchParams.get('trial');
    const planParam = searchParams.get('plan');

    if (trialParam === 'started') {
      toast.success('Your ' + (planParam || 'Pro') + ' trial is now active!');
      onTrialStarted?.();
    } else if (trialParam === 'cancelled') {
      toast.error('Trial checkout was cancelled');
    }
  }, [searchParams]);

  const loadTrialStatus = async () => {
    try {
      const response = await trialService.getTrialStatus();
      setTrialInfo(response.trial);
    } catch (error) {
      console.error('Failed to load trial status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrial = async (planId: 'pro' | 'team' = 'pro') => {
    setStarting(true);
    try {
      const result = await trialService.startTrial(planId);
      if (result.success && result.checkoutUrl) {
        toast.loading('Redirecting to secure checkout...', { duration: 2000 });
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to start trial');
      setStarting(false);
    }
  };

  const handleCancelTrial = async () => {
    if (!confirm('Are you sure you want to cancel your trial? You will not be charged.')) {
      return;
    }
    try {
      const result = await trialService.cancelTrial();
      toast.success(result.message || 'Trial cancelled successfully');
      await loadTrialStatus();
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel trial');
    }
  };

  if (loading || dismissed) return null;
  if (trialInfo?.trialStatus === 'converted') return null;

  // Show trial active banner
  if (trialInfo?.hasActiveTrial && trialInfo?.daysRemaining > 0) {
    const planName = trialInfo.trialPlan ? trialInfo.trialPlan.charAt(0).toUpperCase() + trialInfo.trialPlan.slice(1) : 'Pro';
    return (
      <div className={'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4 ' + className}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-white flex items-center gap-2">
                {planName} Trial Active
                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
              </p>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {trialInfo.daysRemaining} day{trialInfo.daysRemaining !== 1 ? 's' : ''} remaining
                {trialInfo.willAutoCharge && (
                  <span className="ml-2 text-amber-400">
                     Then ${trialInfo.chargeAmount}/mo
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/pricing')}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-2"
            >
              Keep Pro
              <ArrowRight className="h-4 w-4" />
            </button>
            {trialInfo.canCancelTrial && (
              <button
                onClick={handleCancelTrial}
                className="px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
              >
                Cancel Trial
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show start trial banner for free users
  if (trialInfo?.canStartTrial) {
    if (variant === 'full') {
      return (
        <div className={'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6 ' + className}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Try Pro Free for 7 Days
                </h3>
                <p className="text-gray-400 mb-3">
                  Unlock unlimited queries, advanced AI models, and follow-up questions
                </p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="flex items-center gap-1 text-green-400">
                    <Shield className="h-4 w-4" />
                    No charge during trial
                  </span>
                  <span className="flex items-center gap-1 text-blue-400">
                    <CreditCard className="h-4 w-4" />
                    Cancel anytime
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <button
                onClick={() => handleStartTrial('pro')}
                disabled={starting}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {starting ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    Start Pro Trial - $3/mo after
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
              <button
                onClick={() => handleStartTrial('team')}
                disabled={starting}
                className="px-6 py-2 border border-purple-500/50 text-purple-400 text-sm font-medium rounded-lg hover:bg-purple-500/10 transition-all"
              >
                Or try Team - $8/mo after
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Compact variant
    return (
      <div className={'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-4 ' + className}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-white">Try Pro Free for 7 Days</p>
              <p className="text-sm text-gray-400">No charge until trial ends  Cancel anytime</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStartTrial('pro')}
              disabled={starting}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {starting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show "trial already used" message
  if (trialInfo?.eligibilityReason && trialInfo.trialStatus === 'none' && !trialInfo.canStartTrial) {
    return (
      <div className={'bg-gray-800/50 border border-gray-700 rounded-xl p-4 ' + className}>
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-400">{trialInfo.eligibilityReason}</p>
            <button onClick={() => navigate('/pricing')} className="text-sm text-blue-400 hover:text-blue-300 mt-1">
              View pricing plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TrialBanner;