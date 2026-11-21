# XMDB — Xyrus' Movie DataBase

A streaming-style discovery app for movies and TV shows, powered by [TMDB](https://www.themoviedb.org/). Browse trending and upcoming titles, search, view details, check availability, manage a local watchlist, and track watched movies/episodes — all stored in your browser (localStorage), with no account required.

## Stack

| | |
|---|---|
| Build | Vite 6, TypeScript (strict) |
| UI | React 19, Tailwind CSS v4 |
| Routing | TanStack Router (code-based) |
| Data | TanStack Query v5, Axios |
| Tests | Vitest, Testing Library, msw |
| Deploy | Vercel (via GitHub Actions) |

## Getting started

```bash
npm install
cp .env.example .env.local   # add your TMDB credential
npm run dev
```

### TMDB credential

Get one from [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) and set **one** of these in `.env.local`:

- `VITE_TMDB_TOKEN` (v4 Read Access Token, preferred)
- `VITE_TMDB_API_KEY` (v3 API key)

These are bundled into the client (TMDB’s intended model for client apps). Keep them read-only/revocable in the TMDB dashboard.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck and build to `build/` |
| `npm run preview` | Preview production build |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm run test` | Vitest |
| `npm run lint` | ESLint |

## Notes

- Watchlist, watched items, and region preferences are stored in `localStorage`.
- Vercel Analytics is included when enabled by the platform.

## License

MIT
