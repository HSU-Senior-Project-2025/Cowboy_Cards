import react from '@vitejs/plugin-react-swc';
import { componentTagger } from 'lovable-tagger';
import path from 'path';
import { defineConfig } from 'vite';

function manualChunks(id: string) {
  if (id.includes('ion-')) {
    return 'ion';
  } else if (id.includes('core')) {
    return 'core';
  } else if (id.includes('react')) {
    return 'react';
  } else if (id.includes('node_modules')) {
    return 'nm';
  } else {
    return 'main';
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  server: {
    host: '::',
    port: 8080,
  },
  build: {
    outDir: 'public',
    rollupOptions: {
      // manualChunks: {
      //   vendor_radix: ['@radix-ui/react-accordion'],
      //   vendor_react: ['react', 'react-dom', 'react-router-dom'],
      //   vendor_lll: ['@ionic/react'],
      // },
      //   output: {
      //     manualChunks,
      //   },
    },
    sourcemap: true,
  },
  publicDir: 'static',
  plugins: [react(), mode === 'development' && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
