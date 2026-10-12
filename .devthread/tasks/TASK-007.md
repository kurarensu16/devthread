---
id: TASK-007
title: "Package an npm installer for Windows, Linux, and macOS"
status: review
priority: high
depends_on: [TASK-001]
requirements: [REQ-004, REQ-005]
---

## Goal

Offer a dependency-free npm installer that places the complete DevThread skill in the selected local directory on Windows, Linux, and macOS.

## Scope

Root npm package, Node CLI, preservation and package tests, OS CI matrix, installation docs, and verification evidence. Publishing remains a separate approved release action.

## Acceptance Criteria

- `devthread install` supports project, global, custom destination, and dry-run options with native paths.
- Existing files, directories, and linked destinations are refused without replacement.
- The npm archive contains the complete skill and installer, excluding website dependencies, private project state, and Python caches.
- A packed-package installation can run the bundled Python scripts on the available host.
- CI checks the installer and Python scripts on Windows, Linux, and macOS; configured checks are distinguished from executed results.
- Documentation includes prerequisites and separates tested OS behavior from pending checks and unpublished registry commands.
- No runtime npm dependencies or automatic publication are introduced.

## Relevant Files

`package.json`, `bin/`, `lib/`, `tests/npm/`, `.github/workflows/`, `README.md`, `website/content/docs/`, and `docs/COMPATIBILITY.md`.

## Evidence

- Assessment: verified for installer behavior, archive fidelity, Python script execution, and static documentation checks in the recorded environments. Eleven npm tests and fifteen Python tests pass locally on Windows. Native CI passed on Windows, Linux, and macOS with Node 22/24 and Python 3.13, plus the website job. See `reports/TASK-007-verification.md` for local commands, failures, and limits, and `reports/TASK-007-ci.md` for remote outcomes.
- Publication preparation: the final `npm publish --dry-run` passes all 11 npm tests after fixing inherited dry-run configuration in nested test operations. The 24-entry v0.1.0 archive is prepared; login as `kurarens` and absence of a published package record are confirmed. See `reports/TASK-007-publication-preflight.md` for commands, the initial failure, artifact integrity, and limits.

## Notes/Blockers

The user approved adding the npm packaging task, requested Windows, Linux, and macOS availability, and approved the source commit and push. Native OS CI is complete and passing. New-name discovery is observed in this chat after user setup; independent fresh-chat workflow review remains separate. Source corrections follow that existing authorization; registry publication requires specific approval. This task remains in review awaiting acceptance.
