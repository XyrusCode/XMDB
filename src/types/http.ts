/** Every rejection out of `src/api/client.ts` is normalised to this shape. */
export interface ApiError {
  /** `http_404`, or `tmdb_7` when TMDB sends its own status_code. */
  code: string;
  /** 0 means the request never got a response (network failure, CORS, abort). */
  status: number;
  message: string;
  url?: string;
}
