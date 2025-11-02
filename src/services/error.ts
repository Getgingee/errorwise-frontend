import { apiClient } from './api';
import {
  ErrorExplanationRequest,
  ErrorExplanationResponse,
  ErrorHistoryItem,
  PaginatedResponse,
  ApiResponse
} from '../types';

export class ErrorService {
  /**
   * Get error explanation from AI
   */
  async explainError(request: ErrorExplanationRequest): Promise<ApiResponse<ErrorExplanationResponse>> {
    // Map frontend request to backend format expected by test script
    const backendRequest = {
      errorText: request.errorMessage,
      context: request.context ? JSON.stringify(request.context) : undefined
    };
    return await apiClient.post<ErrorExplanationResponse>('/errors/analyze', backendRequest);
  }

  /**
   * Get user's error history
   */
  async getErrorHistory(
    page: number = 1,
    limit: number = 10,
    category?: string,
    severity?: string
  ): Promise<ApiResponse<PaginatedResponse<ErrorHistoryItem>>> {
    const params = {
      page,
      limit,
      ...(category && { category }),
      ...(severity && { severity })
    };

    return await apiClient.get<PaginatedResponse<ErrorHistoryItem>>('/history', params);
  }

  /**
   * Get specific error explanation by ID
   */
  async getErrorById(id: string): Promise<ApiResponse<ErrorExplanationResponse>> {
    return await apiClient.get<ErrorExplanationResponse>(`/errors/${id}`);
  }

  /**
   * Delete error from history
   */
  async deleteError(id: string): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.delete<{ message: string }>(`/errors/${id}`);
  }

  /**
   * Get error categories
   */
  async getErrorCategories(): Promise<ApiResponse<string[]>> {
    return await apiClient.get<string[]>('/errors/categories');
  }

  /**
   * Get error statistics for user dashboard
   */
  async getErrorStats(): Promise<ApiResponse<{
    totalQueries: number;
    queriesThisMonth: number;
    mostCommonCategory: string;
    averageResponseTime: number;
    queriesLeft?: number; // For free users
  }>> {
    return await apiClient.get('/errors/stats');
  }

  /**
   * Export error history as CSV
   */
  async exportErrorHistory(): Promise<Blob> {
    const response = await apiClient.get('/errors/export', {});
    // Note: This would need special handling for blob responses
    return new Blob([response.data as BlobPart], { type: 'text/csv' });
  }

  /**
   * Search error history
   */
  async searchErrorHistory(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<ErrorHistoryItem>>> {
    const params = { query, page, limit };
    return await apiClient.get<PaginatedResponse<ErrorHistoryItem>>('/errors/search', params);
  }

  /**
   * Get usage limits for current user
   */
  async getUsageLimits(): Promise<ApiResponse<{
    dailyLimit: number;
    usedToday: number;
    remaining: number;
    resetTime: string;
    subscriptionTier: string;
  }>> {
    return await apiClient.get('/errors/usage');
  }

  /**
   * Get AI model availability
   */
  async getAiModelStatus(): Promise<ApiResponse<{
    openai: {
      available: boolean;
      models: string[];
      status: string;
    };
    gemini: {
      available: boolean;
      models: string[];
      status: string;
    };
  }>> {
    return await apiClient.get('/errors/ai-status');
  }

  /**
   * Rate an explanation (feedback)
   */
  async rateExplanation(
    errorId: string,
    rating: 'helpful' | 'not_helpful',
    feedback?: string
  ): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post(`/errors/${errorId}/rate`, {
      rating,
      feedback
    });
  }

  /**
   * Report an issue with explanation
   */
  async reportIssue(
    errorId: string,
    issueType: 'incorrect' | 'incomplete' | 'inappropriate' | 'other',
    description: string
  ): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post(`/errors/${errorId}/report`, {
      issueType,
      description
    });
  }

  /**
   * Get trending errors
   */
  async getTrendingErrors(): Promise<ApiResponse<{
    category: string;
    count: number;
    examples: string[];
  }[]>> {
    return await apiClient.get('/errors/trending');
  }

  /**
   * Get suggested error messages based on input
   */
  async getSuggestions(partialError: string): Promise<ApiResponse<string[]>> {
    return await apiClient.get('/errors/suggestions', { q: partialError });
  }
}

export const errorService = new ErrorService();
export default errorService;