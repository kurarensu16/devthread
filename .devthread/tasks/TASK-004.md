---
id: TASK-004
title: "Build landing page and documentation"
status: review
priority: medium
depends_on: [TASK-003]
requirements: [REQ-003]
---

## Goal

Publishable static-compatible landing page and docs that accurately describe tested DevThread behavior.

## Scope

Responsive site, installation guides, quick starts, workflow and format reference, example, troubleshooting, privacy, compatibility, and contributing documentation.

## Acceptance Criteria

- Website lint, typecheck, and build pass.
- Internal links and quick-start commands are checked.
- Compatibility and product claims match recorded evidence.
- GitHub CTA uses a real configured URL before publication.

## Relevant Files

`website/`, `docs/`, `README.md`.

## Evidence

- Assessment: likely for overall presentation and browser interaction; verified for compilation, static routes, local links, and the exercised documentation commands. `website/` has the Blueprint landing page and 23 MDX docs pages. See `reports/TASK-004-verification.md` for exact passed, failed, and not-run checks.
- Repository URL configuration and remote verification are recorded in `reports/TASK-004-repository-url.md`.
- Built-in installer, `npx skills add`, and manual installation guidance are documented with tested/untested limits in `reports/TASK-004-installation-options.md`; static checks pass.
- The 2026-10-12 landing/docs QA refinement, production build, exported link/search checks, palette contrast checks, and remaining manual review are recorded in `reports/TASK-004-ui-qa.md`.

## Notes/Blockers

TASK-003 is done. The browser tool's URL policy blocked visual inspection, so mobile, keyboard, theme, clipboard, and search-dialog behavior still need manual review. The source is pushed to the user-created GitHub repository, and the prior website CI job passed; the current refinement's CI result is recorded separately. Website deployment remains pending.
