import type { ReactNode } from 'react';

interface MediaRowProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function MediaRow({ title, subtitle, children }: MediaRowProps) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-baseline justify-between px-1">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent -mx-1 px-1">
        {children}
      </div>
    </section>
  );
}
