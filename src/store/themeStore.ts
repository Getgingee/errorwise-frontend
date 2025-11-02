import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getActualTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      actualTheme: 'dark',
      
      setTheme: (theme: Theme) => {
        const actualTheme = getActualTheme(theme);
        
        // Update document class
        if (actualTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        set({ theme, actualTheme });
      },
      
      initializeTheme: () => {
        const { theme } = get();
        const actualTheme = getActualTheme(theme);
        
        // Update document class
        if (actualTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        set({ actualTheme });
        
        // Listen for system theme changes
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = () => {
            const { theme } = get();
            if (theme === 'system') {
              const newActualTheme = getSystemTheme();
              if (newActualTheme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
              set({ actualTheme: newActualTheme });
            }
          };
          
          mediaQuery.addEventListener('change', handleChange);
        }
      },
    }),
    {
      name: 'errorwise-theme',
    }
  )
);
