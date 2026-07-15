import { describe, expect, it } from 'vitest';
import { calcTime, convertMoney, toTimecode } from '@/helpers/format';

describe('calcTime', () => {
  it('formats a runtime', () => {
    expect(calcTime(142)).toBe('2h 22m');
  });

  // TMDB returns runtime: null routinely. The old helper answered "0h 0m" for
  // null and "NaNh NaNm" for undefined — both invented a runtime.
  it.each<number | null | undefined>([null, undefined, 0, NaN])(
    'reports Unknown rather than inventing a runtime for %s',
    (input) => {
      expect(calcTime(input)).toBe('Unknown');
    },
  );
});

describe('toTimecode', () => {
  it('pads to an edit-bay timecode', () => {
    expect(toTimecode(166)).toBe('02:46:00');
    expect(toTimecode(9)).toBe('00:09:00');
  });

  it('shows blank sprockets when there is no runtime', () => {
    expect(toTimecode(null)).toBe('--:--:--');
  });
});

describe('convertMoney', () => {
  it('formats a budget', () => {
    expect(convertMoney(25_000_000)).toBe('$25,000,000');
  });

  // TMDB uses 0 for "not disclosed" rather than omitting the field.
  it('does not claim a film cost $0', () => {
    expect(convertMoney(0)).toBe('Undisclosed');
    expect(convertMoney(null)).toBe('Undisclosed');
  });
});
