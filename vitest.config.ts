import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(import.meta.dirname, 'src') },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    // Pinned here rather than read from .env.local so the suite is hermetic and
    // runs the same in CI, where no .env.local exists.
    env: { VITE_TMDB_API_KEY: 'test-key-not-a-real-credential' },
  },
});
