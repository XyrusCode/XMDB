import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { uris } from '@/api/uris';
import { queryKeys } from '@/queries/query-keys';
import type { CrewMember, MovieDetail, MovieView } from '@/types/tmdb';

export const selectDirectors = (crew: CrewMember[]): CrewMember[] =>
  crew.filter((member) => member.job === 'Director');

const fetchMovie = async (id: number): Promise<MovieDetail> => {
  const { data } = await api.get<MovieDetail>(uris.movies.detail(id), {
    // One round trip instead of two serial ones, one cache entry, and no
    // half-loaded state where the movie arrived but the credits didn't.
    params: { append_to_response: 'credits' },
  });
  return data;
};

/**
 * Shared by the route loader and the component so both provably use one key —
 * if they drifted apart, the loader would warm a cache entry the component
 * never reads.
 */
export const movieQueryOptions = (id: number) =>
  queryOptions({
    queryKey: queryKeys.movies.detail(id),
    queryFn: () => fetchMovie(id),
    select: (data): MovieView => ({
      ...data,
      actors: data.credits.cast,
      directors: selectDirectors(data.credits.crew),
    }),
  });

export const useMovie = (id: number) => useQuery(movieQueryOptions(id));
