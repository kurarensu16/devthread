# Architecture

## Observed Structure

- Root `package.json` and `package-lock.json` define the dependency-free npm package. `bin/devthread.mjs` exposes installation and `lib/install.mjs` handles arguments, native paths, and exclusive file copying.
- `tests/npm/` covers installer preservation and the actual npm archive; `.github/workflows/checks.yml` configures Windows/Linux/macOS package and Python checks, plus a website job.
- `skill/devthread/SKILL.md` routes natural-language workflows to focused references.
- `skill/devthread/templates/` contains Markdown templates for project state.
- `skill/devthread/LICENSE` carries the approved MIT notice into installed copies and is checked against the root license.
- `skill/devthread/scripts/` contains standard-library Python CLI tools for initialization, validation, and status.
- `docs/` records format, workflow, roadmap, compatibility, and test evidence.
- `tests/` contains script checks, workflow scenarios, and repository fixtures.
- A user-scoped DevMap copy is still installed at `C:/Users/sadia/.codex/skills/devmap`; the permission request to rename/update it was declined. The repository's `skill/devthread/` is the current source, and new-name discovery is pending.
- `website/` uses Next.js, TypeScript, Tailwind CSS, and Fumadocs/MDX. A custom landing page and statically generated docs share light/dark design tokens.
- `website/content/docs/` contains documentation sources; the production build exports routes and assets to `website/out/`.
- `website/site.config.json` tracks the real repository URL. `website/lib/site.ts` reads it with an optional `NEXT_PUBLIC_GITHUB_URL` override. `website/lib/repository-url.mjs` validates the URL for both the site and release configuration check. There is no website runtime backend.

## Inferences

- The static output is suitable for a static host, subject to publication configuration, manual visual review, and approval. Deployment has not been tested.
