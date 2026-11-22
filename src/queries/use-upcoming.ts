import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { uris } from '@/api/uris';
import type { Movie, Paginated } from '@/types/tmdb';

export function useUpcomingMovies(region?: string) {
  return useQuery({
    queryKey: ['movies', 'upcoming', 1, region || 'US'],
    queryFn: async () => {
      const { data } = await api.get<Paginated<Movie>>(uris.movies.upcoming, {
        params: { page: 1, language: 'en-US', region: region || 'US' },
      });
      return data.results.slice(0, 12);
    },
    staleTime: 1000 * 60 * 10,
  });
}
