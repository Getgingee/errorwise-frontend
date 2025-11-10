import React, { useEffect } from 'react';
import { useAuthEdgeCases } from '../../hooks/useAuthEdgeCases';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../UI/card';
import { Button } from '../UI/button';
import { Alert, AlertDescription } from '../UI/alert';
import { Loader2, Monitor, Smartphone, Tablet, LogOut } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SessionManagementProps {
  onSessionRevoked?: () => void;
}

export const SessionManagement: React.FC<SessionManagementProps> = ({ onSessionRevoked }) => {
  const { loading, error, sessions, getSessions, revokeSingleSession, revokeAllOther } = useAuthEdgeCases();

  useEffect(() => {
    getSessions();
  }, []);

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return <Smartphone className="w-4 h-4" />;
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return <Tablet className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  const handleRevoke = async (sessionId: string) => {
    try {
      await revokeSingleSession(sessionId);
      onSessionRevoked?.();
    } catch (err) {
      console.error('Revoke session failed:', err);
    }
  };

  const handleRevokeAll = async () => {
    try {
      await revokeAllOther();
      onSessionRevoked?.();
    } catch (err) {
      console.error('Revoke all failed:', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>Manage your logged-in devices</CardDescription>
          </div>
          {sessions.length > 1 && (
            <Button
              onClick={handleRevokeAll}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Revoke All Others'
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && sessions.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={lex items-center justify-between p-4 rounded-lg border }
              >
                <div className="flex items-center gap-3">
                  {getDeviceIcon(session.userAgent)}
                  <div>
                    <p className="font-medium text-sm">
                      {session.isCurrent && <span className="text-blue-600">(Current) </span>}
                      {session.ipAddress}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session.userAgent.substring(0, 60)}...
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Last active:{' '}
                      {formatDistanceToNow(new Date(session.lastActive), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button
                    onClick={() => handleRevoke(session.id)}
                    disabled={loading}
                    variant="ghost"
                    size="sm"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            {sessions.length === 0 && !loading && (
              <p className="text-center text-gray-500 py-8">No active sessions found</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
