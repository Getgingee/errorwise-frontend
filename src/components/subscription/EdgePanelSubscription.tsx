import { useState } from 'react';
import { SubscriptionData } from '../../services/subscription';
import { 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  X, 
  ChevronLeft,
  Crown,
  Zap,
  Clock
} from 'lucide-react';

interface EdgePanelSubscriptionProps {
  subscription: SubscriptionData;
  onCancel: () => Promise<void>;
  onUpgrade: () => void;
}

export function EdgePanelSubscription({ subscription, onCancel, onUpgrade }: EdgePanelSubscriptionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const sub = subscription?.subscription as any | undefined;
  const planObj = subscription?.plan as any | undefined;
  const usage = subscription?.usage as any | undefined;

  const percentUsed = usage ? Math.min(
    Math.round(((usage.queriesUsed || 0) / (planObj.limits?.daily_queries || 100)) * 100),
    100
  ) : 0;

  if (!sub || !planObj) {
    return null;
  }

  const handleCancelClick = async () => {
    if (!showCancelConfirm) {
      setShowCancelConfirm(true);
      return;
    }

    try {
      setCancelling(true);
      await onCancel();
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Cancellation failed:', error);
    } finally {
      setCancelling(false);
    }
  };

  const statusColors = {
    active: 'from-green-500 to-emerald-600',
    trial: 'from-blue-500 to-cyan-600',
    cancelled: 'from-yellow-500 to-orange-600',
    expired: 'from-red-500 to-rose-600',
    past_due: 'from-orange-500 to-amber-600'
  };

  const planIcons = {
    free: Zap,
    pro: Crown,
    team: TrendingUp
  };

  const PlanIcon = planIcons[planObj.name?.toLowerCase()] || Crown;

  return (
    <>
      {/* Edge Handle - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${
          isOpen ? 'right-80' : 'right-0'
        }`}
        aria-label="Toggle subscription panel"
      >
        <div className="relative">
          {/* Handle Tab */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white px-3 py-6 rounded-l-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:px-4 group">
            <div className="flex flex-col items-center gap-2">
              <PlanIcon className="w-5 h-5" />
              <div className="h-12 w-0.5 bg-white/30 rounded-full" />
              <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-l-xl blur-md opacity-50 -z-10" />
        </div>
      </button>

      {/* Edge Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 shadow-2xl transform transition-transform duration-300 ease-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Frosted glass overlay */}
        <div className="absolute inset-0 backdrop-blur-xl bg-white/5 border-l border-white/10" />
        
        {/* Content */}
        <div className="relative h-full overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className={`bg-gradient-to-br ${statusColors[sub.status]} p-6 text-white relative overflow-hidden`}>
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Plan Icon */}
            <div className="mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <PlanIcon className="w-8 h-8" />
              </div>
            </div>

            {/* Plan Name */}
            <h2 className="text-2xl font-bold mb-2">{planObj.name} Plan</h2>
            <p className="text-white/80 text-sm">
              {sub.isTrial ? `${planObj.trialDays}-day trial active` : 'Active subscription'}
            </p>

            {/* Status Badge */}
            <div className="mt-4 inline-block">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold uppercase">
                {sub.status}
              </span>
            </div>

            {/* Decorative gradient */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Subscription Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <Calendar className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-1">Current Period</p>
                  <p className="text-sm text-white font-medium">
                    {new Date(sub.currentPeriodStart).toLocaleDateString()} - {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <CreditCard className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-1">Price</p>
                  <p className="text-sm text-white font-medium">
                    ${(planObj.price / 100).toFixed(2)} / month
                  </p>
                </div>
              </div>

              {sub.isTrial && (
                <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-lg backdrop-blur-sm border border-blue-400/20">
                  <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-blue-300 mb-1">Trial Ends</p>
                    <p className="text-sm text-white font-medium">
                      {new Date(sub.trialEnd).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Usage Display */}
            {usage && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white/90">Usage This Month</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400">API Calls</span>
                      <span className="text-xs text-white font-medium">
                        {usage.queriesUsed || 0} / {planObj.limits?.daily_queries || '∞'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-300 w-[${percentUsed}%]`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white/90">Features</h3>
              <div className="space-y-2">
                {planObj.features?.map((feature: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              {subscription.canUpgrade && (
                <button
                  onClick={onUpgrade}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade Plan
                </button>
              )}

              {sub.status === 'active' && !sub.isTrial && (
                <button
                  onClick={handleCancelClick}
                  disabled={cancelling}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    showCancelConfirm
                      ? 'bg-red-500/20 text-red-300 border-2 border-red-500/50 hover:bg-red-500/30'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {cancelling ? 'Cancelling...' : showCancelConfirm ? 'Click again to confirm' : 'Cancel Subscription'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop when panel is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .usage-progress-bar[data-progress="0"] { width: 0%; }
        .usage-progress-bar[data-progress="1"] { width: 1%; }
        .usage-progress-bar[data-progress="2"] { width: 2%; }
        .usage-progress-bar[data-progress="3"] { width: 3%; }
        .usage-progress-bar[data-progress="4"] { width: 4%; }
        .usage-progress-bar[data-progress="5"] { width: 5%; }
        .usage-progress-bar[data-progress="10"] { width: 10%; }
        .usage-progress-bar[data-progress="15"] { width: 15%; }
        .usage-progress-bar[data-progress="20"] { width: 20%; }
        .usage-progress-bar[data-progress="25"] { width: 25%; }
        .usage-progress-bar[data-progress="30"] { width: 30%; }
        .usage-progress-bar[data-progress="35"] { width: 35%; }
        .usage-progress-bar[data-progress="40"] { width: 40%; }
        .usage-progress-bar[data-progress="45"] { width: 45%; }
        .usage-progress-bar[data-progress="50"] { width: 50%; }
        .usage-progress-bar[data-progress="55"] { width: 55%; }
        .usage-progress-bar[data-progress="60"] { width: 60%; }
        .usage-progress-bar[data-progress="65"] { width: 65%; }
        .usage-progress-bar[data-progress="70"] { width: 70%; }
        .usage-progress-bar[data-progress="75"] { width: 75%; }
        .usage-progress-bar[data-progress="80"] { width: 80%; }
        .usage-progress-bar[data-progress="85"] { width: 85%; }
        .usage-progress-bar[data-progress="90"] { width: 90%; }
        .usage-progress-bar[data-progress="95"] { width: 95%; }
        .usage-progress-bar[data-progress="100"] { width: 100%; }
      `}</style>
    </>
  );
}
