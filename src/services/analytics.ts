/**
 * Analytics Service for tracking user events
 * Currently logs to console, ready for integration with Google Analytics, Mixpanel, etc.
 */

export interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}

class AnalyticsService {
  private isProduction = import.meta.env.PROD;
  private events: AnalyticsEvent[] = [];

  /**
   * Track a custom event
   */
  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      category: 'general',
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
      },
    };

    this.events.push(analyticsEvent);
    
    // Log in development
    if (!this.isProduction) {
      console.log('📊 Analytics Event:', analyticsEvent);
    }

    // Send to analytics platforms
    this.sendToAnalytics(analyticsEvent);
  }

  /**
   * Track newsletter signup
   */
  trackNewsletterSignup(email: string, source: string = 'footer') {
    this.track('newsletter_signup', {
      category: 'engagement',
      label: source,
      email_domain: email.split('@')[1], // Track domain for analytics, not full email
      source,
    });
  }

  /**
   * Track feedback submission
   */
  trackFeedbackSubmit(type: string) {
    this.track('feedback_submit', {
      category: 'engagement',
      label: type,
      feedback_type: type,
    });
  }

  /**
   * Track contact form submission
   */
  trackContactSubmit(messageType?: string) {
    this.track('contact_submit', {
      category: 'engagement',
      label: messageType || 'general',
      message_type: messageType,
    });
  }

  /**
   * Track page view
   */
  trackPageView(page: string) {
    this.track('page_view', {
      category: 'navigation',
      page,
    });
  }

  /**
   * Track modal open
   */
  trackModalOpen(modalName: string) {
    this.track('modal_open', {
      category: 'interaction',
      label: modalName,
      modal_name: modalName,
    });
  }

  /**
   * Track button click
   */
  trackButtonClick(buttonName: string, location: string) {
    this.track('button_click', {
      category: 'interaction',
      label: `${location}_${buttonName}`,
      button_name: buttonName,
      location,
    });
  }

  /**
   * Send events to analytics platforms
   */
  private sendToAnalytics(event: AnalyticsEvent) {
    // Google Analytics (gtag)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.event, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.properties,
      });
    }

    // Mixpanel
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      (window as any).mixpanel.track(event.event, event.properties);
    }

    // Segment
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track(event.event, event.properties);
    }

    // Facebook Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('trackCustom', event.event, event.properties);
    }

    // Send to backend for custom analytics
    this.sendToBackend(event);
  }

  /**
   * Send to backend for storage
   */
  private async sendToBackend(event: AnalyticsEvent) {
    try {
      // Only send in production or if explicitly enabled
      if (!this.isProduction) return;

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://errorwise-backend-production.up.railway.app/api';
      
      await fetch(`${API_BASE_URL}/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      // Silently fail - analytics should never break the app
      console.warn('Analytics tracking failed:', error);
    }
  }

  /**
   * Get all tracked events (for debugging)
   */
  getEvents() {
    return this.events;
  }

  /**
   * Clear tracked events
   */
  clearEvents() {
    this.events = [];
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Export convenience functions
export const trackNewsletterSignup = (email: string, source?: string) => 
  analytics.trackNewsletterSignup(email, source);

export const trackFeedbackSubmit = (type: string) => 
  analytics.trackFeedbackSubmit(type);

export const trackContactSubmit = (messageType?: string) => 
  analytics.trackContactSubmit(messageType);

export const trackPageView = (page: string) => 
  analytics.trackPageView(page);

export const trackModalOpen = (modalName: string) => 
  analytics.trackModalOpen(modalName);

export const trackButtonClick = (buttonName: string, location: string) => 
  analytics.trackButtonClick(buttonName, location);

