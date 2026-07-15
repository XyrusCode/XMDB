/**
 * Every `import.meta.env` read in the app goes through here.
 *
 * A missing credential throws at module load rather than defaulting to '', so a
 * misconfigured deploy fails at boot (or at build, in CI) instead of surfacing
 * later as an unexplained 401 from TMDB.
 */

const v4Token = import.meta.env.VITE_TMDB_TOKEN;
const v3Key = import.meta.env.VITE_TMDB_API_KEY;

const present = (v: string | undefined): v is string => typeof v === 'string' && v.length > 0;

/**
 * TMDB accepts either credential. The v4 token is preferred: it travels as a
 * bearer header, so it stays out of URLs and therefore out of Referer headers,
 * browser history and access logs. The v3 key can only go in the query string.
 *
 * Both are public by construction — they ship in the browser bundle, as TMDB
 * intends for client-side apps. Both are read-only and revocable. Nothing that
 * isn't safe to publish belongs in a VITE_ prefixed var.
 */
export const tmdbAuth = ((): { kind: 'bearer'; token: string } | { kind: 'query'; key: string } => {
  if (present(v4Token)) return { kind: 'bearer', token: v4Token };
  if (present(v3Key)) return { kind: 'query', key: v3Key };
  throw new Error(
    'Missing TMDB credentials: set VITE_TMDB_TOKEN (v4, preferred) or VITE_TMDB_API_KEY (v3). See .env.example.',
  );
})();

export const config = {
  /** Swapping this for a same-origin proxy path is the whole migration. */
  apiBase: 'https://api.themoviedb.org/3',
} as const;

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
export const BACKDROP_SIZE = 'w1280';
export const POSTER_SIZE = 'w780';

/** TMDB refuses to paginate past 500 regardless of total_pages. */
export const MAX_TMDB_PAGE = 500;
