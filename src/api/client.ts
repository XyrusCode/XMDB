import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { config, tmdbAuth } from '@/config';
import type { ApiError } from '@/types/http';

/**
 * TMDB's error envelope. It arrives with a non-2xx status, which axios rejects
 * on — the old fetch client never checked response.ok, so this body flowed
 * through as if it were a movie and blew up at the first `.map`.
 */
interface TmdbErrorBody {
  status_code?: number;
  status_message?: string;
}

export const api: AxiosInstance = axios.create({
  baseURL: config.apiBase,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    ...(tmdbAuth.kind === 'bearer' ? { Authorization: `Bearer ${tmdbAuth.token}` } : {}),
  },
  ...(tmdbAuth.kind === 'query' ? { params: { api_key: tmdbAuth.key } } : {}),
});

const normalize = (error: AxiosError): ApiError => {
  const status = error.response?.status ?? 0;
  const body = error.response?.data as TmdbErrorBody | undefined;

  return {
    code: body?.status_code ? `tmdb_${body.status_code}` : `http_${status}`,
    status,
    message:
      body?.status_message ??
      (status === 0 ? 'Network error. Please check your connection.' : error.message),
    url: error.config?.url,
  };
};

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(normalize(error)),
);

export const isApiError = (e: unknown): e is ApiError =>
  typeof e === 'object' && e !== null && 'status' in e && 'code' in e;
