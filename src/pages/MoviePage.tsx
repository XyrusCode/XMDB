import { Link } from '@tanstack/react-router';
import { SEO } from '@/components/global/SEO';
import { IMAGE_BASE_URL, POSTER_SIZE } from '@/config';
import { createMovieStructuredData } from '@/helpers/structured-data';
import { CastFrame } from '@/components/movie/CastFrame';
import { ContactSheet } from '@/components/movie/ContactSheet';
import { MovieSheet } from '@/components/movie/MovieSheet';
import { useMovie } from '@/queries/use-movie';

export const MoviePage = ({ movieId }: { movieId: number }) => {
  // The route loader has already warmed this, so it resolves from cache; the
  // subscription here is what keeps the component reactive.
  const { data: movie } = useMovie(movieId);

  if (!movie) return null;

  const description = movie.overview ? movie.overview.slice(0, 160) : undefined;
  const image = movie.poster_path
    ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
    : undefined;

  return (
    <>
      <SEO
        title={movie.title}
        description={description}
        image={image}
        type="video.movie"
        structuredData={createMovieStructuredData(movie)}
      />

      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              to="/"
              className="edge rounded-xs underline-offset-4 outline-none hover:text-grease hover:underline"
            >
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
