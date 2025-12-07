import React, { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { setupTokenRefreshInterceptor } from '../utils/tokenRefresh';
import axios from 'axios';
import toast from 'react-hot-toast';

const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // Warn 5 minutes before
const CHECK_INTERVAL = 60 * 1000; // Check every minute

// Setup token refresh interceptor globally
setupTokenRefreshInterceptor(axios);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuthStore();
  const lastActivityRef = useRef<number>(Date.now());
  const warningShownRef = useRef<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;
  }, []);
  
  const handleIdleLogout = useCallback(async () => {
    console.log('Session expired due to inactivity');
    await logout();
    navigate('/login', { 
      state: { message: 'You were logged out due to inactivity' } 
    });
  }, [logout, navigate]);
  
  const checkIdle = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    const idleTime = Date.now() - lastActivityRef.current;
    
    // Logout if idle too long
    if (idleTime >= IDLE_TIMEOUT) {
      handleIdleLogout();
      return;
    }
    
    // Warn before logout
    if (idleTime >= IDLE_TIMEOUT - WARNING_TIME && !warningShownRef.current) {
      warningShownRef.current = true;
      const minutes = Math.ceil((IDLE_TIMEOUT - idleTime) / 60000);
      toast(`Session expiring in ${minutes} minutes`, {
        icon: '⚠️',
        duration: 10000
      });
    }
  }, [handleIdleLogout]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear interval when logged out
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    
    // Activity events
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(e => window.addEventListener(e, updateActivity, { passive: true }));
    
    // Start idle check
    intervalRef.current = setInterval(checkIdle, CHECK_INTERVAL);
    
    return () => {
      events.forEach(e => window.removeEventListener(e, updateActivity));
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, updateActivity, checkIdle]);
  
  // Check for expired query param (from token refresh failure)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      toast.error('Your session expired. Please log in again.');
      // Clean up the URL
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  
  return <>{children}</>;
};

export default AuthProvider;
