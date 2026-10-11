# TASK-007 verification — npm installer and OS targets

Date: 2026-10-11. Workspace: `C:/Users/sadia/DevMap`. The user approved npm packaging and requested Windows, Linux, and macOS availability.

## Implemented

- Root npm package `devthread@0.1.0`, with no runtime dependencies, a Node 22+ executable, and Windows/Linux/macOS targets.
- `devthread install` supports the current project, an explicit existing project, the user's home, a custom exact directory, and dry run. Paths use native Node modules.
- Existing files, directories, empty directories, junctions, and dangling links are refused. Exclusive directory reservation prevents concurrent installers from merging files. The skill manifest is written last; a partial copy reports its location without removing user files.
- The archive contains the installer, full skill, and MIT notices. Website dependencies, project maps, tests, Python caches, and credentials are excluded by the package file list and checked by the archive test.
- Package tests install the real archive offline through npm, run its executable shim, compare every installed resource, and exercise bundled Python init/validate/status while preserving project instructions.
- CI is configured for Windows, Linux, and macOS, Node 22 and 24, and Python 3.13. A separate Linux job checks the website. There is no publishing or deployment job.
- Installation and compatibility guides distinguish local package checks, native OS checks, agent discovery, and registry publication.

## Checks

Commands ran from the workspace root unless noted.

| Exact command | Outcome | Supports and limits |
| --- | --- | --- |
| `npm install --package-lock-only --ignore-scripts --offline --no-audit --no-fund` | Passed. | Dependency-free root lockfile generated offline. |
| `npm ci --ignore-scripts --offline --no-audit --no-fund` | Passed. | Root package clean install with the lockfile. |
| `npm test` in the sandbox | Failed: 10 filesystem tests hit `EPERM` resolving the sandbox temporary directory; the path-resolution test passed. | Environment restriction; preserved here rather than reported as a passing run. |
| `npm test` outside the sandbox | Passed: 11 tests, no skipped tests. Repeated after adding the installed MIT notice and passed again. | Native Windows installer and archive checks, plus simulated POSIX path resolution. Global tests use a temporary home; the user's installed skill was not modified. |
| `python -m unittest discover -s tests -p 'test_*.py' -v` outside the sandbox | Passed: 15 tests. | Existing script, workflow, legacy-state, and preservation behavior on Windows/Python 3.13. |
| `node bin/devthread.mjs --help` | Passed. | CLI options and usage output. |
| `node bin/devthread.mjs --version` | Passed: `0.1.0`. | Package version resolution. |
| `npm run typecheck` from `website/` | Passed. | Updated MDX and TypeScript compile checks. |
| `npm run build` from `website/`, outside the sandbox | Passed. | Production static output. The two previously recorded nonfatal Fumadocs `::highlight(fd-search)` CSS optimizer warnings remain. |
| `npm run check:links` from `website/` | Passed: 1,065 local links/anchors and basic document semantics across 27 HTML files. | Local destinations and anchors; external URLs are excluded. |
| `npm pack --ignore-scripts --json` | Passed. | Deliverable `devthread-0.1.0.tgz`: 24 entries, 13,123 bytes compressed, 38,077 bytes unpacked. The test separately checks archive contents and every installed skill resource. |
| `wsl --list --quiet` | Failed in the sandbox with access denied; passed outside it. Only `docker-desktop` was listed. | No development Linux distribution was available for native tests. |
| `docker image ls --format '{{.Repository}}:{{.Tag}}'` | Failed: Docker Linux engine named pipe was absent. | Docker daemon was unavailable; no container or image was started/downloaded. |

The workflow YAML was parsed with the existing website YAML library using this exact command:

```sh
node --input-type=module -e 'import { readFileSync } from "node:fs"; import YAML from "./website/node_modules/yaml/dist/index.js"; const workflow = YAML.parse(readFileSync(".github/workflows/checks.yml", "utf8")); const matrix = workflow.jobs["skill-and-installer"].strategy.matrix; console.log("Workflow YAML parsed: " + matrix.os.length * matrix.node.length + " OS/Node combinations and a website job.");'
```

Passed: six OS/Node combinations and a website job. Parsing establishes YAML syntax and the configured matrix; it does not execute GitHub Actions.

Archive integrity: `sha512-6bzrQ6q4UPM0WJgB8gnzZyv2pOCgBd9oed+i8kAqwKoKS6iFgqOclS8CKZwOl97Qo1CYyCzT17bHtmL0LW3aVg==`.

## Not run and next checks

- **Native Linux and macOS tests:** not run. CI can execute these after source upload; no macOS host is available here, and no usable local Linux runtime was found. POSIX path tests on Windows do not prove native execution.
- **Node 24:** not run locally; configured in CI. Local Node is 22.18.0, npm 11.5.2, Python 3.13.
- **Fresh-chat `$devthread` discovery:** not run. The temporary tests establish installed files and scripts, not agent selection. Earlier DevMap discovery remains historical evidence only.
- **User-scoped installed-copy update:** not run. The earlier declined operation was not retried. Temporary package tests do not change that installed copy.
- **Browser interaction checks:** not run; the existing preview policy limit remains.
- **Commit, push, npm publication, tagging, and deployment:** not performed. Registry commands are documented as available after publication, not as currently usable.

## Assessment

Verified for native Windows package installation and Python script behavior, package contents, preservation, and documentation compilation. Linux/macOS are implementation targets with pending native checks. TASK-007 remains in review; the release tasks retain their review and approval gates.

Sources checked for implementation: [npm package metadata](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/), [Node filesystem APIs](https://nodejs.org/api/fs.html), [Node test runner](https://nodejs.org/api/test.html), [npm pack](https://docs.npmjs.com/cli/v11/commands/npm-pack/), and the official [checkout](https://github.com/actions/checkout), [setup-node](https://github.com/actions/setup-node), and [setup-python](https://github.com/actions/setup-python) documentation.
