---
id: TASK-002
title: "Complete a task without changing its ID"
status: review
priority: high
depends_on: [TASK-001]
requirements: [REQ-002]
---

## Goal

Allow a stored task to be marked done while retaining its ID.

## Scope

Add a completion operation to `src/taskboard.py` and relevant tests. Keep JSON storage and standard-library dependencies.

## Acceptance Criteria

- Completing an existing ID sets its `done` field to true and preserves its ID.
- Other tasks remain unchanged.
- An unknown ID raises a clear error without changing stored data.
- The relevant test command passes.

## Relevant Files

`src/taskboard.py`, `tests/test_taskboard.py`.

## Evidence

- Assessment before implementation: missing. A bounded `rg` search over `src/` and `tests/` found no `complete_task` or `def complete`; only initial `done: False` data was present. The existing two tests covered add/list, not completion.
- Assessment after implementation: verified for the stated acceptance checks. The completion tests and baseline tests passed; see `reports/TASK-002-verification.md` for exact outcomes and limits.

## Notes/Blockers

TASK-001 is done. This task moved to `review` after implementation and checks. It has not been automatically marked `done`.
