import { apiClient } from './api';

// ============================================================================
// AUTHENTICATION EDGE CASE SERVICES
// ============================================================================

export interface EmailChangeRequest {
  newEmail: string;
}

export interface SessionInfo {
  sessionId: string;
  deviceInfo: string;
  ipAddress: string;
  location: string;
  createdAt: string;
  lastActivity: string;
}

export interface AccountDeletionRequest {
  reason?: string;
}

/**
 * Initiate email change process (sends verification to new email)
 */
export const initiateEmailChange = async (newEmail: string): Promise<any> => {
  const response = await apiClient.post('/api/auth/change-email', { newEmail });
  return response.data;
};

/**
 * Verify new email address with token from email
 */
export const verifyEmailChange = async (token: string): Promise<any> => {
  const response = await apiClient.get(`/api/auth/verify-email-change?token=``);
  return response.data;
};

/**
 * Get all active sessions for current user
 */
export const getUserSessions = async (): Promise<SessionInfo[]> => {
  const response = await apiClient.get('/api/auth/sessions');
  return response.data.sessions || [];
};

/**
 * Revoke a specific session by ID
 */
export const revokeSession = async (sessionId: string): Promise<any> => {
  const response = await apiClient.delete(`/api/auth/sessions/``);
  return response.data;
};

/**
 * Revoke all sessions except current one
 */
export const revokeAllOtherSessions = async (): Promise<any> => {
  const response = await apiClient.post('/api/auth/revoke-all-sessions');
  return response.data;
};

/**
 * Soft delete account (30-day restoration window)
 */
export const deleteAccount = async (reason?: string): Promise<any> => {
  const response = await apiClient.delete('/api/auth/account', {
    data: { reason },
  });
  return response.data;
};

/**
 * Restore soft-deleted account
 */
export const restoreAccount = async (email: string): Promise<any> => {
  const response = await apiClient.post('/api/auth/restore-account', { email });
  return response.data;
};
