import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { Analytics } from '@vercel/analytics/react';
import { AppProviders } from '@/providers/AppProviders';
import { purgeLegacyCaches } from '@/lib/legacy-caches';
import { router } from '@/router';
import '@/css/globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found in index.html');

// Fire and forget: returning visitors carry caches from the pre-2.0 worker that
// the new one cannot see. Nothing here should delay first paint.
void purgeLegacyCaches();

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
      <Analytics />
    </AppProviders>
  </StrictMode>,
);
