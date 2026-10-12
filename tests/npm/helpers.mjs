import { mkdtemp, realpath, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

export const root = fileURLToPath(new URL('../../', import.meta.url));
export const source = path.join(root, 'skill', 'devthread');
export const cli = path.join(root, 'bin', 'devthread.mjs');

export async function sandbox(t) {
  const parent = await realpath(tmpdir());
  const directory = await mkdtemp(path.join(parent, 'devthread-npm-test-'));
  t.after(async () => {
    // Only clean the unique temporary directory created by this test.
    assert.equal(path.dirname(directory), parent);
    assert.ok(path.basename(directory).startsWith('devthread-npm-test-'));
    await rm(directory, { recursive: true, force: true });
  });
  return directory;
}

export function command(executable, args, cwd) {
  const result = spawnSync(executable, args, { cwd, encoding: 'utf8', timeout: 120000 });
  if (result.error) throw result.error;
  return result;
}

export function npm(args, cwd) {
  assert.ok(process.env.npm_execpath, 'Run the package tests through npm test.');
  // Publication dry runs export npm_config_dry_run to lifecycle scripts.
  // Nested tests still need to create their temporary archive and installation.
  return command(process.execPath, [process.env.npm_execpath, '--dry-run=false', ...args], cwd);
}
