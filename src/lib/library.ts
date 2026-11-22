import { createStore, type Store } from '@tanstack/store';
import { useStore, useSelector } from '@tanstack/react-store';

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
  watchedEpisodes: Record<string, number[]>;
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

function loadPersisted(): LibraryState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState, region: detectRegion() };
    const parsed = JSON.parse(raw) as Partial<LibraryState>;
    const hasRegion = typeof parsed.region === 'string' && parsed.region.length === 2;
    return {
      watchlist: Array.isArray(parsed.watchlist) ? parsed.watchlist : [],
      watchedMovies: Array.isArray(parsed.watchedMovies) ? parsed.watchedMovies : [],
      watchedEpisodes: parsed.watchedEpisodes && typeof parsed.watchedEpisodes === 'object' ? parsed.watchedEpisodes : {},
      region: hasRegion ? (parsed.region as string).toUpperCase() : detectRegion(),
    };
  } catch {
    return { ...defaultState, region: detectRegion() };
  }
}

/** Single source of truth: an immutable TanStack Store. */
export const libraryStore: Store<LibraryState> = createStore(loadPersisted());

/** Persist every change to localStorage (single write listener). */
libraryStore.subscribe((value) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
});

/** Immutable, batched write helpers. */
export function setRegion(region: string): LibraryState {
  const clean = region.toUpperCase().slice(0, 2) || 'US';
  libraryStore.setState((prev) => ({ ...prev, region: clean }));
  return libraryStore.state;
}

export function isInWatchlist(id: number, mediaType: MediaType): boolean {
  return libraryStore.state.watchlist.some((i) => i.id === id && i.mediaType === mediaType);
}

export function toggleWatchlist(item: WatchlistInput): LibraryState {
  libraryStore.setState((prev) => {
    const exists = prev.watchlist.findIndex((i) => i.id === item.id && i.mediaType === item.mediaType);
    let watchlist: WatchlistItem[];
    if (exists >= 0) {
      watchlist = prev.watchlist.filter((_, idx) => idx !== exists);
    } else {
      watchlist = [{ ...item, addedAt: Date.now() }, ...prev.watchlist];
    }
    return { ...prev, watchlist };
  });
  return libraryStore.state;
}

export function isMovieWatched(id: number): boolean {
  return libraryStore.state.watchedMovies.includes(id);
}

export function toggleMovieWatched(id: number): LibraryState {
  libraryStore.setState((prev) => {
    const has = prev.watchedMovies.includes(id);
    const watchedMovies = has ? prev.watchedMovies.filter((m) => m !== id) : [...prev.watchedMovies, id];
    return { ...prev, watchedMovies };
  });
  return libraryStore.state;
}

function epKey(tvId: number, season: number) {
  return `${tvId}-s${season}`;
}

export function isEpisodeWatched(tvId: number, season: number, episode: number): boolean {
  const arr = libraryStore.state.watchedEpisodes[epKey(tvId, season)] || [];
  return arr.includes(episode);
}

export function toggleEpisodeWatched(tvId: number, season: number, episode: number): LibraryState {
  libraryStore.setState((prev) => {
    const key = epKey(tvId, season);
    const arr = prev.watchedEpisodes[key] || [];
    const has = arr.includes(episode);
    const nextArr = has ? arr.filter((e) => e !== episode) : [...arr, episode].sort((a, b) => a - b);
    return {
      ...prev,
      watchedEpisodes: { ...prev.watchedEpisodes, [key]: nextArr },
    };
  });
  return libraryStore.state;
}

export function getWatchedEpisodesForSeason(tvId: number, season: number): number[] {
  return libraryStore.state.watchedEpisodes[epKey(tvId, season)] || [];
}

/** Derived: watchlist count (computed on read). */
export function getWatchlistCount(): number {
  return libraryStore.state.watchlist.length;
}

/** Derived: watched movies count (computed on read). */
export function getWatchedMoviesCount(): number {
  return libraryStore.state.watchedMovies.length;
}

/** React hook: subscribe to the whole store state. */
export function useLibraryState(): LibraryState {
  return useStore(libraryStore);
}

/** React hook: subscribe to a selected slice — rerenders only when the slice changes. */
export function useLibrarySelector<T>(select: (state: LibraryState) => T): T {
  return useSelector(libraryStore, select);
}

/** Backwards-compatible hook used by existing components. */
export function useLibrary() {
  const state = useLibraryState();
  const watchlistCount = useLibrarySelector((s) => s.watchlist.length);
  const watchedMoviesCount = useLibrarySelector((s) => s.watchedMovies.length);

  return {
    ...state,
    watchlistCount,
    watchedMoviesCount,
    toggleWatchlist: (item: WatchlistInput) => toggleWatchlist(item),
    toggleMovieWatched: (id: number) => toggleMovieWatched(id),
    toggleEpisodeWatched: (tvId: number, season: number, episode: number) =>
      toggleEpisodeWatched(tvId, season, episode),
    setRegion: (region: string) => setRegion(region),
    isInWatchlist: (id: number, mediaType: MediaType) => isInWatchlist(id, mediaType),
    isMovieWatched: (id: number) => isMovieWatched(id),
    isEpisodeWatched: (tvId: number, season: number, ep: number) => isEpisodeWatched(tvId, season, ep),
  };
}
