import { create } from 'zustand';
import { 
  ErrorExplanationRequest,
  ErrorExplanationResponse,
  ErrorHistoryItem
} from '../types';
import { errorService } from '../services/error';

interface ErrorState {
  // Current explanation state
  currentExplanation: ErrorExplanationResponse | null;
  isExplaining: boolean;
  explanationError: string | null;

  // History state
  errorHistory: ErrorHistoryItem[];
  historyLoading: boolean;
  historyError: string | null;
  historyPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;

  // Usage state
  usageLimits: {
    dailyLimit: number;
    usedToday: number;
    remaining: number;
    resetTime: string;
    subscriptionTier: string;
  } | null;
  usageLoading: boolean;

  // Categories and filters
  categories: string[];
  selectedCategory: string | null;
  selectedSeverity: string | null;
  searchQuery: string;

  // Actions
  explainError: (request: ErrorExplanationRequest) => Promise<ErrorExplanationResponse>;
  loadErrorHistory: (page?: number, limit?: number) => Promise<void>;
  loadMoreHistory: () => Promise<void>;
  searchHistory: (query: string) => Promise<void>;
  clearCurrentExplanation: () => void;
  setFilters: (category?: string, severity?: string) => void;
  loadUsageLimits: () => Promise<void>;
  loadCategories: () => Promise<void>;
  deleteError: (id: string) => Promise<void>;
  rateExplanation: (errorId: string, rating: 'helpful' | 'not_helpful', feedback?: string) => Promise<void>;
  clearErrors: () => void;
}

export const useErrorStore = create<ErrorState>()((set, get) => ({
  // Initial state
  currentExplanation: null,
  isExplaining: false,
  explanationError: null,

  errorHistory: [],
  historyLoading: false,
  historyError: null,
  historyPagination: null,

  usageLimits: null,
  usageLoading: false,

  categories: [],
  selectedCategory: null,
  selectedSeverity: null,
  searchQuery: '',

  // Actions
  explainError: async (request: ErrorExplanationRequest) => {
    set({ isExplaining: true, explanationError: null });
    
    try {
      const response = await errorService.explainError(request);
      
      if (response.success && response.data) {
        set({
          currentExplanation: response.data,
          isExplaining: false
        });
        
        // Refresh usage limits after successful explanation
        get().loadUsageLimits();
        
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to explain error');
      }
    } catch (error: any) {
      set({
        isExplaining: false,
        explanationError: error.message || 'Failed to explain error'
      });
      throw error;
    }
  },

  loadErrorHistory: async (page = 1, limit = 10) => {
    set({ historyLoading: true, historyError: null });
    
    try {
      const { selectedCategory, selectedSeverity } = get();
      const response = await errorService.getErrorHistory(
        page,
        limit,
        selectedCategory || undefined,
        selectedSeverity || undefined
      );
      
      if (response.success && response.data) {
        set({
          errorHistory: response.data.data,
          historyPagination: response.data.pagination,
          historyLoading: false
        });
      } else {
        throw new Error(response.message || 'Failed to load history');
      }
    } catch (error: any) {
      set({
        historyLoading: false,
        historyError: error.message || 'Failed to load history'
      });
    }
  },

  loadMoreHistory: async () => {
    const { historyPagination, errorHistory } = get();
    
    if (!historyPagination?.hasNext) return;
    
    try {
      const { selectedCategory, selectedSeverity } = get();
      const response = await errorService.getErrorHistory(
        historyPagination.page + 1,
        historyPagination.limit,
        selectedCategory || undefined,
        selectedSeverity || undefined
      );
      
      if (response.success && response.data) {
        set({
          errorHistory: [...errorHistory, ...response.data.data],
          historyPagination: response.data.pagination
        });
      }
    } catch (error: any) {
      set({
        historyError: error.message || 'Failed to load more history'
      });
    }
  },

  searchHistory: async (query: string) => {
    set({ historyLoading: true, historyError: null, searchQuery: query });
    
    try {
      if (query.trim()) {
        const response = await errorService.searchErrorHistory(query);
        
        if (response.success && response.data) {
          set({
            errorHistory: response.data.data,
            historyPagination: response.data.pagination,
            historyLoading: false
          });
        }
      } else {
        // If query is empty, load regular history
        await get().loadErrorHistory();
      }
    } catch (error: any) {
      set({
        historyLoading: false,
        historyError: error.message || 'Failed to search history'
      });
    }
  },

  clearCurrentExplanation: () => {
    set({ 
      currentExplanation: null, 
      explanationError: null 
    });
  },

  setFilters: (category?: string, severity?: string) => {
    set({
      selectedCategory: category || null,
      selectedSeverity: severity || null
    });
    
    // Reload history with new filters
    get().loadErrorHistory();
  },

  loadUsageLimits: async () => {
    set({ usageLoading: true });
    
    try {
      const response = await errorService.getUsageLimits();
      
      if (response.success && response.data) {
        set({
          usageLimits: response.data,
          usageLoading: false
        });
      }
    } catch (error) {
      set({ usageLoading: false });
      // Don't show error for usage limits as it's not critical
    }
  },

  loadCategories: async () => {
    try {
      const response = await errorService.getErrorCategories();
      
      if (response.success && response.data) {
        set({ categories: response.data });
      }
    } catch (error) {
      // Silently fail for categories
      console.error('Failed to load categories:', error);
    }
  },

  deleteError: async (id: string) => {
    try {
      const response = await errorService.deleteError(id);
      
      if (response.success) {
        // Remove from local state
        const { errorHistory } = get();
        set({
          errorHistory: errorHistory.filter(error => error.id !== id)
        });
      } else {
        throw new Error(response.message || 'Failed to delete error');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete error');
    }
  },

  rateExplanation: async (errorId: string, rating: 'helpful' | 'not_helpful', feedback?: string) => {
    try {
      await errorService.rateExplanation(errorId, rating, feedback);
      // Could update local state to reflect rating if needed
    } catch (error: any) {
      throw new Error(error.message || 'Failed to rate explanation');
    }
  },

  clearErrors: () => {
    set({
      explanationError: null,
      historyError: null
    });
  }
}));