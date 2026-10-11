# DevThread state format — version 1

DevThread stores reviewable project state in `.devthread/` at the root of the user's repository. Markdown is the source for human-readable decisions and plans; JSON stores configuration. The format is designed to be committed to Git. It must not contain secrets or raw private model transcripts.

DevThread was previously named DevMap. Existing `.devmap/` state uses the same version 1 content format and is supported in place by all scripts. Initialization fills missing legacy files without creating a second map. If both `.devthread` and `.devmap` paths exist, all scripts stop with an ambiguity error; neither state is silently selected or merged.

```text
.devthread/
  config.json
  PROJECT.md
  REQUIREMENTS.md
  ARCHITECTURE.md
  ROADMAP.md
  DECISIONS.md
  tasks/TASK-001.md
  reports/TASK-001-verification.md
```

## Configuration

`config.json` is a JSON object with a required integer `schemaVersion`, currently `1`. Other fields are optional and must be preserved by tools that update the file. An unknown future schema version is an error for validation and a stop condition for mutation, rather than permission to guess its meaning.

```json
{
  "schemaVersion": 1
}
```

Initialization creates missing files and directories only. It never replaces existing files, including `AGENTS.md` and partially populated `.devthread/` state. A repeat run must leave existing file contents unchanged. If existing state is malformed, report it; do not silently repair or erase it.

Initialization includes empty `.gitkeep` markers in `tasks/` and `reports/` so the directory layout survives a Git clone before either directory contains a task or report.

## Project documents

`PROJECT.md` records the project's purpose, users, current state, and known constraints. `REQUIREMENTS.md` holds requirement entries headed `## REQ-001: Title`. `ARCHITECTURE.md` records observed structure and explicitly labeled inferences. `ROADMAP.md` groups milestones and references task IDs. `DECISIONS.md` records meaningful decisions and changes without erasing prior approved decisions. A document may say that information is unknown; do not invent facts to fill sections.

Requirement IDs match `REQ-[0-9]{3,}` and are unique. IDs are stable once assigned. When adding an ID, use one greater than the highest existing numeric suffix; do not recycle a deleted ID. Apply the same allocation rule to task IDs.

## Task files

Each task is `.devthread/tasks/TASK-<number>.md` with an ID matching `TASK-[0-9]{3,}`. The filename and frontmatter ID must match. Frontmatter is delimited by `---` on its own lines and contains these required fields:

```yaml
---
id: TASK-001
title: "Implement login form"
status: ready
priority: medium
depends_on: []
requirements: ["REQ-001"]
---
```

To keep scripts dependency-free, version 1 supports a deliberately small YAML subset: one `key: value` per line, unique keys, plain or JSON-quoted string values, and inline lists of simple unquoted IDs or JSON-quoted strings. No nested objects, block strings, aliases, multiline values, or comments within values. Titles containing `:` or `#` must be JSON-quoted. Unknown keys with valid subset values are allowed and must be preserved when a tool edits the task.

The body has these level-two sections, each exactly once: `Goal`, `Scope`, `Acceptance Criteria`, `Relevant Files`, `Evidence`, and `Notes/Blockers`. `Relevant Files` may say `Unknown`. Evidence entries identify what was observed and where; source references and agent assertions do not count as passing checks. Verification reports record exact commands, results (`passed`, `failed`, or `not run`), and a reason when not run.

`status` is one of `backlog`, `ready`, `in_progress`, `blocked`, `review`, or `done`. `priority` is `low`, `medium`, or `high`. `depends_on` lists task IDs; `requirements` lists IDs defined in `REQUIREMENTS.md`. Both lists contain unique IDs. Dependencies must exist, cannot refer to the task itself, and cannot form cycles. A task may be `ready` only when all dependencies are `done`; scripts flag inconsistent state rather than changing it automatically.

| Status | Meaning |
|---|---|
| `backlog` | Defined but not ready to start. |
| `ready` | Eligible to start; dependencies are done. |
| `in_progress` | Work is underway. |
| `blocked` | A stated impediment prevents progress. |
| `review` | Implementation is awaiting review or verification. |
| `done` | Acceptance criteria have been explicitly reviewed and status updated. |

Changing code never automatically changes a task to `done`. A verification failure remains visible even if the task status was previously `done`; reconciliation should flag the drift for review.

## Evidence and reconciliation

Evidence level is an assessment of implementation support, **separate from task status**. Reconciliation records a level and rationale in the task's `Evidence` section or a linked report. It does not infer task completion from a filename or an agent's prior claim.

| Level | Criteria |
|---|---|
| `verified` | Relevant acceptance criteria have recorded passing checks or review results, with exact evidence and no known contradictory result. |
| `likely` | Relevant implementation is visible in source, but runtime behavior or acceptance criteria have not been verified. |
| `missing` | A bounded search found no implementation evidence for the stated requirement or task. |
| `blocked` | A named impediment prevented obtaining the needed evidence. This is an evidence assessment, not the task's workflow status. |
| `unknown` | Available information does not justify another level. |

Inspection of source does not prove runtime behavior. Record a check as `not run` with its reason when it cannot execute. If evidence conflicts, describe the conflict and use `unknown` until it is resolved; do not calculate a completion percentage from ambiguous evidence.

## Next-task selection

The `next` workflow considers tasks with `status: ready` whose dependency tasks are all `done`. Recommend the highest-priority eligible task, breaking ties by numeric task ID, and explain the dependency and evidence basis. If no task qualifies, report why rather than inventing one. The recommendation is advisory; it does not change status.
