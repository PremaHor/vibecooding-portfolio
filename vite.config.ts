import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { nonblockingCss } from './vite-plugin-nonblocking-css';
import { earlyModulePreload } from './vite-plugin-early-modulepreload';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const prod = mode === 'production';
  return {
    plugins: [react(), tailwindcss(), nonblockingCss(), earlyModulePreload()],
    build: {
      target: 'es2022',
      minify: prod ? 'terser' : 'esbuild',
      terserOptions: prod
        ? {
            compress: { passes: 2, pure_getters: true },
            format: { comments: false },
          }
        : undefined,
      cssMinify: prod,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/motion')) return 'vendor-motion';
            if (id.includes('node_modules/react-dom')) return 'vendor-react';
            if (id.includes('node_modules/react/')) return 'vendor-react';
            if (id.includes('node_modules/lucide-react')) return 'vendor-ui';
            if (id.includes('node_modules/@studio-freight/lenis')) return 'vendor-lenis';
            return undefined;
          },
        },
      },
      chunkSizeWarningLimit: 600,
      reportCompressedSize: false,
    },
    esbuild: prod
      ? { legalComments: 'none', drop: ['debugger'] as ('debugger')[] }
      : undefined,
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
