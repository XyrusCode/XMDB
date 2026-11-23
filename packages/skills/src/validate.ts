/**
 * Skill-set validation.
 *
 * Hard errors (fail CI): malformed metadata, name/dir mismatch, duplicate
 * names, references that do not resolve on disk.
 *
 * Stale checks are deliberately conservative — they compare last-commit
 * timestamps from git and only flag a skill when BOTH the skill file and the
 * referenced doc are tracked AND the doc was committed later than the skill.
 * Shallow clones, untracked files, missing git → check is skipped, never
 * guessed. Staleness surfaces as warnings so a docs-only change can't block a
 * release on its own.
 */

import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { listLocalSkills, type SkillRecord } from './scan';

const execFileAsync = promisify(execFile);

export interface ValidationIssue {
  skill: string;
  message: string;
}

export interface ValidationResult {
  errors: ValidationIssue[];
  stale: ValidationIssue[];
}

async function gitTimestamp(repoRoot: string, path: string): Promise<number | null> {
  try {
    const { stdout } = await execFileAsync('git', [
      '-C',
      repoRoot,
      'log',
      '-1',
      '--format=%ct',
      '--',
      path,
    ]);
    const value = Number.parseInt(stdout.trim(), 10);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null; // git unavailable, or history too shallow — skip conservatively
  }
}

/** `true` only when both timestamps are known and the doc is strictly newer. */
export function isStale(skillTime: number | null, docTime: number | null): boolean {
  if (skillTime === null || docTime === null) return false;
  return docTime > skillTime;
}

/** Repo root via git, resolved from this file's directory. */
async function findRepoRoot(): Promise<string | null> {
  try {
    const pkgDir = dirname(fileURLToPath(import.meta.url));
    const { stdout } = await execFileAsync('git', ['-C', pkgDir, 'rev-parse', '--show-toplevel']);
    const root = stdout.trim();
    return root || null;
  } catch {
    return null;
  }
}

export async function validateSkillSet(
  skills?: SkillRecord[],
  repoRootOverride?: string,
): Promise<ValidationResult> {
  const errors: ValidationIssue[] = [];
  const stale: ValidationIssue[] = [];
  const skillsToCheck = skills ?? (await listLocalSkills());
  const repoRoot = repoRootOverride ?? (await findRepoRoot());

  if (skillsToCheck.length === 0) {
    errors.push({ skill: '<set>', message: 'no skills found' });
    return { errors, stale };
  }

  const seen = new Map<string, string>();
  for (const skill of skillsToCheck) {
    const { name, references } = skill.frontmatter;

    if (name !== skill.dirName) {
      errors.push({
        skill: name,
        message: `frontmatter name "${name}" does not match directory "${skill.dirName}"`,
      });
    }

    const previous = seen.get(name);
    if (previous) {
      errors.push({ skill: name, message: `duplicate skill name (also in ${previous})` });
    }
    seen.set(name, skill.dirName);

    for (const ref of references) {
      if (repoRoot && !existsSync(join(repoRoot, ref))) {
        errors.push({ skill: name, message: `reference does not exist: ${ref}` });
      }
    }

    if (!repoRoot) continue;
    const skillPath = relative(repoRoot, skill.path).split(sep).join('/');
    const skillTime = await gitTimestamp(repoRoot, skillPath);
    for (const ref of references) {
      const docTime = await gitTimestamp(repoRoot, ref);
      if (isStale(skillTime, docTime)) {
        stale.push({
          skill: name,
          message: `referenced doc changed after the skill last updated: ${ref} — review it`,
        });
      }
    }
  }

  return { errors, stale };
}
