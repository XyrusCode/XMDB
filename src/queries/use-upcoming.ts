import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { uris } from '@/api/uris';
import { queryKeys } from '@/queries/query-keys';
import type { Movie, Paginated } from '@/types/tmdb';

export function useUpcomingMovies() {
  return useQuery({
    queryKey: queryKeys.movies.upcoming(1),
    queryFn: async () => {
      const { data } = await api.get<Paginated<Movie>>(uris.movies.upcoming, { params: { page: 1 } });
      return data.results.slice(0, 12);
    },
    staleTime: 1000 * 60 * 10,
  });
}
