import { describe, expect, it } from 'vitest';
import { config, IMAGE_BASE_URL, MAX_TMDB_PAGE } from '@/config';

describe('app config', () => {
  it('uses local api base', () => {
    expect(config.apiBase).toBe('/api');
  });

  it('serves images over https', () => {
    expect(IMAGE_BASE_URL.startsWith('https://')).toBe(true);
  });

  it('has a sane max tmdb page', () => {
    expect(MAX_TMDB_PAGE).toBe(500);
  });
});
