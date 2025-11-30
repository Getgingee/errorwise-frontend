// EPIC E and F API Services
// Conversion Optimisation and Early Retention Hooks

import apiClient from './api';

// E1: Smart Upgrade Prompts
export interface UpgradePromptResponse {
  shouldShow: boolean;
  promptType: 'almost_out' | 'popular_feature' | 'try_more' | null;
  message: string;
  title: string;
  cta: string;
  queriesRemaining: number;
  usagePercentage: number;
  triggers: string[];
}

export const smartUpgradeService = {
  async check(context?: string): Promise<UpgradePromptResponse> {
    const url = context ? `/smart-upgrade/check?context=${context}` : '/smart-upgrade/check';
    const response = await apiClient.get(url);
    return (response as any).data || response;
  },
  async trackShown(promptType: string, triggers?: string[]): Promise<void> {
    await apiClient.post('/smart-upgrade/shown', { promptType, triggers, page: window.location.pathname });
  },
  async trackClicked(promptType: string): Promise<void> {
    await apiClient.post('/smart-upgrade/clicked', { promptType, page: window.location.pathname });
  },
  async trackDismissed(promptType: string): Promise<void> {
    await apiClient.post('/smart-upgrade/dismissed', { promptType });
  }
};

// E2: Compare Plans
export interface PlanFeature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  team: boolean | string;
  tooltip?: string;
}

export interface PlanComparison {
  plans: {
    free: { name: string; price: string; description: string; features: string[] };
    pro: { name: string; price: string; description: string; features: string[]; popular: boolean };
    team: { name: string; price: string; description: string; features: string[] };
  };
  featureMatrix: PlanFeature[];
  queryPacks: Array<{ id: string; queries: number; price: string; pricePerQuery: string; popular?: boolean }>;
}

export const comparePlansService = {
  async getComparison(): Promise<PlanComparison> {
    const response = await apiClient.get('/plans/compare');
    return (response as any).data || response;
  },
  async getQueryPacks(): Promise<any> {
    const response = await apiClient.get('/plans/query-packs');
    return (response as any).data || response;
  },
  async trackModalOpen(): Promise<void> {
    await apiClient.post('/plans/track-modal-open');
  }
};

// E3: Social Proof
export interface SocialProofData {
  userCount: number;
  queriesSolved: number;
  testimonials: Array<{
    id: string; name: string; role: string; company: string;
    avatar: string; quote: string; rating: number;
  }>;
  liveActivity: Array<{ id: string; type: string; message: string; time: string }>;
  stats: { avgResponseTime: string; successRate: string; languagesSupported: number };
}

export const socialProofService = {
  async getData(): Promise<SocialProofData> {
    const response = await apiClient.get('/social-proof');
    return (response as any).data || response;
  }
};

// F1: Weekly Digest
export interface DigestAnalytics {
  period: { start: string; end: string };
  queriesThisWeek: number;
  queriesLastWeek: number;
  changePercentage: number;
  topCategories: Array<{ category: string; count: number; trend: string }>;
  timeSaved: string;
  unresolvedQueries: number;
  streakDays: number;
  tips: string[];
}

export interface DigestPreferences {
  enabled: boolean;
  frequency: 'weekly' | 'daily' | 'never';
  dayOfWeek: number;
  includeStats: boolean;
  includeTips: boolean;
}

export const digestService = {
  async getAnalytics(): Promise<DigestAnalytics> {
    const response = await apiClient.get('/digest/analytics');
    return (response as any).data || response;
  },
  async preview(): Promise<any> {
    const response = await apiClient.get('/digest/preview');
    return (response as any).data || response;
  },
  async getPreferences(): Promise<DigestPreferences> {
    const response = await apiClient.get('/digest/preferences');
    return (response as any).data || response;
  },
  async updatePreferences(prefs: Partial<DigestPreferences>): Promise<void> {
    await apiClient.put('/digest/preferences', prefs);
  }
};

// F2: Success Feedback
export interface FeedbackResponse {
  success: boolean;
  message: string;
  bonusOffered?: boolean;
  bonusAmount?: number;
}

export const feedbackService = {
  async submit(data: { queryId?: string; feedback: 'yes' | 'no' | 'partial'; reason?: string; wouldShare?: boolean }): Promise<FeedbackResponse> {
    const response = await apiClient.post('/feedback', data);
    return (response as any).data || response;
  },
  async getShareContent(queryId?: string, errorType?: string): Promise<any> {
    const params = new URLSearchParams();
    if (queryId) params.append('queryId', queryId);
    if (errorType) params.append('errorType', errorType);
    const response = await apiClient.get('/feedback/share-content?' + params);
    return (response as any).data?.shareContent || {};
  },
  async claimBonus(queryId?: string, shareMethod?: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/feedback/claim-bonus', { queryId, shareMethod });
    return (response as any).data || response;
  }
};

// F3: Referral Program
export interface ReferralDashboard {
  referralCode: string;
  referralLink: string;
  totalReferred: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalQueriesEarned: number;
  proMonthsEarned: number;
  referrals: Array<{ email: string; status: string; reward: string; date: string }>;
  rewards: { perFreeReferral: number; perPaidReferral: string; maxMonthlyReferrals: number };
}

export const referralService = {
  async getDashboard(): Promise<ReferralDashboard> {
    const response = await apiClient.get('/referral/dashboard');
    return (response as any).data || response;
  },
  async applyCode(code: string): Promise<{ success: boolean; message: string; bonusQueries?: number }> {
    const response = await apiClient.post('/referral/apply', { code });
    return (response as any).data || response;
  }
};

// Analytics & Event Tracking
export const analyticsService = {
  async trackEvent(eventType: string, metadata?: Record<string, any>): Promise<void> {
    try {
      await apiClient.post('/analytics/event', { eventType, metadata });
    } catch (e) {
      console.error('Event tracking failed:', e);
    }
  },
  trackPageView: (page: string) => analyticsService.trackEvent('page_view', { page }),
  trackFeatureUse: (feature: string) => analyticsService.trackEvent('feature_used', { feature }),
  trackUpgradeIntent: (source: string) => analyticsService.trackEvent('upgrade_intent', { source })
};

export default {
  smartUpgrade: smartUpgradeService,
  comparePlans: comparePlansService,
  socialProof: socialProofService,
  digest: digestService,
  feedback: feedbackService,
  referral: referralService,
  analytics: analyticsService
};
