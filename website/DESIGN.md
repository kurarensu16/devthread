# DevThread website design proposal

Status: Blueprint direction approved and implemented locally for Milestone 4. Review and verification limits are recorded in `.devthread/reports/TASK-004-verification.md`; publication is a separate step.

## Purpose and audience

Help a student, solo developer, or small team understand DevThread in one minute, then install and use the tested Codex skill from the docs. Show how repository state, task dependencies, and verification evidence help someone resume work. Keep the website static or statically deployable.

## Visual directions

| Direction | Look and feel | Strength | Tradeoff |
| --- | --- | --- | --- |
| **Blueprint** (recommended) | Warm near-white canvas, deep ink, teal paths, restrained amber evidence markers, precise lines and generous space | Makes the project map and evidence model tangible while keeping long docs comfortable to read | Needs careful restraint so diagrams stay useful rather than decorative |
| **Field notes** | Cream paper, forest green, editorial headings, marginal notes | Approachable for students and solo builders | Can make code and commands feel secondary |
| **Terminal** | Dark surfaces, bright cyan or lime accents, dense monospace details | Familiar to experienced developers | Less inviting for long reading and easy to mistake for a generic AI tool |

**Recommendation:** use Blueprint as the default light theme, with a matching dark theme. Its organizing motif is a simple path through **repository → map → evidence → next task**. Use this path in the hero and the workflow explanation, not as a fake dashboard or product screenshot.

## Design principles

1. **Show actual artifacts.** Use real, reviewed snippets from `examples/` and `.devthread/`. Label any condensed conversation or output as an example.
2. **Make evidence legible.** Present `verified`, `likely`, `missing`, `blocked`, and `unknown` as distinct text labels with shape or icon cues; color is supplementary.
3. **Keep one route through the site.** The primary CTA goes to installation, and the installation page leads to a reproducible quick start. GitHub is the secondary route once its real URL is configured.
4. **Prefer clarity over motion.** Diagrams explain relationships. Animation may gently reveal a path, but no information depends on it.
5. **Write within tested scope.** Name Codex as tested only to the extent recorded in `docs/COMPATIBILITY.md`. Explain other hosts as untested or planned until tested.

## Shared visual system

### Color tokens

| Role | Light | Dark | Usage |
| --- | --- | --- | --- |
| Canvas | `#F7F8F4` | `#0C151B` | Page background |
| Surface | `#FFFFFF` | `#13242B` | Cards, code panels, navigation |
| Primary text | `#13252B` | `#E8F1EF` | Headings and body |
| Secondary text | `#42565B` | `#B1C8C6` | Metadata and supporting text |
| Action | `#087F75` | `#5FE1CB` | Links, focus accents, primary actions |
| Caution | `#986500` | `#F2C66D` | Drift or incomplete evidence, always with a label |

The proposed light text pairs measure at least 4.8:1 for small text on their listed canvas or white surface; the listed dark text pairs exceed 10:1 on the dark canvas. Recheck all final component states, including badges, borders, hover, focus, and code syntax, in the implemented UI. Keep status meaning independent of color.

### Typography and spacing

- Use a modern system sans stack for interface and prose and a system monospace stack for paths, commands, IDs, and code. This avoids a font dependency while the design is being established.
- Keep docs body text around 16–18 px with comfortable line height and a reading column around 70–76 characters. Use larger, shorter headings on the landing page.
- Use a consistent spacing scale based on 4 and 8 px, broad section spacing, and few card borders. A faint grid can appear in the hero only; it must not compete with text.
- Use sentence case for navigation and headings. Reserve monospace for real technical strings, not whole paragraphs.

### Components

- **Navigation:** DevThread wordmark, Docs, GitHub, and a clear Get started action. The mobile menu must be usable by keyboard and screen reader.
- **Buttons and links:** obvious focus ring, underlined body links, discernible labels, and a clear primary action.
- **Code panels:** selectable text, language or context label, and copy action only if it is robust. Avoid decorative terminal chrome.
- **Evidence chips:** text label plus simple icon or shape; pair each claim with the file, test, or review evidence where available.
- **Diagram nodes:** repository, map, evidence, next task. Render as semantic HTML or accessible SVG with an equivalent text explanation.
- **Callouts:** use sparingly for permission, privacy, and limitations; never rely on color alone.

## Landing page plan

| Section | Message and content | Visual treatment |
| --- | --- | --- |
| Hero | Tagline: “Know what's built. See what's next. Keep AI development on track.” One sentence explaining the repository-native skill. Get started → installation; GitHub → configured real URL. | Large type and a compact four-node path. |
| Problem | Context is lost between agent sessions; plans drift from code; changes need verification. | Three short statements tied to one realistic project scenario. |
| How it works | Install → Understand → Map → Reconcile → Resume. | Five-step sequence; stacks vertically on mobile. |
| Capabilities | Repo awareness, persistent `.devthread/` context, requirement-to-code traceability, next-task recommendation, verification evidence. | Plain cards with a concrete artifact or outcome per card. |
| Demo | A short, labeled example conversation beside actual `.devthread/` task and report excerpts. | Readable code and prose panels; no simulated live agent UI. |
| Compatibility | Show only hosts and levels supported by recorded tests. | Small table linked to the full compatibility page. |
| Open source | MIT license, contribution guide, and repository link. | Quiet text section. |
| Final CTA | Install and run the first workflow. | Single primary action to the quick start. |

Keep the hero and first CTA visible without requiring a long scroll on a typical desktop viewport. On mobile, prioritize headline, short explanation, CTA, then diagram.

## Documentation plan

Use the same colors and typography with a calmer layout. On desktop, use a left navigation, central reading column, and a small on-page table of contents where space allows. On narrow screens, use one reading column and a compact navigation drawer. Keep the installation and quick-start routes prominent.

Proposed navigation:

1. **Start:** Introduction; Installation; Quick start for a new repository; Quick start for an existing repository.
2. **Understand DevThread:** Project state; Task lifecycle; Evidence levels; Reconciliation and session recovery.
3. **Use the workflows:** `init`, `understand`, `map`, `reconcile`, `next`, `implement`, `verify`, `status`.
4. **Reference:** `.devthread/` format and schema; End-to-end example; Compatibility.
5. **Help and project:** Safety and privacy; Troubleshooting and FAQ; Contributing and development setup.

Every workflow page should state when to use it, a natural-language prompt, what files it reads or writes, an example of its output, and any relevant safety boundary. Installation pages must distinguish tested steps from experimental guidance. Commands should be copied from and checked against the delivered repository before publication.

## Interaction and accessibility

- Preserve a logical heading order, landmarks, visible keyboard focus, and a skip-to-content link.
- Meet WCAG 2.2 AA text contrast targets: at least 4.5:1 for ordinary text and 3:1 for large text. Test the final implementation, not only these proposed tokens.
- Keep content usable at a 320 CSS px viewport and at high zoom without horizontal page scrolling. Allow code blocks to scroll within their own region when necessary.
- Honor `prefers-reduced-motion`; motion is optional and never required to understand the workflow.
- Offer light and dark appearance through a small, persistent user control if implementation is straightforward. Follow the system preference initially. A fully accessible light theme takes priority over an incomplete dark theme.

Accessibility references: [WCAG 2.2 contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [W3C reflow guidance](https://www.w3.org/WAI/WCAG21/Understanding/reflow), [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion).

## Content and implementation guardrails

- Treat the page as documentation for an agent skill, not as a dashboard or hosted product. Do not add accounts, analytics requirements, a backend, or live agent simulation for v1.
- Use Next.js, TypeScript, and Tailwind CSS as specified in the brief. Check current versions and a clean build before choosing Fumadocs; use a simpler MDX setup if it adds disproportionate setup cost.
- Keep diagrams and icons as simple SVG or CSS assets. Add a dependency only when it solves a concrete requirement.
- Do not invent a GitHub URL. Read the URL from site configuration, and do not publish a broken GitHub CTA.
- Keep the visual source of truth in this file and the implemented tokens/components once built.

## Design acceptance for Milestone 4

- A reader can explain what DevThread does and reach installation from the hero.
- A developer can complete both quick starts using documented, tested commands.
- Every navigation link and CTA reaches a real destination.
- Landing page and docs remain readable by keyboard, at mobile width, and in the supported color modes.
- Site lint, typecheck, and build pass; product and compatibility claims match recorded evidence.

## Decisions to resolve before publishing

- Confirm this visual direction and whether the initial release should include the dark theme.
- Resolved on 2026-10-11: the GitHub URL is `https://github.com/kurarensu16/devthread`, tracked in `site.config.json`. The initial source upload is complete.
- Choose Fumadocs only after validating the current package combination and build.
