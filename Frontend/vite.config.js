import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
    rollupOptions: {
      // Ensure there are no empty chunks
      output: {
        manualChunks: undefined
      }
    }
  },
  publicDir: './public',
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
