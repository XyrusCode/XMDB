import { Link } from '@tanstack/react-router';
import { CastFrame } from '@/components/movie/CastFrame';
import { ContactSheet } from '@/components/movie/ContactSheet';
import { MovieSheet } from '@/components/movie/MovieSheet';
import { useMovie } from '@/queries/use-movie';

export const MoviePage = ({ movieId }: { movieId: number }) => {
  // The route loader has already warmed this, so it resolves from cache; the
  // subscription here is what keeps the component reactive.
  const { data: movie } = useMovie(movieId);

  if (!movie) return null;

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2">
          <li>
            <Link to="/" className="edge rounded-xs underline-offset-4 outline-none hover:text-grease hover:underline">
              Sheet
            </Link>
          </li>
          <li aria-hidden="true" className="edge">
            /
          </li>
          <li>
            <span className="edge text-foreground">{movie.title}</span>
          </li>
        </ol>
      </nav>

      <MovieSheet movie={movie} />

      {movie.actors.length > 0 && (
        <div className="mt-14">
          <ContactSheet label="Cast" count={movie.actors.length}>
            {movie.actors.slice(0, 20).map((actor) => (
              <CastFrame key={actor.credit_id} actor={actor} />
            ))}
          </ContactSheet>
        </div>
      )}
    </>
  );
};
