import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { api, isApiError } from '@/api/client';
import { server } from '@/test/msw-server';
import type { ApiError } from '@/types/http';

const POPULAR = 'https://api.themoviedb.org/3/movie/popular';

describe('api client error normalisation', () => {
  /**
   * The bug this pins: TMDB answers a bad credential with HTTP 401 and a JSON
   * body. The old fetch client never checked response.ok, so that body was
   * handed to the UI as if it were a page of movies and Home crashed on .map.
   * axios rejects non-2xx, so the failure is now typed and catchable.
   */
  it('turns a TMDB error body into a rejected ApiError', async () => {
    server.use(
      http.get(POPULAR, () =>
        HttpResponse.json(
          { status_code: 7, status_message: 'Invalid API key: You must be granted a valid key.' },
          { status: 401 },
        ),
      ),
    );

    const err: unknown = await api.get(POPULAR).then(
      () => {
        throw new Error('request should not have resolved');
      },
      (e: unknown) => e,
    );

    expect(isApiError(err)).toBe(true);
    const apiErr = err as ApiError;
    expect(apiErr.status).toBe(401);
    expect(apiErr.code).toBe('tmdb_7');
    expect(apiErr.message).toContain('Invalid API key');
  });

  it('reports status 0 for a network failure so it is distinguishable from an HTTP error', async () => {
    server.use(http.get(POPULAR, () => HttpResponse.error()));

    const err = (await api.get(POPULAR).catch((e: unknown) => e)) as ApiError;

    expect(isApiError(err)).toBe(true);
    expect(err.status).toBe(0);
    expect(err.code).toBe('http_0');
    expect(err.message).toMatch(/network/i);
  });

  it('falls back to an http_ code when the body has no TMDB status_code', async () => {
    server.use(http.get(POPULAR, () => new HttpResponse(null, { status: 503 })));

    const err = (await api.get(POPULAR).catch((e: unknown) => e)) as ApiError;

    expect(err.status).toBe(503);
    expect(err.code).toBe('http_503');
  });

  it('passes a successful response straight through', async () => {
    server.use(http.get(POPULAR, () => HttpResponse.json({ page: 1, results: [] })));

    const { data } = await api.get(POPULAR);
    expect(data).toEqual({ page: 1, results: [] });
  });
});

describe('isApiError', () => {
  it('rejects things that are not ApiErrors', () => {
    expect(isApiError(new Error('nope'))).toBe(false);
    expect(isApiError(null)).toBe(false);
    expect(isApiError('string')).toBe(false);
  });
});
