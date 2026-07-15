export const queryKeys = {
  movies: {
    all: ['movies'] as const,
    list: (params: { search: string }) => ['movies', 'list', params] as const,
    detail: (id: number) => ['movies', 'detail', id] as const,
  },
} as const;
