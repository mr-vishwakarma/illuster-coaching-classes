import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Agora is ~1MB — isolate it so it only loads on /live-class
          if (id.includes('agora-rtc-sdk-ng') || id.includes('agora-rtc-react')) {
            return 'vendor-agora';
          }
          // framer-motion is ~150KB — isolate from main entry
          if (id.includes('framer-motion')) {
            return 'vendor-framer-motion';
          }
          // Supabase — already split but ensure consistency
          if (id.includes('@supabase')) {
            return 'vendor-supabase';
          }
          // React core — keep in a stable, long-cached chunk
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
        },
      },
    },
    // Raise warning threshold to 1000kB since Agora has its own chunk now
    chunkSizeWarningLimit: 1000,
  },
})

