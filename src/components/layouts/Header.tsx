import { Link } from '@tanstack/react-router';

export const Header = () => (
  <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
    <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <Link to="/" className="group flex items-center gap-3 rounded outline-none">
        <img src="/icon.svg" alt="" className="h-9 w-9 sm:h-10 sm:w-10" />
        <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          XMDB
        </span>
      </Link>
      <Link
        to="/watchlist"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Watchlist
      </Link>
      <Link
        to="/docs"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Docs
      </Link>
      <a
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noreferrer noopener"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Powered by TMDB
      </a>
    </div>
  </header>
);
