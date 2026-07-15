import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // 'prompt' + skipWaiting:false lets the reader opt into an update rather
      // than having the page swapped out from under them mid-scroll.
      registerType: 'prompt',
      strategies: 'generateSW',
      // The old service worker is still installed in real browsers at this
      // scope and will keep serving stale content until something replaces it.
      // This registers at the same scope, so it does.
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        cleanupOutdatedCaches: true,
        skipWaiting: false,
        clientsClaim: false,
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            // Images only. The old worker matched RegExp('/*') with
            // StaleWhileRevalidate, which swept up every TMDB API response and
            // served stale films with no way to invalidate them. Posters are
            // immutable and content-addressed, so they are safe to keep;
            // api.themoviedb.org must never be cached here.
            urlPattern: /^https:\/\/image\.tmdb\.org\/t\/p\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tmdb-images',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: "Xyrus' Movie DataBase",
        short_name: 'XMDB',
        description: 'Browse popular films and search The Movie Database.',
        start_url: '/',
        display: 'standalone',
        lang: 'en',
        categories: ['entertainment'],
        // Matches the lightbox and the darkroom respectively.
        theme_color: '#edf0f2',
        background_color: '#edf0f2',
        icons: [
          { src: '/favicon.ico', sizes: '64x64 32x32 24x24 16x16', type: 'image/x-icon' },
          { src: '/logo180.png', type: 'image/png', sizes: '180x180', purpose: 'any' },
          { src: '/logo512.png', type: 'image/png', sizes: '512x512', purpose: 'any' },
          { src: '/logo512.png', type: 'image/png', sizes: '512x512', purpose: 'maskable' },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: { '@': resolve(import.meta.dirname, 'src') },
  },
  server: { port: 5173 },
  preview: { port: 5173 },
  build: { outDir: 'build' },
});
