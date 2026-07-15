import { describe, expect, it } from 'vitest';
import { getNextPageParam } from '@/queries/use-movies';
import type { Movie, Paginated } from '@/types/tmdb';

const page = (over: Partial<Paginated<Movie>>): Paginated<Movie> => ({
  page: 1,
  results: [],
  total_pages: 10,
  total_results: 200,
  ...over,
});

describe('getNextPageParam', () => {
  it('advances while pages remain', () => {
    expect(getNextPageParam(page({ page: 1, total_pages: 10 }))).toBe(2);
  });

  it('stops on the last page', () => {
    expect(getNextPageParam(page({ page: 10, total_pages: 10 }))).toBeUndefined();
  });

  // TMDB 400s past page 500 however large total_pages is. Unreachable by hand
  // in the old app, which is why it never surfaced.
  it('stops at TMDB’s hard 500-page cap even when total_pages exceeds it', () => {
    expect(getNextPageParam(page({ page: 500, total_pages: 900 }))).toBeUndefined();
    expect(getNextPageParam(page({ page: 499, total_pages: 900 }))).toBe(500);
  });
});
