# TASK-006 verification — DevThread rename

Date: 2026-10-11. Workspace: `C:/Users/sadia/DevMap`. The user approved proceeding with DevThread after name screening.

## Implemented changes

- Current product branding, landing page, docs, license attribution, package metadata, and documented commands use DevThread.
- The skill source moved from `skill/devmap/` to `skill/devthread/`; its manifest name is `devthread`.
- This repository's active map and its two example maps moved from `.devmap/` to `.devthread/`. Task IDs, statuses, and report filenames were retained.
- The scripts accept legacy `.devmap/` state in place and refuse ambiguous dual-state paths without writes. New projects initialize `.devthread/`.
- Original reports, prior decisions, fixture application files, and `AGENTS.md` files were excluded from text replacement. Old-name references remain where they document historical checks or legacy compatibility.
- Compatibility claims now distinguish prior DevMap chat tests from renamed script tests and pending `$devthread` discovery.

## Checks

| Exact command | Outcome | Supports and limits |
| --- | --- | --- |
| `python -m unittest discover -s tests -p 'test_*.py' -v` from the workspace root, outside the sandbox | Passed: 15 tests. | Existing script/workflow scenarios, legacy byte preservation, legacy status recovery, dual-state refusal, and existing legacy-file preservation. |
| `python skill/devthread/scripts/validate.py .` | Passed: 6-task state. | The moved project map validates. |
| `python skill/devthread/scripts/validate.py examples/new-project` | Passed: 1-task state. | The moved new-project example validates. |
| `python skill/devthread/scripts/validate.py examples/taskboard-session` | Passed: 2-task state. | The moved existing-project example validates. |
| `python skill/devthread/scripts/status.py examples/taskboard-session --json` | Passed: one done task, one review task, no eligible task. | Previously saved state is recovered with the renamed scripts. |
| Skill Creator `quick_validate.py` against `skill/devthread/` | Passed: `Skill is valid!` after supplying PyYAML from a temporary validation directory. | Manifest naming, frontmatter, and scaffold checks; not agent behavior. |
| `npm run lint` from `website/` | Passed. | Source lint and JSX accessibility rules. |
| `npm run typecheck` from `website/` | Passed. | MDX generation, route types, and TypeScript checks. |
| `npm run build` from `website/`, outside the sandbox | Passed. | Static production output with DevThread branding and updated docs. The same two nonfatal Fumadocs search-highlight CSS warnings remain. |
| `npm run check:links` from `website/` | Passed: 1,038 local links and anchors, plus basic document semantics, across 27 exported HTML files. | Exported local destinations and anchors; not external URL availability or browser interaction. |

The packaging validator was executed with the following temporary dependency setup. PyYAML was used only for this tooling check; it was not added to project dependencies or the skill runtime.

```powershell
$devthreadValidation = Join-Path $env:TEMP ('devthread-validation-' + [guid]::NewGuid())
python -m pip install --disable-pip-version-check --no-warn-script-location --target $devthreadValidation 'PyYAML>=6,<7'
python -X utf8 -c "import runpy, sys; sys.path.insert(0, sys.argv.pop(1)); script = sys.argv.pop(1); sys.argv[0] = script; runpy.run_path(script, run_name='__main__')" $devthreadValidation 'C:\Users\sadia\.codex\skills\.system\skill-creator\scripts\quick_validate.py' 'C:\Users\sadia\DevMap\skill\devthread'
```

## Preserved failures and limits

- The first two packaging validator attempts failed with `ModuleNotFoundError: No module named 'yaml'`, using the system and bundled Python respectively. The temporary PyYAML setup resolved this, and the actual bundled validator then passed.
- Initial registry/domain requests inside the sandbox failed at DNS resolution. The authorized read-only retry returned HTTP 404 for npm, PyPI, and the `.dev` RDAP record, and HTTP 200 for the `.com` RDAP record. `.io` remains unverified. Full lookup details are in `docs/NAMING.md`; these results are not reservations or purchase confirmations.
- **Installed-skill update: not run.** The execution request to rename and update `C:/Users/sadia/.codex/skills/devmap` was declined with `Rejected("rejected by user")` before the command started. Read-only checks afterward confirmed the DevMap directory still exists and the DevThread directory does not. The current installed copy therefore retains the old name and scripts.
- **Fresh-chat `$devthread` discovery: not run.** Installation under the new name is pending. Previous `$devmap` discovery and recovery checks remain historical evidence only. Until installation is updated, refer explicitly to the repository skill source rather than assuming `$devthread` is discoverable.
- **Visual browser review: not run.** The earlier preview inspection was rejected by the browser URL policy. This turn used source, build, and export checks; they do not establish runtime reflow or keyboard behavior.
- **Domain purchase, package publication, GitHub creation, commit, push, tag, and deployment: not run.** This was a local rename; the publication prerequisites remain open.

## Preservation evidence

The example and fixture Taskboard instructions still have SHA-256 `E332D03A7660F275F80A4A1A3475AE69145C3417D776F631C924D6459AC90C70`, matching the recorded baseline. The pre-existing fixture instructions remain unchanged, and the legacy initialization test verifies byte preservation for those instructions and saved user state. Historical reports were moved with their containing directories and excluded from content updates.

## Assessment

Repository branding, scripts, state compatibility, packaging, build output, and local links have passing checks. The rename remains in review because the installed-copy update was declined and new-name discovery is not established. The repository source is ready to install; no external publication occurred.
