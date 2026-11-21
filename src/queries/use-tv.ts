import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { uris } from '@/api/uris';
import { queryKeys } from '@/queries/query-keys';
import type { CrewMember, TVDetail, TVView } from '@/types/tmdb';

export const selectTVCreators = (crew: CrewMember[]): CrewMember[] =>
  crew.filter((m) => m.job === 'Executive Producer' || m.department === 'Writing').slice(0, 5);

const fetchTV = async (id: number): Promise<TVDetail> => {
  const { data } = await api.get<TVDetail>(uris.tv.detail(id), {
    params: { language: 'en-US' },
  });
  return data;
};

export const tvQueryOptions = (id: number) =>
  queryOptions({
    queryKey: queryKeys.tv.detail(id),
    queryFn: () => fetchTV(id),
    select: (data): TVView => ({
      ...data,
      actors: data.credits?.cast ?? [],
      directors: data.credits?.crew ?? [],
    }),
  });

export function useTV(id: number) {
  return useQuery(tvQueryOptions(id));
}
