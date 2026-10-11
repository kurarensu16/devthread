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

- Assessment: likely for release readiness. CI is implemented in `.github/workflows/checks.yml`; local npm and Python checks pass as recorded in `reports/TASK-007-verification.md`. Remote CI, native Linux/macOS execution, fresh-agent discovery, the remaining review gates, and publication are pending.

## Notes/Blockers

Depends on the landing page and documentation task. After the initial source upload, exercise the documented Codex `$skill-installer` and `npx skills add` routes and confirm `$devthread` discovery in a fresh chat. They are currently documented from source guidance and remain untested for DevThread.
