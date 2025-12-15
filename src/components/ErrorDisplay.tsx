import React from 'react';
import { AlertCircle, Mail, Clock } from 'lucide-react';
import { useSupportContact, getResponseTimeByTier } from '../hooks/useSupportContact';

interface ErrorWithSupport {
  message: string;
  code?: string;
  supportContact?: {
    email: string;
    responseTime: string;
    category?: string;
  };
}

interface ErrorDisplayProps {
  error: ErrorWithSupport | string | Error;
  userTier?: string;
  onRetry?: () => void;
  showContactOption?: boolean;
  className?: string;
}

/**
 * Component to display API errors with support contact information
 * Used to show user-friendly error messages with support resources
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  userTier = 'free',
  onRetry,
  showContactOption = true,
  className = '',
}) => {
  const { data: supportInfo } = useSupportContact();

  let errorMessage = '';
  let errorCode = '';
  let supportEmail = supportInfo?.supportEmail || 'hi@getgingee.com';
  let responseTime = getResponseTimeByTier(supportInfo?.responseTimes, userTier);

  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error && typeof error === 'object') {
    errorMessage = (error as ErrorWithSupport).message;
    errorCode = (error as ErrorWithSupport).code || '';
    if ((error as ErrorWithSupport).supportContact) {
      supportEmail = (error as ErrorWithSupport).supportContact?.email || supportEmail;
      responseTime = (error as ErrorWithSupport).supportContact?.responseTime || responseTime;
    }
  }

  return (
    <div
      className={`p-6 bg-red-500/10 border border-red-500/30 rounded-lg ${className}`}
    >
      <div className="flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          {/* Error Title */}
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            {errorCode ? `Error ${errorCode}` : 'Something went wrong'}
          </h3>

          {/* Error Message */}
          <p className="text-gray-300 mb-4">{errorMessage}</p>

          {/* Support Information */}
          {showContactOption && (
            <div className="mt-6 pt-6 border-t border-red-500/20 space-y-4">
              <p className="text-sm text-gray-400 font-medium">Need help? Contact our support team:</p>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Email */}
                <a
                  href={`mailto:${supportEmail}`}
                  className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded hover:bg-red-500/10 transition-colors group"
                >
                  <Mail className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white group-hover:text-red-400 transition-colors">
                      Email Support
                    </p>
                    <p className="text-xs text-gray-400 break-all">{supportEmail}</p>
                  </div>
                </a>

                {/* Response Time */}
                <div className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded">
                  <Clock className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Response Time</p>
                    <p className="text-xs text-gray-400">{responseTime}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {onRetry && (
            <div className="mt-6 pt-6 border-t border-red-500/20">
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Hook to create an error object with support contact info
 */
export const useErrorWithSupport = (userTier?: string) => {
  const { data: supportInfo } = useSupportContact();

  const createErrorWithSupport = (
    message: string,
    code?: string,
    category?: string
  ): ErrorWithSupport => {
    const categoryObj = supportInfo?.categories.find(
      (c) => c.name.toLowerCase() === (category || 'general').toLowerCase()
    );

    return {
      message,
      code,
      supportContact: {
        email: categoryObj?.email || supportInfo?.supportEmail || 'hi@getgingee.com',
        responseTime: getResponseTimeByTier(supportInfo?.responseTimes, userTier || 'free'),
        category: category || 'general',
      },
    };
  };

  return { createErrorWithSupport };
};

/**
 * Provider component to wrap parts of your app and provide error display context
 */
export const ErrorHandler: React.FC<{
  children: React.ReactNode;
  userTier?: string;
}> = ({ children, userTier = 'free' }) => {
  const [error, setError] = React.useState<ErrorWithSupport | null>(null);

  const clearError = () => setError(null);
  const setErrorWithSupport = (err: ErrorWithSupport) => setError(err);

  return (
    <>
      {error && (
        <div className="mb-6">
          <ErrorDisplay
            error={error}
            userTier={userTier}
            onRetry={clearError}
            showContactOption={true}
          />
        </div>
      )}
      <ErrorHandlerContext.Provider
        value={{
          error,
          setError: setErrorWithSupport,
          clearError,
        }}
      >
        {children}
      </ErrorHandlerContext.Provider>
    </>
  );
};

export const ErrorHandlerContext = React.createContext<{
  error: ErrorWithSupport | null;
  setError: (error: ErrorWithSupport) => void;
  clearError: () => void;
} | null>(null);

export const useErrorHandler = () => {
  const context = React.useContext(ErrorHandlerContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within ErrorHandler component');
  }
  return context;
};
