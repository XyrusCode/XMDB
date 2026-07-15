import { QueryClient } from '@tanstack/react-query';
import { isApiError } from '@/api/client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // Covers the Home -> Movie -> Back trip that the old sessionStorage
      // cache existed to serve.
      gcTime: 15 * 60_000,
      retry: (failureCount, error) => {
        if (isApiError(error)) {
          const s = error.status;
          if (s === 408 || s === 429) return failureCount < 1;
          // A 401 or 404 will not fix itself on a retry.
          if (s >= 400 && s < 500) return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
  },
});
