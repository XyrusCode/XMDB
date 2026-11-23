import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { SEO } from '@/components/global/SEO';
import { MediaCard } from '@/components/media/MediaCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { useTrendingMovies, useTrendingTV } from '@/queries/use-trending';
import { useUpcomingMovies } from '@/queries/use-upcoming';
import { usePopularTV } from '@/queries/use-tv-popular';
import { useMultiSearch } from '@/queries/use-multi-search';
import { useAnimePicks, useKDramas, useCDramas } from '@/queries/use-discover';
import { useLibrary } from '@/hooks/use-library';
import { MediaVirtualRow } from '@/components/virtual/MediaVirtualRow';
import { appHotkeys } from '@/lib/app-hotkeys';
import { useHotkey } from '@tanstack/react-hotkeys';
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
  const navigate = useNavigate();

  // Keyboard: focus search (Mod+K), jump to top (G G), docs (Mod+Shift+D).
  useHotkey(appHotkeys['nav.search'], () => {
    document.getElementById('search')?.focus();
  });
  useHotkey(appHotkeys['nav.goToTop'], () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  useHotkey(appHotkeys['actions.openDocs'], () => {
    navigate({ to: '/docs' });
  });

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

      {/* Rows (virtualized) */}
      {!isSearching && (
        <div className="space-y-2">
          <MediaVirtualRow
            title="Trending Movies"
            items={trendingMovies?.map((m) => ({
              id: m.id, mediaType: 'movie' as const, title: m.title, posterPath: m.poster_path, year: yearFromDate(m.release_date),
            })) ?? []}
            rowKey="trending-movies"
            loading={loadingTM}
            error={errTM ? 'Failed to load trending movies.' : undefined}
            subtitle={`Popular in ${region}`}
            renderItem={(item) => <MediaCard key={item.id} id={item.id} mediaType={item.mediaType} title={item.title} posterPath={item.posterPath} year={item.year} />}
          />

          <MediaVirtualRow
            title="Trending Series"
            items={trendingTV?.map((t) => ({
              id: t.id, mediaType: 'tv' as const, title: t.name, posterPath: t.poster_path, year: yearFromDate(t.first_air_date),
            })) ?? []}
            rowKey="trending-tv"
            loading={loadingTT}
            error={errTT ? 'Failed to load trending series.' : undefined}
            renderItem={(item) => <MediaCard key={item.id} id={item.id} mediaType={item.mediaType} title={item.title} posterPath={item.posterPath} year={item.year} />}
          />

          <MediaVirtualRow
            title="Upcoming Movies"
            items={upcomingMovies?.map((m) => ({
              id: m.id, mediaType: 'movie' as const, title: m.title, posterPath: m.poster_path, year: yearFromDate(m.release_date),
            })) ?? []}
            rowKey="upcoming-movies"
            loading={loadingUM}
            error={errUM ? 'Failed to load upcoming movies.' : undefined}
            subtitle={`In ${region}`}
            renderItem={(item) => <MediaCard key={item.id} id={item.id} mediaType={item.mediaType} title={item.title} posterPath={item.posterPath} year={item.year} />}
          />

          <MediaVirtualRow
            title="Popular Series"
            items={popularTV?.map((t) => ({
              id: t.id, mediaType: 'tv' as const, title: t.name, posterPath: t.poster_path, year: yearFromDate(t.first_air_date),
            })) ?? []}
            rowKey="popular-tv"
            loading={loadingPT}
            error={errPT ? 'Failed to load popular series.' : undefined}
            renderItem={(item) => <MediaCard key={item.id} id={item.id} mediaType={item.mediaType} title={item.title} posterPath={item.posterPath} year={item.year} />}
          />

          <MediaVirtualRow
            title="Anime"
            subtitle="Japanese animation"
            items={animePicks?.map((t) => ({
              id: t.id, mediaType: 'tv' as const, title: t.name, posterPath: t.poster_path, year: yearFromDate(t.first_air_date),
            })) ?? []}
            rowKey="anime"
            loading={loadingAnime}
            error={errAnime ? 'Failed to load anime picks.' : undefined}
            renderItem={(item) => <MediaCard key={item.id} id={item.id} mediaType={item.mediaType} title={item.title} posterPath={item.posterPath} year={item.year} />}
          />

          <MediaVirtualRow
            title="K-Dramas"
            subtitle="Korean series"
            items={kdramas?.map((t) => ({
              id: t.id, mediaType: 'tv' as const, title: t.name, posterPath: t.poster_path, year: yearFromDate(t.first_air_date),
            })) ?? []}
            rowKey="kdrama"
            loading={loadingKD}
            error={errKD ? 'Failed to load K-dramas.' : undefined}
            renderItem={(item) => <MediaCard key={item.id} id={item.id} mediaType={item.mediaType} title={item.title} posterPath={item.posterPath} year={item.year} />}
          />

          <MediaVirtualRow
            title="C-Dramas"
            subtitle="Chinese series"
            items={cdramas?.map((t) => ({
              id: t.id, mediaType: 'tv' as const, title: t.name, posterPath: t.poster_path, year: yearFromDate(t.first_air_date),
            })) ?? []}
            rowKey="cdrama"
            loading={loadingCD}
            error={errCD ? 'Failed to load C-dramas.' : undefined}
            renderItem={(item) => <MediaCard key={item.id} id={item.id} mediaType={item.mediaType} title={item.title} posterPath={item.posterPath} year={item.year} />}
          />
        </div>
      )}
    </>
  );
}
