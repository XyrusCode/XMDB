import { defineAppHotkeys, type CustomHotkeys } from '@tanstack/hotkeys';

/**
 * App hotkeys — the keyboard shortcuts this product declares, keyed by id.
 * Declare every shortcut up front (cheat sheets can list them even when their
 * component isn't mounted), pass to HotkeysProvider as `appHotkeys`.
 *
 * Mod bindings map to ⌘ on macOS, Ctrl on Windows/Linux. Physical [Code]
 * bindings are available where key position matters.
 */
export const appHotkeys = defineAppHotkeys({
  'nav.home': { hotkey: 'Mod+H', meta: { name: 'Go Home' } },
  'nav.search': { hotkey: 'Mod+K', meta: { name: 'Focus Search' } },
  'nav.watchlist': { hotkey: 'Mod+L', meta: { name: 'Go to Watchlist' } },
  'nav.goToTop': {
    hotkey: ['G', 'G'],
    meta: { name: 'Jump to Top', group: 'Navigation' },
    options: { timeout: 900 },
  },
  'actions.toggleWatchlist': {
    hotkey: 'Mod+Shift+L',
    meta: { name: 'Toggle Watchlist', group: 'Library' },
  },
  'actions.markWatched': {
    hotkey: 'Mod+Shift+W',
    meta: { name: 'Mark Watched', group: 'Library' },
  },
  'actions.openDocs': { hotkey: 'Mod+Shift+D', meta: { name: 'Docs' } },
});

export type AppHotkeyIds = keyof typeof appHotkeys;

/** The custom-hotkey map shape for this app's declarations. */
export type AppCustomHotkeys = CustomHotkeys<typeof appHotkeys>;

/** Persisted shape: user custom hotkeys keyed by id (null = unbound). */
export function loadCustomHotkeys(): AppCustomHotkeys {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('xmdb_hotkeys_v1') ?? '{}');
  } catch {
    return {};
  }
}

export function saveCustomHotkeys(custom: AppCustomHotkeys) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('xmdb_hotkeys_v1', JSON.stringify(custom));
}
