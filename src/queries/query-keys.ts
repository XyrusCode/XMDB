export const queryKeys = {
  movies: {
    all: ['movies'] as const,
    list: (params: { search: string }) => ['movies', 'list', params] as const,
    popular: (page?: number) => ['movies', 'popular', page ?? 1] as const,
    upcoming: (page?: number) => ['movies', 'upcoming', page ?? 1] as const,
    detail: (id: number) => ['movies', 'detail', id] as const,
  },
  tv: {
    all: ['tv'] as const,
    popular: (page?: number) => ['tv', 'popular', page ?? 1] as const,
    detail: (id: number) => ['tv', 'detail', id] as const,
    season: (id: number, season: number) => ['tv', 'season', id, season] as const,
  },
  trending: {
    movies: ['trending', 'movies'] as const,
    tv: ['trending', 'tv'] as const,
  },
  search: {
    multi: (q: string) => ['search', 'multi', q] as const,
  },
} as const;
