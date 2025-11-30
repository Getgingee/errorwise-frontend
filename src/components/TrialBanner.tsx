import React, { useState, useEffect } from 'react';
import { Crown, Clock, ArrowRight, X, Sparkles } from 'lucide-react';
import { getCurrentTier, startProTrial, TierInfo } from '../services/chatService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface TrialBannerProps {
  onTrialStarted?: () => void;
  className?: string;
}

const TrialBanner: React.FC<TrialBannerProps> = ({
  onTrialStarted,
  className = '',
}) => {
  const navigate = useNavigate();
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    loadTierInfo();
  }, []);

  const loadTierInfo = async () => {
    try {
      const info = await getCurrentTier();
      setTierInfo(info);
    } catch (error) {
      console.error('Failed to load tier info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrial = async () => {
    setStarting(true);
    try {
      const result = await startProTrial();
      toast.success(result.message);
      onTrialStarted?.();
      await loadTierInfo();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setStarting(false);
    }
  };

  if (loading || dismissed) return null;

  // Don''t show if already Pro/Team
  if (tierInfo?.tier === 'pro' || tierInfo?.tier === 'team') return null;

  // Show trial active banner
  if (tierInfo?.isTrialActive && tierInfo?.trialDaysLeft !== undefined) {
    return (
      <div className={`bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4 ${className}`}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-white flex items-center gap-2">
                Pro Trial Active
                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
              </p>
              <p className="text-sm text-gray-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {tierInfo.trialDaysLeft} days remaining
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/pricing')}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-2"
          >
            Upgrade Now
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Show start trial banner for free users
  return (
    <div className={`bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-white">
              Try Pro Free for 7 Days
            </p>
            <p className="text-sm text-gray-400">
              Unlock AI model selection, unlimited follow-ups & more
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleStartTrial}
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
};

export default TrialBanner;
