export const uris = {
  movies: {
    popular: '/movie/popular',
    upcoming: '/movie/upcoming',
    search: '/search/movie',
    detail: (id: number) => `/movie/${id}`,
  },
  tv: {
    popular: '/tv/popular',
    search: '/search/tv',
    detail: (id: number) => `/tv/${id}`,
    season: (id: number, season: number) => `/tv/${id}/season/${season}`,
  },
  trending: {
    movies: '/trending/movie/week',
    tv: '/trending/tv/week',
  },
  search: {
    multi: '/search/multi',
  },
} as const;
