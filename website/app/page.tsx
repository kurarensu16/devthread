import Link from 'next/link';
import { Header } from '@/components/header';
import { Brand } from '@/components/brand';
import { CodePanel } from '@/components/code-panel';
import { InstallCommand } from '@/components/install-command';
import { site } from '@/lib/site';

const steps = [
  { title: 'Install', actor: 'You · terminal', detail: 'Run the npm command to copy the skill into .agents/skills/devthread/. Your project map is created later.' },
  { title: 'Understand', actor: 'You ask · agent inspects', detail: 'Ask the agent to read your instructions, source, tests, and saved context. It reports facts, inferences, and unknowns.' },
  { title: 'Map', actor: 'You set a goal · agent plans', detail: 'Ask to initialize .devthread/ and plan a bounded goal. Review the Markdown tasks, criteria, and dependencies it writes.' },
  { title: 'Reconcile', actor: 'You ask · agent compares', detail: 'Ask the agent to compare the plan with code and available check results. It records gaps and conflicting evidence.' },
  { title: 'Resume', actor: 'You open a new chat', detail: 'Ask for status and the next task. The agent reads the saved files and explains which work can start and why.' },
];

function Arrow() { return <span aria-hidden="true">↗</span>; }

function ProjectPath() {
  return <figure className="project-path" aria-label="Taskboard example before implementation: TASK-002 is ready because its dependency is done">
    <div className="path-caption"><span className="live-dot" aria-hidden="true" /> Taskboard · before implementation</div>
    <div className="path-source">
      <span className="node-icon" aria-hidden="true">⌥</span>
      <div><span className="small-label">Repository inspected</span><strong>taskboard/</strong><span className="path-files">src/ · tests/ · AGENTS.md</span></div>
      <span className="outline-label">Observed</span>
    </div>
    <div className="path-connector"><span>Agent saves the findings</span></div>
    <div className="path-map">
      <div className="path-map-title"><span className="node-icon" aria-hidden="true">▦</span><div><span className="small-label">Context in your repository</span><strong>.devthread/</strong></div></div>
      <div className="map-file"><span>PROJECT.md</span><span>Purpose & constraints</span></div>
      <div className="map-file"><span>tasks/TASK-002.md</span><span>Criteria & dependencies</span></div>
      <div className="map-file"><span>reports/</span><span>Commands & outcomes</span></div>
    </div>
    <div className="path-connector"><span>Agent explains the next action</span></div>
    <div className="path-next">
      <div className="next-task-heading"><span className="small-label">TASK-002 · next action</span><span className="outline-label">Ready</span></div>
      <strong>Complete a task without changing its ID</strong>
      <dl className="next-reasons">
        <div><dt>Why it can start</dt><dd>TASK-001 is done; add/list checks pass.</dd></div>
        <div><dt>What is missing</dt><dd>No completion operation found in the inspected source.</dd></div>
      </dl>
      <p className="next-action">Implement completion, then check ID preservation and unknown-ID behavior.</p>
    </div>
    <p className="diagram-note">Condensed from the recorded example. <Link href="/docs/example/">Read the search, tests, and final state <Arrow /></Link></p>
  </figure>;
}

export default function Home() {
  return <><Header /><main id="main-content">
    <section className="hero blueprint-grid">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> An Agent Skill for your repository</p>
          <h1>Know what’s built.<br />See <span className="accent-text">what’s next.</span></h1>
          <p className="hero-subtitle">Keep AI development on track.</p>
          <p className="hero-description">Give your coding agent a project map it can read every session. DevThread keeps repository findings, tasks, and check results beside your code, so the agent can recommend work with a clear reason.</p>
          <div className="button-row"><Link className="button" href="/docs/installation/">Install DevThread <Arrow /></Link><Link className="text-link" href="/docs/example/">Explore the example <span aria-hidden="true">→</span></Link></div>
          <InstallCommand />
          <p className="install-requirements">Node.js 22+ for npm installation · Python 3 for local scripts</p>
          <div className="hero-meta"><span>Open source · MIT</span><span>Uses your coding agent’s model and tools</span></div>
        </div>
        <ProjectPath />
      </div>
      <div className="shell hero-bottom"><span>YOUR CODE. YOUR CONTEXT. A CLEAR NEXT STEP.</span><Link href="#how-it-works">Explore the workflow <span aria-hidden="true">↓</span></Link></div>
    </section>

    <section className="shell section problem-section">
      <div className="section-intro"><p className="eyebrow">01 / The problem</p><h2>The session ends.<br />The project keeps going.</h2><p>A new chat needs the decisions, constraints, and unfinished work that matter. Save those details where the next session can read them.</p></div>
      <div className="problem-list">{[
        ['Agents lose project context', 'Decisions and unfinished work are scattered across earlier conversations.'],
        ['Plans fall out of sync with code', 'A roadmap can say “done” while the implementation still has gaps.'],
        ['Completed work needs verification', 'A changed file needs a check tied to the behavior you expected.'],
      ].map(([title, detail], i) => <div className="problem-item" key={title}><span className="mono problem-number">0{i + 1}</span><div><h3>{title}</h3><p>{detail}</p></div></div>)}</div>
    </section>

    <section id="how-it-works" className="workflow-section">
      <div className="shell section">
        <div className="section-heading"><div><p className="eyebrow">02 / The workflow</p><h2>You set the goal.<br />Your agent follows the workflow.</h2></div><Link className="text-link" href="/docs/workflows/init/">Read the workflow reference <Arrow /></Link></div>
        <ol className="workflow-steps">{steps.map(({ title, actor, detail }, i) => <li key={title}>
          <div className="step-top"><span className="step-number">0{i + 1}</span><span className="step-arrow" aria-hidden="true">→</span></div>
          <div className="step-content"><h3>{title}</h3><span className="small-label step-actor">{actor}</span><p>{detail}</p></div>
        </li>)}</ol>
        <div className="workflow-note"><p>Start with <code>“Use $devthread to understand this repository.”</code></p><p>Workflows run when you ask the host agent. Planning updates <code>.devthread/</code>; source edits require an implementation request. <Link href="/docs/workflows/verify/">Ask for verification</Link> to run relevant available checks.</p></div>
      </div>
    </section>

    <section className="shell section capabilities">
      <div className="section-heading"><div><p className="eyebrow">03 / What you keep</p><h2>A useful map.<br />A reviewable trail.</h2></div><p className="heading-description">The map is a set of Markdown and JSON files you can inspect, edit, and version with the project.</p></div>
      <div className="capability-grid">
        <article className="capability featured-capability"><span className="capability-symbol" aria-hidden="true">⌘</span><h3>Context the next<br />session can read.</h3><p>The agent recovers the plan from saved files. You can review the same context before approving work.</p><ul className="artifact-files"><li><code>PROJECT.md</code><span>Purpose and current state</span></li><li><code>ARCHITECTURE.md</code><span>Findings and inferences</span></li><li><code>DECISIONS.md</code><span>Approved choices</span></li></ul></article>
        <article className="capability"><code className="artifact-path">tasks/TASK-002.md</code><h3>Tasks with clear boundaries.</h3><p>Scope, dependencies, and acceptance criteria explain what to build and when it can start.</p></article>
        <article className="capability"><code className="artifact-path">REQUIREMENTS.md → ROADMAP.md</code><h3>A plan linked to real work.</h3><p>Stable requirement and task IDs connect your goals to the code and checks inspected by the agent.</p></article>
        <article className="capability"><code className="artifact-path">reports/</code><h3>Checks you can trace.</h3><p>Exact commands and passed, failed, or not-run outcomes show which claims have evidence.</p></article>
        <article className="capability"><code className="artifact-path">config.json · Markdown files</code><h3>A map you can keep.</h3><p>The context stays inside your repository. DevThread needs no service or model API of its own.</p></article>
      </div>
    </section>

    <section id="example" className="example-section">
      <div className="shell section">
        <div className="section-heading"><div><p className="eyebrow">04 / A concrete example</p><h2>The recommendation<br />comes with a reason.</h2></div><span className="outline-label">Recorded example · Taskboard</span></div>
        <div className="example-grid">
          <div className="example-conversation">
            <div className="conversation-prompt"><span className="small-label">Developer prompt</span><p>“Compare the roadmap with the code. What can I work on next?”</p></div>
            <div className="conversation-response">
              <span className="small-label">Before implementation · condensed result</span>
              <h3>TASK-002 can start.</h3>
              <dl className="proof-reasons"><div><dt><span className="evidence verified">✓ Verified</span> Dependency satisfied</dt><dd>TASK-001 is done. Two baseline tests cover adding and listing tasks.</dd></div><div><dt><span className="evidence missing">◇ Missing</span> Completion operation</dt><dd>A bounded search of <code>src/</code> and <code>tests/</code> found no completion implementation.</dd></div></dl>
              <p><strong>Next action:</strong> implement completion, then verify preserved IDs, unchanged other tasks, and unknown-ID behavior.</p>
            </div>
            <Link className="text-link" href="/docs/example/">Read the full tested session <Arrow /></Link>
          </div>
          <CodePanel title="tasks/TASK-002.md · excerpt before implementation">{[
            '---', 'id: TASK-002', 'title: "Complete a task without changing its ID"',
            'status: ready', 'priority: high', 'depends_on: [TASK-001]', 'requirements: [REQ-002]', '---', '',
            '## Acceptance Criteria', '- Completing an ID preserves that ID.', '- Other tasks remain unchanged.',
            '- An unknown ID leaves stored data unchanged.', '', '## Evidence', 'Assessment: missing.',
            'No completion operation found in src/ or tests/.',
          ].join('\n')}</CodePanel>
        </div>
        <div className="example-outcome"><span className="evidence verified">✓ Four tests passed</span><p><strong>After implementation:</strong> the recorded checks verified the stated criteria. TASK-002 stayed in <code>review</code> awaiting acceptance. The report retains the earlier failure and a not-run concurrency check.</p></div>
        <dl className="evidence-key"><div><dt>Observed</dt><dd>Found during inspection; behavior may still need a check.</dd></div><div><dt>Verified</dt><dd>The stated criteria have recorded passing checks or review.</dd></div><div><dt>Missing</dt><dd>A bounded search found no implementation evidence.</dd></div><div><dt>In review</dt><dd>Work awaits verification or explicit acceptance, even when some checks pass.</dd></div></dl>
        <p className="evidence-limit">Evidence describes the checks performed. Task status describes progress. <Link href="/docs/evidence/">Read the evidence definitions</Link> and <Link href="/docs/task-lifecycle/">task lifecycle</Link>.</p>
      </div>
    </section>

    <section className="shell section compatibility-section">
      <div><p className="eyebrow">05 / Compatibility</p><h2>Tested where<br />we can show the evidence.</h2><p>Results are recorded per environment and type of check. The npm installer copies the skill; the coding agent interprets its instructions.</p><Link className="text-link" href="/docs/compatibility/">See the compatibility matrix <Arrow /></Link></div>
      <div className="compatibility-table">
        <div className="compatibility-row"><div><strong>Windows · Linux · macOS</strong><span>Installer, packed archive, and Python scripts<br />CI: Node 22/24 · Python 3.13 · 12 Oct 2026</span></div><span className="evidence verified">✓ CI passed</span></div>
        <div className="compatibility-row"><div><strong>npm registry installation</strong><span>Windows · Node 22.18.0 · Python 3.13<br />File fidelity and bundled scripts · 12 Oct 2026</span></div><span className="evidence verified">✓ Checked</span></div>
        <div className="compatibility-row"><div><strong>Codex discovery</strong><span>DevThread loaded on Windows from .agents/skills/<br />Separate fresh-chat workflow review pending</span></div><span className="outline-label">Observed</span></div>
        <div className="compatibility-row"><div><strong>Other coding agents</strong><span>Installation and workflows need their own checks</span></div><span className="evidence unknown">? Untested</span></div>
      </div>
    </section>

    <section className="open-source-section"><div className="shell open-source-inner"><div><p className="eyebrow">06 / Open source</p><h2>Keep the map close to the code.</h2><p><Link href="/docs/license/">MIT licensed</Link> · Published as <a href="https://www.npmjs.com/package/devthread/v/0.1.0">devthread@0.1.0</a><br />Help improve the skill, its examples, or its tested compatibility.</p></div><div className="open-source-actions">{site.githubUrl ? <a className="button button-outline" href={site.githubUrl}>View on GitHub <Arrow /></a> : <Link className="button button-outline" href="/docs/contributing/">Contribute to DevThread <Arrow /></Link>}<Link className="text-link" href="/docs/safety/">Read about safety and privacy →</Link></div></div></section>

    <section className="shell final-cta"><p className="eyebrow">Start with the repository you have.</p><h2>Give your next session<br />a place to begin.</h2><InstallCommand /><p className="install-requirements">Node.js 22+ for installation · Python 3 for local scripts · Your coding agent for the workflows</p><Link className="button" href="/docs/installation/">Install DevThread <Arrow /></Link><p>Then try the <Link href="/docs/quick-start-existing/">existing repository quick start</Link>.</p></section>
  </main><footer className="site-footer"><div className="shell footer-inner"><Link href="/" aria-label="DevThread home"><Brand /></Link><p>Know what’s built. See what’s next.</p><nav aria-label="Footer navigation"><Link href="/docs/">Docs</Link><Link href="/docs/contributing/">Contributing</Link><Link href="/docs/license/">MIT license</Link>{site.githubUrl && <a href={site.githubUrl}>GitHub ↗</a>}</nav></div></footer></>;
}
