/**
 * TMDB returns runtime: null often enough that this has to be handled rather
 * than guarded against. The old helper turned null into "0h 0m" and undefined
 * into "NaNh NaNm"; both claimed a runtime the API never gave.
 */
export const calcTime = (minutes: number | null | undefined): string => {
  if (typeof minutes !== 'number' || !Number.isFinite(minutes) || minutes <= 0) {
    return 'Unknown';
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

/** Runtime as an edit-bay timecode: 02:46:00. */
export const toTimecode = (minutes: number | null | undefined): string => {
  if (typeof minutes !== 'number' || !Number.isFinite(minutes) || minutes <= 0) {
    return '--:--:--';
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(mins)}:00`;
};

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

/**
 * TMDB uses 0 for "not disclosed" rather than omitting the field, so a literal
 * $0 budget would be a lie about a film nobody made for free.
 */
export const convertMoney = (money: number | null | undefined): string => {
  if (typeof money !== 'number' || !Number.isFinite(money) || money <= 0) {
    return 'Undisclosed';
  }
  return formatter.format(money);
};
