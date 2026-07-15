import { describe, expect, it } from 'vitest';
import { isValidMovieId, parseMovieId, stringifyMovieId } from '@/router/params';

/**
 * The bug this pins: /:movieId used to match anything, so /asdf was treated as
 * a film, fetched movie/asdf, and rendered "Something went wrong" instead of a
 * 404. The route now guards on isValidMovieId and throws notFound().
 */
describe('parseMovieId', () => {
  it('hands back a number, not a string', () => {
    expect(parseMovieId({ movieId: '278' })).toEqual({ movieId: 278 });
  });

  it('round-trips through stringify', () => {
    expect(stringifyMovieId(parseMovieId({ movieId: '278' }))).toEqual({ movieId: '278' });
  });
});

describe('isValidMovieId', () => {
  it('accepts a real TMDB id', () => {
    expect(isValidMovieId(278)).toBe(true);
  });

  it.each([
    ['asdf', 'letters'],
    ['', 'empty'],
    ['12abc', 'trailing letters'],
    ['-1', 'negative'],
    ['0', 'zero'],
    ['1.5', 'fractional'],
    ['null', 'the string null'],
    ['undefined', 'the string undefined'],
  ])('rejects %s (%s) so the route 404s', (raw) => {
    expect(isValidMovieId(parseMovieId({ movieId: raw }).movieId)).toBe(false);
  });
});
