'use client';

import { useState } from 'react';

export function InstallCommand() {
  const command = 'npx devthread install';
  const [status, setStatus] = useState<'idle' | 'copied' | 'unavailable'>('idle');

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setStatus('copied');
    } catch {
      setStatus('unavailable');
    }
  }

  return <div className="install-snippet">
    <div className="install-command">
      <pre role="region" aria-label="DevThread installation command" tabIndex={0}><code>{command}</code></pre>
      <button type="button" onClick={copyCommand} aria-label="Copy DevThread installation command">{status === 'copied' ? 'Copied' : 'Copy'}</button>
    </div>
    <span role="status" className={status === 'unavailable' ? 'copy-status' : 'sr-only'}>
      {status === 'copied' ? 'Installation command copied.' : status === 'unavailable' ? 'Clipboard unavailable. Select the command and copy it manually.' : ''}
    </span>
  </div>;
}
