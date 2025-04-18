import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/duffel': {
        target: 'https://api.duffel.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/duffel/, '')
      }
    }
  }
});
