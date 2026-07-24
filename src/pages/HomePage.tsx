import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO } from '@/components/global/SEO';
import { ContactSheet } from '@/components/movie/ContactSheet';
import { Frame } from '@/components/movie/Frame';
import { HeroFrame } from '@/components/movie/HeroFrame';
import { SearchLoupe } from '@/components/movie/SearchLoupe';
import { useDebounce } from '@/hooks/use-debounce';
import { toYear } from '@/helpers/type';
import { useMovies } from '@/queries/use-movies';

const SheetSkeleton = () => (
  <ul className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
    {Array.from({ length: 10 }, (_, i) => (
      <li key={i}>
        <Skeleton className="aspect-2/3 w-full rounded-none" />
      </li>
    ))}
  </ul>
);

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm);

  const { data, isPending, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMovies(debouncedSearch);

  const movies = data?.movies ?? [];
  const isSearching = debouncedSearch.length > 0;
  // The hero is frame 01 of the popular sheet; a search result set has no
  // "most popular today" to lead with.
  const hero = !isSearching ? movies[0] : undefined;
  const sheet = hero ? movies.slice(1) : movies;

  return (
    <>
      <SEO
        title="Discover Popular Movies"
        description="Browse popular films and search The Movie Database. A contact sheet for the movies."
      />

      {hero && <HeroFrame movie={hero} />}

      <div className="mb-8 max-w-md">
        <SearchLoupe value={searchTerm} onChange={setSearchTerm} />
      </div>

      {isError ? (
        <div role="alert" className="border border-grease p-6">
          <p className="edge text-grease">Could not load films</p>
          <p className="mt-2 text-sm text-foreground">{error.message}</p>
        </div>
      ) : isPending ? (
        <SheetSkeleton />
      ) : movies.length === 0 ? (
        <div className="border-t border-sprocket py-16 text-center">
          <p className="edge">No frames match &ldquo;{debouncedSearch}&rdquo;</p>
          <p className="mt-2 text-sm text-pencil">Try a shorter or different title.</p>
        </div>
      ) : (
        <>
          {/* Only searches get a count. TMDB reports every film it holds for
              "popular" (~1.1m), which says nothing and overstates what you can
              actually page to. */}
          <ContactSheet
            label={isSearching ? 'Search result' : 'Popular'}
            count={isSearching ? data?.totalResults : undefined}
          >
            {sheet.map((movie, index) => (
              <Frame
                key={movie.id}
                movieId={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                // Continues the hero's numbering: it is frame 01.
                frameNumber={hero ? index + 2 : index + 1}
                year={toYear(movie.release_date)}
              />
            ))}
          </ContactSheet>

          {hasNextPage && (
            <div className="mt-10 flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Pulling next sheet…' : 'Next sheet'}
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};
