import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { uris } from '@/api/uris';
import { queryKeys } from '@/queries/query-keys';
import type { Movie, Paginated, TVShow } from '@/types/tmdb';

export function useTrendingMovies() {
  return useQuery({
    queryKey: queryKeys.trending.movies,
    queryFn: async () => {
      const { data } = await api.get<Paginated<Movie>>(uris.trending.movies, { params: { page: 1 } });
      return data.results.slice(0, 12);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useTrendingTV() {
  return useQuery({
    queryKey: queryKeys.trending.tv,
    queryFn: async () => {
      const { data } = await api.get<Paginated<TVShow>>(uris.trending.tv, { params: { page: 1 } });
      return data.results.slice(0, 12);
    },
    staleTime: 1000 * 60 * 5,
  });
}
