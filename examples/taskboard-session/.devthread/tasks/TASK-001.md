---
id: TASK-001
title: "Add and list tasks"
status: done
priority: medium
depends_on: []
requirements: [REQ-001]
---

## Goal

Store tasks with stable IDs and return the stored list.

## Scope

The JSON-backed functions in `src/taskboard.py`.

## Acceptance Criteria

- The first two added tasks receive IDs 1 and 2.
- Listing returns persisted task records.

## Relevant Files

`src/taskboard.py`, `tests/test_taskboard.py`.

## Evidence

- Assessment: verified. Source inspection found `add_task` and `list_tasks`; `python -m unittest discover -s tests -v` passed two tests before DevThread initialization.

## Notes/Blockers

This example explicitly reviews the existing behavior as done. It does not infer completion solely from file presence.
