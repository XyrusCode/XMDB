import {
  allLanguages,
  createHighlighter,
  normalizeLanguage as normalizeBuiltin,
  type Highlighter,
} from '@tanstack/highlight';

/**
 * Languages this app actually displays, filtered from the built-ins.
 */
export const registeredLangs = ['ts', 'tsx', 'json', 'css', 'shell', 'plaintext'] as const;

export type XMDBHighlightLanguage = (typeof registeredLangs)[number];

/** Built-in language definitions for the registered languages. */
const wanted = new Set<string>(['ts', 'tsx', 'json', 'css', 'shell', 'plaintext']);
const languageDefs = allLanguages.filter((def) => wanted.has(def.name));

/** Shared, synchronous, SSR-safe highlighter. */
export const highlighter: Highlighter = createHighlighter({
  fallbackLanguage: 'plaintext',
  languages: languageDefs,
});

export function normalizeLang(lang: string | undefined): XMDBHighlightLanguage {
  const normalized = normalizeBuiltin(lang) as string;
  return (registeredLangs as readonly string[]).includes(normalized)
    ? (normalized as XMDBHighlightLanguage)
    : 'plaintext';
}
