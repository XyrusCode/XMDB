# XMDB — Xyrus' Movie DataBase

A streaming-style discovery app for movies and TV shows, powered by [TMDB](https://www.themoviedb.org/). Browse trending and upcoming titles, search, view details, check availability, manage a local watchlist, and track watched movies/episodes — all stored in your browser (localStorage), with no account required.

## Stack

| | |
|---|---|
| Build | Vite 6, TypeScript (strict) |
| UI | React 19, Tailwind CSS v4 |
| Routing | TanStack Router (code-based) |
| Data | TanStack Query v5, Axios (client → `/api/*`) |
| Server | Vercel serverless functions proxy TMDB (keeps credentials off the client) |
| Tests | Vitest, Testing Library, msw |
| Deploy | Vercel (via GitHub Actions in this repo’s workflow) |

## Features (current)

- Streaming-style discovery: trending movies/TV, upcoming movies, popular series, search (multi).
- Movie and TV detail pages with posters/backdrops, overviews, cast highlights.
- “Where to watch” availability via TMDB watch providers (region selectable on detail pages).
- Watchlist and watched state stored in `localStorage` (no sign-in).
- TV season/episode guide with per-episode watched toggles.
- PWA support via `vite-plugin-pwa` (where applicable).

## Getting started

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173` by default.

### TMDB credentials (server-side)

TMDB API calls are made from Vercel/server functions under `api/`, **not** from the browser bundle.

Set **one** of these in your server/Vercel environment (and in local dev via your shell or a server env setup as appropriate):

- `TMDB_TOKEN` — v4 “API Read Access Token” (preferred), sent as `Authorization: Bearer …`
- `TMDB_API_KEY` — v3 API key (sent as query param on the server)

Do **not** expose these as `VITE_*` variables for this app’s current architecture.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck and build to `build/` |
| `npm run preview` | Preview production build |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm run test` | Vitest (run once) |
| `npm run lint` | ESLint |

## Notes

- Live TMDB responses require valid server credentials configured in the deployment environment.
- Vercel Analytics is included in the app shell when enabled by the platform.

## License

MIT (see `LICENSE`).
