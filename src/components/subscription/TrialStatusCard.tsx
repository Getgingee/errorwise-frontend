import React, { useState, useEffect } from 'react';
import { Crown, Clock, AlertTriangle, ArrowRight, X, Sparkles, Calendar, CreditCard, Shield, Loader2 } from 'lucide-react';
import { trialService, TrialStatus } from '../../services/trialService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface TrialStatusCardProps {
  onStatusChange?: () => void;
  className?: string;
}

const TrialStatusCard: React.FC<TrialStatusCardProps> = ({
  onStatusChange,
  className = '',
}) => {
  const navigate = useNavigate();
  const [trialInfo, setTrialInfo] = useState<TrialStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadTrialStatus();
  }, []);

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

  const handleCancelTrial = async () => {
    if (!confirm('Are you sure you want to cancel your trial?\\n\\nYou will not be charged, but you will lose access to Pro features at the end of your trial period.')) {
      return;
    }

    setCancelling(true);
    try {
      const result = await trialService.cancelTrial('Cancelled from subscription page');
      toast.success(result.message || 'Trial cancelled successfully');
      await loadTrialStatus();
      onStatusChange?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel trial');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className={\g-gray-800 rounded-xl p-6 \\}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  // Don't show if no trial info or not in trial
  if (!trialInfo || trialInfo.trialStatus === 'none' || trialInfo.trialStatus === 'converted') {
    return null;
  }

  // Show active trial card
  if (trialInfo.hasActiveTrial && trialInfo.daysRemaining > 0) {
    const isLowDays = trialInfo.daysRemaining <= 2;
    
    return (
      <div className={\\ border rounded-xl p-6 \\}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={\p-2 \ rounded-lg\}>
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white flex items-center gap-2">
                {trialInfo.trialPlan?.charAt(0).toUpperCase()}{trialInfo.trialPlan?.slice(1)} Trial Active
                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
              </h3>
              <p className="text-sm text-gray-400">
                Enjoying full {trialInfo.trialPlan} features
              </p>
            </div>
          </div>
        </div>

        {/* Trial Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Time Remaining
            </span>
            <span className={\ont-medium \\}>
              {trialInfo.daysRemaining} day{trialInfo.daysRemaining !== 1 ? 's' : ''} left
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={\h-2 rounded-full transition-all \\}
              style={{ width: \\%\ }}
            />
          </div>

          {trialInfo.trialEndDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Trial Ends
              </span>
              <span className="text-white">
                {new Date(trialInfo.trialEndDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          )}

          {trialInfo.willAutoCharge && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                After Trial
              </span>
              <span className="text-white">
                ${trialInfo.chargeAmount}/month
              </span>
            </div>
          )}
        </div>

        {/* Warning for low days */}
        {isLowDays && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-amber-400 font-medium">Trial ending soon!</p>
                <p className="text-gray-400">
                  You'll be charged ${trialInfo.chargeAmount}/mo after your trial ends.
                  {' '}
                  <button 
                    onClick={handleCancelTrial}
                    className="text-amber-400 hover:text-amber-300 underline"
                  >
                    Cancel to avoid charge
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/pricing')}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
          >
            Keep {trialInfo.trialPlan?.charAt(0).toUpperCase()}{trialInfo.trialPlan?.slice(1)}
            <ArrowRight className="h-4 w-4" />
          </button>
          {trialInfo.canCancelTrial && (
            <button
              onClick={handleCancelTrial}
              disabled={cancelling}
              className="px-4 py-2 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-700/50 hover:text-white transition-colors disabled:opacity-50"
            >
              {cancelling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                  Cancelling...
                </>
              ) : (
                'Cancel Trial'
              )}
            </button>
          )}
        </div>

        {/* Guarantee */}
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <Shield className="h-3 w-3" />
          <span>Cancel anytime before trial ends - no questions asked</span>
        </div>
      </div>
    );
  }

  // Show cancelled trial info (still has access until end)
  if (trialInfo.trialStatus === 'cancelled' && trialInfo.trialEndDate) {
    const endDate = new Date(trialInfo.trialEndDate);
    const now = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft > 0) {
      return (
        <div className={\g-gray-800 border border-gray-700 rounded-xl p-6 \\}>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-gray-700 rounded-lg">
              <X className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Trial Cancelled</h3>
              <p className="text-sm text-gray-400">
                Access until {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            You still have {daysLeft} day{daysLeft !== 1 ? 's' : ''} of Pro access remaining.
            You won't be charged.
          </p>
          <button
            onClick={() => navigate('/pricing')}
            className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Pricing Plans
          </button>
        </div>
      );
    }
  }

  return null;
};

export default TrialStatusCard;
