import { normalizeLang, highlighter } from '@/lib/highlighter';
import type { Highlighter, HighlightTokenClass } from '@tanstack/highlight';
import { cn } from '@/lib/utils';

type HighlightResult = ReturnType<Highlighter['highlight']>;

const tokenClassToCss: Record<HighlightTokenClass, string> = {
  attr: 'tsh-attr',
  'code-inline': 'tsh-code-inline',
  command: 'tsh-command',
  comment: 'tsh-comment',
  deleted: 'tsh-deleted',
  function: 'tsh-function',
  heading: 'tsh-heading',
  inserted: 'tsh-inserted',
  keyword: 'tsh-keyword',
  link: 'tsh-link',
  literal: 'tsh-literal',
  meta: 'tsh-meta',
  number: 'tsh-number',
  operator: 'tsh-operator',
  property: 'tsh-property',
  selector: 'tsh-selector',
  string: 'tsh-string',
  tag: 'tsh-tag',
  type: 'tsh-type',
  variable: 'tsh-variable',
};

interface CodeBlockProps {
  code: string;
  lang?: string;
  title?: string;
  className?: string;
}

/** Shared synchronous highlighter (SSR + browser) — one instance for everything. */
const sharedResultCache = new Map<string, HighlightResult>();

export function getSharedHighlight(code: string, lang?: string): HighlightResult {
  const key = `${lang ?? 'plaintext'}::${code}`;
  const cached = sharedResultCache.get(key);
  if (cached) return cached;
  const result = highlighter.highlight(code, { lang: lang as never });
  sharedResultCache.set(key, result);
  return result;
}

export function CodeBlock({ code, lang, title, className }: CodeBlockProps) {
  const normalized = normalizeLang(lang);
  const result = getSharedHighlight(code, lang);

  // One compact semantic markup tree from the shared sync highlighter.
  const tokens = result.tokens;

  return (
    <div className={cn('rounded-lg border border-border bg-card overflow-hidden', className)}>
      {(title || code) && (
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 sm:px-4 py-2">
          <span className="text-xs text-muted-foreground">{title ?? normalized}</span>
          <button
            onClick={() => navigator.clipboard?.writeText(code)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy code"
          >
            Copy
          </button>
        </div>
      )}
      <pre className="overflow-x-auto p-3 sm:p-4 font-mono text-[0.8125rem] leading-relaxed">
        <code className={`language-${normalized}`}>
          {tokens.map((token, i) => (
            <span
              key={i}
              className={token.className ? tokenClassToCss[token.className] : undefined}
            >
              {token.value}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
