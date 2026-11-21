export const uris = {
  movies: {
    popular: '/movies/popular',
    upcoming: '/movies/upcoming',
    search: '/movies/search',
    detail: (id: number) => `/movies/${id}`,
  },
  tv: {
    popular: '/tv/popular',
    search: '/tv/search',
    detail: (id: number) => `/tv/${id}`,
    season: (id: number, season: number) => `/tv/${id}/season/${season}`,
  },
  trending: {
    movies: '/trending/movies',
    tv: '/trending/tv',
  },
  search: {
    multi: '/search/multi',
  },
} as const;
