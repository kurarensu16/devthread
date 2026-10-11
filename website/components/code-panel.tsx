import type { ReactNode } from 'react';

export function CodePanel({ title, children }: { title: string; children: ReactNode }) {
  return <div className="code-panel"><div className="code-label"><span aria-hidden="true">⌘</span> {title}</div><pre role="region" aria-label={title + ' code'} tabIndex={0}><code>{children}</code></pre></div>;
}
