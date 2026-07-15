import type { ReactNode } from 'react';

interface ContactSheetProps {
  label: string;
  /** Real count from TMDB, not the number rendered so far. */
  count?: number;
  children: ReactNode;
}

export const ContactSheet = ({ label, count, children }: ContactSheetProps) => (
  <section aria-label={label}>
    <div className="mb-3 flex items-baseline justify-between border-b border-sprocket pb-2">
      <h2 className="edge text-foreground">{label}</h2>
      {count !== undefined && (
        <span className="edge tabular-nums">
          {count.toLocaleString('en-US')} {count === 1 ? 'frame' : 'frames'}
        </span>
      )}
    </div>
    <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {children}
    </ul>
  </section>
);
