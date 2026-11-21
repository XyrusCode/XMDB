import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { SEO } from '@/components/global/SEO';
import { MediaCard } from '@/components/media/MediaCard';
import { MediaRow } from '@/components/media/MediaRow';
import { useDebounce } from '@/hooks/use-debounce';
import { useTrendingMovies, useTrendingTV } from '@/queries/use-trending';
import { useUpcomingMovies } from '@/queries/use-upcoming';
import { usePopularTV } from '@/queries/use-tv-popular';
import { useMultiSearch } from '@/queries/use-multi-search';
import { IMAGE_BASE_URL, BACKDROP_SIZE } from '@/config';

function yearFromDate(d?: string) {
  if (!d) return undefined;
  const y = d.slice(0, 4);
  return y && y !== '0000' ? y : undefined;
}

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const { data: trendingMovies, isLoading: loadingTM } = useTrendingMovies();
  const { data: trendingTV, isLoading: loadingTT } = useTrendingTV();
  const { data: upcomingMovies, isLoading: loadingUM } = useUpcomingMovies();
  const { data: popularTV, isLoading: loadingPT } = usePopularTV();
  const { data: searchResults, isLoading: searching } = useMultiSearch(debouncedSearch);

  const hero = trendingMovies?.[0];
  const isSearching = debouncedSearch.trim().length >= 2;

  return (
    <>
      <SEO
        title="Discover Movies & Series"
        description="Stream-style discovery for movies and series: trending, upcoming, and search powered by TMDB."
      />

      {/* Hero */}
      {hero && !isSearching && (
        <section className="relative mb-10 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="relative h-[50vh] min-h-[280px] max-h-[520px] overflow-hidden">
            {hero.backdrop_path ? (
              <img
                src={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${hero.backdrop_path}`}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-900" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="relative h-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 pb-8 max-w-3xl">
              <p className="text-xs uppercase tracking-widest text-white/70 mb-2">Trending Movie</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
                {hero.title}
              </h1>
              <p className="text-sm sm:text-base text-white/80 line-clamp-3 mb-4 max-w-xl">
                {hero.overview}
              </p>
              <div className="flex gap-3">
                <Link
                  to="/movie/$movieId"
                  params={{ movieId: String(hero.id) }}
                  className="inline-flex items-center px-5 py-2.5 rounded-md bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors"
                >
                  View details
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search */}
      <div className="mb-8">
        <label htmlFor="search" className="block text-sm font-medium text-muted-foreground mb-2">
          Search movies & series
        </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a title…"
          className="w-full max-w-xl rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Search results */}
      {isSearching && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Search results</h2>
          {searching && <p className="text-muted-foreground">Searching…</p>}
          {!searching && searchResults && searchResults.length === 0 && (
            <p className="text-muted-foreground">No results for “{debouncedSearch}”.</p>
          )}
          {!searching && searchResults && searchResults.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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

      {/* Rows (hidden while searching for simplicity) */}
      {!isSearching && (
        <>
          <MediaRow title="Trending Movies" subtitle="This week">
            {loadingTM && <p className="text-muted-foreground text-sm py-8">Loading…</p>}
            {!loadingTM && trendingMovies?.map((m) => (
              <MediaCard
                key={m.id}
                id={m.id}
                mediaType="movie"
                title={m.title}
                posterPath={m.poster_path}
                year={yearFromDate(m.release_date)}
              />
            ))}
          </MediaRow>

          <MediaRow title="Trending Series" subtitle="This week">
            {loadingTT && <p className="text-muted-foreground text-sm py-8">Loading…</p>}
            {!loadingTT && trendingTV?.map((t) => (
              <MediaCard
                key={t.id}
                id={t.id}
                mediaType="tv"
                title={t.name}
                posterPath={t.poster_path}
                year={yearFromDate(t.first_air_date)}
              />
            ))}
          </MediaRow>

          <MediaRow title="Upcoming Movies">
            {loadingUM && <p className="text-muted-foreground text-sm py-8">Loading…</p>}
            {!loadingUM && upcomingMovies?.map((m) => (
              <MediaCard
                key={m.id}
                id={m.id}
                mediaType="movie"
                title={m.title}
                posterPath={m.poster_path}
                year={yearFromDate(m.release_date)}
              />
            ))}
          </MediaRow>

          <MediaRow title="Popular Series">
            {loadingPT && <p className="text-muted-foreground text-sm py-8">Loading…</p>}
            {!loadingPT && popularTV?.map((t) => (
              <MediaCard
                key={t.id}
                id={t.id}
                mediaType="tv"
                title={t.name}
                posterPath={t.poster_path}
                year={yearFromDate(t.first_air_date)}
              />
            ))}
          </MediaRow>
        </>
      )}
    </>
  );
};
