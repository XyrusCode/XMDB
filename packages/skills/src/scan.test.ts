import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadSkills, scanInstalledSkills } from './scan';

let root: string;

async function makePackage(
  pkg: string,
  skills: Array<{ dir: string; name: string; description: string; valid?: boolean }>,
) {
  for (const skill of skills) {
    const dir = join(root, 'node_modules', pkg, 'skills', skill.dir);
    await mkdir(dir, { recursive: true });
    const content =
      skill.valid === false
        ? 'not frontmatter'
        : [
            '---',
            `name: ${skill.name}`,
            `description: ${skill.description}`,
            'references:',
            '  - src/api/client.ts',
            '---',
            `Body for ${skill.name}.`,
          ].join('\n');
    await writeFile(join(dir, 'SKILL.md'), content);
  }
}

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'xmdb-skills-'));
});

afterEach(async () => {
  await rm(root, { recursive: true, force: true });
});

describe('scanInstalledSkills', () => {
  it('returns nothing without any skill packages', async () => {
    await expect(scanInstalledSkills({ cwd: root })).resolves.toEqual([]);
  });

  it('finds skills in regular and scoped packages, skipping malformed ones', async () => {
    await makePackage('pkg-a', [{ dir: 'alpha', name: 'alpha', description: 'A' }]);
    await makePackage('@scope/pkg-b', [{ dir: 'beta', name: 'beta', description: 'B' }]);
    await makePackage('pkg-bad', [{ dir: 'broken', name: 'x', description: 'x', valid: false }]);

    const found = await scanInstalledSkills({ cwd: root });
    const names = found.map((r) => r.frontmatter.name).sort();
    expect(names).toEqual(['alpha', 'beta']);
    expect(found.map((r) => r.packageName).sort()).toEqual(['@scope/pkg-b', 'pkg-a']);
  });

  it('ignores packages without a skills directory', async () => {
    await mkdir(join(root, 'node_modules', 'plain-pkg'), { recursive: true });
    await expect(scanInstalledSkills({ cwd: root })).resolves.toEqual([]);
  });

  it('applies the allowlist and lets exclude win over it', async () => {
    await makePackage('pkg-a', [{ dir: 'alpha', name: 'alpha', description: 'A' }]);
    await makePackage('pkg-b', [{ dir: 'beta', name: 'beta', description: 'B' }]);

    const allowed = await scanInstalledSkills({ cwd: root, allowlist: ['pkg-a'] });
    expect(allowed.map((r) => r.packageName)).toEqual(['pkg-a']);

    const excluded = await scanInstalledSkills({
      cwd: root,
      allowlist: ['pkg-a', 'pkg-b'],
      exclude: ['pkg-a'],
    });
    expect(excluded.map((r) => r.packageName)).toEqual(['pkg-b']);
  });
});

describe('loadSkills', () => {
  it('returns only the requested guidance', async () => {
    await makePackage('pkg-a', [
      { dir: 'alpha', name: 'alpha', description: 'A' },
      { dir: 'gamma', name: 'gamma', description: 'G' },
    ]);
    const loaded = await loadSkills(['gamma'], { cwd: root });
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.frontmatter.name).toBe('gamma');
    expect(loaded[0]?.body).toContain('Body for gamma.');
  });
});
