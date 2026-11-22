export type MediaType = 'movie' | 'tv';

export interface WatchlistItem {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath?: string | null;
  addedAt: number;
}

export type WatchlistInput = Omit<WatchlistItem, 'addedAt'>;

export interface LibraryState {
  watchlist: WatchlistItem[];
  watchedMovies: number[];
  watchedEpisodes: Record<string, number[]>; // key: `${tvId}-s${season}` -> episode numbers
  region: string;
}

const STORAGE_KEY = 'xmdb_library_v1';

const defaultState: LibraryState = {
  watchlist: [],
  watchedMovies: [],
  watchedEpisodes: {},
  region: 'US',
};

function detectRegion(): string {
  try {
    const lang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'en-US';
    const parts = lang.split('-');
    if (parts.length >= 2 && parts[1].length === 2) return parts[1].toUpperCase();
  } catch {}
  return 'US';
}

function safeParse(raw: string | null): LibraryState {
  if (!raw) {
    return { ...defaultState, region: typeof window !== 'undefined' ? detectRegion() : 'US' };
  }
  try {
    const parsed = JSON.parse(raw) as Partial<LibraryState>;
    const hasRegion = typeof parsed.region === 'string' && parsed.region.length === 2;
    return {
      watchlist: Array.isArray(parsed.watchlist) ? parsed.watchlist : [],
      watchedMovies: Array.isArray(parsed.watchedMovies) ? parsed.watchedMovies : [],
      watchedEpisodes: parsed.watchedEpisodes && typeof parsed.watchedEpisodes === 'object' ? parsed.watchedEpisodes : {},
      region: hasRegion ? (parsed.region as string).toUpperCase() : (typeof window !== 'undefined' ? detectRegion() : 'US'),
    };
  } catch {
    return { ...defaultState, region: typeof window !== 'undefined' ? detectRegion() : 'US' };
  }
}

export function loadLibrary(): LibraryState {
  if (typeof window === 'undefined') return defaultState;
  return safeParse(localStorage.getItem(STORAGE_KEY));
}

export function saveLibrary(state: LibraryState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getRegion(): string {
  return loadLibrary().region;
}

export function setRegion(region: string): LibraryState {
  const state = loadLibrary();
  const next = { ...state, region: region.toUpperCase().slice(0, 2) || 'US' };
  saveLibrary(next);
  return next;
}

export function isInWatchlist(id: number, mediaType: MediaType): boolean {
  const state = loadLibrary();
  return state.watchlist.some((i) => i.id === id && i.mediaType === mediaType);
}

export function toggleWatchlist(item: WatchlistInput): LibraryState {
  const state = loadLibrary();
  const exists = state.watchlist.findIndex((i) => i.id === item.id && i.mediaType === item.mediaType);
  let watchlist: WatchlistItem[];
  if (exists >= 0) {
    watchlist = state.watchlist.filter((_, idx) => idx !== exists);
  } else {
    watchlist = [{ ...item, addedAt: Date.now() }, ...state.watchlist];
  }
  const next = { ...state, watchlist };
  saveLibrary(next);
  return next;
}

export function isMovieWatched(id: number): boolean {
  return loadLibrary().watchedMovies.includes(id);
}

export function toggleMovieWatched(id: number): LibraryState {
  const state = loadLibrary();
  const has = state.watchedMovies.includes(id);
  const watchedMovies = has
    ? state.watchedMovies.filter((m) => m !== id)
    : [...state.watchedMovies, id];
  const next = { ...state, watchedMovies };
  saveLibrary(next);
  return next;
}

function epKey(tvId: number, season: number) {
  return `${tvId}-s${season}`;
}

export function isEpisodeWatched(tvId: number, season: number, episode: number): boolean {
  const state = loadLibrary();
  const arr = state.watchedEpisodes[epKey(tvId, season)] || [];
  return arr.includes(episode);
}

export function toggleEpisodeWatched(tvId: number, season: number, episode: number): LibraryState {
  const state = loadLibrary();
  const key = epKey(tvId, season);
  const arr = state.watchedEpisodes[key] || [];
  const has = arr.includes(episode);
  const nextArr = has ? arr.filter((e) => e !== episode) : [...arr, episode].sort((a, b) => a - b);
  const next = {
    ...state,
    watchedEpisodes: { ...state.watchedEpisodes, [key]: nextArr },
  };
  saveLibrary(next);
  return next;
}

export function getWatchedEpisodesForSeason(tvId: number, season: number): number[] {
  const state = loadLibrary();
  return state.watchedEpisodes[epKey(tvId, season)] || [];
}
