import { apiClient } from './api';
import {
  User,
  UserSettings,
  ApiResponse
} from '../types';

export class UserService {
  /**
   * Get user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return await apiClient.get<User>('/users/profile');
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    return await apiClient.put<User>('/users/profile', updates);
  }

  /**
   * Change password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.put<{ message: string }>('/users/password', {
      currentPassword,
      newPassword
    });
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(file: File): Promise<ApiResponse<{ profilePictureUrl: string }>> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    return await apiClient.post<{ profilePictureUrl: string }>('/users/profile-picture', formData);
  }

  /**
   * Delete profile picture
   */
  async deleteProfilePicture(): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.delete<{ message: string }>('/users/profile-picture');
  }

  /**
   * Get user settings
   */
  async getSettings(): Promise<ApiResponse<UserSettings>> {
    return await apiClient.get<UserSettings>('/users/settings');
  }

  /**
   * Update user settings
   */
  async updateSettings(settings: Partial<UserSettings>): Promise<ApiResponse<UserSettings>> {
    return await apiClient.put<UserSettings>('/users/settings', settings);
  }

  /**
   * Delete user account
   */
  async deleteAccount(password: string): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>('/users/delete-account', { password });
  }

  /**
   * Export user data
   */
  async exportData(): Promise<ApiResponse<{
    export_url: string;
    expires_at: string;
  }>> {
    return await apiClient.post<{
      export_url: string;
      expires_at: string;
    }>('/users/export');
  }

  /**
   * Get user activity log
   */
  async getActivityLog(
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<{
    activities: {
      id: string;
      action: string;
      description: string;
      ip_address: string;
      user_agent: string;
      created_at: string;
    }[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>> {
    return await apiClient.get('/users/activity', { page, limit });
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences: {
    email_notifications: boolean;
    marketing_emails: boolean;
    security_alerts: boolean;
    product_updates: boolean;
  }): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.put<{ message: string }>('/users/notifications', preferences);
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(): Promise<ApiResponse<{
    email_notifications: boolean;
    marketing_emails: boolean;
    security_alerts: boolean;
    product_updates: boolean;
  }>> {
    return await apiClient.get('/users/notifications');
  }

  /**
   * Verify current password
   */
  async verifyPassword(password: string): Promise<ApiResponse<{ valid: boolean }>> {
    return await apiClient.post<{ valid: boolean }>('/users/verify-password', {
      password
    });
  }

  /**
   * Update email address
   */
  async updateEmail(
    newEmail: string,
    password: string
  ): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.put<{ message: string }>('/users/email', {
      email: newEmail,
      password
    });
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<ApiResponse<{
    total_queries: number;
    queries_this_month: number;
    queries_today: number;
    favorite_categories: string[];
    account_age_days: number;
    subscription_tier: string;
    last_login: string;
  }>> {
    return await apiClient.get('/users/stats');
  }

  /**
   * Set user preferences
   */
  async setPreferences(preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    date_format: string;
    explanation_detail: 'basic' | 'detailed' | 'comprehensive';
  }): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.put<{ message: string }>('/users/preferences', preferences);
  }

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<ApiResponse<{
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    date_format: string;
    explanation_detail: 'basic' | 'detailed' | 'comprehensive';
  }>> {
    return await apiClient.get('/users/preferences');
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>('/users/send-verification');
  }

  /**
   * Get API keys (for pro/team users)
   */
  async getApiKeys(): Promise<ApiResponse<{
    keys: {
      id: string;
      name: string;
      key_preview: string;
      created_at: string;
      last_used: string;
      usage_count: number;
    }[];
  }>> {
    return await apiClient.get('/users/api-keys');
  }

  /**
   * Create new API key
   */
  async createApiKey(name: string): Promise<ApiResponse<{
    id: string;
    name: string;
    key: string;
    created_at: string;
  }>> {
    return await apiClient.post<{
      id: string;
      name: string;
      key: string;
      created_at: string;
    }>('/users/api-keys', { name });
  }

  /**
   * Revoke API key
   */
  async revokeApiKey(keyId: string): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.delete<{ message: string }>(`/users/api-keys/${keyId}`);
  }
}

export const userService = new UserService();
export default userService;