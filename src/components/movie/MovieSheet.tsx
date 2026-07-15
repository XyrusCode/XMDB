import { IMAGE_BASE_URL, POSTER_SIZE } from '@/config';
import { convertMoney, toTimecode } from '@/helpers/format';
import { fitWidth, toYear } from '@/helpers/type';
import type { MovieView } from '@/types/tmdb';
import NoImage from '@/assets/no_image.jpg';

const Datum = ({ label, value }: { label: string; value: string }) => (
  <div className="border-t border-sprocket pt-2">
    <dt className="edge">{label}</dt>
    <dd className="mt-1 font-mono text-sm text-foreground tabular-nums">{value}</dd>
  </div>
);

export const MovieSheet = ({ movie }: { movie: MovieView }) => {
  const year = toYear(movie.release_date);

  return (
    <article className="grid gap-8 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
      <div>
        <div className="relative bg-rebate p-1.5">
          <div className="perfs absolute inset-y-0 left-0 w-1.5" aria-hidden="true" />
          <div className="perfs absolute inset-y-0 right-0 w-1.5" aria-hidden="true" />
          <div className="mx-1.5 aspect-2/3 overflow-hidden bg-sheet">
            <img
              src={
                movie.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}` : NoImage
              }
              alt={`Poster for ${movie.title}`}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        {/* An edge code, but a real one: TMDB's id and the release year are what
            identify this print. */}
        <p className="edge mt-2 text-center tabular-nums">
          TMDB-{movie.id}
          {year && ` · ${year}`}
        </p>
      </div>

      <div>
        <h1
          className="display text-[clamp(2rem,5.5vw,3.75rem)] text-foreground"
          style={{ '--wdth': fitWidth(movie.title) } as React.CSSProperties}
        >
          {movie.title}
        </h1>
        {movie.tagline && <p className="mt-3 text-sm text-pencil italic">{movie.tagline}</p>}

        <p className="mt-5 max-w-prose text-sm leading-relaxed text-foreground">{movie.overview}</p>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          {/* Runtime as an edit-bay timecode — it is a duration, so it reads
              like one. */}
          <Datum label="Runtime" value={toTimecode(movie.runtime)} />
          <Datum
            label="Rating"
            value={movie.vote_average > 0 ? movie.vote_average.toFixed(1) : '—'}
          />
          <Datum label="Budget" value={convertMoney(movie.budget)} />
          <Datum label="Revenue" value={convertMoney(movie.revenue)} />
        </dl>

        {movie.directors.length > 0 && (
          <div className="mt-6 border-t border-sprocket pt-2">
            <h2 className="edge">{movie.directors.length > 1 ? 'Directors' : 'Director'}</h2>
            <p className="mt-1 text-sm text-foreground">
              {movie.directors.map((d) => d.name).join(', ')}
            </p>
          </div>
        )}
      </div>
    </article>
  );
};
