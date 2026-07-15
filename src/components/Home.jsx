import React, { useState } from 'react';
// Config
import { POSTER_SIZE, BACKDROP_SIZE, IMAGE_BASE_URL } from '../config';
// Components
import HeroImage from './HeroImage';
import Grid from './Grid';
import Thumb from './Thumb';
import Spinner from './Spinner';
import SearchBar from './SearchBar';
import Button from './Button';
// Hooks
import { useMovies } from '../queries/use-movies';
import { useDebounce } from '../hooks/use-debounce';
// Image
import NoImage from '../images/no_image.jpg';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm);

  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useMovies(debouncedSearch);

  if (isError) return <div>{error?.message ?? 'Something went wrong ...'}</div>;

  const movies = data?.movies ?? [];
  const hero = !debouncedSearch ? movies[0] : null;

  return (
    <>
      {hero && hero.backdrop_path ? (
        <HeroImage
          image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${hero.backdrop_path}`}
          title={hero.original_title}
          text={hero.overview}
        />
      ) : null}
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <Grid header={debouncedSearch ? 'Search Result' : 'Popular Movies'}>
        {movies.map(movie => (
          <Thumb
            key={movie.id}
            clickable
            image={
              movie.poster_path
                ? IMAGE_BASE_URL + POSTER_SIZE + movie.poster_path
                : NoImage
            }
            movieId={movie.id}
          />
        ))}
      </Grid>
      {(isPending || isFetchingNextPage) && <Spinner />}
      {hasNextPage && !isFetchingNextPage && (
        <Button text='Load More' callback={() => fetchNextPage()} />
      )}
    </>
  );
};

export default Home;
