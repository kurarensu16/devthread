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

- Assessment: verified for Windows installer behavior, archive fidelity, Python script execution, and static documentation checks. Eleven npm tests and fifteen Python tests pass locally. Native Linux/macOS and Node 24 checks are configured in CI and have not run. See `reports/TASK-007-verification.md` for exact commands, failures, and limits.

## Notes/Blockers

The user approved adding the npm packaging task and requested Windows, Linux, and macOS availability. Actual Linux/macOS test execution depends on available hosts or CI after source upload. Fresh Codex discovery, registry publication, and release remain separate checks.
