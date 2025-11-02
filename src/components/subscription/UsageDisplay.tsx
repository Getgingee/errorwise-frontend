import { Usage } from '../../services/subscription';
import { TrendingUp, Infinity } from 'lucide-react';

interface UsageDisplayProps {
  usage: Usage;
}

export function UsageDisplay({ usage }: UsageDisplayProps) {
  const isUnlimited = usage.queriesRemaining === 'unlimited';

  if (isUnlimited) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
        <div className="flex items-center gap-3">
          <Infinity className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-semibold text-gray-900">Unlimited Queries</p>
            <p className="text-sm text-gray-600">No limits on your error analysis</p>
          </div>
        </div>
      </div>
    );
  }

  const queriesUsed = usage.queriesUsed;
  const queriesLimit = typeof usage.dailyLimit === 'number' 
    ? usage.dailyLimit 
    : typeof usage.queriesRemaining === 'number'
    ? queriesUsed + usage.queriesRemaining
    : queriesUsed;
  
  const percentage = queriesLimit > 0 ? (queriesUsed / queriesLimit) * 100 : 0;
  const remaining = typeof usage.queriesRemaining === 'number' ? usage.queriesRemaining : 0;

  const getBarColor = () => {
    if (percentage >= 90) return 'bg-red-600';
    if (percentage >= 70) return 'bg-yellow-600';
    return 'bg-green-600';
  };

  const getTextColor = () => {
    if (percentage >= 90) return 'text-red-700';
    if (percentage >= 70) return 'text-yellow-700';
    return 'text-green-700';
  };

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm font-medium text-gray-700">
            {queriesUsed} / {queriesLimit} queries used
          </span>
          <span className={`text-sm font-semibold ${getTextColor()}`}>
            {remaining} remaining
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Reset Time */}
      {usage.resetTime && (
        <p className="text-xs text-gray-600">
          Resets on {new Date(usage.resetTime).toLocaleDateString()} at{' '}
          {new Date(usage.resetTime).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      )}

      {/* Limit Reached Warning */}
      {usage.limitReached && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <TrendingUp className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900">Monthly limit reached</p>
            <p className="text-xs text-red-700 mt-1">
              Upgrade to Pro for unlimited queries
            </p>
            <a 
              href="/pricing"
              className="inline-block mt-2 text-xs text-red-600 hover:text-red-700 underline font-semibold"
            >
              View Plans →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}