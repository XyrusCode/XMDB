import { afterEach, describe, expect, it, vi } from 'vitest';

// config reads import.meta.env at module load, so each case needs a fresh
// module registry.
const loadConfig = async () => {
  vi.resetModules();
  return import('@/config');
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('tmdb credentials', () => {
  /**
   * The reference implementation this was modelled on defaulted a missing env
   * var to '', which surfaces much later as an unexplained 401. Throwing at
   * module load means a misconfigured deploy dies at boot, or at build in CI.
   */
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

  it('serves images over https', async () => {
    const { IMAGE_BASE_URL } = await loadConfig();
    expect(IMAGE_BASE_URL.startsWith('https://')).toBe(true);
  });
});
