import { useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

/**
 * Hook to detect user inactivity and handle session management
 * - If logged in: Auto-refresh token before expiry when idle
 * - If not logged in: No action (best practice)
 * - Auto-logout after extended inactivity
 */
interface UseIdleTimeoutOptions {
  idleTimeout?: number; // Time in ms before refresh attempt (default: 40 minutes)
  logoutTimeout?: number; // Time in ms before forced logout (default: 60 minutes)
  onLogout?: () => void; // Callback when auto-logout happens
  onWarning?: () => void; // Callback 1 minute before logout
}

export const useIdleTimeout = ({
  idleTimeout = 40 * 60 * 1000, // 40 minutes
  logoutTimeout = 60 * 60 * 1000, // 60 minutes
  onLogout,
  onWarning
}: UseIdleTimeoutOptions = {}) => {
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef(false);
  const isRefreshingRef = useRef(false);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('accessToken') || 
                  document.cookie.includes('accessToken=');
    return !!token;
  }, []);

  // Refresh token silently
  const refreshToken = useCallback(async () => {
    if (isRefreshingRef.current) {
      return; // Prevent multiple simultaneous refresh attempts
    }

    try {
      isRefreshingRef.current = true;
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'https://errorwise-backend-production.up.railway.app'}/api/auth/refresh-token`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        // Token refreshed successfully
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
        }
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  // Auto-logout the user
  const performLogout = useCallback(async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'https://errorwise-backend-production.up.railway.app'}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local auth data regardless of API response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('subscriptionTier');
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Trigger callback
      if (onLogout) {
        onLogout();
      }

      // Redirect to login
      window.location.href = '/login?session_expired=true';
    }
  }, [onLogout]);

  // Reset all timers
  const resetTimers = useCallback(() => {
    // Clear existing timers
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

    warningShownRef.current = false;

    // Only set timers if user is authenticated
    if (isAuthenticated()) {
      // Idle timer: Refresh token after idle period
      idleTimerRef.current = setTimeout(() => {
        console.log('[IdleTimeout] Idle period reached - attempting token refresh');
        refreshToken();
      }, idleTimeout);

      // Logout timer: Force logout after extended inactivity
      logoutTimerRef.current = setTimeout(() => {
        // Warning: 1 minute before logout
        if (!warningShownRef.current) {
          warningShownRef.current = true;
          if (onWarning) {
            onWarning();
          }
          // Show warning and then logout
          console.warn('[IdleTimeout] Session expiring soon - showing warning');
          
          // Logout after warning period (1 minute)
          setTimeout(() => {
            console.log('[IdleTimeout] Force logout due to inactivity');
            performLogout();
          }, 60 * 1000); // 1 minute warning period
        }
      }, logoutTimeout - 60 * 1000); // Start warning 1 minute before logout
    }
  }, [isAuthenticated, idleTimeout, logoutTimeout, refreshToken, performLogout, onWarning]);

  // Set up activity listeners
  useEffect(() => {
    // Only setup if user is authenticated
    if (!isAuthenticated()) {
      return;
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const resetOnActivity = () => {
      resetTimers();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetOnActivity);
    });

    // Set initial timers
    resetTimers();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetOnActivity);
      });

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [isAuthenticated, resetTimers]);

  // Manual logout method
  const manualLogout = useCallback(() => {
    performLogout();
  }, [performLogout]);

  // Manual refresh method
  const manualRefresh = useCallback(() => {
    return refreshToken();
  }, [refreshToken]);

  return {
    manualLogout,
    manualRefresh,
    isAuthenticated: isAuthenticated()
  };
};

export default useIdleTimeout;
