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
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor chunks
          if (id.includes('node_modules')) {
            // Keep React ecosystem together to avoid useState errors
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || 
                id.includes('zustand') || id.includes('use-sync-external-store') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('lucide') || id.includes('framer-motion')) {
              return 'vendor-ui';
            }
            if (id.includes('axios')) {
              return 'vendor-utils';
            }
            // Other node_modules
            return 'vendor';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
