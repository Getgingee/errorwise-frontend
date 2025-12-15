import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React core ecosystem - must stay together
            if (id.includes('react') || id.includes('react-dom') || 
                id.includes('scheduler') || id.includes('use-sync-external-store')) {
              return 'vendor-react-core';
            }
            // React Router separate
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            // State management
            if (id.includes('zustand')) {
              return 'vendor-state';
            }
            // UI libraries - split by size
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-animation';
            }
            if (id.includes('react-syntax-highlighter') || id.includes('refractor') || id.includes('prismjs')) {
              return 'vendor-syntax';
            }
            // Form libraries
            if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
              return 'vendor-forms';
            }
            // Radix UI components
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            // Date utilities
            if (id.includes('date-fns')) {
              return 'vendor-date';
            }
            // HTTP client
            if (id.includes('axios')) {
              return 'vendor-http';
            }
            // Tailwind utilities
            if (id.includes('tailwind-merge') || id.includes('clsx') || id.includes('class-variance-authority')) {
              return 'vendor-css';
            }
            // Other vendor libs
            return 'vendor-misc';
          }
          
          // Split large app components
          if (id.includes('/components/subscription/')) {
            return 'app-subscription';
          }
          if (id.includes('/components/team/')) {
            return 'app-team';
          }
          if (id.includes('/components/landing/')) {
            return 'app-landing';
          }
          if (id.includes('/services/')) {
            return 'app-services';
          }
        },
      },
    },
    cssCodeSplit: true,
    minify: 'esbuild'
  },
  esbuild: {
    drop: ['console', 'debugger']
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
