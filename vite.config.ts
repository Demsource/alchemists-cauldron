import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Relative base path ensures builds work seamlessly on GitHub Pages
  base: './',

  // Directory for static assets (images, SVGs, audio, etc.)
  publicDir: 'public',

  server: {
    port: 3000,
    open: true
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    // Ensures clean dist folder on build
    emptyOutDir: true
  },

  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src')
    }
  }
});
