---
name: local-library
description: XMDB's user data layer — TanStack Store singleton, localStorage persistence, debounced writes.
references:
  - src/lib/library.ts
  - src/hooks/use-watchlist-writes.ts
  - src/hooks/use-debounce.ts
---

# Local library (watchlist / watched / region)

## Architecture

- No backend accounts. User data (watchlist, watched movies/episodes, region,
  scroll snapshots) lives in localStorage, owned by the TanStack Store
  singleton in `src/lib/library.ts`.
- Read via `useLibrary`-style hooks (`src/hooks/use-library.ts`); never touch
  `localStorage` directly from components.

## Writes

- Mutation paths (add/remove watchlist, mark watched) go through
  `src/hooks/use-watchlist-writes.ts`, which serializes writes with
  `useAsyncQueuer` and retries with `asyncRetry` — don't fire your own
  `localStorage.setItem` for library data.
- Debounce/throttle user input with `src/hooks/use-debounce.ts`
  (`useDebouncedValue`, Pacer-based) rather than hand-rolled timers.

## Rules

- Keep the store shape append-only-ish: new fields must default when missing
  from older persisted payloads (users' stored JSON predates your change).
- `useSyncExternalStore` snapshots must be referentially stable between
  mutations or the app re-renders in a loop.
