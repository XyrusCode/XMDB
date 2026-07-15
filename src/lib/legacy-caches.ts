/**
 * The pre-2.0 service worker created caches through workbox loaded from a CDN,
 * under names the new worker does not know about — so its
 * `cleanupOutdatedCaches` will not touch them. Returning visitors would
 * otherwise keep a stale copy of the old app, including cached TMDB API
 * responses, indefinitely.
 *
 * Safe to run on every load: after the first pass nothing matches.
 */

/** The cacheName the old service worker declared. */
const LEGACY_CACHE_NAME = 'xmdb-cache';

/**
 * Workbox stamps its own caches with the origin that created them, e.g.
 * `workbox-precache-v2-https://xmdb.netlify.app/`. A workbox cache naming some
 * *other* origin was left by the old deployment.
 *
 * This must not match on prefix alone: the current worker's precache is also
 * called `workbox-…`, and deleting it every load would defeat the precache
 * entirely.
 */
const isForeignWorkboxCache = (key: string, origin: string): boolean =>
  key.startsWith('workbox-') && key.includes('http') && !key.includes(origin);

export const isLegacyCache = (key: string, origin: string): boolean =>
  key === LEGACY_CACHE_NAME || isForeignWorkboxCache(key, origin);

export const purgeLegacyCaches = async (): Promise<string[]> => {
  if (!('caches' in globalThis)) return [];

  try {
    const origin = globalThis.location?.origin ?? '';
    const keys = await caches.keys();
    const stale = keys.filter((key) => isLegacyCache(key, origin));
    await Promise.all(stale.map((key) => caches.delete(key)));
    return stale;
  } catch {
    // A blocked Cache API is not worth failing a page load over.
    return [];
  }
};
