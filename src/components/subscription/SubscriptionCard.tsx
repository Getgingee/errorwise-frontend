import { useState } from 'react';
import { SubscriptionData } from '../../services/subscription';
import { CreditCard, Calendar, AlertCircle, TrendingUp, X } from 'lucide-react';
import { UsageDisplay } from './UsageDisplay';

interface SubscriptionCardProps {
  subscription: SubscriptionData;
  onCancel: () => Promise<void>;
  onUpgrade: () => void;
}

export function SubscriptionCard({ subscription, onCancel, onUpgrade }: SubscriptionCardProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const { subscription: sub, plan, usage, canUpgrade, canDowngrade } = subscription;

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    trial: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-yellow-100 text-yellow-800',
    expired: 'bg-red-100 text-red-800',
    past_due: 'bg-orange-100 text-orange-800'
  };

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
      alert('Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">{plan.name} Plan</h2>
            <p className="text-blue-100">
              {sub.isTrial ? `${plan.trialDays}-day trial` : 'Active subscription'}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              statusColors[sub.status]
            }`}
          >
            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Subscription Details */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Tier */}
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Current Tier</p>
              <p className="font-semibold text-gray-900">{sub.tier.toUpperCase()}</p>
              {plan.price > 0 && (
                <p className="text-sm text-gray-600">${plan.price}/{plan.interval}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">
                {sub.status === 'cancelled' ? 'Access Until' : 'Renewal Date'}
              </p>
              <p className="font-semibold text-gray-900">
                {sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'N/A'}
              </p>
              {sub.isTrial && sub.trialEndsAt && (
                <p className="text-sm text-blue-600">
                  Trial ends {new Date(sub.trialEndsAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Usage Display */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Query Usage</h3>
          <UsageDisplay usage={usage} />
        </div>

        {/* Cancelled Notice */}
        {sub.status === 'cancelled' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900">Subscription Cancelled</p>
              <p className="text-sm text-yellow-800 mt-1">
                You will retain access until {new Date(sub.endDate).toLocaleDateString()}.
                After that, your account will be downgraded to the Free plan.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          {/* Upgrade Button */}
          {canUpgrade && sub.status !== 'cancelled' && (
            <button
              onClick={onUpgrade}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              Upgrade Plan
            </button>
          )}

          {/* Cancel Button */}
          {canDowngrade && sub.status === 'active' && (
            <button
              onClick={handleCancelClick}
              disabled={cancelling}
              className={`flex-1 ${
                showCancelConfirm
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              } py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                cancelling ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {cancelling ? (
                <>Processing...</>
              ) : showCancelConfirm ? (
                <>
                  <X className="w-5 h-5" />
                  Confirm Cancel
                </>
              ) : (
                'Cancel Subscription'
              )}
            </button>
          )}

          {showCancelConfirm && !cancelling && (
            <button
              onClick={() => setShowCancelConfirm(false)}
              className="px-4 py-3 text-gray-600 hover:text-gray-800"
            >
              Nevermind
            </button>
          )}
        </div>

        {showCancelConfirm && (
          <p className="text-sm text-gray-600 text-center">
            Are you sure? You'll retain access until the end of your billing period.
          </p>
        )}
      </div>
    </div>
  );
}