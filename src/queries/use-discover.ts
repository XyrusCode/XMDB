import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { uris } from '@/api/uris';
import type { Paginated, TVShow } from '@/types/tmdb';

export function useAnimePicks() {
  return useQuery({
    queryKey: ['discover', 'anime'],
    queryFn: async () => {
      // Anime: Animation genre (16) + Japanese original language
      const { data } = await api.get<Paginated<TVShow>>(uris.discover.tv, {
        params: {
          with_genres: '16',
          with_original_language: 'ja',
          sort_by: 'popularity.desc',
          page: 1,
          language: 'en-US',
        },
      });
      return data.results.slice(0, 12);
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useKDramas() {
  return useQuery({
    queryKey: ['discover', 'kdrama'],
    queryFn: async () => {
      const { data } = await api.get<Paginated<TVShow>>(uris.discover.tv, {
        params: {
          with_original_language: 'ko',
          sort_by: 'popularity.desc',
          page: 1,
          language: 'en-US',
        },
      });
      return data.results.slice(0, 12);
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useCDramas() {
  return useQuery({
    queryKey: ['discover', 'cdrama'],
    queryFn: async () => {
      const { data } = await api.get<Paginated<TVShow>>(uris.discover.tv, {
        params: {
          with_original_language: 'zh',
          sort_by: 'popularity.desc',
          page: 1,
          language: 'en-US',
        },
      });
      return data.results.slice(0, 12);
    },
    staleTime: 1000 * 60 * 10,
  });
}
