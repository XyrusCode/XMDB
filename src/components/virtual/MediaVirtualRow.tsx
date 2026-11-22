import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { getScrollSnapshot, setScrollSnapshot, type MediaType } from '@/lib/library';

interface MediaItem {
  id: number;
  title: string;
  posterPath: string | null;
  year?: string;
  mediaType: MediaType;
}

interface MediaVirtualRowProps {
  title: string;
  items: MediaItem[];
  renderItem: (item: MediaItem, index: number) => React.ReactNode;
  rowKey: string;
  subtitle?: string;
  loading?: boolean;
  error?: string;
  estimateSize?: number;
  overscan?: number;
}

function SkeletonRow() {
  return (
    <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-36 sm:w-40 md:w-44">
          <div className="aspect-[2/3] w-full rounded-lg bg-muted" />
          <div className="h-4 w-3/4 mt-2 rounded bg-muted" />
          <div className="h-3 w-1/2 mt-1 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

/**
 * Virtualized media row: renders only visible items + overscan, measures
 * dynamic content, supports element scrolling, and restores scroll from a
 * store-backed snapshot. The scroll surface and markup are owned by product UI.
 */
export function MediaVirtualRow({
  title,
  items,
  renderItem,
  rowKey,
  subtitle,
  loading,
  error,
  estimateSize = 200,
  overscan = 6,
}: MediaVirtualRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateSize,
    overscan,
    getItemKey: (index) => items[index]?.id ?? index,
    initialOffset: getScrollSnapshot(rowKey) ?? 0,
    onChange: (instance) => {
      if (instance.scrollOffset != null) setScrollSnapshot(rowKey, instance.scrollOffset);
    },
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <section className="mb-10 sm:mb-12" aria-labelledby={`row-${title}`}>
      <div className="mb-4 flex items-baseline justify-between px-1">
        <div>
          <h2 id={`row-${title}`} className="text-xl sm:text-2xl font-semibold tracking-tight">
            {title}
          </h2>
          {subtitle && <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </div>

      {error ? (
        <p className="px-1 text-sm text-red-400">{error}</p>
      ) : items.length === 0 ? (
        <p className="px-1 text-sm text-muted-foreground">No results.</p>
      ) : loading ? (
        <SkeletonRow />
      ) : (
        <div ref={scrollRef} className="relative h-[600px] overflow-y-auto pr-2">
          <div className="flex gap-3 sm:gap-5">
            {virtualItems.map((item) => {
              const media = items[item.index];
              if (!media) return null;
              return (
                <div
                  key={item.key}
                  data-index={item.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 'calc(100% - 1.5rem)',
                    transform: `translateY(${item.start}px)`,
                  }}
                >
                  {renderItem(media, item.index)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
