---
id: TASK-005
title: "Complete release checks and seek approval"
status: done
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

- Assessment: verified for test execution, state validation, clean sample workflow, and claim audit. See `reports/TASK-005-verification.md` for recorded outcomes. All 11 npm tests, 15 Python tests, state validation, and clean installation checks pass locally. The approved v0.1.0 npm package is live and verified on the Windows registry. Prerequisite tasks TASK-004, TASK-006, and TASK-007 are reviewed as done. Git release tag v0.1.0 is prepared and awaits user approval.

## Notes/Blockers

All prerequisite tasks (TASK-004, TASK-006, TASK-007) are complete. Package v0.1.0 is published on npm. Git release tag `v0.1.0` approved and release checks passed. Milestone 5 and DevThread v1 release complete.
