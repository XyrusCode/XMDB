import { describe, expect, it } from 'vitest';
import { fitWidth, toYear } from '@/helpers/type';

const pct = (s: string) => Number.parseFloat(s);

describe('fitWidth', () => {
  it('stretches short titles and compresses long ones', () => {
    expect(pct(fitWidth('Dune'))).toBeGreaterThan(pct(fitWidth('The Shawshank Redemption')));
  });

  // Outside the axis Archivo actually ships, the browser silently clamps and the
  // effect is lost.
  it('stays inside Archivo’s 62–125 width axis at both extremes', () => {
    expect(pct(fitWidth('A'))).toBeLessThanOrEqual(125);
    expect(pct(fitWidth('A'))).toBeGreaterThanOrEqual(62);

    const veryLong = 'The Lord of the Rings: The Fellowship of the Ring Extended Edition';
    expect(pct(fitWidth(veryLong))).toBeGreaterThanOrEqual(62);
  });

  it('does not let whitespace pad a title into a wider setting', () => {
    expect(fitWidth('   Dune   ')).toBe(fitWidth('Dune'));
  });
});

describe('toYear', () => {
  it('takes the year off an ISO date', () => {
    expect(toYear('1994-09-23')).toBe('1994');
  });

  // TMDB returns '' for unreleased films rather than omitting the field.
  it('returns empty rather than a partial year when there is no date', () => {
    expect(toYear('')).toBe('');
    expect(toYear(null)).toBe('');
    expect(toYear(undefined)).toBe('');
  });
});
