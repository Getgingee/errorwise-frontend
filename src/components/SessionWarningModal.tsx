import React, { useState, useEffect } from 'react';
import { AlertCircle, LogOut, RotateCw } from 'lucide-react';

interface SessionWarningProps {
  show: boolean;
  onLogout: () => void;
  onRefresh: () => Promise<boolean>;
  countdown?: number;
}

/**
 * Component to warn user about session expiration
 * Shows 1 minute before auto-logout
 */
export const SessionWarningModal: React.FC<SessionWarningProps> = ({
  show,
  onLogout,
  onRefresh,
  countdown = 60
}) => {
  const [timeLeft, setTimeLeft] = useState(countdown);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!show) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [show]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const success = await onRefresh();
      if (success) {
        // Reset the modal
        setTimeLeft(countdown);
      } else {
        alert('Failed to refresh session. Please log in again.');
        onLogout();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-amber-500" />
          <h2 className="text-lg font-semibold text-gray-800">Session Expiring Soon</h2>
        </div>

        <p className="text-gray-600 mb-4">
          Your session will expire in <span className="font-bold text-red-600">{timeLeft} seconds</span> due to inactivity.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Click "Stay Logged In" to refresh your session or you will be automatically logged out.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
            {isRefreshing ? 'Refreshing...' : 'Stay Logged In'}
          </button>

          <button
            onClick={onLogout}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Your inactivity triggered this warning.
        </p>
      </div>
    </div>
  );
};

export default SessionWarningModal;
