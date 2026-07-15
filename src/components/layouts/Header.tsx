import { Link } from '@tanstack/react-router';

export const Header = () => (
  <header className="border-b border-sprocket">
    <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6">
      <Link to="/" className="group flex items-baseline gap-2 rounded-xs outline-none">
        <span className="display text-xl" style={{ '--wdth': '118%' } as React.CSSProperties}>
          XMDB
        </span>
        <span className="edge hidden sm:inline">Xyrus&rsquo; Movie DataBase</span>
      </Link>
      <a
        href="https://www.themoviedb.org/"
        target="_blank"
        rel="noreferrer noopener"
        className="edge rounded-xs underline-offset-4 outline-none hover:text-grease hover:underline"
      >
        Data &middot; TMDB
      </a>
    </div>
  </header>
);
