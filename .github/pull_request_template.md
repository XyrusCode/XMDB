## What & why

<!-- One paragraph. Link the issue if there is one. -->

## Phase

<!-- v2 rewrite phase (0 demolition / 1 vite / 2 ts+data / 3 ui / 4 pwa / 5 deploy / 6 lint),
     or "post-v2" for normal work. -->

## Checks

- [ ] `npm run typecheck` passes
- [ ] `npm run test` passes
- [ ] `npm run build` passes
- [ ] No new `any`, `@ts-expect-error`, or `eslint-disable` without a comment saying why

## TMDB / data

- [ ] No new TMDB endpoint without a type in `src/types/tmdb.ts`
- [ ] New queries use `queryKeys` — no inline key arrays
- [ ] No secret added to the bundle beyond the known-public `VITE_TMDB_TOKEN`

## Verified in browser

- [ ] Home: popular list, search, load-more (past page 1)
- [ ] Movie detail: poster, directors, actors, runtime/budget/revenue
- [ ] 404: a junk URL (`/asdf`) renders NotFound, not an error
- [ ] Refresh: SW updates without a stuck old version
