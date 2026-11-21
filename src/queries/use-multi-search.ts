import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { uris } from '@/api/uris';
import { queryKeys } from '@/queries/query-keys';
import type { MediaItem, Paginated } from '@/types/tmdb';

export function useMultiSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.search.multi(query),
    queryFn: async () => {
      const { data } = await api.get<Paginated<MediaItem>>(uris.search.multi, {
        params: { query, page: 1 },
      });
      // Filter to only movies and tv
      return data.results.filter((r) => r.media_type === 'movie' || r.media_type === 'tv');
    },
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 30,
  });
}
