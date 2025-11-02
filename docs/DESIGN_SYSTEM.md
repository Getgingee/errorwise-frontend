# Design System Documentation

> **Comprehensive design system for ErrorWise platform including UI components, styling guidelines, glassmorphic patterns, theme configuration, and accessibility standards.**

---

## 🎨 Design Philosophy

### Core Principles

1. **Glassmorphism**: Modern, elegant aesthetic with frosted glass effects
2. **Consistency**: Uniform design patterns across all pages
3. **Accessibility**: WCAG 2.1 AA compliant
4. **Responsiveness**: Mobile-first, adaptive layouts
5. **Performance**: Optimized animations and transitions

---

## 🌈 Color System

### Primary Palette

```css
/* Gradients */
--gradient-primary: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
--gradient-accent: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
--gradient-hero: linear-gradient(to right, #0f172a, #1e293b, #1e3a8a);

/* Accent Colors */
--cyan-400: #22d3ee;    /* Primary accent */
--cyan-500: #06b6d4;    /* Hover states */
--cyan-600: #0891b2;    /* Active states */

/* Background Colors */
--slate-900: #0f172a;   /* Primary background */
--slate-800: #1e293b;   /* Secondary background */
--slate-700: #334155;   /* Tertiary background */

/* Text Colors */
--text-primary: #f8fafc;     /* White text */
--text-secondary: #cbd5e1;   /* Gray text */
--text-muted: #94a3b8;       /* Muted text */
```

### Color Usage

```typescript
// Component example
<div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
  <h1 className="text-white">Primary Text</h1>
  <p className="text-slate-300">Secondary Text</p>
  <span className="text-cyan-400">Accent Text</span>
</div>
```

---

## 🪟 Glassmorphism

### Glass Effect Pattern

```css
/* Base glass effect */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

/* Interactive glass effect */
.glass-interactive {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.glass-interactive:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(34, 211, 238, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(34, 211, 238, 0.1);
}
```

### Tailwind Classes

```html
<!-- Basic glass card -->
<div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
  Card content
</div>

<!-- Interactive glass card -->
<div class="
  bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6
  hover:bg-white/8 hover:border-cyan-400/30
  transition-all duration-300
  hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(34,211,238,0.1)]
">
  Interactive card
</div>

<!-- Sidebar glass -->
<aside class="
  bg-white/5 backdrop-blur-md border-r border-white/10
  transition-all duration-500
">
  Sidebar content
</aside>
```

---

## 🧩 Component Library

### Button Component

```typescript
// components/UI/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
}) => {
  const baseStyles = 'rounded-lg font-medium transition-all duration-200 inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/50',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
    ghost: 'text-cyan-400 hover:bg-cyan-400/10',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

### Card Component

```typescript
// components/UI/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  interactive = false,
}) => {
  const baseStyles = 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6';
  const interactiveStyles = interactive
    ? 'hover:bg-white/8 hover:border-cyan-400/30 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(34,211,238,0.1)] transition-all duration-300 cursor-pointer'
    : '';

  return (
    <div className={`${baseStyles} ${interactiveStyles} ${className}`}>
      {children}
    </div>
  );
};
```

### Input Component

```typescript
// components/UI/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-2 ${icon ? 'pl-10' : ''}
            bg-white/5 backdrop-blur-sm
            border border-white/10
            rounded-lg
            text-white placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
```

### Modal Component

```typescript
// components/UI/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`
          ${sizes[size]} w-full
          bg-slate-900/95 backdrop-blur-md
          border border-white/10
          rounded-2xl
          shadow-2xl
          overflow-hidden
          animate-in fade-in zoom-in duration-200
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
```

---

## 📐 Layout Patterns

### Dashboard Layout

```typescript
// Layout structure
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
  {/* Navigation Sidebar */}
  <aside className="
    fixed left-0 top-0 h-full
    bg-white/5 backdrop-blur-md border-r border-white/10
    transition-all duration-500
    w-64 lg:w-20  // Collapsible
  ">
    <Navigation />
  </aside>

  {/* Main Content */}
  <main className="
    ml-64 lg:ml-20  // Adjust for sidebar width
    p-6
    transition-all duration-500
  ">
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </main>
</div>
```

### Card Grid Layout

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id} interactive>
      <CardContent item={item} />
    </Card>
  ))}
</div>
```

---

## ✨ Animations & Transitions

### Standard Transitions

```css
/* Duration standards */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;

/* Easing functions */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Tailwind Animation Classes

```html
<!-- Hover transitions -->
<div class="transition-all duration-300 hover:-translate-y-1">
  Hover me
</div>

<!-- Fade in -->
<div class="animate-in fade-in duration-500">
  Fade in
</div>

<!-- Slide in -->
<div class="animate-in slide-in-from-bottom duration-500">
  Slide in
</div>

<!-- Spin (loading) -->
<div class="animate-spin">
  <Loader2 />
</div>
```

### Custom Animations

```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(34, 211, 238, 0.6)' },
        },
      },
    },
  },
};
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Tailwind default breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Responsive Patterns

```html
<!-- Responsive grid -->
<div class="
  grid
  grid-cols-1           // Mobile: 1 column
  md:grid-cols-2        // Tablet: 2 columns
  lg:grid-cols-3        // Desktop: 3 columns
  gap-4 md:gap-6        // Responsive gap
">
  Cards...
</div>

<!-- Responsive text -->
<h1 class="
  text-2xl              // Mobile: 24px
  md:text-3xl           // Tablet: 30px
  lg:text-4xl           // Desktop: 36px
  font-bold
">
  Responsive Heading
</h1>

<!-- Responsive padding -->
<div class="
  p-4                   // Mobile: 16px
  md:p-6                // Tablet: 24px
  lg:p-8                // Desktop: 32px
">
  Content
</div>

<!-- Hide/show on different screens -->
<div class="hidden lg:block">
  Desktop only
</div>

<div class="block lg:hidden">
  Mobile only
</div>
```

---

## ♿ Accessibility

### ARIA Labels

```typescript
// Button with aria label
<button
  aria-label="Close modal"
  aria-pressed={isPressed}
  onClick={handleClose}
>
  <X className="w-6 h-6" />
</button>

// Input with aria attributes
<input
  type="email"
  aria-label="Email address"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? 'email-error' : undefined}
/>
{hasError && (
  <p id="email-error" role="alert">
    Please enter a valid email
  </p>
)}
```

### Keyboard Navigation

```typescript
// Focus management
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
  
  if (e.key === 'Escape') {
    handleClose();
  }
};

// Focus trap in modal
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  onKeyDown={handleKeyDown}
  tabIndex={-1}
>
  <h2 id="modal-title">Modal Title</h2>
  {/* Modal content */}
</div>
```

### Color Contrast

```css
/* WCAG AA compliant ratios */
/* Normal text: 4.5:1 minimum */
/* Large text (18px+): 3:1 minimum */

/* ✅ GOOD - High contrast */
.text-white on .bg-slate-900    /* 15.4:1 */
.text-slate-300 on .bg-slate-900 /* 12.1:1 */
.text-cyan-400 on .bg-slate-900  /* 7.2:1 */

/* ❌ BAD - Low contrast */
.text-slate-500 on .bg-slate-900 /* 2.8:1 - Fails */
```

---

## 🌙 Theme Configuration

### Dark Mode (Primary)

```typescript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        // Custom dark theme colors
        dark: {
          bg: {
            primary: '#0f172a',
            secondary: '#1e293b',
            tertiary: '#334155',
          },
          text: {
            primary: '#f8fafc',
            secondary: '#cbd5e1',
            muted: '#94a3b8',
          },
        },
      },
    },
  },
};
```

### Theme Toggle

```typescript
// stores/themeStore.ts
export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: true, // Default dark
  
  toggleTheme: () => {
    set((state) => {
      const newMode = !state.isDarkMode;
      document.documentElement.classList.toggle('dark', newMode);
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return { isDarkMode: newMode };
    });
  },
  
  initializeTheme: () => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || savedTheme === null;
    document.documentElement.classList.toggle('dark', isDark);
    set({ isDarkMode: isDark });
  },
}));
```

---

## 🎯 Usage Examples

### Complete Page Example

```typescript
// pages/DashboardPage.tsx
export const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Dashboard
        </h1>
        <p className="text-slate-300">
          Welcome back! Here's your error analysis overview.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-400/10 rounded-lg">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total Analyses</p>
              <p className="text-2xl font-bold text-white">142</p>
            </div>
          </div>
        </Card>
        {/* More stat cards... */}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">
            Recent Analyses
          </h2>
          {/* Content */}
        </Card>
        
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">
            Quick Actions
          </h2>
          {/* Content */}
        </Card>
      </div>
    </div>
  );
};
```

---

## 📝 Design Tokens

### Spacing Scale

```typescript
// Tailwind spacing (1 unit = 0.25rem = 4px)
const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
};
```

### Typography Scale

```typescript
const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
  base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
  lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
  '5xl': ['3rem', { lineHeight: '1' }],           // 48px
};
```

---

*Last Updated: October 29, 2025*
