/**
 * Design System Tokens
 * Consistent gradient, glassmorphism, and UI properties across all components
 */

export const gradients = {
  // Primary gradient for buttons, badges, and accents
  primary: 'bg-gradient-to-r from-blue-500 to-cyan-400',
  primaryHover: 'hover:from-blue-600 hover:to-cyan-500',
  
  // Background gradients
  background: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900',
  
  // Text gradients
  textGradient: 'bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent',
  
  // Card gradients
  cardGradient: 'bg-gradient-to-br from-slate-800/50 via-blue-900/30 to-slate-800/50',
};

export const glassmorphism = {
  // Light glass effect for cards and modals
  light: 'bg-white/5 backdrop-blur-sm border border-white/10',
  
  // Medium glass effect
  medium: 'bg-white/10 backdrop-blur-md border border-white/20',
  
  // Strong glass effect
  strong: 'bg-white/15 backdrop-blur-lg border border-white/30',
  
  // Dark glass (for overlays)
  dark: 'bg-slate-900/50 backdrop-blur-md border border-slate-700',
  
  // Modal overlay
  modalOverlay: 'bg-black/60 backdrop-blur-sm',
  
  // Navigation
  nav: 'bg-white/5 dark:bg-white/5 backdrop-blur-sm border-b border-white/10',
};

export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  
  // Colored shadows
  blue: 'shadow-blue-500/50',
  cyan: 'shadow-cyan-400/50',
  glow: 'shadow-lg shadow-blue-500/30',
};

export const transitions = {
  default: 'transition-all duration-300',
  fast: 'transition-all duration-150',
  slow: 'transition-all duration-500',
  transform: 'transform hover:scale-105 transition-all duration-300',
};

export const buttons = {
  primary: `${gradients.primary} ${gradients.primaryHover} text-white px-6 py-3 rounded-full ${shadows.lg} hover:${shadows.xl} ${transitions.transform}`,
  secondary: 'border-blue-600 dark:border-blue-600 text-gray-300 dark:text-blue-300 hover:bg-gray-800/50 dark:hover:bg-gray-800/50 backdrop-blur-sm',
  ghost: 'bg-transparent hover:bg-white/5 text-gray-300',
};

export const cards = {
  default: `${glassmorphism.medium} rounded-xl ${shadows.lg} ${transitions.default}`,
  hover: 'hover:border-blue-500/50 hover:shadow-blue-500/20',
  gradient: `${gradients.cardGradient} ${glassmorphism.light} rounded-xl ${shadows.lg}`,
};

export const modals = {
  overlay: `fixed inset-0 ${glassmorphism.modalOverlay} z-50 flex items-center justify-center`,
  content: `${glassmorphism.strong} rounded-2xl ${shadows['2xl']} max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto`,
  header: `border-b border-white/10 ${gradients.textGradient}`,
};

export const inputs = {
  default: `${glassmorphism.light} rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${transitions.default}`,
  error: 'border-red-500/50 focus:ring-red-500',
};

export const badges = {
  primary: `${gradients.primary} text-white px-3 py-1 rounded-full text-sm font-semibold ${shadows.md}`,
  outline: 'border border-blue-500/30 text-blue-400 px-3 py-1 rounded-full text-sm backdrop-blur-sm',
  success: 'bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-sm backdrop-blur-sm',
  warning: 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-3 py-1 rounded-full text-sm backdrop-blur-sm',
};

// Utility function to combine classes
export const cn = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(' ');
};
