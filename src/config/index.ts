/**
 * App config. TMDB credentials are now server-side only (API routes).
 */
export const config = {
  apiBase: '/api',
} as const;

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

export const BACKDROP_SIZE = 'w1280';
export const POSTER_SIZE = 'w500';
export const THUMB_SIZE = 'w342';
export const PROFILE_SIZE = 'w185';

export const MAX_TMDB_PAGE = 500;
