---
name: tanstack-stack
description: Which TanStack library owns which concern in XMDB, and the pattern each one follows here.
references:
  - src/providers/AppProviders.tsx
  - src/components/data-grid/WatchlistGrid.tsx
  - src/components/virtual/MediaVirtualRow.tsx
  - src/lib/app-hotkeys.ts
---

# TanStack integration map

| Concern    | Library            | Home                                        |
| ---------- | ------------------ | ------------------------------------------- |
| Server data | React Query        | `src/queries`, provider in `AppProviders`   |
| Client state | Store (`@tanstack/store`) | `src/lib/library.ts`              |
| Table      | Table v9           | `src/components/data-grid/WatchlistGrid.tsx` |
| Virtualization | React Virtual   | `src/components/virtual/MediaVirtualRow.tsx` |
| Debounce/queue | Pacer           | `src/hooks/use-debounce.ts`, `use-watchlist-writes.ts` |
| Hotkeys    | React Hotkeys      | `src/lib/app-hotkeys.ts` + provider in `AppProviders` |

## Patterns

- **Table v9** uses `tableFeatures()` + a loose `as unknown as {...}` cast —
  keep that cast; it is the sanctioned way to satisfy v9's feature-typed
  generics here.
- **Virtual**: rows are virtualized per media row; scroll positions snapshot
  into the library store (`mediaScroll`) so navigation restores them.
- **Providers** compose in `src/providers/AppProviders.tsx`
  (Helmet → Query → Pacer → Hotkeys). New global providers go there.
- Devtools mount only under the `DEV` guard in `AppProviders` so they
  tree-shake out of production builds.
