import { useState, useCallback } from 'react';
import { ToastProps } from '../components/UI/Toast';

export interface UseToastReturn {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id' | 'onRemove'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<ToastProps, 'id' | 'onRemove'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastProps = {
      ...toast,
      id,
      onRemove: removeToast,
    };
    
    setToasts(prev => [...prev, newToast]);
  }, [removeToast]);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
  };
};