import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(import.meta.dirname, 'src') },
  },
  server: { port: 5173 },
  preview: { port: 5173 },
  build: { outDir: 'build' },
});
