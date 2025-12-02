/**
 * Config Service
 * 
 * Fetches application configuration from backend.
 * ALL tier configurations, AI models, and limits come from here.
 * NO HARDCODED VALUES IN FRONTEND.
 */

import { apiClient } from './api';

// Types
export interface TierLimits {
  queriesPerMonth: number;
  queriesPerDay: number;
  historyRetentionDays: number;
  maxErrorLength: number;
  maxFollowUps: number;
  savedSolutionsLimit: number;
  maxTokens: number;
}

export interface TierFeatures {
  basicAnalysis: boolean;
  advancedAnalysis: boolean;
  codeExamples: boolean;
  stepByStep: boolean;
  aiModelSelection: boolean;
  autoMode: boolean;
  fastModel: boolean;
  smartModel: boolean;
  geniusModel: boolean;
  conversationalMode: boolean;
  followUpQuestions: boolean;
  contextMemory: boolean;
  errorHistory: boolean;
  searchHistory: boolean;
  exportHistory: boolean;
  solutionLibrary: boolean;
  saveSolutions: boolean;
  teamAccess: boolean;
  sharedLibrary: boolean;
  teamAnalytics: boolean;
  adminControls: boolean;
  communitySupport: boolean;
  emailSupport: boolean;
  prioritySupport: boolean;
  vscodeExtension: boolean;
  apiAccess: boolean;
  webhooks: boolean;
  canStartTrial: boolean;
}

export interface TierInfo {
  id: string;
  name: string;
  price: { monthly: number; yearly: number };
  priceLabel: string;
  yearlyPriceLabel?: string;
  description: string;
  badge: string;
  color: string;
  popular?: boolean;
  limits: TierLimits;
  features: TierFeatures;
  highlights: Array<{ text: string; icon: string; highlight?: boolean }>;
}

export interface AIModel {
  id: string;
  name: string;
  apiId: string;
  description: string;
  tier: string;
  available: boolean;
  recommended?: boolean;
}

export interface SubscriptionInfo {
  tier: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}

export interface TrialInfo {
  isInTrial: boolean;
  trialExpired: boolean;
  hasUsedTrial: boolean;
  trialEndsAt: string | null;
  canStartTrial: boolean;
}

export interface UpgradeInfo {
  canUpgrade: boolean;
  nextTier: string | null;
  requiresPayment: boolean;
}

export interface UserConfig {
  subscription: SubscriptionInfo;
  trial: TrialInfo;
  limits: TierLimits;
  features: TierFeatures;
  models: {
    available: AIModel[];
    all: AIModel[];
    default: string;
    autoModeAvailable: boolean;
  };
  upgrade: UpgradeInfo;
}

export interface AppConfig {
  tiers: TierInfo[];
  comparisonTable: any;
  tierLimits: Record<string, TierLimits>;
  aiModels: {
    available: AIModel[];
    defaultByTier: Record<string, string>;
  };
  features: Record<string, { name: string; description: string; icon: string }>;
  version: string;
  environment: string;
}

// Cache for config (to avoid repeated API calls)
let cachedAppConfig: AppConfig | null = null;
let cachedUserConfig: UserConfig | null = null;
let configCacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get full application configuration (public)
 */
export async function getAppConfig(forceRefresh = false): Promise<AppConfig | null> {
  const now = Date.now();
  
  // Return cached if valid
  if (!forceRefresh && cachedAppConfig && (now - configCacheTime) < CACHE_DURATION) {
    return cachedAppConfig;
  }

  try {
    const response = await apiClient.get('/config');
    if (response.success && response.data) {
      cachedAppConfig = response.data;
      configCacheTime = now;
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch app config:', error);
    return null;
  }
}

/**
 * Get user-specific configuration (requires auth)
 */
export async function getUserConfig(forceRefresh = false): Promise<UserConfig | null> {
  const now = Date.now();
  
  // Return cached if valid
  if (!forceRefresh && cachedUserConfig && (now - configCacheTime) < CACHE_DURATION) {
    return cachedUserConfig;
  }

  try {
    const response = await apiClient.get('/config/user');
    if (response.success && response.data) {
      cachedUserConfig = response.data;
      configCacheTime = now;
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch user config:', error);
    return null;
  }
}

/**
 * Get plans for pricing page (public)
 */
export async function getPlans(): Promise<TierInfo[] | null> {
  try {
    const response = await apiClient.get('/config/plans');
    if (response.success && response.data?.plans) {
      return response.data.plans;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    return null;
  }
}

/**
 * Get user's current tier limits
 */
export async function getUserLimits(): Promise<TierLimits | null> {
  const config = await getUserConfig();
  return config?.limits || null;
}

/**
 * Get user's available AI models
 */
export async function getUserModels(): Promise<AIModel[] | null> {
  const config = await getUserConfig();
  return config?.models?.available || null;
}

/**
 * Check if user can start a trial
 */
export async function canStartTrial(): Promise<boolean> {
  const config = await getUserConfig();
  return config?.trial?.canStartTrial || false;
}

/**
 * Check if payment is required for upgrade
 */
export async function isPaymentRequired(): Promise<boolean> {
  const config = await getUserConfig();
  return config?.upgrade?.requiresPayment || false;
}

/**
 * Get max follow-ups for current user
 */
export async function getMaxFollowUps(): Promise<number> {
  const config = await getUserConfig();
  return config?.limits?.maxFollowUps || 3; // Default to free tier
}

/**
 * Clear config cache (call after subscription changes)
 */
export function clearConfigCache(): void {
  cachedAppConfig = null;
  cachedUserConfig = null;
  configCacheTime = 0;
}

// Export singleton instance
export const configService = {
  getAppConfig,
  getUserConfig,
  getPlans,
  getUserLimits,
  getUserModels,
  canStartTrial,
  isPaymentRequired,
  getMaxFollowUps,
  clearConfigCache
};

export default configService;
