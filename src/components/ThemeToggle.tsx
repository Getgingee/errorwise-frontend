import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex items-center space-x-1 bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-full transition-all duration-200 ${
          theme === 'light'
            ? 'bg-white text-blue-600 shadow-md'
            : 'text-gray-300 hover:text-white hover:bg-white/10'
        }`}
        title="Light mode"
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-full transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-300 hover:text-white hover:bg-white/10'
        }`}
        title="Dark mode"
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-full transition-all duration-200 ${
          theme === 'system'
            ? 'bg-purple-600 text-white shadow-md'
            : 'text-gray-300 hover:text-white hover:bg-white/10'
        }`}
        title="System mode"
        aria-label="System mode"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
};
