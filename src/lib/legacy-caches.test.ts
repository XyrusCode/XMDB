import { afterEach, describe, expect, it, vi } from 'vitest';
import { isLegacyCache, purgeLegacyCaches } from '@/lib/legacy-caches';

const HERE = 'https://xmdb.vercel.app';
const OLD = 'https://xmdb.netlify.app';

describe('isLegacyCache', () => {
  it('matches the old worker’s declared cache', () => {
    expect(isLegacyCache('xmdb-cache', HERE)).toBe(true);
  });

  it('matches a workbox cache stamped with the old origin', () => {
    expect(isLegacyCache(`workbox-precache-v2-${OLD}/`, HERE)).toBe(true);
  });

  /**
   * The important one. The current worker's precache is also named `workbox-…`,
   * so a prefix match would delete it on every load and the precache would
   * never survive a single navigation.
   */
  it('spares the current worker’s own precache', () => {
    expect(isLegacyCache(`workbox-precache-v2-${HERE}/`, HERE)).toBe(false);
  });

  it('spares the runtime image cache', () => {
    expect(isLegacyCache('tmdb-images', HERE)).toBe(false);
  });
});

describe('purgeLegacyCaches', () => {
  const stubCaches = (keys: string[]) => {
    const deleted: string[] = [];
    vi.stubGlobal('caches', {
      keys: () => Promise.resolve(keys),
      delete: (k: string) => {
        deleted.push(k);
        return Promise.resolve(true);
      },
    });
    vi.stubGlobal('location', { origin: HERE });
    return deleted;
  };

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('deletes only what the old deployment left behind', async () => {
    const deleted = stubCaches([
      'xmdb-cache',
      `workbox-precache-v2-${OLD}/`,
      `workbox-precache-v2-${HERE}/`,
      'tmdb-images',
    ]);

    await purgeLegacyCaches();

    expect(deleted).toEqual(['xmdb-cache', `workbox-precache-v2-${OLD}/`]);
  });

  it('does not throw when the Cache API is unavailable', async () => {
    vi.stubGlobal('caches', undefined);
    await expect(purgeLegacyCaches()).resolves.toEqual([]);
  });
});
