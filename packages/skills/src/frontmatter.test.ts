import { describe, expect, it } from 'vitest';
import { parseFrontmatter, SkillFormatError } from './frontmatter';

const wrap = (body: string) => `---\n${body}\n---\n# Skill`;

describe('parseFrontmatter', () => {
  it('parses scalar keys and a references list', () => {
    const parsed = parseFrontmatter(
      wrap(
        [
          'name: tmdb-client',
          'description: How XMDB talks to TMDB.',
          'references:',
          '  - src/api/client.ts',
          '  - src/config/index.ts',
        ].join('\n'),
      ),
    );
    expect(parsed.frontmatter).toEqual({
      name: 'tmdb-client',
      description: 'How XMDB talks to TMDB.',
      references: ['src/api/client.ts', 'src/config/index.ts'],
    });
    expect(parsed.body).toBe('# Skill');
  });

  it('defaults references to an empty list', () => {
    const parsed = parseFrontmatter(wrap('name: bare\ndescription: no refs'));
    expect(parsed.frontmatter.references).toEqual([]);
  });

  it('accepts references as a single scalar', () => {
    const parsed = parseFrontmatter(wrap('name: s\ndescription: d\nreferences: src/a.ts'));
    expect(parsed.frontmatter.references).toEqual(['src/a.ts']);
  });

  it('normalizes CRLF line endings', () => {
    const parsed = parseFrontmatter('---\r\nname: x\r\ndescription: y\r\n---\r\nbody');
    expect(parsed.frontmatter.name).toBe('x');
    expect(parsed.body).toBe('body');
  });

  it.each([
    ['missing opening delimiter', 'name: x\n---'],
    ['missing closing delimiter', '---\nname: x'],
    ['unknown key', '---\nname: x\ndescription: y\nextra: z\n---'],
    ['missing name', '---\ndescription: y\n---'],
    ['missing description', '---\nname: x\n---'],
    ['absolute reference', '---\nname: x\ndescription: y\nreferences: /etc/passwd\n---'],
    ['parent traversal', '---\nname: x\ndescription: y\nreferences: ../../secrets\n---'],
    ['unparseable line', '---\nname: x\ndescription: y\n???\n---'],
  ])('rejects %s', (_label, raw) => {
    expect(() => parseFrontmatter(raw)).toThrow(SkillFormatError);
  });
});
