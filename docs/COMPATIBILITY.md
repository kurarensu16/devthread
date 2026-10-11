# Compatibility status

| Host | Packaging | Workflow test | Status |
|---|---|---|---|
| Codex on Windows with Python 3.13 | `SKILL.md` frontmatter and supporting directory match [official OpenAI skill guidance](https://developers.openai.com/blog/eval-skills). A local user-scoped copy was installed and its files checked. | The scripts and process-level exercise pass. Separate Codex chats completed `understand` and recovered saved state with `status` and `next`. This chat exercised `init`, `map`, `reconcile`, `next`, `implement`, `verify`, and `status` on new and existing examples. | Tested in this environment; no universal compatibility claim. |
| Other coding agents | Not checked against host documentation. | Not run. | Untested. |

The current skill is self-contained in `skill/devthread/`; copying only `SKILL.md` would omit references, templates, and scripts. Other Python versions and coding agents remain untested. Installer OS checks are tracked separately below.

## npm installer and OS checks

The root npm package uses Node's built-in modules, requires Node 22+, and targets Windows, Linux, and macOS without native binaries or runtime dependencies. It supports project, global, custom-directory, and dry-run installation with preservation of existing destinations. The package remains unpublished.

| OS | Installer and scripts | Agent discovery |
| --- | --- | --- |
| Windows, Node 22.18.0 and Python 3.13 | 11 npm tests pass: file fidelity, spaced paths, preservation, exclusive concurrent install, dry-run, offline archive installation through the npm executable shim, and bundled Python init/validate/status | `$devthread` fresh-chat discovery pending |
| Linux | POSIX path resolution exercised on Windows; native checks configured in CI, not run | Not run |
| macOS | POSIX path resolution exercised on Windows; native checks configured in CI, not run | Not run |

CI targets all three OSes with Node 22 and 24 and Python 3.13. The existing 15 Python tests run on every OS, as does installation of the actual npm archive. CI awaits the initial source upload; a configured matrix does not establish passing results. The user-scoped installed copy was not changed by these tests; global-install tests use a temporary home path.

## DevThread rename

The Milestone 3 agent sessions used the original DevMap name and user-scoped `devmap` package. Those historical results are preserved in `WORKFLOW_EVIDENCE.md` and the verification reports. The renamed `devthread` scripts pass the same workflow exercises plus legacy-state preservation tests. Fresh-chat discovery under `$devthread` still requires a separate check; it must not be inferred from the prior-name sessions. Current official documentation lists `.agents/skills/`; copying to that location is now tested by the npm installer, while discovery there remains untested.

## Additional installation routes

The installation guide also includes Codex's built-in `$skill-installer` and Vercel Labs' `npx skills add`, based on their current documentation. Neither route has been exercised with DevThread. GitHub-based installation requires the pending initial source upload. The skills CLI targets `.agents/skills/` for a Codex project installation and `~/.agents/skills/` for global installation. The DevThread npm tests exercise copying into the project location; discovery and these additional installers still need their own checks. Documented installer support does not establish tested DevThread behavior or compatibility with other agents.
