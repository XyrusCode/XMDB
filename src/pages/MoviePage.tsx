import { Link } from '@tanstack/react-router';
import { SEO } from '@/components/global/SEO';
import { IMAGE_BASE_URL, BACKDROP_SIZE, POSTER_SIZE } from '@/config';
import { useMovie } from '@/queries/use-movie';
import { useLibrary } from '@/hooks/use-library';
import { createMovieStructuredData } from '@/helpers/structured-data';

export const MoviePage = ({ movieId }: { movieId: number }) => {
  const { data: movie } = useMovie(movieId);
  const { isInWatchlist, toggleWatchlist, isMovieWatched, toggleMovieWatched, region, setRegion } = useLibrary();

  if (!movie) return null;

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

      {/* Backdrop hero */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-8">
        <div className="relative h-[40vh] min-h-[240px] max-h-[400px] overflow-hidden">
          {movie.backdrop_path ? (
            <img
              src={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${movie.backdrop_path}`}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto -mt-24 relative px-1">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">← Back to discover</Link>
        </nav>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="flex-shrink-0 w-40 sm:w-52 md:w-64 mx-auto md:mx-0">
            {movie.poster_path ? (
              <img
                src={`${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`}
                alt={movie.title}
                className="w-full rounded-lg shadow-xl"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-neutral-800 rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                No poster
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">{movie.title}</h1>
            {movie.tagline && <p className="mt-2 text-muted-foreground italic">{movie.tagline}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
              {movie.runtime && <span>• {movie.runtime} min</span>}
              <span>• ★ {movie.vote_average?.toFixed(1)}</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
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
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${inWatchlist ? 'bg-white text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
              >
                {inWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
              </button>
              <button
                onClick={() => toggleMovieWatched(movie.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${watched ? 'bg-green-600 text-white' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
              >
                {watched ? '✓ Watched' : 'Mark as Watched'}
              </button>
              <a
                href={ticketSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-md text-sm font-medium bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
              >
                Find tickets
              </a>
            </div>

            {movie.overview && (
              <div className="mt-6">
                <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Overview</h2>
                <p className="text-foreground leading-relaxed">{movie.overview}</p>
              </div>
            )}

            {/* Availability */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm uppercase tracking-wider text-muted-foreground">Where to watch</h2>
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
                  {flatrate.length > 0 && (
                    <p><span className="text-muted-foreground">Stream:</span> {flatrate.map((p) => p.provider_name).join(', ')}</p>
                  )}
                  {rent.length > 0 && (
                    <p><span className="text-muted-foreground">Rent:</span> {rent.map((p) => p.provider_name).join(', ')}</p>
                  )}
                  {buy.length > 0 && (
                    <p><span className="text-muted-foreground">Buy:</span> {buy.map((p) => p.provider_name).join(', ')}</p>
                  )}
                  {wp?.link && (
                    <a href={wp.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs">
                      View on TMDB →
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No streaming availability data for region {region}. Try changing region.</p>
              )}
            </div>

            {/* Cast */}
            {movie.actors && movie.actors.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Top Cast</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.actors.slice(0, 10).map((a) => (
                    <span key={a.credit_id} className="px-3 py-1 rounded-full bg-neutral-800 text-sm text-foreground">
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
