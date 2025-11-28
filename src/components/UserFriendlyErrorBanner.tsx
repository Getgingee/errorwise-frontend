import React from 'react';
import { AlertCircle, Clock, RefreshCw, Server, XCircle } from 'lucide-react';
import { UserFriendlyError } from '../types';

interface UserFriendlyErrorBannerProps {
  error: UserFriendlyError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const errorIcons: Record<UserFriendlyError['type'], React.ReactNode> = {
  rateLimit: <Clock className="w-5 h-5" />,
  timeout: <RefreshCw className="w-5 h-5" />,
  allProvidersFailed: <Server className="w-5 h-5" />,
  invalidJson: <AlertCircle className="w-5 h-5" />,
  unexpectedError: <XCircle className="w-5 h-5" />
};

const errorColors: Record<UserFriendlyError['type'], string> = {
  rateLimit: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700',
  timeout: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700',
  allProvidersFailed: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700',
  invalidJson: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700',
  unexpectedError: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
};

const iconColors: Record<UserFriendlyError['type'], string> = {
  rateLimit: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-800/50',
  timeout: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-800/50',
  allProvidersFailed: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-800/50',
  invalidJson: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-800/50',
  unexpectedError: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-800/50'
};

const textColors: Record<UserFriendlyError['type'], { title: string; message: string }> = {
  rateLimit: { title: 'text-yellow-800 dark:text-yellow-200', message: 'text-yellow-700 dark:text-yellow-300' },
  timeout: { title: 'text-blue-800 dark:text-blue-200', message: 'text-blue-700 dark:text-blue-300' },
  allProvidersFailed: { title: 'text-red-800 dark:text-red-200', message: 'text-red-700 dark:text-red-300' },
  invalidJson: { title: 'text-orange-800 dark:text-orange-200', message: 'text-orange-700 dark:text-orange-300' },
  unexpectedError: { title: 'text-red-800 dark:text-red-200', message: 'text-red-700 dark:text-red-300' }
};

export const UserFriendlyErrorBanner: React.FC<UserFriendlyErrorBannerProps> = ({
  error,
  onRetry,
  onDismiss
}) => {
  const icon = errorIcons[error.type];
  const bgColor = errorColors[error.type];
  const iconColor = iconColors[error.type];
  const colors = textColors[error.type];

  return (
    <div className={`rounded-lg border p-4 ${bgColor}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${iconColor}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold ${colors.title}`}>
            {error.title}
          </h4>
          <p className={`text-sm mt-1 ${colors.message}`}>
            {error.message}
          </p>
          {error.suggestion && (
            <p className={`text-sm mt-2 italic ${colors.message} opacity-80`}>
               {error.suggestion}
            </p>
          )}
          {error.retryAfter && (
            <p className={`text-xs mt-2 ${colors.message} opacity-70`}>
              Please try again in {error.retryAfter} seconds
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1.5 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFriendlyErrorBanner;
