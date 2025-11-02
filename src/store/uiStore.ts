import { create } from 'zustand';
import { ToastMessage } from '../types';

interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'auto';
  
  // Loading states
  globalLoading: boolean;
  loadingMessage: string | null;
  
  // Sidebar
  sidebarOpen: boolean;
  
  // Modals
  activeModal: string | null;
  modalData: any;
  
  // Toasts
  toasts: ToastMessage[];
  
  // Mobile
  isMobile: boolean;
  
  // Page state
  pageTitle: string;
  breadcrumbs: { label: string; href?: string }[];
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setGlobalLoading: (loading: boolean, message?: string) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modalId: string, data?: any) => void;
  closeModal: () => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => string;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
  setIsMobile: (isMobile: boolean) => void;
  setPageTitle: (title: string) => void;
  setBreadcrumbs: (breadcrumbs: { label: string; href?: string }[]) => void;
}

let toastId = 0;

export const useUIStore = create<UIState>()((set, get) => ({
  // Initial state
  theme: 'auto',
  globalLoading: false,
  loadingMessage: null,
  sidebarOpen: false,
  activeModal: null,
  modalData: null,
  toasts: [],
  isMobile: false,
  pageTitle: 'ErrorWise',
  breadcrumbs: [],

  // Actions
  setTheme: (theme) => {
    set({ theme });
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto theme - check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // Store in localStorage
    localStorage.setItem('theme', theme);
  },

  setGlobalLoading: (loading, message) => {
    set({ 
      globalLoading: loading, 
      loadingMessage: message || null 
    });
  },

  toggleSidebar: () => {
    set(state => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },

  openModal: (modalId, data) => {
    set({ 
      activeModal: modalId, 
      modalData: data || null 
    });
  },

  closeModal: () => {
    set({ 
      activeModal: null, 
      modalData: null 
    });
  },

  showToast: (toast) => {
    const id = `toast-${++toastId}`;
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration || 5000
    };

    set(state => ({
      toasts: [...state.toasts, newToast]
    }));

    // Auto-hide toast
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().hideToast(id);
      }, newToast.duration);
    }

    return id;
  },

  hideToast: (id) => {
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }));
  },

  clearAllToasts: () => {
    set({ toasts: [] });
  },

  setIsMobile: (isMobile) => {
    set({ isMobile });
  },

  setPageTitle: (title) => {
    set({ pageTitle: title });
    document.title = `${title} - ErrorWise`;
  },

  setBreadcrumbs: (breadcrumbs) => {
    set({ breadcrumbs });
  }
}));

// Helper functions for common toast types
export const toast = {
  success: (title: string, message?: string) => 
    useUIStore.getState().showToast({ type: 'success', title, message }),
  
  error: (title: string, message?: string) => 
    useUIStore.getState().showToast({ type: 'error', title, message }),
  
  warning: (title: string, message?: string) => 
    useUIStore.getState().showToast({ type: 'warning', title, message }),
  
  info: (title: string, message?: string) => 
    useUIStore.getState().showToast({ type: 'info', title, message })
};

// Initialize theme on load
if (typeof window !== 'undefined') {
  const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' || 'auto';
  useUIStore.getState().setTheme(storedTheme);
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = useUIStore.getState().theme;
    if (currentTheme === 'auto') {
      useUIStore.getState().setTheme('auto');
    }
  });
  
  // Listen for window resize
  const updateMobile = () => {
    useUIStore.getState().setIsMobile(window.innerWidth < 768);
  };
  
  updateMobile();
  window.addEventListener('resize', updateMobile);
}