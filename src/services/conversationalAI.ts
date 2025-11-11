import api from './api';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  followUpQuestions?: string[];
  webSources?: WebSource[];
}

export interface WebSource {
  url: string;
  title: string;
  snippet: string;
  relevance: number;
}

export interface ConversationResponse {
  conversationId: string;
  answer: string;
  followUpQuestions?: string[];
  webSources?: WebSource[];
  context?: {
    manufacturer?: string;
    model?: string;
    errorType?: string;
    language?: string;
  };
}

export interface ScrapeRequest {
  query: string;
  context?: {
    manufacturer?: string;
    model?: string;
    errorType?: string;
  };
}

export interface ScrapeResponse {
  sources: WebSource[];
  summary: string;
}

/**
 * Ask a question in a conversational manner with context awareness
 * Supports multi-turn conversations with follow-up questions (Pro/Team only)
 */
export const askConversational = async (
  query: string,
  conversationId?: string,
  context?: any
): Promise<ConversationResponse> => {
  try {
    const response = await api.post<ConversationResponse>('/conversation/ask', {
      query,
      conversationId,
      context
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('This feature requires a Pro or Team subscription');
    }
    if (error.response?.status === 429) {
      throw new Error('Monthly query limit reached. Upgrade to Pro for unlimited queries.');
    }
    throw new Error(error.response?.data?.message || 'Failed to get conversational response');
  }
};

/**
 * Get conversation history for a specific conversation
 */
export const getConversationHistory = async (
  conversationId: string
): Promise<ConversationMessage[]> => {
  try {
    const response = await api.get<{ history: any[] }>(`/conversation/history/${conversationId}`);
    return response.data.history.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get conversation history');
  }
};

/**
 * Clear conversation context
 */
export const clearConversation = async (conversationId: string): Promise<void> => {
  try {
    await api.delete(`/conversation/${conversationId}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to clear conversation');
  }
};

/**
 * Scrape web for solutions (Pro/Team only)
 */
export const scrapeForSolutions = async (
  request: ScrapeRequest
): Promise<ScrapeResponse> => {
  try {
    const response = await api.post<ScrapeResponse>('/conversation/scrape', request);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('Web scraping is only available for Pro and Team subscribers');
    }
    throw new Error(error.response?.data?.message || 'Failed to scrape web for solutions');
  }
};

/**
 * Generate a unique conversation ID
 */
export const generateConversationId = (): string => {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
