# TASK-007 npm publication and documentation

Date: 2026-10-12.

## Authorization and package

The user explicitly approved publishing `devthread@0.1.0` publicly to npm under `kurarens` with MIT and requested the documentation page update. The reviewed source is commit `1b1cc5daf1f5a351c172870c913abb8e2ec5b3b3`; [its CI run passed all seven jobs](https://github.com/kurarensu16/devthread/actions/runs/38198818302).

- Public release: [devthread 0.1.0](https://www.npmjs.com/package/devthread/v/0.1.0).
- Registry: `https://registry.npmjs.org/`.
- Dist tag: `latest` points to `0.1.0`.
- License: MIT.
- Runtime npm dependencies: none.
- Archive: 24 entries, 13,224 compressed bytes, 38,479 unpacked bytes.
- SHA-1: `5fae9b9a3e2eba814a39e96aaa5c6f82a9e8a13e`.
- Integrity: `sha512-7aM38rAxWXv4G4vzs3j4MCMmLxikCrKrAHXVRcagnYjWdDcY1YE1YDHioZFgWFc0IK3a+gWmxGUh3pn90n4XHA==`.
- Registry version timestamp: `2026-10-12T03:38:29.957Z` (11:38:29 in Asia/Manila).

## Upload outcomes

```text
npm publish .\devthread-0.1.0.tgz --access public --registry=https://registry.npmjs.org/ --fetch-retries=0 --fetch-timeout=30000
```

The initial attempt failed with npm E403: publishing required 2FA or a granular publishing token configured to bypass 2FA. The user configured account 2FA. The retry requested browser authentication, which the user completed personally. The command then exited 0 and reported `+ devthread@0.1.0` with asynchronous processing pending. No password, recovery code, or token was requested in chat or copied into the repository.

An immediate registry query returned E404 for 0.1.0. A subsequent public registry read showed only npm's `0.0.0-stage` placeholder. Later reads exposed 0.1.0 as `latest`; the license, SHA-1, SHA-512 integrity, file count, and unpacked size match the approved archive. The uploaded archive was not rebuilt after documentation changes.

## Live registry installation

Host: Windows, Node 22.18.0, npm 11.5.2, Python 3.13.

The smoke check used a fresh owned temporary directory named `devthread-registry-smoke-586b044c06f74bac91e5796cef880dbb`, containing a private npm consumer, a project named `software project`, and a separate npm cache. The consumer was outside the source checkout to avoid npm choosing a same-named local package.

With `CACHE` and `PROJECT` identifying those temporary paths, the executed npx commands were:

```text
npx --yes --cache CACHE --registry=https://registry.npmjs.org/ --fetch-retries=0 --fetch-timeout=30000 devthread --version
npx --yes --cache CACHE --registry=https://registry.npmjs.org/ --fetch-retries=0 --fetch-timeout=30000 devthread install --project PROJECT --dry-run
npx --yes --cache CACHE --registry=https://registry.npmjs.org/ --fetch-retries=0 --fetch-timeout=30000 devthread install --project PROJECT
```

| Check | Result |
| --- | --- |
| CLI version from fresh registry cache | Passed: 0.1.0 |
| Dry run | Passed: no project `.agents/` directory created |
| Published CLI installation | Passed: complete skill at `PROJECT/.agents/skills/devthread/` |
| SHA-256 comparisons of installed resources | Passed: all 19 files match the approved source |
| `python INSTALLED_SKILL/scripts/init.py PROJECT` | Passed: initialized the temporary map |
| `python INSTALLED_SKILL/scripts/validate.py PROJECT` | Passed: valid state with zero tasks |
| `python INSTALLED_SKILL/scripts/status.py PROJECT --json` | Passed: recovered the saved empty map |
| Repeating the same install command | Passed: refused existing destination without replacement |
| Project `AGENTS.md` | Passed: unchanged hash |

The temporary test directory was removed only after resolving its absolute path and verifying its parent and owned name prefix. The user's global installed skill and project instructions were not changed by this smoke check.

## Documentation changes

- Installation guide now starts with the published npm release and working `npx devthread install` command, including project/global/custom/dry-run options and optional version pinning.
- The guide explains the distinct npm package and skill installation steps, source/archive alternatives, and npm prefix permissions for global CLI installation.
- Manual Windows guidance uses the current `~/.agents/skills/devthread/` location. Codex installer guidance specifies the repository's `master` branch.
- Compatibility, troubleshooting, docs overview, naming, and README reflect publication and observed DevThread discovery on Windows.

Verification before committing the documentation:

| Command | Result |
| --- | --- |
| `git diff --check` | Passed |
| `python skill/devthread/scripts/validate.py .` | Passed: seven project tasks |
| `npm run build` in `website/` | Passed, including TypeScript and static export; the same two nonfatal Fumadocs `::highlight` warnings remain |
| `npm run check:links` in `website/` | Passed: 1,065 local links/anchors and basic document semantics across 27 HTML files |
| `npm run check:release` in `website/` | Passed for the tracked GitHub URL; this is configuration validation |

## Limits

- Live registry downloads were exercised on Windows. Linux and macOS archive installation and Python suites passed in CI with Node 22/24 and Python 3.13; their registry downloads were not separately exercised.
- The renamed installed skill is discovered and loaded in this Codex chat. A separate fresh-chat workflow output has not been independently reviewed.
- Codex `$skill-installer`, Vercel Labs `npx skills add`, and manual copying remain separately untested routes for DevThread.
- Manual browser, mobile, keyboard, and theme review remains pending after the earlier URL-policy rejection. This request did not deploy the website or create a release tag.
- Verification and publication approval do not automatically mark the project review tasks done.
