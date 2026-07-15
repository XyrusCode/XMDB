/**
 * Parses leniently — junk becomes NaN rather than throwing.
 *
 * Throwing from parse does not make the router decline the match; the router
 * catches it and renders the route's errorComponent, so /asdf came out as
 * "Could not load this film" rather than a 404. The route guards with
 * isValidMovieId in beforeLoad and throws notFound() instead.
 */
export const parseMovieId = (raw: Record<string, string>): { movieId: number } => ({
  movieId: Number(raw.movieId),
});

export const stringifyMovieId = (params: { movieId: number }): { movieId: string } => ({
  movieId: String(params.movieId),
});

/** TMDB ids are positive integers. Anything else is not a film, it's a typo. */
export const isValidMovieId = (movieId: number): boolean =>
  Number.isInteger(movieId) && movieId > 0;
