/**
 * Minimal frontmatter parser for SKILL.md files.
 *
 * Deliberately not a YAML library: it understands exactly the shape our skills
 * use (scalar keys plus one optional list key). Anything it cannot parse is a
 * hard error rather than a silent guess — a skill with broken metadata should
 * fail validation, not load half-correct.
 */

export interface SkillFrontmatter {
  name: string;
  description: string;
  references: string[];
}

export interface ParsedSkill {
  frontmatter: SkillFrontmatter;
  body: string;
}

export class SkillFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SkillFormatError';
  }
}

const KEYS = new Set(['name', 'description', 'references']);

export function parseFrontmatter(raw: string): ParsedSkill {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  if (lines[0] !== '---') {
    throw new SkillFormatError('missing opening "---" frontmatter delimiter');
  }
  const close = lines.indexOf('---', 1);
  if (close === -1) {
    throw new SkillFormatError('missing closing "---" frontmatter delimiter');
  }

  const fields = new Map<string, string | string[]>();
  let listKey: string | null = null;

  for (const line of lines.slice(1, close)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const item = line.match(/^\s*-\s+(.*)$/);
    if (item && listKey) {
      const existing = fields.get(listKey);
      if (Array.isArray(existing)) existing.push(item[1]);
      continue;
    }

    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) {
      throw new SkillFormatError(`unparseable frontmatter line: ${line}`);
    }
    const [, key, value] = kv;
    if (!KEYS.has(key)) {
      throw new SkillFormatError(`unknown frontmatter key: ${key}`);
    }
    if (value === '') {
      listKey = key;
      fields.set(key, []);
    } else {
      listKey = null;
      fields.set(key, value);
    }
  }

  const name = fields.get('name');
  const description = fields.get('description');
  const references = fields.get('references');

  if (typeof name !== 'string' || !name.trim()) {
    throw new SkillFormatError('frontmatter "name" must be a non-empty scalar');
  }
  if (typeof description !== 'string' || !description.trim()) {
    throw new SkillFormatError('frontmatter "description" must be a non-empty scalar');
  }
  const refs =
    typeof references === 'string'
      ? [references]
      : (references ?? []).filter((r) => r.trim() !== '');
  for (const ref of refs) {
    if (ref.startsWith('/') || ref.includes('..')) {
      throw new SkillFormatError(`reference must be a repo-relative path without "..": ${ref}`);
    }
  }

  return {
    frontmatter: { name, description, references: refs },
    body: lines
      .slice(close + 1)
      .join('\n')
      .trim(),
  };
}
