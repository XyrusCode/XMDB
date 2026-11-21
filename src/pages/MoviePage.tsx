import { Link } from '@tanstack/react-router';
import { SEO } from '@/components/global/SEO';
import { IMAGE_BASE_URL, BACKDROP_SIZE, POSTER_SIZE } from '@/config';
import { useMovie } from '@/queries/use-movie';
import { useLibrary } from '@/hooks/use-library';
import { createMovieStructuredData } from '@/helpers/structured-data';
import { Skeleton } from '@/components/ui/skeleton';

export const MoviePage = ({ movieId }: { movieId: number }) => {
  const { data: movie, isLoading, isError, error } = useMovie(movieId);
  const { isInWatchlist, toggleWatchlist, isMovieWatched, toggleMovieWatched, region, setRegion } = useLibrary();

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-1 py-8">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-64 aspect-[2/3] rounded-lg flex-shrink-0 mx-auto md:mx-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="max-w-5xl mx-auto px-1 py-16 text-center">
        <p className="text-xl font-semibold text-foreground mb-2">Couldn’t load this movie</p>
        <p className="text-muted-foreground mb-6">{(error as Error)?.message || 'Something went wrong.'}</p>
        <Link to="/" className="text-blue-400 hover:underline">← Back to discover</Link>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(movie.id, 'movie');
  const watched = isMovieWatched(movie.id);
  const wp = movie['watch/providers']?.results?.[region] || movie['watch/providers']?.results?.['US'];
  const flatrate = wp?.flatrate || [];
  const rent = wp?.rent || [];
  const buy = wp?.buy || [];
  const ticketSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(movie.title + ' movie tickets ' + region)}`;

  return (
    <>
      <SEO
        title={movie.title}
        description={movie.overview ? movie.overview.slice(0, 160) : undefined}
        image={movie.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}` : undefined}
        type="video.movie"
        structuredData={createMovieStructuredData(movie)}
      />

      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-8">
        <div className="relative h-[40vh] min-h-[240px] max-h-[420px] overflow-hidden bg-neutral-950">
          {movie.backdrop_path ? (
            <img
              src={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${movie.backdrop_path}`}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto -mt-28 relative px-1">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">← Back to discover</Link>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 w-48 sm:w-56 md:w-72 mx-auto md:mx-0">
            {movie.poster_path ? (
              <img
                src={`${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`}
                alt={movie.title}
                className="w-full rounded-xl shadow-2xl ring-1 ring-white/10"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-neutral-800 rounded-xl flex items-center justify-center text-muted-foreground text-sm">
                No poster
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">{movie.title}</h1>
            {movie.tagline && <p className="mt-3 text-muted-foreground italic text-lg">{movie.tagline}</p>}

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
              {movie.runtime && <span>• {movie.runtime} min</span>}
              <span>• ★ {movie.vote_average?.toFixed(1)}</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  toggleWatchlist({
                    id: movie.id,
                    mediaType: 'movie',
                    title: movie.title,
                    posterPath: movie.poster_path,
                    backdropPath: movie.backdrop_path,
                  })
                }
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${inWatchlist ? 'bg-white text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
              >
                {inWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
              </button>
              <button
                onClick={() => toggleMovieWatched(movie.id)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${watched ? 'bg-emerald-600 text-white' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
              >
                {watched ? '✓ Watched' : 'Mark as Watched'}
              </button>
              <a
                href={ticketSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
              >
                Find tickets
              </a>
            </div>

            {movie.overview && (
              <div className="mt-8">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Overview</h2>
                <p className="text-foreground leading-relaxed text-base">{movie.overview}</p>
              </div>
            )}

            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Where to watch</h2>
                <label className="text-xs text-muted-foreground">
                  Region:{' '}
                  <input
                    value={region}
                    onChange={(e) => setRegion(e.target.value.toUpperCase().slice(0, 2))}
                    className="w-12 bg-transparent border-b border-border text-foreground text-center focus:outline-none"
                    maxLength={2}
                  />
                </label>
              </div>
              {flatrate.length > 0 || rent.length > 0 || buy.length > 0 ? (
                <div className="space-y-2 text-sm">
                  {flatrate.length > 0 && <p><span className="text-muted-foreground">Stream:</span> {flatrate.map((p) => p.provider_name).join(', ')}</p>}
                  {rent.length > 0 && <p><span className="text-muted-foreground">Rent:</span> {rent.map((p) => p.provider_name).join(', ')}</p>}
                  {buy.length > 0 && <p><span className="text-muted-foreground">Buy:</span> {buy.map((p) => p.provider_name).join(', ')}</p>}
                  {wp?.link && (
                    <a href={wp.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs">
                      View on TMDB →
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No streaming availability data for region {region}.</p>
              )}
            </div>

            {movie.actors && movie.actors.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Top Cast</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.actors.slice(0, 10).map((a) => (
                    <span key={a.credit_id} className="px-3 py-1.5 rounded-full bg-neutral-800/80 text-sm text-foreground">
                      {a.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
