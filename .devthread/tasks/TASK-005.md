---
id: TASK-005
title: "Complete release checks and seek approval"
status: backlog
priority: medium
depends_on: [TASK-004, TASK-006, TASK-007]
requirements: [REQ-004]
---

## Goal

Make DevThread v1 ready for an approved public release.

## Scope

CI, clean installation, one complete sample workflow, privacy and claim review, and release approval.

## Acceptance Criteria

- CI and local checks pass with exact outcomes recorded.
- Clean-install instructions and sample workflow are reproducible.
- Unsupported claims and placeholders are removed.
- Tagging and publication occur only after user approval.

## Relevant Files

`.github/workflows/`, `README.md`, `website/`, `docs/`.

## Evidence

- Assessment: likely for full v1 release readiness. CI is implemented in `.github/workflows/checks.yml`; local npm and Python checks pass as recorded in `reports/TASK-007-verification.md`. Remote CI passed all six Windows/Linux/macOS and Node 22/24 combinations plus the website job; see `reports/TASK-007-ci.md`. The user-approved v0.1.0 npm package is published, and live registry installation passes on Windows; see `reports/TASK-007-publication.md`. Independent fresh-chat workflow review, the remaining website review gates, and website deployment remain pending.

## Notes/Blockers

Depends on the landing page and documentation task. Source upload and the approved v0.1.0 npm publication are complete. Additional Codex `$skill-installer` and `npx skills add` routes are documented from source guidance and remain untested for DevThread. New-name discovery is observed in this chat; review a separate fresh-chat workflow before describing recovery under the new name as tested. Website deployment requires its own approval and outstanding manual review.
