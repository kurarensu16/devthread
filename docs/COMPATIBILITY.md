# Compatibility status

| Host | Packaging | Workflow test | Status |
|---|---|---|---|
| Codex on Windows with Python 3.13 | `SKILL.md` frontmatter and supporting directory match [official OpenAI skill guidance](https://developers.openai.com/blog/eval-skills). A local user-scoped copy was installed and its files checked. | The scripts and process-level exercise pass. Separate Codex chats completed `understand` and recovered saved state with `status` and `next`. This chat exercised `init`, `map`, `reconcile`, `next`, `implement`, `verify`, and `status` on new and existing examples. | Tested in this environment; no universal compatibility claim. |
| Other coding agents | Not checked against host documentation. | Not run. | Untested. |

The current skill is self-contained in `skill/devthread/`; copying only `SKILL.md` would omit references, templates, and scripts. Other Python versions and coding agents remain untested. Installer OS checks are tracked separately below.

## npm installer and OS checks

The root npm package uses Node's built-in modules, requires Node 22+, and targets Windows, Linux, and macOS without native binaries or runtime dependencies. It supports project, global, custom-directory, and dry-run installation with preservation of existing destinations. [`devthread@0.1.0` is published on npm](https://www.npmjs.com/package/devthread/v/0.1.0) under MIT; its archive integrity matches the approved local artifact.

| OS | Installer and scripts | Agent discovery |
| --- | --- | --- |
| Windows, Node 22.18.0 and Python 3.13 | 11 npm tests pass; live registry `npx` installation additionally verifies all 19 files, dry run, existing-destination refusal, project-instruction preservation, and bundled Python init/validate/status | `$devthread` discovered and loaded from `~/.agents/skills/devthread/`; separate fresh-chat workflow review pending |
| Linux | Installer/package and Python suites pass in CI on `ubuntu-latest` with Node 22 and 24 and Python 3.13 | Not run |
| macOS | Installer/package and Python suites pass in CI on `macos-latest` with Node 22 and 24 and Python 3.13 | Not run |

[CI passed all six OS/Node combinations](https://github.com/kurarensu16/devthread/actions/runs/38134927423), including Windows with Node 22 and 24 and Python 3.13. Each job ran the npm installer/package suite, the Python suite, and project-map validation. The website job also passed. See [the CI report](../.devthread/reports/TASK-007-ci.md) for the commit and job results. These results cover the runner environments. The user-scoped installed copy was not changed by these tests; global-install tests use a temporary home path.

[The publication-preparation CI run also passed all seven jobs](https://github.com/kurarensu16/devthread/actions/runs/38198818302). Registry downloads on Linux and macOS have not been separately exercised. The Windows live-registry test used a fresh temporary project and npm cache and preserved the user's installed skill. See [the publication report](../.devthread/reports/TASK-007-publication.md) for the release identity, commands, checksums, and limits.

## DevThread rename

The Milestone 3 agent sessions used the original DevMap name and user-scoped `devmap` package. Those historical results are preserved in `WORKFLOW_EVIDENCE.md` and the verification reports. The renamed `devthread` scripts pass the same workflow exercises plus legacy-state preservation tests. On 2026-10-12, all 19 installed files in `~/.agents/skills/devthread/` matched the repository and the installed manifest was loaded in this Codex chat on Windows. Independent review of a separate fresh-chat workflow under `$devthread` remains pending; it must not be inferred from prior-name sessions or current-chat discovery.

## Additional installation routes

The installation guide also includes Codex's built-in `$skill-installer` and Vercel Labs' `npx skills add`, based on their current documentation. The source is available on GitHub, but neither route has been exercised with DevThread. The skills CLI targets `.agents/skills/` for a Codex project installation and `~/.agents/skills/` for global installation. The DevThread npm tests exercise copying into the project location; discovery and these additional installers still need their own checks. Documented installer support does not establish tested DevThread behavior or compatibility with other agents.
