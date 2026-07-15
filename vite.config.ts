import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Empty prefix loads every var in .env.local, so nothing here may spread
  // `env` wholesale — `define` below names the single key it exposes, which is
  // what keeps unrelated secrets in that file out of the browser bundle.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // The app predates .jsx, so JSX lives in .js files. esbuild only applies
    // the jsx loader to .jsx/.tsx by default and would choke on them.
    // Both of these go away in phase 3 when the components become .tsx.
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: { loader: { '.js': 'jsx' } },
    },
    // Shim for CRA's process.env until the config module moves to
    // import.meta.env. Lets the toolchain swap land without touching app code.
    define: {
      'process.env.REACT_APP_API_KEY': JSON.stringify(env.TMDB_API_KEY ?? ''),
    },
    server: { port: 5173 },
    preview: { port: 5173 },
    build: { outDir: 'build' },
  };
});
