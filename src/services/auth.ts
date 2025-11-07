import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginStep1Data {
  email: string;
  password: string;
}

export interface LoginStep2Data {
  email: string;
  otp: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  accessToken?: string;
  requiresOTP?: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/register/enhanced', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const verifyEmail = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Email verification failed');
  }
};

export const resendVerification = async (): Promise<AuthResponse> => {
  try {
    // Get verification token from session
    const verificationToken = sessionStorage.getItem('verificationToken');

    if (!verificationToken) {
      throw new Error('No verification session found. Please try logging in again.');
    }

    const response = await api.post('/auth/resend-verification', {
      verificationToken
    });

    return response.data;
  } catch (error: any) {
    // Handle rate limiting
    if (error.response?.status === 429) {
      const retryAfter = error.response.data.retryAfter;
      throw new Error(
        `Too many attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`
      );
    }

    // Handle expired token
    if (error.response?.status === 401) {
      sessionStorage.removeItem('verificationToken');
      throw new Error('Verification session expired. Please try logging in again.');
    }

    throw new Error(
      error.response?.data?.error ||
      'Failed to resend verification email'
    );
  }
};

export const loginStep1 = async (data: LoginStep1Data): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login/enhanced', data);
    return response.data;
  } catch (error: any) {
    // Check for email verification error
    if (error.response?.status === 403 && error.response?.data?.requiresEmailVerification) {
      // Store verification token for resend functionality
      const verificationToken = error.response.data.verificationToken;
      if (verificationToken) {
        sessionStorage.setItem('verificationToken', verificationToken);
      }

      // Throw error with all necessary data
      const verificationError = new Error(
        error.response?.data?.error || error.response?.data?.message || 'Email not verified'
      );
      (verificationError as any).requiresEmailVerification = true;
      (verificationError as any).email = error.response.data.email;
      (verificationError as any).verificationToken = verificationToken;
      throw verificationError;
    }

    throw new Error(error.response?.data?.error || error.response?.data?.message || 'Login failed');
  }
};

export const loginStep2 = async (data: LoginStep2Data): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login/verify-otp', data);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'OTP verification failed');
  }
};

export const resendLoginOTP = async (email: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/resend-login-otp', { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to resend OTP');
  }
};

export const forgotPassword = async (data: ForgotPasswordData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send reset email');
  }
};

export const resetPassword = async (data: ResetPasswordData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Password reset failed');
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken() && !!getCurrentUser();
};

export const sendPhoneOTP = async (phoneNumber: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/send-phone-otp', { phoneNumber });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { success: false, message: 'Failed to send phone OTP' };
  }
};

export const verifyPhoneOTP = async (otp: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/verify-phone-otp', { otp });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { success: false, message: 'Failed to verify phone OTP' };
  }
};

export const deleteAccount = async (reason: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/user/delete-account', { reason });
    if (response.data.success) {
      logout();
    }
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { success: false, message: 'Failed to delete account' };
  }
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
