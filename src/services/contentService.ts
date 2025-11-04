/**
 * Content Service
 * Handles fetching dynamic content from backend API
 */

import { API_ENDPOINTS } from '@/config/api';

export interface ContentSection {
  heading: string;
  content: string;
}

export interface PrivacyPolicyContent {
  title: string;
  lastUpdated: string;
  sections: ContentSection[];
}

export interface TermsOfServiceContent {
  title: string;
  lastUpdated: string;
  sections: ContentSection[];
}

export interface AboutContent {
  mission: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
  values: Array<{
    title: string;
    description: string;
  }>;
}

export interface CommunityContent {
  platforms: Array<{
    name: string;
    url: string;
    members: string;
    activity: string;
    description: string;
  }>;
  channels: Array<{
    name: string;
    description: string;
    purpose: string;
  }>;
  stats: {
    totalMembers: string;
    activeContributors: string;
    monthlyMessages: string;
  };
}

class ContentService {
  /**
   * Fetch Privacy Policy content
   */
  async getPrivacyPolicy(): Promise<PrivacyPolicyContent> {
    try {
      const response = await fetch(API_ENDPOINTS.content.privacy);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to fetch privacy policy:', error);
      throw error;
    }
  }

  /**
   * Fetch Terms of Service content
   */
  async getTermsOfService(): Promise<TermsOfServiceContent> {
    try {
      const response = await fetch(API_ENDPOINTS.content.terms);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to fetch terms of service:', error);
      throw error;
    }
  }

  /**
   * Fetch About content
   */
  async getAboutContent(): Promise<AboutContent> {
    try {
      const response = await fetch(API_ENDPOINTS.content.about);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to fetch about content:', error);
      throw error;
    }
  }

  /**
   * Fetch Community content
   */
  async getCommunityInfo(): Promise<CommunityContent> {
    try {
      const response = await fetch(API_ENDPOINTS.content.community);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to fetch community info:', error);
      throw error;
    }
  }

  /**
   * Generic method to fetch any page content
   */
  async getPageContent(page: 'privacy' | 'terms' | 'about' | 'community'): Promise<any> {
    switch (page) {
      case 'privacy':
        return this.getPrivacyPolicy();
      case 'terms':
        return this.getTermsOfService();
      case 'about':
        return this.getAboutContent();
      case 'community':
        return this.getCommunityInfo();
      default:
        throw new Error(`Unknown page: ${page}`);
    }
  }
}

// Export singleton instance
export const contentService = new ContentService();
