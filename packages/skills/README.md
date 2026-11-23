# xmdb-skills

Agent skills (convention sets) for the [XMDB](https://github.com/XyrusCode/XMDB)
codebase: validated, reference-checked guidance that consumers load **without
executing any package code**.

## Why this package

Shared conventions (how XMDB talks to TMDB, how local library state works,
which TanStack library owns which concern) are useful to any agent working in
the repo — but only if they are *current*. This package ships them as
`SKILL.md` files with machine-checked metadata.

## Skill format

Each skill lives in `skills/<dir>/SKILL.md`:

```markdown
---
name: tmdb-client
description: How XMDB talks to TMDB — auth from env, single axios client, query hooks.
references:
  - src/api/client.ts
  - src/config/index.ts
---

Body starts here…
```

- `name` must equal the directory name.
- `description` is one line, shown when an agent decides which skill to load.
- `references` are repo-relative paths to the source docs the skill is about.
  Absolute paths and `..` are rejected.

Anything the parser cannot understand is a hard error — a skill with broken
metadata fails validation instead of loading half-correct.

## Guarantees

1. **No code execution.** Installed packages are only ever `readdir` /
   `readFile`d as markdown. Nothing is `import`ed, no `package.json` scripts
   run, no `main` entry is resolved. A dependency that would throw on import
   never gets the chance.
2. **Explicit selection.** `scanInstalledSkills` takes `allowlist` /
   `exclude`; `loadSkills(names)` returns only the guidance you asked for.
   REQUIRED

## Usage

```ts
import { loadSkills, scanInstalledSkills, validateSkillSet } from 'xmdb-skills';

// Find what's installed, without importing any of it
const installed = await scanInstalledSkills({ allowlist: ['xmdb-skills'] });

// Load only the guidance you need
const skills = await loadSkills(['tmdb-client', 'local-library']);
for (const s of skills) {
  console.log(s.frontmatter.name, '—', s.frontmatter.description);
}
```

## Validation

`validateSkillSet()` enforces:

- **Errors** (fail CI): malformed metadata, `name`/directory mismatch,
  duplicate names, `references` that do not resolve on disk, empty skill set.
- **Stale warnings** (never fail on their own): a reference file whose last
  git commit is *newer* than the skill's. The check is deliberately
  conservative — shallow clones, untracked files, or missing git skip it
  rather than guess.

Run it locally:

```sh
npm test          # includes the full validation suite
npm run typecheck # typechecks this package
```

## Editor hooks: convenience, not a security boundary

Editor/agent integrations (loading skills on prompt, auto-suggesting the
closest skill) are a **convenience layer**. They do not sandbox anything:

- Skill content is *text* — treat it like any other repo file you'd review
  before trusting. Validation checks structure and paths, not intent.
- The no-execution guarantee covers *this package's loader*; it does not
  make running skills inside your agent safe.
- If you need a real boundary, enforce it outside this package (agent
  permission prompts, sandboxed runtimes).

## License

MIT
