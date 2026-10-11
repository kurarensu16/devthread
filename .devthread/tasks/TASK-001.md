---
id: TASK-001
title: "Establish DevMap format, skill, and local scripts"
status: done
priority: high
depends_on: []
requirements: [REQ-001]
---

## Goal

Create a safe repository-native foundation for DevMap v1.

## Scope

Specification, MIT license, skill references and templates, Python init/validate/status scripts, fixtures, and script tests.

## Acceptance Criteria

- Initialization preserves existing files and supports dry-run.
- Validation reports malformed tasks, missing references, and cycles.
- Status reports factual counts and dependency-valid ready tasks.
- The skill has a short entry point and focused references.

## Relevant Files

`docs/FORMAT.md`, `docs/WORKFLOWS.md`, `skill/devmap/`, `tests/`.

## Evidence

- Assessment: verified. `python -m unittest discover -s tests -p 'test_*.py'` passed 12 tests on 2026-10-11, including initialization, validation, status, and local workflow scenarios.
- The skill entry point and references were inspected; a fresh Codex chat loaded the installed copy and completed the read-only `understand` workflow.
- The skill-creator `quick_validate.py` check was not run successfully because its Python environment lacks PyYAML. Manual frontmatter and reference-link checks passed.

## Notes/Blockers

The skill's broader live behavior is tracked separately in Milestone 3.
