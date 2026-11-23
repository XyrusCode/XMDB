---
name: tmdb-client
description: How XMDB talks to TMDB — auth from env, single axios client, query hooks, pagination rules.
references:
  - src/config/index.ts
  - src/api/client.ts
  - src/queries/query-client.ts
  - .env.example
---

# TMDB client

## Auth

- The browser calls TMDB directly; there is no backend proxy.
- `src/config/index.ts` resolves credentials once: `VITE_TMDB_TOKEN`
  (Authorization: Bearer) is preferred; `VITE_TMDB_API_KEY` falls back to a
  `?api_key=` query param. Missing both throws at startup — never read the env
  vars anywhere else.
- The dev/test hermetic key lives in `vitest.config.ts`, not in `.env` files.

## Requests

- Use the shared axios instance from `src/api/client.ts`. It normalizes
  errors into `{ status, message }` shapes the UI already renders; do not
  create new axios instances or raw `fetch` calls to TMDB.
- All list endpoints paginate; `MAX_TMDB_PAGE` (config) caps pages at 500.

## Data fetching

- React Query hooks live in `src/queries`. The shared `queryClient` in
  `src/queries/query-client.ts` owns retry/stale-time policy — don't pass
  per-call overrides that fight it.
- Add loading and error states to every page/row that fetches.

## Images

- Build TMDB image URLs with `IMAGE_BASE_URL` + the size constants from
  `src/config/index.ts` (`BACKDROP_SIZE`, `POSTER_SIZE`, `THUMB_SIZE`).
  Never hardcode `/w500` etc. inline.
