# DevThread project

## Purpose

Provide a repository-native Agent Skill that helps developers understand current project state, maintain a lightweight plan, reconcile work with code evidence, and resume across agent sessions.

## Users

Student developers, solo developers, and small teams using AI coding agents.

## Current State

Milestones 1 through 3 are implemented and tested in this working tree. Separate Codex chats discovered the installed skill, completed a read-only `understand` assessment, and recovered this saved map. This chat exercised the remaining workflows on new and existing example projects. Milestone 4 has a local Blueprint landing page and MDX docs with a passing static build. Its review and verification limits are recorded in `reports/TASK-004-verification.md`.

The user created `https://github.com/kurarensu16/devthread.git` and approved the initial commit and push. Source commit `d160615ec36ab7645e6de8493389efc955409fba` was pushed to `origin/master` on 2026-10-11. The website tracks its canonical URL in `website/site.config.json`. GitHub Actions run `38134927423` passed all seven jobs. Source upload is complete; npm publication and website deployment remain pending.

The user approved the DevThread rename. Current branding, skill source, and active maps use the new name. Earlier reports retain the DevMap name as historical evidence. Renamed scripts pass 15 tests, including legacy-state preservation. Fresh-chat discovery under `$devthread` is pending; prior sessions only established `$devmap` discovery.

TASK-006 is in review. The installed-copy update was declined at the filesystem permission step; `C:/Users/sadia/.codex/skills/devmap` still contains the original installed skill, and no installed `devthread` directory exists. Use the current repository skill source until installation is updated. See `reports/TASK-006-verification.md`.

TASK-007 adds the user-approved npm package and Node installer for Windows, Linux, and macOS. Eleven installer/package tests and fifteen Python tests pass locally on Windows. Native CI passed installer/package and Python suites on all three OSes with Node 22/24 and Python 3.13, plus website checks on Linux. The package is prepared and unpublished. Fresh `$devthread` discovery remains pending; the user's installed skill was not changed by temporary tests. See `reports/TASK-007-verification.md` and `reports/TASK-007-ci.md`.

## Constraints

- v1 has no dashboard, SaaS backend, user accounts, DevThread-owned model API, or automatic deployment.
- Existing project files and instructions must be preserved.
- Verification claims require recorded checks; source inspection alone does not prove runtime behavior.
- MIT was selected by the user. Publishing and release remain subject to approval.
