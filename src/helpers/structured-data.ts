import { IMAGE_BASE_URL, POSTER_SIZE } from '@/config';
import type { MovieView } from '@/types/tmdb';

export const createMovieStructuredData = (movie: MovieView) => ({
  '@context': 'https://schema.org',
  '@type': 'Movie',
  name: movie.title,
  ...(movie.release_date ? { datePublished: movie.release_date } : {}),
  ...(movie.poster_path ? { image: `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}` } : {}),
  ...(movie.directors.length > 0 ? { director: movie.directors.map((d) => d.name) } : {}),
  ...(movie.overview ? { description: movie.overview } : {}),
});
