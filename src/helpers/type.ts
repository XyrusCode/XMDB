/** Archivo's width axis, from its metadata. */
const WDTH_MIN = 62;
const WDTH_MAX = 125;

/** Below this a title is short enough to stretch; above it, it must compress. */
const SHORT_TITLE = 6;
const LONG_TITLE = 34;

/**
 * Fits a title to its frame by width rather than by size, the way poster
 * lettering is drawn: "DUNE" opens out to expanded, "The Lord of the Rings: The
 * Fellowship of the Ring" squeezes to condensed. The type stays one size, so
 * the grid keeps its rhythm.
 */
export const fitWidth = (title: string): string => {
  const len = Math.min(Math.max(title.trim().length, SHORT_TITLE), LONG_TITLE);
  const t = (len - SHORT_TITLE) / (LONG_TITLE - SHORT_TITLE);
  return `${(WDTH_MAX - t * (WDTH_MAX - WDTH_MIN)).toFixed(1)}%`;
};

/** TMDB dates are ISO; the year is all the sheet has room for. */
export const toYear = (releaseDate: string | null | undefined): string =>
  releaseDate && releaseDate.length >= 4 ? releaseDate.slice(0, 4) : '';
