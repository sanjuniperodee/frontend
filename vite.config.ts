import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          leaflet: ['leaflet', 'react-leaflet'],
          ui: ['@tanstack/react-query', 'react-hot-toast', 'framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  }
});