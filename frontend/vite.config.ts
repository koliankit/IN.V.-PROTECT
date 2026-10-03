import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    // Dev proxy: forwards /api requests to the local FastAPI backend
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Output goes to frontend/dist — picked up by Render's staticPublishPath
    outDir: 'dist',
  },
  test: {
    globals: true,
    environment: 'node',
  },
});
