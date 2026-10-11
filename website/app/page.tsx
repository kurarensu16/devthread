import Link from 'next/link';
import { Header } from '@/components/header';
import { Brand } from '@/components/brand';
import { CodePanel } from '@/components/code-panel';
import { site } from '@/lib/site';

const steps = [
  ['Install', 'Add the skill to your coding agent.'],
  ['Understand', 'Read the repository and recover its context.'],
  ['Map', 'Turn requirements into tasks with dependencies.'],
  ['Reconcile', 'Compare the plan with source and check results.'],
  ['Resume', 'Pick the next justified task in a fresh session.'],
];

function Arrow() { return <span aria-hidden="true">↗</span>; }

function ProjectPath() {
  return <div className="project-path" aria-label="Example: repository evidence supports a saved map and the next task">
    <div className="path-caption"><span className="live-dot" aria-hidden="true" /> A map that stays with your code <span className="mono">v1 / local</span></div>
    <div className="path-source"><span className="node-icon" aria-hidden="true">⌥</span><div><span className="small-label">01 / repository</span><strong>taskboard/</strong><span className="path-files">src/ · tests/ · AGENTS.md</span></div><span className="outline-label">Observed</span></div>
    <div className="path-connector"><span>read → map</span></div>
    <div className="path-map"><div className="path-map-title"><span className="node-icon" aria-hidden="true">▦</span><div><span className="small-label">02 / saved context</span><strong>.devthread/</strong></div><span className="small-label">Git friendly</span></div><div className="map-file"><span>PROJECT.md</span><span>Purpose & constraints</span></div><div className="map-file"><span>tasks/TASK-002.md</span><span>Scope & dependencies</span></div><div className="map-file"><span>reports/</span><span>Checks & outcomes</span></div></div>
    <div className="path-connector"><span>reconcile → next</span></div>
    <div className="path-next"><div><span className="small-label">03 / next justified task</span><strong>Add task completion</strong><p>TASK-002 · dependency complete</p></div><span className="evidence missing">◇ Missing</span></div>
    <p className="diagram-note">Illustrative snapshot before implementation. <Link href="/docs/example/">Follow the tested example <Arrow /></Link></p>
  </div>;
}

export default function Home() {
  return <><Header /><main id="main-content">
    <section className="hero blueprint-grid"><div className="shell hero-grid"><div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line" /> Repository-native agent skill</p><h1>Know what’s built.<br />See <span className="accent-text">what’s next.</span></h1><p className="hero-subtitle">Keep AI development on track.</p><p className="hero-description">DevThread helps your coding agent understand the project, connect plans to code evidence, and pick up where you left off.</p><div className="button-row"><Link className="button" href="/docs/installation/">Get started <Arrow /></Link><Link className="text-link" href="/docs/example/">Explore an example <span aria-hidden="true">→</span></Link></div><div className="hero-meta"><span>Open source · MIT</span><span>Lives in your repository</span></div></div><ProjectPath /></div><div className="shell hero-bottom"><span>YOUR CODE. YOUR CONTEXT. A CLEAR NEXT STEP.</span><Link href="#how-it-works">Explore the workflow <span aria-hidden="true">↓</span></Link></div></section>

    <section className="shell section problem-section"><div className="section-intro"><p className="eyebrow">01 / The problem</p><h2>The session ends.<br />The project keeps going.</h2><p>A conversation can lose the details that matter. A development map gives the next session something concrete to work from.</p></div><div className="problem-list">{[
      ['Context fades', 'The decisions, constraints, and unfinished work are scattered across previous conversations.'],
      ['Plans drift', 'A roadmap can say “done” while the repository tells a different story.'],
      ['Changes need evidence', 'A new file or a confident answer does not establish that a feature works.'],
    ].map(([title, detail], i) => <div className="problem-item" key={title}><span className="mono problem-number">0{i + 1}</span><div><h3>{title}</h3><p>{detail}</p></div></div>)}</div></section>

    <section id="how-it-works" className="workflow-section"><div className="shell section"><div className="section-heading"><div><p className="eyebrow">02 / The workflow</p><h2>From a repository<br />to a reasoned next step.</h2></div><Link className="text-link" href="/docs/workflows/init/">Read the workflow reference <Arrow /></Link></div><ol className="workflow-steps">{steps.map(([title, detail], i) => <li key={title}><div className="step-top"><span className="step-number">0{i + 1}</span><span className="step-arrow" aria-hidden="true">→</span></div><h3>{title}</h3><p>{detail}</p></li>)}</ol><p className="workflow-note">Use natural language with your coding agent. <code>“Use DevThread to understand this project.”</code></p></div></section>

    <section className="shell section capabilities"><div className="section-heading"><div><p className="eyebrow">03 / What you keep</p><h2>A useful map.<br />A reviewable trail.</h2></div><p className="heading-description">Small Markdown and JSON files carry the project’s state alongside its source.</p></div><div className="capability-grid"><article className="capability featured-capability"><span className="capability-symbol" aria-hidden="true">⌘</span><h3>Context that survives<br />the conversation.</h3><p>Purpose, architecture, decisions, and task state live in <code>.devthread/</code>. A fresh agent session can read them before recommending work.</p><div className="artifact-label"><span className="mono">PROJECT.md → DECISIONS.md → tasks/</span></div></article><article className="capability"><span className="small-label">01 / Awareness</span><h3>Read the project as it is.</h3><p>Inspect structure, manifests, instructions, and Git state. Keep observed facts distinct from inferences.</p></article><article className="capability"><span className="small-label">02 / Traceability</span><h3>Connect requirements to work.</h3><p>Stable IDs, clear acceptance criteria, and dependencies link the plan to relevant source and tests.</p></article><article className="capability"><span className="small-label">03 / Direction</span><h3>Find work that can start.</h3><p>Recommend an eligible task using dependency state, priority, and recorded evidence.</p></article><article className="capability"><span className="small-label">04 / Verification</span><h3>Keep the check results.</h3><p>Record exact commands, passes, failures, and checks that could not run. Completion stays a review decision.</p></article></div></section>

    <section id="example" className="example-section"><div className="shell section"><div className="section-heading"><div><p className="eyebrow">04 / A concrete example</p><h2>The plan says what’s needed.<br />The evidence says where you are.</h2></div><span className="outline-label">Example · Taskboard</span></div><div className="example-grid"><div className="example-conversation"><div className="conversation-prompt"><span className="small-label">Developer prompt / example</span><p>“Compare the roadmap with the code. What can I work on next?”</p></div><div className="conversation-response"><span className="small-label">Condensed response / example</span><p>Adding and listing tasks is verified by the baseline tests. Completion is missing from the inspected source.</p><p><strong>TASK-002 can start.</strong> Its dependency is done, and the acceptance criteria cover preserving IDs and handling unknown tasks.</p><div className="evidence-row"><span className="evidence verified">✓ Verified</span><span className="evidence missing">◇ Missing</span></div></div><Link className="text-link" href="/docs/example/">Read the full tested session <Arrow /></Link></div><CodePanel title="tasks/TASK-002.md · before implementation">{[
      '---', 'id: TASK-002', 'title: "Complete a task without changing its ID"',
      'status: ready', 'priority: high', 'depends_on: [TASK-001]', 'requirements: [REQ-002]', '---', '',
      '## Acceptance Criteria', '- Completing an ID preserves that ID.', '- Other tasks remain unchanged.',
      '- An unknown ID leaves stored data unchanged.', '', '## Evidence', 'Assessment: missing.',
      'No completion operation found in src/ or tests/.',
    ].join('\n')}</CodePanel></div><div className="example-outcome"><span className="evidence verified">✓ After implementation</span><p>The Taskboard example passed four tests. TASK-002 stayed in <code>review</code>, with the earlier failure and a not-run concurrency check preserved in its report.</p></div></div></section>

    <section className="shell section compatibility-section"><div><p className="eyebrow">05 / Compatibility</p><h2>Tested where<br />we can show the evidence.</h2><p>DevThread uses the host agent’s model, tools, and repository access. Compatibility is recorded per environment.</p><Link className="text-link" href="/docs/compatibility/">See the compatibility matrix <Arrow /></Link></div><div className="compatibility-table"><div className="compatibility-row"><div><strong>Codex</strong><span>Windows · Python 3.13</span></div><span className="evidence verified">✓ Scripts tested</span></div><div className="compatibility-row"><div><strong>Other agents and platforms</strong><span>Packaging and workflows still need testing</span></div><span className="evidence unknown">? Untested</span></div><p>The renamed scripts pass local checks. Earlier agent and fresh-chat tests used the original DevMap name; discovery under DevThread still needs a fresh-chat check.</p></div></section>

    <section className="open-source-section"><div className="shell open-source-inner"><div><p className="eyebrow">06 / Open source</p><h2>Keep the map close to the code.</h2><p>Readable files. Local scripts. MIT licensed.<br />Help improve the skill, its examples, or its tested compatibility.</p></div><div className="open-source-actions">{site.githubUrl ? <a className="button button-outline" href={site.githubUrl}>View on GitHub <Arrow /></a> : <Link className="button button-outline" href="/docs/contributing/">Contribute to DevThread <Arrow /></Link>}<Link className="text-link" href="/docs/safety/">Read about safety and privacy →</Link></div></div></section>

    <section className="shell final-cta"><p className="eyebrow">Start with the repository you have.</p><h2>Give your next session<br />a place to begin.</h2><Link className="button" href="/docs/installation/">Install DevThread <Arrow /></Link><p>Then try the <Link href="/docs/quick-start-existing/">existing repository quick start</Link>.</p></section>
  </main><footer className="site-footer"><div className="shell footer-inner"><Link href="/" aria-label="DevThread home"><Brand /></Link><p>Know what’s built. See what’s next.</p><nav aria-label="Footer navigation"><Link href="/docs/">Docs</Link><Link href="/docs/contributing/">Contributing</Link><Link href="/docs/license/">MIT license</Link>{site.githubUrl && <a href={site.githubUrl}>GitHub ↗</a>}</nav></div></footer></>;
}
