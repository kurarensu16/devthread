# DevThread project

## Purpose

Provide a repository-native Agent Skill that helps developers understand current project state, maintain a lightweight plan, reconcile work with code evidence, and resume across agent sessions.

## Users

Student developers, solo developers, and small teams using AI coding agents.

## Current State

Milestones 1 through 3 are implemented and tested in this working tree. Separate Codex chats discovered the installed skill, completed a read-only `understand` assessment, and recovered this saved map. This chat exercised the remaining workflows on new and existing example projects. Milestone 4 has a local Blueprint landing page and MDX docs with a passing static build. Its review and verification limits are recorded in `reports/TASK-004-verification.md`.

The user created `https://github.com/kurarensu16/devthread.git` and approved the initial commit and push. Source commit `d160615ec36ab7645e6de8493389efc955409fba` was pushed to `origin/master` on 2026-10-11. The website tracks its canonical URL in `website/site.config.json`. The initial CI run and publication-preparation run `38198818302` passed all seven jobs. Source upload is complete, and the user-approved `devthread@0.1.0` is published on npm under `kurarens` with MIT. Website deployment remains pending.

The user approved the DevThread rename. Current branding, skill source, and active maps use the new name. Earlier reports retain the DevMap name as historical evidence. Renamed scripts pass 15 tests, including legacy-state preservation. Fresh-chat discovery under `$devthread` is pending; prior sessions only established `$devmap` discovery.

TASK-006 is in review. The earlier installed-copy update was declined at the filesystem permission step, as recorded in `reports/TASK-006-verification.md`. After the user reported completing setup, the new installed copy at `C:/Users/sadia/.agents/skills/devthread` was checked on 2026-10-12: all 19 resources match the repository. This chat discovers and loads the renamed skill. Independent review of a separate fresh-chat workflow remains pending; the original installed DevMap copy was not replaced by this agent.

TASK-007 adds the user-approved npm package and Node installer for Windows, Linux, and macOS. Eleven installer/package tests and fifteen Python tests pass locally on Windows. Native CI passed installer/package and Python suites on all three OSes with Node 22/24 and Python 3.13, plus website checks on Linux. The publication dry-run configuration fix is committed at `1b1cc5d`. On 2026-10-12, the user explicitly approved npm publication and the docs update, configured 2FA after npm's first E403 rejection, and completed the retry's browser authentication. Version 0.1.0 is now available as `latest`; the registry archive checksum and integrity match the approved 24-entry package. A fresh-cache Windows registry installation passes file fidelity, dry run, preservation, and installed Python init/validate/status checks. See `reports/TASK-007-publication.md` for commands and limits; earlier local, CI, and preflight reports remain historical evidence. Documentation now uses active npm commands and the observed `.agents/skills` discovery path.

The 2026-10-12 Milestone 4 refinement clarifies installation, host-agent workflow, saved artifacts, statuses, and Taskboard proof on the landing page and in the docs Introduction. Static docs search, 34 palette/grid contrast checks, and exported search-result validation pass. The local production build and link/release checks pass, as do all seven jobs in [GitHub Actions run 38217089869](https://github.com/kurarensu16/devthread/actions/runs/38217089869). See `reports/TASK-004-ui-qa.md` and `reports/TASK-004-ui-ci.md` for outcomes and the still-pending browser review. TASK-004 remains in review; no website deployment was made.

## Constraints

- v1 has no dashboard, SaaS backend, user accounts, DevThread-owned model API, or automatic deployment.
- Existing project files and instructions must be preserved.
- Verification claims require recorded checks; source inspection alone does not prove runtime behavior.
- MIT was selected by the user. Publishing and release remain subject to approval.
