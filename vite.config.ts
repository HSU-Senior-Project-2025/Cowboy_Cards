import react from '@vitejs/plugin-react-swc';
import { componentTagger } from 'lovable-tagger';
import path from 'path';
import { defineConfig } from 'vite';

function manualChunks(id: string) {
  if (id.includes('node_modules')) {
    return 'nm';
  } else {
    return 'main';
  }
}

export default defineConfig(({ mode }) => {
  console.log("mode: ",mode);
  const res = {
    base: './',
    preview: {
      port: 8080,
    },
    server: {
      host: '::',
      port: 8080,
    },
    build: {
      outDir: 'public',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks,
        },
      },
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
  };

  if (mode === 'production') {
    res.build.sourcemap = false;
  }

  return res;
});
