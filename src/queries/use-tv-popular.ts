import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { uris } from '@/api/uris';
import { queryKeys } from '@/queries/query-keys';
import type { Paginated, TVShow } from '@/types/tmdb';

export function usePopularTV() {
  return useQuery({
    queryKey: queryKeys.tv.popular(1),
    queryFn: async () => {
      const { data } = await api.get<Paginated<TVShow>>(uris.tv.popular, { params: { page: 1 } });
      return data.results.slice(0, 12);
    },
    staleTime: 1000 * 60 * 5,
  });
}
