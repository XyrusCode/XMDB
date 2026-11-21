import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { SEO } from '@/components/global/SEO';
import { IMAGE_BASE_URL, BACKDROP_SIZE, POSTER_SIZE } from '@/config';
import { useTV } from '@/queries/use-tv';
import { useSeason } from '@/queries/use-season';
import { useLibrary } from '@/hooks/use-library';

export const TVPage = ({ tvId }: { tvId: number }) => {
  const { data: tv } = useTV(tvId);
  const { isInWatchlist, toggleWatchlist, toggleEpisodeWatched, isEpisodeWatched, region, setRegion } = useLibrary();
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const { data: seasonData, isLoading: loadingSeason } = useSeason(tvId, selectedSeason);

  if (!tv) return null;

  const inWatchlist = isInWatchlist(tv.id, 'tv');
  const wp = tv['watch/providers']?.results?.[region] || tv['watch/providers']?.results?.['US'];
  const flatrate = wp?.flatrate || [];
  const rent = wp?.rent || [];
  const buy = wp?.buy || [];

  // Auto-select first season if none selected
  const seasons = (tv.seasons || []).filter((s) => s.season_number >= 0);
  const activeSeason = selectedSeason ?? (seasons[0]?.season_number ?? null);

  return (
    <>
      <SEO
        title={tv.name}
        description={tv.overview ? tv.overview.slice(0, 160) : undefined}
        image={tv.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${tv.poster_path}` : undefined}
        type="website"
      />

      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-8">
        <div className="relative h-[40vh] min-h-[240px] max-h-[400px] overflow-hidden">
          {tv.backdrop_path ? (
            <img
              src={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${tv.backdrop_path}`}
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
            {tv.poster_path ? (
              <img
                src={`${IMAGE_BASE_URL}${POSTER_SIZE}${tv.poster_path}`}
                alt={tv.name}
                className="w-full rounded-lg shadow-xl"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-neutral-800 rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                No poster
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">{tv.name}</h1>
            {tv.tagline && <p className="mt-2 text-muted-foreground italic">{tv.tagline}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {tv.first_air_date && <span>{tv.first_air_date.slice(0, 4)}</span>}
              <span>• {tv.number_of_seasons} season{tv.number_of_seasons !== 1 ? 's' : ''}</span>
              <span>• ★ {tv.vote_average?.toFixed(1)}</span>
              {tv.status && <span>• {tv.status}</span>}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  toggleWatchlist({
                    id: tv.id,
                    mediaType: 'tv',
                    title: tv.name,
                    posterPath: tv.poster_path,
                    backdropPath: tv.backdrop_path,
                  })
                }
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${inWatchlist ? 'bg-white text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
              >
                {inWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
              </button>
            </div>

            {tv.overview && (
              <div className="mt-6">
                <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Overview</h2>
                <p className="text-foreground leading-relaxed">{tv.overview}</p>
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
          </div>
        </div>

        {/* Seasons & Episodes */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Episodes</h2>
          {seasons.length === 0 ? (
            <p className="text-muted-foreground text-sm">No seasons available.</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-6">
                {seasons.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSeason(s.season_number)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${(activeSeason === s.season_number) ? 'bg-white text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
                  >
                    {s.name || `Season ${s.season_number}`}
                  </button>
                ))}
              </div>

              {activeSeason !== null && (
                <div>
                  {loadingSeason && <p className="text-muted-foreground text-sm">Loading episodes…</p>}
                  {seasonData && (
                    <div className="space-y-3">
                      {seasonData.episodes?.map((ep) => {
                        const watchedEp = isEpisodeWatched(tvId, ep.season_number, ep.episode_number);
                        return (
                          <div
                            key={ep.id}
                            className="flex items-start gap-4 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800"
                          >
                            {ep.still_path ? (
                              <img
                                src={`${IMAGE_BASE_URL}w300${ep.still_path}`}
                                alt=""
                                className="w-32 h-18 object-cover rounded flex-shrink-0"
                              />
                            ) : (
                              <div className="w-32 h-18 bg-neutral-800 rounded flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-xs text-muted-foreground">E{ep.episode_number}</p>
                                  <h3 className="font-medium text-foreground">{ep.name || `Episode ${ep.episode_number}`}</h3>
                                </div>
                                <button
                                  onClick={() => toggleEpisodeWatched(tvId, ep.season_number, ep.episode_number)}
                                  className={`flex-shrink-0 px-3 py-1 rounded text-xs font-medium transition-colors ${watchedEp ? 'bg-green-600 text-white' : 'bg-neutral-700 text-white hover:bg-neutral-600'}`}
                                >
                                  {watchedEp ? '✓ Watched' : 'Mark watched'}
                                </button>
                              </div>
                              {ep.overview && (
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{ep.overview}</p>
                              )}
                              <p className="mt-1 text-xs text-muted-foreground">
                                {ep.air_date || 'TBA'}{ep.runtime ? ` • ${ep.runtime} min` : ''}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
