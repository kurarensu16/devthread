# TASK-004 verification — landing page and documentation

Date: 2026-10-11. Environment: Windows, Node 22.18.0, npm 11.5.2, Python 3.13. Checks ran from `website/` unless stated otherwise.

## Delivered work

- Custom Blueprint landing page with the eight brief sections, accessible source structure, an example project path, and a labeled Taskboard conversation/task excerpt.
- Shared light/dark tokens, responsive rules, keyboard focus styles, and reduced-motion handling.
- Fumadocs navigation and 23 MDX pages covering installation, both quick starts, concepts, all eight workflows, format, example, compatibility, safety, troubleshooting, contributing, and MIT licensing.
- Static Next.js export, configured repository URL handling, export link checks, and a publication prerequisite check.

## Website commands and outcomes

| Exact command | Outcome | Supports and limits |
| --- | --- | --- |
| `npm install` with the final package configuration | Passed; 618 packages audited, zero vulnerabilities reported. | Compatible installed dependencies; this is not a clean installation check. |
| `npm run lint` | Passed with no errors or warnings after corrections. | TypeScript, React Hooks, and JSX accessibility source rules. It does not prove runtime keyboard behavior. |
| `npm run typecheck` | Passed. | MDX generation, route types, and TypeScript checks. |
| `npm run build` outside the Windows sandbox | Passed; statically generated landing page and docs. | Production compilation and static rendering. Two nonfatal CSS optimization warnings concern Fumadocs' `::highlight(fd-search)` selectors; site search is disabled. |
| `npm run check:links` after the final build | Passed: 1,030 local links and anchors across 27 exported HTML files, plus basic document semantics. | Local destination and anchor existence; one main landmark, one primary heading, and a document language per exported page. External destinations and browser interaction are not covered. |
| `npm run check:release` with no repository URL | Failed as intended: missing real GitHub URL. | Confirms publication is blocked by configuration rather than a fabricated link. It is not a passing release gate. |
| `(Invoke-WebRequest -Uri 'http://127.0.0.1:3000/' -UseBasicParsing -TimeoutSec 5).StatusCode` outside the sandbox | Passed: HTTP 200. | The static landing page served from the local HTTP preview. |
| `(Invoke-WebRequest -Uri 'http://127.0.0.1:3000/docs/installation/' -UseBasicParsing -TimeoutSec 5).StatusCode` outside the sandbox | Passed: HTTP 200. | The installation route served from the local HTTP preview. |

## Preserved failures and corrections

- The first sandboxed production build failed to canonicalize the workspace path with Windows access error 5. The authorized retry outside the sandbox passed. `turbopack.root` now selects this website directory and avoids unrelated ancestor lockfiles.
- The initial lint configuration emitted an anonymous-export warning; the PostCSS configuration now has a named constant.
- The initial dependency audit reported five high findings in the default Next ESLint configuration's glob chain. No patched `braces` version was available. Replacing that configuration with focused TypeScript, React Hooks, and JSX accessibility rules removed 85 packages; the final install reported zero findings.
- The accessibility lint rule initially rejected focus on the scrollable code region. The region now has a label and an explicit rule allowance so keyboard users can focus and scroll it.
- Sandboxed loopback checks were blocked; the authorized preview server and readiness checks outside the sandbox returned HTTP 200. The first failed preview attempt was not counted as a success.

## Documentation commands

The PowerShell command blocks in `website/content/docs/quick-start-new.mdx` and `quick-start-existing.mdx` were replayed with generated temporary directory names. From the repository root, the exact script commands were:

```powershell
python .\skill\devmap\scripts\init.py $devmapPractice --dry-run
python .\skill\devmap\scripts\init.py $devmapPractice
python .\skill\devmap\scripts\validate.py $devmapPractice
python .\skill\devmap\scripts\status.py $devmapPractice --json
```

The new-directory quick start passed initialization, validation, and initial zero-task status. The existing-directory quick start preserved `AGENTS.md` (hash comparison returned `True`). Its `python -m unittest discover -s tests -v` command first failed under the sandbox with temporary-file permission errors; the authorized replay outside the sandbox passed two baseline tests.

The installed skill's `SKILL.md`, `references/planning.md`, and `templates/TASK.md` path checks returned `True`. Each of these commands printed usage and exited successfully:

```powershell
python (Join-Path $devmapSkill 'scripts\init.py') --help
python (Join-Path $devmapSkill 'scripts\validate.py') --help
python (Join-Path $devmapSkill 'scripts\status.py') --help
```

The existing user installation was retained. The installation guide's guard prevents copying over an existing skill; the complete user-scoped installation and fresh-chat invocation were already exercised in Milestone 3. Current official documentation lists `.agents/skills/`; that alternative path is explicitly labeled as not retested here.

The end-to-end example commands were also rerun:

```powershell
Push-Location .\examples\taskboard-session
python -m unittest discover -s tests -v
Pop-Location
python .\skill\devmap\scripts\validate.py .\examples\taskboard-session
python .\skill\devmap\scripts\status.py .\examples\taskboard-session --json
```

Passed: four application tests, valid two-task state, and saved status with one done task, one review task, and no eligible task. These support the documented example's stated results.

## Not-run checks and remaining work

- **Browser visual, mobile reflow, theme interaction, and runtime keyboard checks: not run.** The browser tool rejected inspection of the local preview under its URL security policy. No browser workaround was used. Static semantics, lint, and proposed token contrast checks do not replace manual visual and assistive-technology review.
- **Current `.agents/skills/` installation: not run.** The site accurately distinguishes it from the locally tested `.codex/skills/` route.
- **Clean website installation via `npm ci`: not run.** This remains a Milestone 5 release check; the lockfile is supplied.
- **GitHub destination verification: not run.** The user confirmed the GitHub repository has not been created. Configure and verify its actual URL, then rebuild before publication.
- **Commit, push, tag, publication, and deployment: not run.** They were not part of this local implementation approval.

## Assessment

Compilation, static routes, internal links, basic document semantics, and the exercised documentation commands have passing evidence. Overall presentation and browser interaction remain `likely` based on source until manually reviewed. TASK-004 is in `review`; it was not automatically marked done. Publication remains dependent on the actual GitHub repository URL and approval.
