# Agent notes (XMDB)

This repo is a Vite + React + TypeScript app (TanStack Router, TanStack Query). TMDB is called directly from the client via Axios using `VITE_TMDB_TOKEN` or `VITE_TMDB_API_KEY`.

## Key paths

- `src/router` — routing (TanStack Router)
- `src/pages` — route-level pages
- `src/components` — UI components
- `src/queries` — React Query hooks
- `src/api/client.ts` — Axios client + error normalization
- `src/lib/library.ts` — localStorage library (watchlist, watched movies/episodes, region)

## Conventions

- Use TanStack Query hooks in `src/queries` and the shared Axios `api` client.
- Keep user data in `localStorage` only (no backend accounts). Use `src/lib/library.ts` / `useLibrary`.
- Add loading and error states in pages/rows for good UX.

## Commands

- `npm run dev` — dev server
- `npm run build` — typecheck + build
- `npm run typecheck` — TypeScript only
- `npm run test` — Vitest

## Environment

Set `VITE_TMDB_TOKEN` (preferred) or `VITE_TMDB_API_KEY` in `.env.local` for local dev.
