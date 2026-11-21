/**
 * Every `import.meta.env` read in the app goes through here.
 */
const v4Token = import.meta.env.VITE_TMDB_TOKEN;
const v3Key = import.meta.env.VITE_TMDB_API_KEY;

const present = (v: string | undefined): v is string => typeof v === 'string' && v.length > 0;

export const tmdbAuth = ((): { kind: 'bearer'; token: string } | { kind: 'query'; key: string } => {
  if (present(v4Token)) return { kind: 'bearer', token: v4Token };
  if (present(v3Key)) return { kind: 'query', key: v3Key };
  throw new Error(
    'Missing TMDB credentials: set VITE_TMDB_TOKEN (v4, preferred) or VITE_TMDB_API_KEY (v3). See .env.example.',
  );
})();

export const config = {
  apiBase: 'https://api.themoviedb.org/3',
} as const;

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export const BACKDROP_SIZE = 'w1280';
export const POSTER_SIZE = 'w500';
export const THUMB_SIZE = 'w342';
export const PROFILE_SIZE = 'w185';

export const MAX_TMDB_PAGE = 500;
