import { useState } from 'react';
import {
  initiateEmailChange,
  verifyEmailChange,
  getUserSessions,
  revokeSession,
  revokeAllOtherSessions,
  deleteAccount,
  restoreAccount,
  SessionInfo,
} from '../services/authEdgeCases';

export const useAuthEdgeCases = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);

  const changeEmail = async (newEmail: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await initiateEmailChange(newEmail);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to initiate email change');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyNewEmail = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await verifyEmailChange(token);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to verify email change');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const sessionList = await getUserSessions();
      setSessions(sessionList);
      return sessionList;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch sessions');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const removeSession = async (sessionId: string) => {
    setLoading(true);
    setError(null);
    try {
      await revokeSession(sessionId);
      // Remove from local state
      setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to revoke session');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeAllOtherSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await revokeAllOtherSessions();
      await fetchSessions(); // Refresh session list
      return result;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to revoke sessions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeAccount = async (reason?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteAccount(reason);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const recoverAccount = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await restoreAccount(email);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to restore account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    sessions,
    changeEmail,
    verifyNewEmail,
    fetchSessions,
    removeSession,
    removeAllOtherSessions,
    removeAccount,
    recoverAccount,
  };
};
