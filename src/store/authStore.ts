import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  loginStep1 as apiLoginStep1,
  loginStep2 as apiLoginStep2,
  logout as apiLogout,
  getAccessToken,
  getCurrentUser,
  isAuthenticated as checkIsAuthenticated,
  type User
} from '../services/auth';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // OTP Login State
  otpSent: boolean;
  otpEmail: string | null;

  // Actions
  loginStep1: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginStep2: (otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  checkAuth: () => void;
  resetOtpState: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      otpSent: false,
      otpEmail: null,

      // Step 1: Validate credentials and send OTP
      loginStep1: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const result = await apiLoginStep1({ email, password });

          // Backend returns requiresOTP (no 'success' field)
          if (result.requiresOTP) {
            set({
              isLoading: false,
              otpSent: true,
              otpEmail: email,
              error: null
            });
            return { success: true };
          } else {
            throw new Error(result.message || 'Login failed');
          }
        } catch (error: any) {
          console.error('❌ Login Step 1 error:', error);
          set({
            isLoading: false,
            error: error.message || 'Login failed',
            otpSent: false,
            otpEmail: null
          });
          return { success: false, error: error.message || 'Login failed' };
        }
      },

      // Step 2: Verify OTP and complete login
      loginStep2: async (otp: string) => {
        const { otpEmail } = get();

        if (!otpEmail) {
          return { success: false, error: 'No email found. Please restart login.' };
        }

        set({ isLoading: true, error: null });

        try {
          const result = await apiLoginStep2({ email: otpEmail, otp });

          if (result.success && result.user) {
            set({
              user: result.user,
              token: result.accessToken || null,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              otpSent: false,
              otpEmail: null
            });

            console.log('✅ Login successful - auth state updated:', result.user);
            return { success: true };
          } else {
            throw new Error(result.message || 'OTP verification failed');
          }
        } catch (error: any) {
          console.error('❌ Login Step 2 error:', error);
          set({
            isLoading: false,
            error: error.message || 'OTP verification failed'
          });
          return { success: false, error: error.message || 'OTP verification failed' };
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true });

        try {
          await apiLogout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            otpSent: false,
            otpEmail: null
          });
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Set user
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
        localStorage.setItem('user', JSON.stringify(user));
      },

      // Update user
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser });
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      },

      // Check auth on app load
      checkAuth: () => {
        const token = getAccessToken();
        const user = getCurrentUser();
        const authenticated = checkIsAuthenticated();

        if (authenticated && user && token) {
          set({
            user,
            token,
            isAuthenticated: true
          });
        } else {
          set({
            user: null,
            token: null,
            isAuthenticated: false
          });
        }
      },

      // Reset OTP state
      resetOtpState: () => {
        set({
          otpSent: false,
          otpEmail: null,
          error: null
        });
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
