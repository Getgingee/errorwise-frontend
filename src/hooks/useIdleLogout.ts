import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity
const WARNING_BEFORE = 5 * 60 * 1000; // Show warning 5 minutes before logout
const CHECK_INTERVAL = 60 * 1000; // Check every minute

export const useIdleLogout = () => {
  const navigate = useNavigate();
  const lastActivityRef = useRef<number>(Date.now());
  const warningShownRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    navigate('/login', { state: { message: 'You were logged out due to inactivity' } });
  }, [navigate]);

  const checkIdleStatus = useCallback(() => {
    const now = Date.now();
    const idleTime = now - lastActivityRef.current;
    const token = localStorage.getItem('accessToken');

    // Only check if user is logged in
    if (!token) return;

    // Idle timeout reached - logout
    if (idleTime >= IDLE_TIMEOUT) {
      console.log('Idle timeout reached, logging out...');
      handleLogout();
      return;
    }

    // Show warning before logout
    if (idleTime >= (IDLE_TIMEOUT - WARNING_BEFORE) && !warningShownRef.current) {
      warningShownRef.current = true;
      const minutesLeft = Math.ceil((IDLE_TIMEOUT - idleTime) / 60000);
      
      // Show browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification('Session Expiring', {
          body: `You will be logged out in ${minutesLeft} minutes due to inactivity`,
          icon: '/favicon.ico'
        });
      }
      
      // Also show console warning (could be toast in real app)
      console.warn(`Session expiring in ${minutesLeft} minutes`);
    }
  }, [handleLogout]);

  useEffect(() => {
    // Events that indicate user activity
    const activityEvents = [
      'mousedown', 'mousemove', 'keydown', 'scroll', 
      'touchstart', 'click', 'focus'
    ];

    // Add activity listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    // Start idle check interval
    timeoutRef.current = setInterval(checkIdleStatus, CHECK_INTERVAL);

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [updateActivity, checkIdleStatus]);

  return { updateActivity };
};

export default useIdleLogout;
