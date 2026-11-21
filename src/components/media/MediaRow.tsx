import type { ReactNode } from 'react';

interface MediaRowProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function MediaRow({ title, subtitle, children }: MediaRowProps) {
  return (
    <section className="mb-10 sm:mb-12">
      <div className="mb-4 flex items-baseline justify-between px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </div>
      <div className="flex gap-3 sm:gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent -mx-1 px-1 scroll-smooth">
        {children}
      </div>
    </section>
  );
}
