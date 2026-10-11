# DevThread website

The Blueprint landing page and MDX documentation use Next.js, TypeScript, Tailwind CSS, and Fumadocs. The site exports to `out/` and needs no runtime backend.

## Develop and check

Node.js 20.9 or later is required; the local checks use Node 22.18.0 and npm 11.5.2. From this directory:

```text
npm ci
npm run dev
```

The development server prints its local preview address. Run these checks before handoff:

```text
npm run lint
npm run typecheck
npm run build
npm run check:links
```

`check:links` checks local links, anchors, and basic document semantics against the actual static export. It excludes remote URLs and does not replace visual, keyboard, or screen-reader review; check those separately before publication.

## Repository URL

`site.config.json` tracks the repository URL: [kurarensu16/devthread](https://github.com/kurarensu16/devthread). Navigation and the open-source CTA use this URL by default. An optional nonempty `NEXT_PUBLIC_GITHUB_URL` in `.env.local` or the build environment overrides it. The same validator checks both the site and the release configuration; malformed URLs stop the check or build. The URL is embedded during the build.

```text
npm run check:release
```

This check validates URL configuration; it does not verify remote contents or approve a release. The GitHub repository was reachable but empty when checked on 2026-10-11. The local source has not been pushed, so installation docs begin with a local checkout. Rebuild and check links after URL changes. Publishing or deploying remains a separate approved step.

## Content and styles

- `DESIGN.md`: approved Blueprint direction and design requirements.
- `app/page.tsx`: landing page and labeled Taskboard example.
- `app/globals.css`: light/dark tokens, responsive layout, and reduced-motion behavior.
- `content/docs/`: documentation sources and navigation metadata.
- `source.config.ts`, `lib/source.ts`: MDX processing and static routes.

Compatibility claims must match `../docs/COMPATIBILITY.md` and recorded workflow evidence. Do not claim a new host or path is tested until discovery and representative workflows have been checked.

The current dependency combination follows [Fumadocs' Next.js setup](https://www.fumadocs.dev/docs/manual-installation/next) and [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports); the lockfile records the installed versions.
