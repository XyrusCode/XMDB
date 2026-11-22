import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  libraryStore,
  toggleWatchlist,
  toggleMovieWatched,
  toggleEpisodeWatched,
  isInWatchlist,
  isMovieWatched,
  isEpisodeWatched,
  setRegion,
  type LibraryState,
  type WatchlistInput,
} from './library';

describe('library (TanStack Store)', () => {
  const reset = () => {
    libraryStore.setState(() => ({
      watchlist: [],
      watchedMovies: [],
      watchedEpisodes: {},
      region: 'US',
      mediaScroll: {},
    }));
  };

  beforeEach(() => {
    localStorage.clear();
    reset();
  });

  afterEach(() => {
    reset();
  });

  it('returns default state when empty', () => {
    const state = libraryStore.state;
    expect(state.watchlist).toEqual([]);
    expect(state.watchedMovies).toEqual([]);
    expect(state.region).toBe('US');
  });

  it('toggles watchlist items', () => {
    const item: WatchlistInput = { id: 1, mediaType: 'movie', title: 'Test', posterPath: null };
    const s1 = toggleWatchlist(item);
    expect(s1.watchlist.length).toBe(1);
    expect(isInWatchlist(1, 'movie')).toBe(true);
    const s2 = toggleWatchlist(item);
    expect(s2.watchlist.length).toBe(0);
    expect(isInWatchlist(1, 'movie')).toBe(false);
  });

  it('toggles watched movies', () => {
    expect(isMovieWatched(42)).toBe(false);
    toggleMovieWatched(42);
    expect(isMovieWatched(42)).toBe(true);
    toggleMovieWatched(42);
    expect(isMovieWatched(42)).toBe(false);
  });

  it('toggles watched episodes', () => {
    expect(isEpisodeWatched(10, 1, 3)).toBe(false);
    toggleEpisodeWatched(10, 1, 3);
    expect(isEpisodeWatched(10, 1, 3)).toBe(true);
    toggleEpisodeWatched(10, 1, 3);
    expect(isEpisodeWatched(10, 1, 3)).toBe(false);
  });

  it('sets region', () => {
    setRegion('gb');
    expect(libraryStore.state.region).toBe('GB');
  });

  it('persists state to localStorage', () => {
    toggleMovieWatched(99);
    const raw = localStorage.getItem('xmdb_library_v1');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!) as LibraryState;
    expect(parsed.watchedMovies).toContain(99);
  });
});
