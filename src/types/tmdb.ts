/**
 * Hand-written TMDB types for this app.
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
  media_type?: 'movie';
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  media_type?: 'tv';
}

export type MediaItem = (Movie | TVShow) & { media_type?: 'movie' | 'tv' };

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

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority?: number;
}

export interface WatchProvidersResult {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  ads?: WatchProvider[];
}

export interface WatchProvidersResponse {
  id: number;
  results: Record<string, WatchProvidersResult>;
}

export interface MovieDetail extends Movie {
  runtime: number | null;
  budget: number;
  revenue: number;
  tagline: string | null;
  credits: Credits;
  'watch/providers'?: WatchProvidersResponse;
}

export interface MovieView extends MovieDetail {
  actors: CastMember[];
  directors: CrewMember[];
}

export interface TVSeasonSummary {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export interface TVDetail {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string | null;
  vote_average: number;
  vote_count: number;
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  tagline: string | null;
  genres: { id: number; name: string }[];
  seasons: TVSeasonSummary[];
  credits: Credits;
  'watch/providers'?: WatchProvidersResponse;
}

export interface TVView extends TVDetail {
  actors: CastMember[];
  directors: CrewMember[];
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  air_date: string | null;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  vote_average: number;
  runtime: number | null;
}

export interface SeasonDetail {
  _id: string;
  air_date: string | null;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
}
