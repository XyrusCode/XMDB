import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { SEO } from '@/components/global/SEO';
import { MediaCard } from '@/components/media/MediaCard';
import { MediaRow } from '@/components/media/MediaRow';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { useTrendingMovies, useTrendingTV } from '@/queries/use-trending';
import { useUpcomingMovies } from '@/queries/use-upcoming';
import { usePopularTV } from '@/queries/use-tv-popular';
import { useMultiSearch } from '@/queries/use-multi-search';
import { useAnimePicks, useKDramas, useCDramas } from '@/queries/use-discover';
import { useLibrary } from '@/hooks/use-library';
import { IMAGE_BASE_URL, BACKDROP_SIZE } from '@/config';

function yearFromDate(d?: string) {
  if (!d) return undefined;
  const y = d.slice(0, 4);
  return y && y !== '0000' ? y : undefined;
}

function RowSkeleton() {
  return (
    <div className="flex gap-3 sm:gap-4 overflow-hidden pb-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-36 sm:w-40 md:w-44">
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4 mt-2 rounded" />
          <Skeleton className="h-3 w-1/2 mt-1 rounded" />
        </div>
      ))}
    </div>
  );
}

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const { region } = useLibrary();

  const { data: trendingMovies, isLoading: loadingTM, isError: errTM } = useTrendingMovies(region);
  const { data: trendingTV, isLoading: loadingTT, isError: errTT } = useTrendingTV(region);
  const { data: upcomingMovies, isLoading: loadingUM, isError: errUM } = useUpcomingMovies(region);
  const { data: popularTV, isLoading: loadingPT, isError: errPT } = usePopularTV();
  const { data: animePicks, isLoading: loadingAnime, isError: errAnime } = useAnimePicks();
  const { data: kdramas, isLoading: loadingKD, isError: errKD } = useKDramas();
  const { data: cdramas, isLoading: loadingCD, isError: errCD } = useCDramas();
  const { data: searchResults, isLoading: searching, isError: errSearch } = useMultiSearch(debouncedSearch);

  const hero = trendingMovies?.[0];
  const isSearching = debouncedSearch.trim().length >= 2;

  return (
    <>
      <SEO
        title="Discover Movies & Series"
        description="Stream-style discovery for movies and series: trending, upcoming, anime, K-dramas, C-dramas and search powered by TMDB."
      />

      {/* Hero - Prime Video style */}
      {hero && !isSearching && (
        <section className="relative mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="relative h-[60vh] min-h-[340px] max-h-[640px] overflow-hidden bg-[#0a0a0a]">
            {hero.backdrop_path ? (
              <img
                src={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${hero.backdrop_path}`}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
            <div className="relative h-full flex flex-col justify-end px-4 sm:px-8 lg:px-12 pb-12 max-w-2xl">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-cyan-400/90 mb-3 font-medium">Trending in {region}</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[0.9] mb-4 tracking-tight">
                {hero.title}
              </h1>
              <p className="text-sm sm:text-base text-white/70 line-clamp-3 mb-6 max-w-xl leading-relaxed">
                {hero.overview}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/movie/$movieId"
                  params={{ movieId: String(hero.id) }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors"
                >
                  ▶ Details
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search */}
      <div className="mb-10 px-1">
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search movies & TV series…"
          className="w-full max-w-2xl rounded bg-white/5 border border-white/10 px-5 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-sm sm:text-base"
        />
      </div>

      {/* Search results */}
      {isSearching && (
        <section className="mb-12 px-1">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 tracking-tight text-white">Results for “{debouncedSearch}”</h2>
          {searching && <RowSkeleton />}
          {errSearch && (
            <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-4 text-red-200 text-sm">
              Couldn’t load search results. Check your connection or TMDB credentials.
            </div>
          )}
          {!searching && !errSearch && searchResults && searchResults.length === 0 && (
            <p className="text-muted-foreground py-12 text-center">No results found.</p>
          )}
          {!searching && !errSearch && searchResults && searchResults.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {searchResults.map((item) => {
                const isMovie = item.media_type === 'movie';
                const title = isMovie ? (item as { title: string }).title : (item as { name: string }).name;
                const date = isMovie
                  ? (item as { release_date?: string }).release_date
                  : (item as { first_air_date?: string }).first_air_date;
                return (
                  <MediaCard
                    key={`${item.media_type}-${item.id}`}
                    id={item.id}
                    mediaType={item.media_type!}
                    title={title}
                    posterPath={item.poster_path}
                    year={yearFromDate(date)}
                  />
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Rows */}
      {!isSearching && (
        <div className="space-y-2">
          <MediaRow title="Trending Movies" subtitle={`Popular in ${region}`}>
            {loadingTM && <RowSkeleton />}
            {errTM && <p className="text-sm text-red-400 py-4">Failed to load trending movies.</p>}
            {!loadingTM && !errTM && trendingMovies?.map((m) => (
              <MediaCard key={m.id} id={m.id} mediaType="movie" title={m.title} posterPath={m.poster_path} year={yearFromDate(m.release_date)} />
            ))}
          </MediaRow>

          <MediaRow title="Trending Series" subtitle="This week">
            {loadingTT && <RowSkeleton />}
            {errTT && <p className="text-sm text-red-400 py-4">Failed to load trending series.</p>}
            {!loadingTT && !errTT && trendingTV?.map((t) => (
              <MediaCard key={t.id} id={t.id} mediaType="tv" title={t.name} posterPath={t.poster_path} year={yearFromDate(t.first_air_date)} />
            ))}
          </MediaRow>

          <MediaRow title="Upcoming Movies" subtitle={`In ${region}`}>
            {loadingUM && <RowSkeleton />}
            {errUM && <p className="text-sm text-red-400 py-4">Failed to load upcoming movies.</p>}
            {!loadingUM && !errUM && upcomingMovies?.map((m) => (
              <MediaCard key={m.id} id={m.id} mediaType="movie" title={m.title} posterPath={m.poster_path} year={yearFromDate(m.release_date)} />
            ))}
          </MediaRow>

          <MediaRow title="Popular Series">
            {loadingPT && <RowSkeleton />}
            {errPT && <p className="text-sm text-red-400 py-4">Failed to load popular series.</p>}
            {!loadingPT && !errPT && popularTV?.map((t) => (
              <MediaCard key={t.id} id={t.id} mediaType="tv" title={t.name} posterPath={t.poster_path} year={yearFromDate(t.first_air_date)} />
            ))}
          </MediaRow>

          <MediaRow title="Anime" subtitle="Japanese animation">
            {loadingAnime && <RowSkeleton />}
            {errAnime && <p className="text-sm text-red-400 py-4">Failed to load anime picks.</p>}
            {!loadingAnime && !errAnime && animePicks?.map((t) => (
              <MediaCard key={t.id} id={t.id} mediaType="tv" title={t.name} posterPath={t.poster_path} year={yearFromDate(t.first_air_date)} />
            ))}
          </MediaRow>

          <MediaRow title="K-Dramas" subtitle="Korean series">
            {loadingKD && <RowSkeleton />}
            {errKD && <p className="text-sm text-red-400 py-4">Failed to load K-dramas.</p>}
            {!loadingKD && !errKD && kdramas?.map((t) => (
              <MediaCard key={t.id} id={t.id} mediaType="tv" title={t.name} posterPath={t.poster_path} year={yearFromDate(t.first_air_date)} />
            ))}
          </MediaRow>

          <MediaRow title="C-Dramas" subtitle="Chinese series">
            {loadingCD && <RowSkeleton />}
            {errCD && <p className="text-sm text-red-400 py-4">Failed to load C-dramas.</p>}
            {!loadingCD && !errCD && cdramas?.map((t) => (
              <MediaCard key={t.id} id={t.id} mediaType="tv" title={t.name} posterPath={t.poster_path} year={yearFromDate(t.first_air_date)} />
            ))}
          </MediaRow>
        </div>
      )}
    </>
  );
}
