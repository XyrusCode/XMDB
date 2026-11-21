import { afterEach, describe, expect, it, vi } from 'vitest';

const loadConfig = async () => {
  vi.resetModules();
  return import('@/config');
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('tmdb credentials', () => {
  it('throws at load when no credential is set', async () => {
    vi.stubEnv('VITE_TMDB_TOKEN', '');
    vi.stubEnv('VITE_TMDB_API_KEY', '');

    await expect(loadConfig()).rejects.toThrow(/Missing TMDB credentials/);
  });

  it('prefers the v4 bearer token when both are set', async () => {
    vi.stubEnv('VITE_TMDB_TOKEN', 'v4-token');
    vi.stubEnv('VITE_TMDB_API_KEY', 'v3-key');

    const { tmdbAuth } = await loadConfig();
    expect(tmdbAuth).toEqual({ kind: 'bearer', token: 'v4-token' });
  });

  it('falls back to the v3 key when no token is set', async () => {
    vi.stubEnv('VITE_TMDB_TOKEN', '');
    vi.stubEnv('VITE_TMDB_API_KEY', 'v3-key');

    const { tmdbAuth } = await loadConfig();
    expect(tmdbAuth).toEqual({ kind: 'query', key: 'v3-key' });
  });
});
