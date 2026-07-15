import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { AppProviders } from '@/providers/AppProviders';
import { router } from '@/router';
import '@/css/globals.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found in index.html');

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);
