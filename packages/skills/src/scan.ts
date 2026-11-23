/**
 * Skill discovery for consumers.
 *
 * Two guarantees, documented in the README as the package's contract:
 *
 * 1. No code execution — installed packages are only ever `readdir`/`readFile`d
 *    as markdown. Nothing is `import`ed, no `package.json` scripts run, no
 *    `main` entry is resolved. A dependency that would throw on import simply
 *    never gets the chance.
 * 2. Explicit selection — callers pass an allowlist/exclude pair, and only the
 *    guidance they asked for is returned. REQUIRED nothing is loaded.
 */

import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter, type SkillFrontmatter } from './frontmatter';

export interface SkillRecord {
  /** Package the skill was found in (e.g. `xmdb-skills`, `@scope/pkg`). */
  packageName: string;
  /** Skill directory name (`skills/<dir>/SKILL.md`). */
  dirName: string;
  /** Resolved path to the SKILL.md file. */
  path: string;
  frontmatter: SkillFrontmatter;
  body: string;
}

export interface ScanOptions {
  /** Directories that contain packages. Default: `['node_modules']`. */
  roots?: string[];
  /**
   * REQUIRED these packages are considered. Omitted = all packages
   * under `roots` (still subject to `exclude` and the presence of `skills/`).
   */
  allowlist?: string[];
  /** Package names never scanned, even if allowlisted. Wins over `allowlist`. */
  exclude?: string[];
  /** Base directory `roots` are resolved against. Default: `process.cwd()`. */
  cwd?: string;
}

/** Directory holding this package's own skills (works from `src/` and `dist/`). */
const LOCAL_SKILLS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'skills');

async function readSkillDir(packageName: string, skillsDir: string): Promise<SkillRecord[]> {
  let entries;
  try {
    entries = await readdir(skillsDir, { withFileTypes: true });
  } catch {
    return []; // no skills/ directory — not a skill package, not an error
  }

  const records: SkillRecord[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const path = join(skillsDir, entry.name, 'SKILL.md');
    let raw: string;
    try {
      raw = await readFile(path, 'utf8');
    } catch {
      continue; // directory without SKILL.md — ignored
    }
    try {
      const parsed = parseFrontmatter(raw);
      records.push({ packageName, dirName: entry.name, path, ...parsed });
    } catch {
      // A malformed skill in a third-party package must not break the whole
      // scan; our own set is held to standard by validateSkillSet().
    }
  }
  return records;
}

/** Package directories under a root, resolving `@scope/` one level deeper. */
async function packageDirs(rootDir: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(rootDir, { withFileTypes: true });
  } catch {
    return [];
  }
  const dirs: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('@')) {
      const scopeDir = join(rootDir, entry.name);
      const scoped = await readdir(scopeDir, { withFileTypes: true }).catch(() => []);
      for (const child of scoped) {
        if (child.isDirectory()) dirs.push(join(scopeDir, child.name));
      }
    } else {
      dirs.push(join(rootDir, entry.name));
    }
  }
  return dirs;
}

/** `.../node_modules/@scope/pkg` → `@scope/pkg`; `.../node_modules/pkg` → `pkg`. */
function packageNameOf(dir: string): string {
  const parts = dir.split(sep);
  const name = parts[parts.length - 1];
  const scope = parts[parts.length - 2];
  return scope.startsWith('@') ? `${scope}/${name}` : name;
}

/**
 * Scan installed packages for skills without executing any package code.
 */
export async function scanInstalledSkills(options: ScanOptions = {}): Promise<SkillRecord[]> {
  const { roots = ['node_modules'], allowlist, exclude = [], cwd } = options;
  const base = cwd ?? process.cwd();
  const found: SkillRecord[] = [];

  for (const root of roots) {
    for (const dir of await packageDirs(join(base, root))) {
      const name = packageNameOf(dir);
      if (allowlist && !allowlist.includes(name)) continue;
      if (exclude.includes(name)) continue;
      found.push(...(await readSkillDir(name, join(dir, 'skills'))));
    }
  }
  return found;
}

/**
 * Load only the named skills (by frontmatter `name`), from the given packages.
 * Guidance the caller did not ask for is never returned.
 */
export async function loadSkills(
  names: string[],
  options: ScanOptions = {},
): Promise<SkillRecord[]> {
  const wanted = new Set(names);
  const all = await scanInstalledSkills(options);
  return all.filter((record) => wanted.has(record.frontmatter.name));
}

/** This package's own skills, shipped beside the source in `skills/`. */
export async function listLocalSkills(): Promise<SkillRecord[]> {
  return (await readSkillDir('xmdb-skills', LOCAL_SKILLS_DIR)) ?? [];
}

/** A single local skill by name, or `null`. */
export async function loadLocalSkill(name: string): Promise<SkillRecord | null> {
  const skills = await listLocalSkills();
  return skills.find((record) => record.frontmatter.name === name) ?? null;
}
