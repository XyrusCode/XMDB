import { useCallback, useSyncExternalStore } from 'react';
import {
  type LibraryState,
  type WatchlistInput,
  type MediaType,
  loadLibrary,
  toggleWatchlist as libToggleWatchlist,
  toggleMovieWatched as libToggleMovieWatched,
  toggleEpisodeWatched as libToggleEpisodeWatched,
  setRegion as libSetRegion,
} from '@/lib/library';

let listeners: Array<() => void> = [];
function emitChange() {
  for (const l of listeners) l();
}
function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
function getSnapshot(): LibraryState {
  return loadLibrary();
}
function getServerSnapshot(): LibraryState {
  return { watchlist: [], watchedMovies: [], watchedEpisodes: {}, region: 'US' };
}

export function useLibrary() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleWatchlist = useCallback((item: WatchlistInput) => {
    libToggleWatchlist(item);
    emitChange();
  }, []);

  const toggleMovieWatched = useCallback((id: number) => {
    libToggleMovieWatched(id);
    emitChange();
  }, []);

  const toggleEpisodeWatched = useCallback((tvId: number, season: number, episode: number) => {
    libToggleEpisodeWatched(tvId, season, episode);
    emitChange();
  }, []);

  const setRegion = useCallback((region: string) => {
    libSetRegion(region);
    emitChange();
  }, []);

  const isInWatchlist = useCallback(
    (id: number, mediaType: MediaType) => state.watchlist.some((i) => i.id === id && i.mediaType === mediaType),
    [state.watchlist],
  );
  const isMovieWatchedFn = useCallback((id: number) => state.watchedMovies.includes(id), [state.watchedMovies]);
  const isEpisodeWatchedFn = useCallback(
    (tvId: number, season: number, ep: number) => (state.watchedEpisodes[`${tvId}-s${season}`] || []).includes(ep),
    [state.watchedEpisodes],
  );

  return {
    ...state,
    toggleWatchlist,
    toggleMovieWatched,
    toggleEpisodeWatched,
    setRegion,
    isInWatchlist,
    isMovieWatched: isMovieWatchedFn,
    isEpisodeWatched: isEpisodeWatchedFn,
  };
}
