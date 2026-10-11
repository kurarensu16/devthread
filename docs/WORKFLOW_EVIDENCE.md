# Milestone 3 workflow exercise

Run `python -m unittest discover -s tests -p 'test_*.py' -v` from the repository root. `tests/test_workflow_scenarios.py` copies fixtures into temporary directories and runs the DevMap scripts as fresh Python processes. It does not install or invoke the skill in a separate coding-agent session.

## New project

The new-project scenario starts with an empty directory. `init.py --dry-run` leaves it unchanged. `init.py` creates version 1 state, `validate.py` accepts it, and `status.py --json` reports zero tasks.

## Existing application

The `taskboard` fixture is a small JSON-backed Python application with existing `AGENTS.md`, source, manifest, documentation, and tests. The scenario follows these steps in a temporary copy:

| Workflow | Recorded result |
|---|---|
| `init` | Created missing `.devmap/` state while retaining `AGENTS.md` and application files. |
| `understand` | Recorded observed add/list behavior and the absence of a completion operation; labeled an architecture inference. |
| `map` | Created `REQ-001`, `REQ-002`, and stable `TASK-001`/`TASK-002` with a dependency. |
| `reconcile` | Marked existing add/list behavior `verified` after two passing tests; marked completion `missing` after inspecting `src/taskboard.py`. |
| `next` | `status.py --json` selected `TASK-002` as the sole eligible ready task. |
| `implement` | Added a completion operation to the temporary application copy after observing a failing acceptance check. |
| `verify` | The exact command `python -m unittest discover -s tests -v` failed before implementation because `complete_task` was absent, then passed with three tests after implementation. A verification report recorded both outcomes and a concurrency limitation. |
| `status` | A new process read the saved state: one `done`, one `review`, and no eligible ready task. `TASK-002` was not automatically marked `done`. |

This is a reproducible local exercise of state and script behavior. By itself, it does not establish that a coding agent selects the skill, applies every workflow correctly, or recovers context in a new agent session. The live check below covers only discovery and `understand`.

## Fresh Codex chat

A separate Codex chat was created on this repository for a read-only `$devmap` `understand` request. It loaded the installed `SKILL.md` and `references/repository-analysis.md`, inspected repository files and Git state, separated observed facts from inference, and reported missing root `.devmap/` state. Git status was unchanged before and after. This confirms fresh-chat skill discovery and the `understand` behavior on the DevMap repository. At that point, the repository had no root `.devmap/` state, so this first chat did not test recovery of saved context.

## Saved-state recovery in another fresh chat

After initializing this repository's root `.devmap/` map with five tasks, a second separate Codex chat was asked for project status and the next task without naming an expected ID. It read the installed skill, status and planning references, project map, and task files; `validate.py .` and `status.py .` exited 0. It identified TASK-002 as the sole eligible task based on TASK-001 being done and TASK-003 depending on TASK-002. Git status matched before and after. The chat's final answer gave limited detail about evidence levels; the later live exercise below explicitly distinguishes verified and missing evidence. The detailed recovery check is in `.devmap/reports/TASK-002-verification.md`.

## Live Codex workflows on examples

In this Codex chat, `examples/new-project/` began as an empty directory. A dry run made no files; initialization created `.devmap/`; mapping recorded one ready task. Validation passed and status selected TASK-001. Its implementation evidence remains `missing`, and the example makes no claim that a language or behavior has already been chosen.

`examples/taskboard-session/` was copied from an existing Python application with `AGENTS.md`. The live workflow read those instructions, preserved their SHA-256 hash, initialized DevMap, mapped two requirements and tasks, and reconciled source with the baseline two passing tests. A bounded source/test search found no completion operation, so TASK-002 was initially `missing` and was selected as the sole ready task after its verified dependency.

An acceptance test then failed with `ImportError: cannot import name 'complete_task'`. The completion function was implemented in the example copy. `python -m unittest discover -s tests -v` passed four tests afterward. The report at `examples/taskboard-session/.devmap/reports/TASK-002-verification.md` records exact passed, failed, and not-run outcomes. Final validation passed, and status showed TASK-002 in `review` with no eligible ready task. The original fixture was not changed. The root repository test command `python -m unittest discover -s tests -p 'test_*.py'` passed 12 tests.

These observations support Codex compatibility in the tested local Windows and Python 3.13 environment. Other agents, operating systems, and Python versions remain untested.
