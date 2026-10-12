# DevThread

DevThread is a repository-native Agent Skill for understanding a project's current state, maintaining a lightweight development map, comparing plans with code evidence, and resuming work across agent sessions.

**Status:** The skill, templates, local scripts, and workflow examples are implemented and tested in Codex on Windows with Python 3.13. The source is available on [GitHub](https://github.com/kurarensu16/devthread). [CI passed](https://github.com/kurarensu16/devthread/actions/runs/38134927423) for the installer and Python scripts on Windows, Linux, and macOS with Node 22 and 24, and for the Blueprint website. Milestone 4 is awaiting manual review. Version 0.1.0 packages the installer and skill; registry availability is described below. Other agent compatibility remains untested.

DevThread was previously named DevMap. The new skill is `$devthread`, packaged in `skill/devthread/`. New maps use `.devthread/`; legacy `.devmap/` state remains supported in place. Historical agent tests used the old name; fresh-chat discovery under the new name is still pending. See [the naming decision](docs/NAMING.md) and [compatibility](docs/COMPATIBILITY.md).

## Installation

The dependency-free Node installer targets **Windows, Linux, and macOS**. It supports project, global, custom-directory, and dry-run installation and refuses existing destinations. Node.js 22 or later installs the skill; Python 3 runs its local scripts.

Get the source and preview installation into an existing project:

```sh
git clone https://github.com/kurarensu16/devthread.git
cd devthread
node bin/devthread.mjs install --project "PATH_TO_PROJECT" --dry-run
```

Remove `--dry-run` to install. For availability across projects, use `install --global`. Run `node bin/devthread.mjs --help` for all options.

After npm publication, the corresponding command will be:

```sh
npx devthread install
```

Registry installation requires `devthread@0.1.0` to be published. Check availability with `npm view devthread version`; if the registry has no package record, use the source or locally built archive. Installer and script checks pass in CI on Windows, Linux, and macOS; independent fresh-chat `$devthread` workflow verification is pending. [The installation guide](website/content/docs/installation.mdx) includes archive installation, other installers, manual copying, and OS verification limits.

## v1 scope

DevThread v1 has three deliverables: an Agent Skill with local validation and status scripts, a public landing page, and documentation. It does not include a dashboard, hosted backend, accounts, a DevThread-owned model API, or automated deployment.

The intended repository layout is:

```text
bin/, lib/              Dependency-free npm installer
skill/devthread/        Agent Skill, references, templates, and scripts
website/                Blueprint landing page and MDX documentation
tests/                  Installer, package, script, and workflow tests
docs/                   Format and workflow specification
```

Read [the state format](docs/FORMAT.md), [workflow contract](docs/WORKFLOWS.md), [workflow evidence](docs/WORKFLOW_EVIDENCE.md), [examples](examples/README.md), and [compatibility status](docs/COMPATIBILITY.md). The implementation sequence and exit checks are in [the roadmap](docs/ROADMAP.md).

## Development

Python 3 scripts use the standard library. From this repository root, run:

```sh
python skill/devthread/scripts/init.py PATH_TO_PROJECT --dry-run
python skill/devthread/scripts/init.py PATH_TO_PROJECT
python skill/devthread/scripts/validate.py PATH_TO_PROJECT
python skill/devthread/scripts/status.py PATH_TO_PROJECT --json
python -m unittest discover -s tests -p 'test_*.py'
```

`PATH_TO_PROJECT` must be an existing directory. See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution and verification expectations.

From this repository root, `npm test` checks the installer and exercises an offline installation of the actual `npm pack` archive, including its Python scripts. `npm pack --ignore-scripts` creates `devthread-0.1.0.tgz`. The package contains the installer and full skill, with no runtime npm dependencies. `.github/workflows/checks.yml` runs package and Python checks on Windows, Linux, and macOS with Node 22 and 24, plus website checks on Linux. [The first CI run passed all seven jobs](https://github.com/kurarensu16/devthread/actions/runs/38134927423); [the report](.devthread/reports/TASK-007-ci.md) records its scope and remaining checks.

## Website

The site uses Next.js, TypeScript, Tailwind CSS, and Fumadocs, with a static export in `website/out/`. From `website/`, run:

```text
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
npm run check:links
```

The development server serves the local preview at `http://127.0.0.1:3000/`. [Website setup](website/README.md) explains the tracked GitHub URL and the release configuration check. Read [the design](website/DESIGN.md), [Milestone 4 verification](.devthread/reports/TASK-004-verification.md), and [repository URL verification](.devthread/reports/TASK-004-repository-url.md) for design decisions and check limits.

## License

DevThread is licensed under [MIT](LICENSE).
