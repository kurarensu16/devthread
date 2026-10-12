---
id: TASK-006
title: "Rename the project to DevThread"
status: review
priority: high
depends_on: []
requirements: [REQ-001, REQ-003]
---

## Goal

Use the user-selected DevThread name consistently in the skill, scripts, website, and current documentation.

## Scope

Rename the skill package and local maps, update product branding and commands, retain legacy state support, update the installed skill, and record verification. Preserve historical reports and existing project instructions.

## Acceptance Criteria

- Current branding and documented commands use DevThread, `devthread`, and `skill/devthread/`.
- New projects initialize `.devthread/`; existing `.devmap/` state is read in place without replacing user bytes.
- Ambiguous dual-state paths stop without writes.
- Script tests, skill packaging validation, website lint, typecheck, build, and local link checks pass.
- The installed skill files match the renamed source package.
- Historical verification reports and `AGENTS.md` files remain unchanged.

## Relevant Files

`skill/devthread/`, `website/`, `docs/`, `tests/`, `README.md`, `LICENSE`, `.devthread/`, and example maps.

## Evidence

- Assessment: verified for repository branding, state compatibility, packaging, static build, and local links. The 15 script tests and website checks pass. See `reports/TASK-006-verification.md` for exact outcomes and limits.
- The earlier installed-copy update was declined before execution. On 2026-10-12, after the user reported completing setup, all 19 files in `C:/Users/sadia/.agents/skills/devthread` matched the repository source. The new name is available in this chat and its installed manifest was loaded. A separate fresh-chat workflow output has not been independently reviewed. See `reports/TASK-007-publication-preflight.md`.

## Notes/Blockers

The user created `https://github.com/kurarensu16/devthread.git`; it is configured as local `origin` and in the website. The initial source upload is complete. No domain or npm package was reserved, purchased, or published. The workspace folder remains `C:/Users/sadia/DevMap` so existing workspace references remain valid. The renamed skill is now installed in `C:/Users/sadia/.agents/skills/devthread`. The earlier declined operation was not retried, and this agent did not replace the old `.codex/skills/devmap` copy.
