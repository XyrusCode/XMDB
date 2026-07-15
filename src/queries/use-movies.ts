import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { uris } from '@/api/uris';
import { MAX_TMDB_PAGE } from '@/config';
import { queryKeys } from '@/queries/query-keys';
import type { Movie, Paginated } from '@/types/tmdb';

/**
 * TMDB reports a total_pages it will not actually serve — asking for page 501
 * is a 400 even when total_pages says 900. The old app could only reach page 2
 * or 3 by hand, so it never hit this.
 */
export const getNextPageParam = (last: Paginated<Movie>): number | undefined => {
  const max = Math.min(last.total_pages, MAX_TMDB_PAGE);
  return last.page < max ? last.page + 1 : undefined;
};

const fetchMovies = async (search: string, page: number): Promise<Paginated<Movie>> => {
  const { data } = await api.get<Paginated<Movie>>(
    search ? uris.movies.search : uris.movies.popular,
    { params: { page, language: 'en-US', ...(search ? { query: search } : {}) } },
  );
  return data;
};

/** `search` must already be debounced, or this refetches on every keystroke. */
export const useMovies = (search: string) =>
  useInfiniteQuery({
    queryKey: queryKeys.movies.list({ search }),
    queryFn: ({ pageParam }) => fetchMovies(search, pageParam),
    initialPageParam: 1,
    getNextPageParam,
    select: (data) => ({
      movies: data.pages.flatMap((p) => p.results),
      totalResults: data.pages[0]?.total_results ?? 0,
    }),
  });
