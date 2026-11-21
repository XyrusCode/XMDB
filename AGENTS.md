# Agent notes (XMDB)

This repo is a Vite + React + TypeScript app (TanStack Router, TanStack Query). TMDB is accessed via Vercel serverless functions in `api/` so API keys/tokens stay server-side; the browser calls `/api/*`.

## Key paths

- `src/routes` / `src/router` — routing (TanStack Router)
- `src/pages` — route-level pages
- `src/components` — UI components
- `src/queries` — React Query hooks
- `src/lib/library.ts` — localStorage library (watchlist, watched movies/episodes, region)
- `api/` — Vercel serverless handlers that proxy TMDB

## Conventions

- Prefer existing patterns (React Query hooks in `src/queries`, shared API client in `src/api/client.ts`).
- Keep user data in `localStorage` only (no backend accounts). Use `src/lib/library.ts` helpers / `useLibrary` hook.
- When adding TMDB endpoints, add a server handler under `api/` and a client wrapper via `api` + `uris`.

## Commands

- `npm run dev` — dev server
- `npm run build` — typecheck + build
- `npm run typecheck` — TypeScript only
- `npm run test` — Vitest

## Environment

Server (Vercel / runtime): set `TMDB_TOKEN` (v4, preferred) or `TMDB_API_KEY` (v3). Do not use `VITE_*` TMDB vars in this architecture.
