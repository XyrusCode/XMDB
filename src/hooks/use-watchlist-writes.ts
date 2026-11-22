import { asyncRetry, useAsyncQueuer } from '@tanstack/react-pacer';
import { toggleWatchlist, type WatchlistInput } from '@/lib/library';

/**
 * Batched watchlist writes via TanStack Pacer's async queue.
 *
 * - Queue: `useAsyncQueuer` processes writes with `concurrency` + FIFO ordering.
 * - Async retry: `asyncRetry` wraps the write (exponential backoff, abort).
 * - Observable state: `size`, `isRunning`, `isIdle` via `queuer.state` selector.
 */
export function useWatchlistWrites() {
  const retryingWrite = asyncRetry(
    async (item: WatchlistInput) => {
      toggleWatchlist(item);
    },
    { maxAttempts: 2, backoff: 'exponential', baseWait: 250 },
  );

  const queuer = useAsyncQueuer(
    retryingWrite,
    { concurrency: 2, throwOnError: false },
    (state) => ({ size: state.size, isRunning: state.isRunning, isIdle: state.isIdle }),
  );

  const submitBatch = (items: WatchlistInput[]) => {
    items.forEach((item) => queuer.addItem(item));
  };

  return {
    submitBatch,
    size: queuer.state.size,
    isRunning: queuer.state.isRunning,
    isIdle: queuer.state.isIdle,
  };
}
