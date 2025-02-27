import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // Ensures paths work correctly on AWS Amplify
  plugins: [react()],
  build: {
    outDir: 'dist', // The directory where built files go
    assetsDir: 'static', // Ensures assets are stored properly
    rollupOptions: {
      output: {
        entryFileNames: 'static/[name].js',
        chunkFileNames: 'static/[name].js',
        assetFileNames: 'static/[name].[ext]'
      }
    }
  },
  server: {
    port: 3000, // Local development server
    strictPort: true,
  }
});