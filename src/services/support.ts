import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://errorwise-backend-production.up.railway.app/api';

export interface FeedbackData {
  feedback_type: 'feature_request' | 'bug_report' | 'general_feedback' | 'improvement_suggestion';
  subject?: string;
  message: string;
  rating?: number;
  name?: string;
  email?: string;
}

export interface ContactData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  message_type?: 'general' | 'sales' | 'support' | 'partnership' | 'enterprise';
}

export interface NewsletterData {
  email: string;
  name?: string;
}

class SupportService {
  // Submit feedback
  async submitFeedback(data: FeedbackData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/support/feedback`,
        data,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to submit feedback'
      };
    }
  }

  // Submit contact message
  async submitContact(data: ContactData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/support/contact`,
        data,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send message'
      };
    }
  }

  // Newsletter subscription (we'll use contact endpoint with a specific type)
  async subscribeNewsletter(data: NewsletterData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/support/contact`,
        {
          name: data.name || 'Newsletter Subscriber',
          email: data.email,
          message: 'Newsletter subscription request',
          subject: 'Newsletter Subscription',
          message_type: 'general'
        }
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to subscribe'
      };
    }
  }
}

export const supportService = new SupportService();

