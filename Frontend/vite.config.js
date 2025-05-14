import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Important: Set the base path for production deployment
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://api.duffel.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      // Ensure there are no empty chunks
      output: {
        manualChunks: undefined
      }
    },
    // Ensure source maps are generated for debugging
    sourcemap: true
  },
  publicDir: './public',
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
