import { useEffect, useState, type ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { HotkeysProvider } from '@tanstack/react-hotkeys';
import { PacerProvider } from '@tanstack/react-pacer';
import { PWAUpdatePrompt } from '@/components/global/PWAUpdatePrompt';
import { appHotkeys, loadCustomHotkeys, saveCustomHotkeys } from '@/lib/app-hotkeys';
import { queryClient } from '@/queries/query-client';

const InnerProviders = ({ children }: { children: ReactNode }) => {
  const [customHotkeys, setCustomHotkeys] = useState(() => loadCustomHotkeys());

  useEffect(() => {
    saveCustomHotkeys(customHotkeys);
  }, [customHotkeys]);

  return (
    <HotkeysProvider
      appHotkeys={appHotkeys}
      customHotkeys={customHotkeys}
      onCustomHotkeysChange={(next) => setCustomHotkeys(next as typeof customHotkeys)}
    >
      {children}
      <PWAUpdatePrompt />
    </HotkeysProvider>
  );
};

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <PacerProvider>
        <InnerProviders>{children}</InnerProviders>
        {import.meta.env.DEV && (
          <TanStackDevtools
            plugins={[{ name: 'TanStack Query', render: () => <ReactQueryDevtoolsPanel /> }]}
            config={{ hideUntilHover: true }}
          />
        )}
      </PacerProvider>
    </QueryClientProvider>
  </HelmetProvider>
);
