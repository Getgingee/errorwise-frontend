import { Usage } from '../../services/subscription';
import { TrendingUp, Infinity } from 'lucide-react';

interface UsageDisplayProps {
  usage: Usage;
}

export function UsageDisplay({ usage }: UsageDisplayProps) {
  const isUnlimited = usage.dailyLimit === -1;

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

  const percentage = (usage.queriesUsed / usage.dailyLimit) * 100;
  const isNearLimit = percentage >= 80;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-gray-900">Query Usage</p>
        <span className={`text-sm font-medium ${isNearLimit ? 'text-red-600' : 'text-blue-600'}`}>
          {usage.queriesUsed} / {usage.dailyLimit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isNearLimit ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {usage.resetTime && (
        <p className="text-xs text-gray-500 mt-2">
          Resets: {new Date(usage.resetTime).toLocaleString()}
        </p>
      )}
    </div>
  );
}
