---
id: TASK-003
title: "Exercise remaining workflows in live Codex use"
status: done
priority: high
depends_on: [TASK-002]
requirements: [REQ-002]
---

## Goal

Test the skill's remaining natural-language workflows on new and existing repository cases.

## Scope

Live `init`, `map`, `reconcile`, `next`, `implement`, `verify`, and `status` behavior, using disposable or carefully scoped project state.

## Acceptance Criteria

- The workflows produce valid state and evidence-based recommendations.
- Verification records exact passed, failed, or not-run checks.
- Files unrelated to the requested work are preserved.
- Compatibility notes distinguish tested behavior from untested claims.

## Relevant Files

`skill/devmap/`, `tests/fixtures/`, `docs/WORKFLOW_EVIDENCE.md`, `docs/COMPATIBILITY.md`.

## Evidence

- Assessment: verified for the tested Codex environment. In this live chat, DevMap initialized a new directory and an existing Python application, mapped both, reconciled source and test evidence, recommended dependency-valid tasks, implemented TASK-002 in a copied application, and recorded exact failed, passed, and not-run checks. Both example maps validate; the root suite passed 12 tests and the example application passed 4. See `docs/WORKFLOW_EVIDENCE.md` and `examples/taskboard-session/.devmap/reports/TASK-002-verification.md`.

## Notes/Blockers

Reviewed on 2026-10-11. This is one Codex environment on Windows with Python 3.13; other agents and platforms remain untested. The example implementation task remains in `review` to demonstrate that tests do not automatically set `done`.
