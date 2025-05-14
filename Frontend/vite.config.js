import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate source maps for debugging
    sourcemap: true,
    
    // Make sure paths are correct
    rollupOptions: {
      output: {
        // Ensure all assets get unique names
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        
        // Ensure empty chunks aren't generated
        manualChunks: undefined
      }
    }
  },
  
  // Make sure your favicon and public assets are handled correctly
  publicDir: 'public',
  
  // This ensures base path is root (important for routing)
  base: '/',
  
  server: {
    proxy: {
      '/api': {
        target: 'https://api.duffel.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
