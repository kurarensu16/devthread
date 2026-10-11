# DevThread v1 roadmap

## Milestone 1 — specification and scaffolding

Define the repository layout, state format, task semantics, evidence criteria, and workflow permissions. Add contribution guidance, the approved license, and fixtures for an empty repository, a typical application, and a repository with pre-existing DevThread state. Exit when the documents are consistent and fixtures can be read without errors.

## Milestone 2 — skill and local scripts

Implement `skill/devthread/SKILL.md`, focused references, templates, and standard-library Python scripts `init.py`, `validate.py`, and `status.py`. Test dry-run and repeat initialization, malformed frontmatter, invalid and duplicate IDs, missing dependencies, cycles, and meaningful error output. Exit when an existing repository can be initialized without replacing files and all script tests pass.

## Milestone 3 — end-to-end workflows

Test the eight workflows on a new repository and a realistic existing application. Confirm evidence classification, next-task selection, exact verification outcomes, and context recovery in a new agent session. Record Codex compatibility first; report other hosts only after direct testing.

## Milestone 4 — landing page and documentation

Build the responsive landing page and required docs. Validate current website dependencies before choosing Fumadocs or a simpler MDX setup. Use a real configured GitHub URL. Exit when the build passes, internal links work, and documented installation and quick starts are reproducible.

## Milestone 5 — release readiness

Add CI for scripts and website checks, perform a clean installation and complete sample workflow, review privacy and unsupported claims, then request approval before tagging, publishing, or deploying.

The user approved an npm installer as a release packaging task, with Windows, Linux, and macOS targets. Bundle the full skill with a dependency-free Node CLI, test existing-install preservation and the actual archive, and run native OS checks through CI. Keep registry publication and fresh-agent discovery distinct from local package verification.

No dashboard, SaaS backend, account system, paid model API, vector database, or autonomous deployment is part of v1.
