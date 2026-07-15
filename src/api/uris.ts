export const uris = {
  movies: {
    popular: '/movie/popular',
    search: '/search/movie',
    detail: (id: number) => `/movie/${id}`,
  },
} as const;
