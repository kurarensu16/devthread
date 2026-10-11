# TASK-004 follow-up — installation alternatives

Date: 2026-10-11. The user asked whether installation could use npm or other simpler options.

## Documentation changes

The installation guide now covers Codex's built-in `$skill-installer`, the existing `npx skills add` CLI, and manual copying. It includes the GitHub and local-source CLI forms, installation scopes, and a distinction between installing the skill files and proving fresh-chat discovery. README, compatibility, and troubleshooting guidance were updated consistently.

GitHub commands require the pending initial source upload. This project has not published an npm package or implemented a custom npm installer. No dependency or skill behavior changed.

## Sources checked

- [Official OpenAI skill guidance](https://learn.chatgpt.com/docs/build-skills): built-in installer can download skills from other repositories; current discovery locations include `.agents/skills/`.
- [Vercel Labs skills CLI documentation](https://github.com/vercel-labs/skills): GitHub and local sources, Codex target, skill selection, copy mode, and project/global scope.
- The installed Skill Installer helper was inspected for its explicit repository/path arguments and existing-destination refusal.

## Verification

Commands ran from `C:/Users/sadia/DevMap/website`.

| Exact command | Outcome | Supports and limits |
| --- | --- | --- |
| `npm run typecheck` | Passed. | MDX generation, route generation, and TypeScript checks. |
| `npm run build`, outside the sandbox | Passed. | Updated MDX compiles into production static output. The same two nonfatal Fumadocs `::highlight(fd-search)` CSS optimizer warnings remain. |
| `npm run check:links` | Passed: 1,050 local links and anchors, plus basic document semantics, across 27 HTML files. | Internal routes and anchors; external URLs are excluded. |

## Not run

- GitHub installation: the remote has no uploaded skill source yet.
- `npx skills add` installation and fresh-chat discovery: commands were checked against the CLI's documentation, not executed. Both new routes remain untested for DevThread.
- Manual installed-copy update: outside this documentation change; the earlier declined operation remains pending.
- Runtime browser review: the existing policy limit remains. No workaround was attempted.

TASK-004 remains in review. Clean installation and fresh-chat discovery belong to the outstanding release verification work.
