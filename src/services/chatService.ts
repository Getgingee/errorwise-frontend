import api from './api';
import { API_ENDPOINTS } from '../config/api';

// Types for the chat/conversation system
export interface ConversationInfo {
  id: string;
  canFollowUp: boolean;
  maxFollowUps: number;
  followUpsRemaining: number;
  suggestedQuestions: string[];
}

export interface AnalysisResponse {
  id: string;
  explanation: string;
  solution: string;
  codeExample?: string;
  sources?: Array<{
    title: string;
    url: string;
    description: string;
  }>;
  confidence: number;
  category: string;
  conversation: ConversationInfo;
}

export interface FollowUpResponse {
  response: string;
  suggestedChips: string[];
  conversation: {
    followUpsRemaining: number;
    canContinue: boolean;
  };
  sources?: Array<{
    title: string;
    url: string;
    description: string;
  }>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  chips?: string[];
}

/**
 * Send a follow-up question in an existing conversation
 */
export const sendFollowUp = async (
  conversationId: string,
  message: string
): Promise<FollowUpResponse> => {
  try {
    const response = await api.post<FollowUpResponse>(API_ENDPOINTS.chat.followUp, {
      conversationId,
      message
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error(error.response.data?.error || 'Follow-up limit reached');
    }
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw new Error(error.response?.data?.error || 'Failed to send follow-up');
  }
};

/**
 * Get conversation history by ID
 */
export const getConversation = async (conversationId: string): Promise<any> => {
  try {
    const response = await api.get(API_ENDPOINTS.chat.get(conversationId));
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to get conversation');
  }
};

/**
 * Get all chat history
 */
export const getChatHistory = async (limit: number = 10): Promise<any[]> => {
  try {
    const response = await api.get(`${API_ENDPOINTS.chat.history}?limit=${limit}`);
    return response.data.conversations || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to get chat history');
  }
};

// Tier-related services
export interface TierInfo {
  tier: string;
  isTrialActive: boolean;
  trialDaysLeft?: number;
  trialEndsAt?: string;
  features: Record<string, boolean>;
  limits: Record<string, number>;
}

export interface TierFeatures {
  tier: string;
  features: string[];
  limits: Record<string, number>;
  comparison?: any;
}

/**
 * Get current tier information
 */
export const getCurrentTier = async (): Promise<TierInfo> => {
  try {
    const response = await api.get<TierInfo>(API_ENDPOINTS.tiers.current);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to get tier info');
  }
};

/**
 * Get tier features and limits
 */
export const getTierFeatures = async (): Promise<TierFeatures> => {
  try {
    const response = await api.get<TierFeatures>(API_ENDPOINTS.tiers.features);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to get tier features');
  }
};

/**
 * Start 7-day Pro trial (free users only)
 */
export const startProTrial = async (): Promise<{ success: boolean; message: string; trialEndsAt: string }> => {
  try {
    const response = await api.post(API_ENDPOINTS.tiers.startTrial);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.error || 'Trial not available');
    }
    throw new Error(error.response?.data?.error || 'Failed to start trial');
  }
};

// Model-related services
export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  speed: string;
  quality: string;
  available: boolean;
  recommended?: boolean;
}

export interface AvailableModels {
  models: ModelInfo[];
  currentModel: string;
  autoModeEnabled: boolean;
  autoModeAvailable: boolean;
}

/**
 * Get available AI models for current tier
 */
export const getAvailableModels = async (): Promise<AvailableModels> => {
  try {
    const response = await api.get<AvailableModels>(API_ENDPOINTS.models.available);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to get models');
  }
};

/**
 * Select AI model
 */
export const selectModel = async (modelId: string): Promise<{ success: boolean; model: string }> => {
  try {
    const response = await api.post(API_ENDPOINTS.models.select, { model: modelId });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('This model requires a higher subscription tier');
    }
    throw new Error(error.response?.data?.error || 'Failed to select model');
  }
};

/**
 * Get current selected model
 */
export const getCurrentModel = async (): Promise<{ model: string; isAuto: boolean }> => {
  try {
    const response = await api.get(API_ENDPOINTS.models.current);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Failed to get current model');
  }
};
