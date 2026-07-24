import type { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PWAUpdatePrompt } from '@/components/global/PWAUpdatePrompt';
import { queryClient } from '@/queries/query-client';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      {children}
      <PWAUpdatePrompt />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </HelmetProvider>
);
