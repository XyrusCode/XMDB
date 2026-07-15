import { Link } from '@tanstack/react-router';
import { BACKDROP_SIZE, IMAGE_BASE_URL } from '@/config';
import { fitWidth, toYear } from '@/helpers/type';
import type { Movie } from '@/types/tmdb';

/**
 * The thesis: the most popular film today, laid on the lightbox as frame 01 of
 * the sheet — not a full-bleed backdrop with text floated over a scrim.
 */
export const HeroFrame = ({ movie }: { movie: Movie }) => {
  const year = toYear(movie.release_date);

  return (
    <section aria-labelledby="hero-title" className="mb-10">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="edge">Frame 01 &middot; Most popular today</span>
        <span className="edge tabular-nums">{year}</span>
      </div>

      <Link to="/$movieId" params={{ movieId: movie.id }} className="group block outline-none">
        <div className="relative bg-rebate p-2">
          <div className="relative aspect-16/9 overflow-hidden bg-sheet sm:aspect-21/9">
            {movie.backdrop_path ? (
              <img
                src={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${movie.backdrop_path}`}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="edge">No frame available</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <h1
          id="hero-title"
          className="display text-[clamp(2rem,7vw,4.5rem)] text-foreground"
          style={{ '--wdth': fitWidth(movie.title) } as React.CSSProperties}
        >
          {movie.title}
        </h1>
        <p className="max-w-prose text-sm leading-relaxed text-pencil">{movie.overview}</p>
      </div>
    </section>
  );
};
