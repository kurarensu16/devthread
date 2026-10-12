# Decisions

## 2026-10-11 — v1 scope

Build a repository-native Agent Skill first, followed by a landing page and documentation. Exclude a dashboard, hosted backend, paid model API, and automatic deployment. This follows the user-provided implementation brief.

## 2026-10-11 — license

The user approved MIT for DevMap.

## 2026-10-11 — state format

Use `.devmap/` with `schemaVersion: 1`, Markdown project and task files, JSON configuration, stable task IDs, dependency checks, and evidence levels separate from task status. Python scripts use the standard library.

## 2026-10-11 — compatibility claims

Advertise only directly tested hosts and workflows. Codex skill discovery, read-only `understand`, and saved-state recovery with `status` and `next` succeeded in fresh chats. At the time of this decision, the other live workflows still required checking; that later check is recorded below.

## 2026-10-11 — local Codex workflow exercise

The remaining workflows were exercised in this Codex chat on two example projects. Describe support as tested for the local Windows and Python 3.13 environment only. Do not infer compatibility with other agents or platforms.

## 2026-10-11 — website design and stack

The user approved proceeding with the proposed Blueprint design: warm light canvas, ink text, teal paths, evidence markers, and a matching dark theme. Implement the landing page and docs locally with Next.js 16, TypeScript, Tailwind 4, and Fumadocs/MDX after checking current package compatibility. Export static files; publication remains separate.

## 2026-10-11 — publication prerequisite and lint tooling

The user confirmed that a GitHub repository has not been created. Leave the URL unset and keep preview links working; require the actual URL before publication. Replace the default Next ESLint configuration's vulnerable glob dependency chain with focused TypeScript, React Hooks, and JSX accessibility rules. The resulting installation reported zero vulnerabilities.

## 2026-10-11 — skill discovery documentation

The recorded user installation at `.codex/skills/devmap` remains the tested route. Current official documentation lists `.agents/skills`; clearly label that path as not retested for DevMap here rather than silently expanding compatibility claims.

## 2026-10-11 — rename to DevThread

The user approved DevThread after name screening. Use `DevThread` for display, `$devthread` for invocation, `skill/devthread/` for the package, and `.devthread/` for new state. Keep legacy `.devmap/` state readable in place; stop if both state paths exist. This repository and its example maps were moved explicitly as part of the approved rename. Preserve historical reports and project instructions.

Registry lookups returned no `devthread` npm/PyPI records and no `devthread.dev` registration record; `.com` is registered and `.io` remains unverified. No name was reserved or purchased. Domain confirmation and publication remain separate. Prior fresh-chat evidence used `$devmap`; new-name discovery requires its own check.

The permission request to update the installed user-scoped skill was declined. Complete the local repository changes, retain the old installed copy, and report installation/new-name discovery as pending. Do not retry the declined external write through another tool or path.

## 2026-10-11 — GitHub repository configured

The user supplied the newly created `https://github.com/kurarensu16/devthread.git` repository. Configure it as local `origin` and use `https://github.com/kurarensu16/devthread` for website links. Store the website default in tracked `website/site.config.json`, with an optional environment override, so new checkouts retain the real destination. The remote lookup succeeded but returned no refs. Record source upload as pending; repository creation alone does not establish published source or a release.

## 2026-10-11 — installation alternatives

The user asked for simpler installation options such as npm. Document Codex's built-in `$skill-installer` and the existing Vercel Labs `npx skills add` CLI alongside manual copying. GitHub-based commands require the pending source upload. Label both installer routes and their discovery checks as untested for DevThread. The project has not published an npm package; a custom npm installer would require separate packaging and publication work.

## 2026-10-11 — npm installer and OS verification

The user approved npm packaging and requested Windows, Linux, and macOS availability. Implement a root `devthread` package with a Node 22+ CLI using built-in modules. Bundle the existing Python skill and its MIT notice, preserve existing destinations, and offer project/global/custom/dry-run scopes. Package installation is explicit; there are no installation hooks or replacement commands.

Configure native OS checks for Windows, Linux, and macOS with Node 22/24 and Python 3.13, plus the website's CI checks. Local Windows tests pass; record other OSes as pending native CI rather than inferring compatibility from simulated paths. Publishing, source upload, and fresh-chat discovery remain separate actions and checks.

## 2026-10-11 — approved source push and native CI

The user answered yes to creating the initial commit and pushing it to GitHub to run native CI. Push source commit `d160615ec36ab7645e6de8493389efc955409fba` on the existing `master` branch and retain the executable permission on `bin/devthread.mjs`. GitHub Actions run `38134927423` passed all six Windows/Linux/macOS and Node 22/24 combinations with Python 3.13, plus the website checks. Record observed results in `reports/TASK-007-ci.md` and update current installation and compatibility docs. Preserve earlier reports as historical snapshots.

This approval covers the source commit and push, including verification documentation. npm publication, tags, deployment, and the previously declined installed-copy update remain separate actions. Keep the review tasks in review until acceptance is established.

## 2026-10-12 — installed DevThread and publication preparation

After the user reported completing setup, the installed `.agents/skills/devthread` copy matched all 19 source resources and appeared in this chat's skill catalog. The installed manifest was loaded; distinguish that observation from independent review of a separate fresh-chat workflow. npm login returns `kurarens`; the registry has no published `devthread` record at the check.

The initial publication dry run failed because npm's inherited dry-run setting prevented the nested package test from creating its archive. Set `--dry-run=false` only on the test helper's nested npm commands. Final publication dry-run checks pass all 11 npm tests. Normalize repository metadata, prepare a README with conditional registry availability, and record the 24-entry v0.1.0 archive integrity in `reports/TASK-007-publication-preflight.md`. Commit and push source corrections under the existing source-upload authorization and check CI. Seek specific approval for the public npm upload. Do not infer publication authorization from completion of setup.

## 2026-10-12 — approved npm publication and documentation update

The user explicitly approved publishing `devthread@0.1.0` publicly under `kurarens` with MIT and requested the documentation page update. Publish the exact reviewed archive. The initial attempt received npm E403 for its 2FA requirement. The user configured 2FA and completed browser authentication for the retry; npm accepted the upload. After asynchronous processing, the registry exposes 0.1.0 as `latest`, with checksum and integrity identical to the approved artifact.

Verify the recommended `npx devthread install` route in a temporary Windows project with a fresh npm cache. Version, all 19 skill resources, dry-run behavior, preservation, and installed Python init/validate/status pass. Update current installation, compatibility, troubleshooting, and README guidance; preserve historical preflight and CI reports. Separate live Windows registry verification from CI archive checks on Linux/macOS, and current-chat discovery from independent fresh-chat workflow review. Record results in `reports/TASK-007-publication.md`. This approval does not include a release tag or website deployment.
