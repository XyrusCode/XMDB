# XMDB — Xyrus' Movie DataBase

Browse popular films and search [TMDB](https://www.themoviedb.org/).

The interface is built as a film editor's contact sheet rather than a streaming
app: posters sit in film frames on a lightbox, ranked by popularity and numbered
like frames, and runtimes read as timecode. Hovering or tabbing to a film draws a
grease-pencil ring around it — the mark an editor makes on a select. In dark mode
the lightbox goes off and you are in a darkroom.

## Stack

| | |
|---|---|
| Build | Vite 6, TypeScript strict |
| UI | React 19, Tailwind v4, shadcn on [Base UI](https://base-ui.com/) |
| Routing | TanStack Router (code-based) |
| Data | TanStack Query v5, Axios |
| Tests | Vitest, Testing Library, msw |
| Deploy | Vercel, via GitHub Actions |

## Getting started

```bash
npm install
cp .env.example .env.local   # then add a TMDB credential
npm run dev
```

### The TMDB credential

Get one from [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
and set **one** of these in `.env.local`:

- `VITE_TMDB_TOKEN` — the v4 "API Read Access Token" (preferred). Sent as a
  bearer header, so it stays out of URLs, `Referer` headers and access logs.
- `VITE_TMDB_API_KEY` — the v3 API key. Can only travel in the query string.

Whichever you use **ships in the browser bundle**. That is how TMDB intends
client-side apps to work: both credentials are read-only and revocable from the
dashboard. A `VITE_`-prefixed variable is a public variable by definition — do
not put anything in one that isn't safe to publish.

If neither is set the app throws at boot rather than defaulting to an empty
string, so a misconfigured deploy fails loudly instead of surfacing later as an
unexplained 401 from TMDB.

## Scripts

| Script | |
|---|---|
| `npm run dev` | Dev server on :5173 |
| `npm run build` | Typecheck and build to `build/` |
| `npm run preview` | Serve the built app (needed to exercise the service worker) |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm run test` | Vitest once |
| `npm run test:watch` | Vitest in watch mode |

## Deploying

Pushes deploy through GitHub Actions, not Vercel's git integration — the git
integration deploys regardless of CI status, which lets a red build ship anyway.
Here the `deploy` job needs a green `test` job, so CI is the real gate.
`vercel.json` sets `deploymentEnabled.main: false` to stop Vercel deploying the
same commit a second time.

Repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.

The TMDB credential is **not** among them. CI runs `vercel pull` before
`vercel build`, which fetches the project's environment from Vercel — so the
credential lives in the Vercel dashboard only, with one source of truth.

## Releasing

Bump the version, tag it, push:

```bash
npm version 2.1.0   # writes package.json and creates the v2.1.0 tag
git push && git push --tags
```

CI refuses to deploy or release when the tag and `package.json` disagree, so a
release cannot be labelled with a version that exists nowhere in the artifact.
Release notes are generated from the commits in the tag.

## History

Version 1 was built from a [2021 YouTube tutorial](https://www.youtube.com/watch?v=nTeuhbP7wdE)
on Create React App, React 17 and styled-components. 2.0.0 is a full rewrite.
