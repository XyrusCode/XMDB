/**
 * Hand-written against the three TMDB endpoints this app calls.
 *
 * Nullable fields are nullable because TMDB really returns null for them, not
 * as defensive padding: films regularly have no poster, no backdrop, and no
 * runtime, and people regularly have no profile photo.
 */

export interface Paginated<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

export interface CastMember {
  credit_id: string;
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  credit_id: string;
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

/** `movie/{id}?append_to_response=credits` — detail and credits in one call. */
export interface MovieDetail extends Movie {
  runtime: number | null;
  budget: number;
  revenue: number;
  tagline: string | null;
  credits: Credits;
}

/** What `useMovie`'s `select` hands to components. */
export interface MovieView extends MovieDetail {
  actors: CastMember[];
  directors: CrewMember[];
}
