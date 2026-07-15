import { describe, expect, it } from 'vitest';
import { selectDirectors } from '@/queries/use-movie';
import type { CrewMember } from '@/types/tmdb';

const crew = (job: string, name: string): CrewMember => ({
  credit_id: `${job}-${name}`,
  id: name.length,
  name,
  job,
  department: 'Directing',
  profile_path: null,
});

describe('selectDirectors', () => {
  it('keeps only Directors, not the rest of the crew', () => {
    const result = selectDirectors([
      crew('Director', 'Frank Darabont'),
      crew('Producer', 'Niki Marvin'),
      crew('Director of Photography', 'Roger Deakins'),
    ]);
    expect(result.map((d) => d.name)).toEqual(['Frank Darabont']);
  });

  it('keeps co-directors', () => {
    const result = selectDirectors([crew('Director', 'Joel Coen'), crew('Director', 'Ethan Coen')]);
    expect(result).toHaveLength(2);
  });

  // MovieInfo reads directors.length unconditionally, so this must be [] and
  // never undefined.
  it('returns an empty list rather than undefined when nobody directed', () => {
    expect(selectDirectors([crew('Producer', 'Niki Marvin')])).toEqual([]);
  });
});
