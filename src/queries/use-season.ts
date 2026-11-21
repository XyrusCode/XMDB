import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { uris } from '@/api/uris';
import { queryKeys } from '@/queries/query-keys';
import type { SeasonDetail } from '@/types/tmdb';

export function useSeason(tvId: number, seasonNumber: number | null) {
  return useQuery({
    queryKey: queryKeys.tv.season(tvId, seasonNumber ?? 0),
    queryFn: async () => {
      const { data } = await api.get<SeasonDetail>(uris.tv.season(tvId, seasonNumber!));
      return data;
    },
    enabled: seasonNumber !== null && seasonNumber >= 0,
  });
}
