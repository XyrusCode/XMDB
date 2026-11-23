import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    main: 'src/main.tsx',
  },
  format: 'esm',
  outDir: 'build',
  clean: true,
  dts: true,
  shims: true,
  // Keep Vite as the dev server; tsdown handles the production TypeScript bundle.
  // Devtools and other dev-only imports are tree-shaken out via `process.env.NODE_ENV`.
});
