import React, { useState } from 'react';
import { useSubscriptionEdgeCases } from '../../hooks/useSubscriptionEdgeCases';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../UI/card';
import { Button } from '../UI/button';
import { Alert, AlertDescription } from '../UI/alert';
import { Loader2, Pause, Play, TrendingDown, TrendingUp } from 'lucide-react';

interface SubscriptionManagementProps {
  currentTier: string;
  status: string;
  onUpdate?: () => void;
}

export const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({
  currentTier,
  status,
  onUpdate,
}) => {
  const { loading, error, pause, resume, downgrade } = useSubscriptionEdgeCases();
  const [showDowngradeConfirm, setShowDowngradeConfirm] = useState(false);
  const [downgradeImmediate, setDowngradeImmediate] = useState(false);

  const handlePause = async () => {
    try {
      await pause();
      onUpdate?.();
    } catch (err) {
      console.error('Pause failed:', err);
    }
  };

  const handleResume = async () => {
    try {
      await resume();
      onUpdate?.();
    } catch (err) {
      console.error('Resume failed:', err);
    }
  };

  const handleDowngrade = async () => {
    try {
      const newTier = currentTier === 'team' ? 'pro' : 'free';
      await downgrade(newTier as 'free' | 'pro', downgradeImmediate);
      setShowDowngradeConfirm(false);
      onUpdate?.();
    } catch (err) {
      console.error('Downgrade failed:', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
        <CardDescription>
          Current Plan: <span className=\"font-semibold\">{currentTier}</span> - 
          Status: <span className=\"font-semibold\">{status}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant=\"destructive\" className=\"mb-4\">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className=\"space-y-3\">
          {/* Pause/Resume */}
          {status === 'active' && currentTier !== 'free' && (
            <Button
              onClick={handlePause}
              disabled={loading}
              variant=\"outline\"
              className=\"w-full\"
            >
              {loading ? (
                <Loader2 className=\"w-4 h-4 mr-2 animate-spin\" />
              ) : (
                <Pause className=\"w-4 h-4 mr-2\" />
              )}
              Pause Subscription
            </Button>
          )}

          {status === 'paused' && (
            <Button onClick={handleResume} disabled={loading} className=\"w-full\">
              {loading ? (
                <Loader2 className=\"w-4 h-4 mr-2 animate-spin\" />
              ) : (
                <Play className=\"w-4 h-4 mr-2\" />
              )}
              Resume Subscription
            </Button>
          )}

          {/* Downgrade */}
          {currentTier !== 'free' && !showDowngradeConfirm && (
            <Button
              onClick={() => setShowDowngradeConfirm(true)}
              variant=\"outline\"
              className=\"w-full\"
            >
              <TrendingDown className=\"w-4 h-4 mr-2\" />
              Downgrade Plan
            </Button>
          )}

          {/* Downgrade Confirmation */}
          {showDowngradeConfirm && (
            <div className=\"bg-yellow-50 border border-yellow-200 p-4 rounded-lg space-y-3\">
              <p className=\"text-sm font-medium\">Downgrade Confirmation</p>
              <p className=\"text-xs text-gray-600\">
                You're about to downgrade from <strong>{currentTier}</strong> to{' '}
                <strong>{currentTier === 'team' ? 'pro' : 'free'}</strong>
              </p>

              <div className=\"flex items-center gap-2\">
                <input
                  type=\"checkbox\"
                  id=\"immediate\"
                  checked={downgradeImmediate}
                  onChange={(e) => setDowngradeImmediate(e.target.checked)}
                />
                <label htmlFor=\"immediate\" className=\"text-sm\">
                  Downgrade immediately (otherwise at end of billing period)
                </label>
              </div>

              <div className=\"flex gap-2\">
                <Button
                  onClick={handleDowngrade}
                  disabled={loading}
                  variant=\"destructive\"
                  className=\"flex-1\"
                >
                  {loading ? <Loader2 className=\"w-4 h-4 animate-spin\" /> : 'Confirm'}
                </Button>
                <Button
                  onClick={() => setShowDowngradeConfirm(false)}
                  variant=\"outline\"
                  className=\"flex-1\"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
