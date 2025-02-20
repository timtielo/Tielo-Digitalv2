import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'entry-server': resolve(__dirname, 'src/entry-server.tsx')
      }
    }
  },
  ssr: {
    noExternal: ['lucide-react', 'framer-motion']
  },
  preview: {
    port: 4173,
    host: true,
    open: true
  },
  server: {
    port: 5173,
    host: true,
    open: true
  }
});