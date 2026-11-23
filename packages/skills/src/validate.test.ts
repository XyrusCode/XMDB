import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { isStale, validateSkillSet } from './validate';
import { listLocalSkills } from './scan';
import { parseFrontmatter } from './frontmatter';
import type { SkillRecord } from './scan';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

describe('isStale', () => {
  it('flags only when the doc is strictly newer and both times are known', () => {
    expect(isStale(100, 101)).toBe(true);
    expect(isStale(100, 100)).toBe(false);
    expect(isStale(101, 100)).toBe(false);
    expect(isStale(null, 100)).toBe(false);
    expect(isStale(100, null)).toBe(false);
    expect(isStale(null, null)).toBe(false);
  });
});

describe('validateSkillSet', () => {
  it('accepts the shipped skill set', async () => {
    const skills = await listLocalSkills();
    expect(skills.length).toBeGreaterThanOrEqual(3);
    const result = await validateSkillSet(skills, repoRoot);
    expect(result.errors).toEqual([]);
  });

  it('rejects an empty skill set', async () => {
    const result = await validateSkillSet([], '/tmp');
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]?.message).toContain('no skills found');
  });

  it('rejects name/dir mismatch and duplicate names', async () => {
    const make = (dirName: string, name: string): SkillRecord => ({
      packageName: 'xmdb-skills',
      dirName,
      path: `/repo/packages/skills/skills/${dirName}/SKILL.md`,
      frontmatter: parseFrontmatter(`---\nname: ${name}\ndescription: d\n---\nb`).frontmatter,
      body: 'b',
    });
    const result = await validateSkillSet([make('one', 'wrong'), make('two', 'wrong')], '/tmp');
    const messages = result.errors.map((e) => e.message);
    expect(messages.some((m) => m.includes('does not match directory'))).toBe(true);
    expect(messages.some((m) => m.includes('duplicate'))).toBe(true);
  });

  it('rejects references that do not exist on disk', async () => {
    const record: SkillRecord = {
      packageName: 'xmdb-skills',
      dirName: 'ghost',
      path: '/repo/packages/skills/skills/ghost/SKILL.md',
      frontmatter: parseFrontmatter(
        '---\nname: ghost\ndescription: d\nreferences:\n  - definitely/not/a/file.ts\n---\nb',
      ).frontmatter,
      body: 'b',
    };
    const result = await validateSkillSet([record], repoRoot);
    expect(result.errors.some((e) => e.message.includes('reference does not exist'))).toBe(true);
  });
});
