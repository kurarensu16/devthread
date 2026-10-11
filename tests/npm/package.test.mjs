import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { root, source, sandbox, npm, command } from './helpers.mjs';

async function resources(directory, prefix = '') {
  const names = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === '__pycache__' || /\.(pyc|pyo)$/.test(entry.name) || entry.name === '.DS_Store') continue;
    const name = prefix + entry.name;
    if (entry.isDirectory()) names.push(...await resources(path.join(directory, entry.name), name + '/'));
    else names.push(name);
  }
  return names;
}

test('packed npm package installs offline and its bundled scripts initialize and recover state', async t => {
  const directory = await sandbox(t);
  const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  assert.deepEqual(pkg.dependencies ?? {}, {});
  assert.equal((await readFile(path.join(source, 'LICENSE'), 'utf8')).replaceAll('\r\n', '\n'), (await readFile(path.join(root, 'LICENSE'), 'utf8')).replaceAll('\r\n', '\n'));
  const pack = npm(['pack', '--json', '--ignore-scripts', '--pack-destination', directory, '--cache', path.join(directory, 'cache')], root);
  assert.equal(pack.status, 0, pack.stderr);
  const [archive] = JSON.parse(pack.stdout);
  const packedFiles = archive.files.map(file => file.path);
  for (const resource of await resources(source)) assert.ok(packedFiles.includes('skill/devthread/' + resource), `missing ${resource}`);
  for (const file of packedFiles) assert.ok(/^(package\.json|README\.md|LICENSE|bin\/[^/]+\.mjs|lib\/[^/]+\.mjs|skill\/devthread\/(SKILL\.md|LICENSE)|skill\/devthread\/(references|templates)\/[^/]+\.md|skill\/devthread\/scripts\/[^/]+\.py)$/.test(file), `unintended package file: ${file}`);

  const consumer = path.join(directory, 'fresh npm consumer');
  await mkdir(consumer);
  await writeFile(path.join(consumer, 'package.json'), '{"private":true}\n');
  const install = npm(['install', path.join(directory, archive.filename), '--offline', '--ignore-scripts', '--no-audit', '--no-fund', '--no-package-lock', '--cache', path.join(directory, 'cache')], consumer);
  assert.equal(install.status, 0, install.stderr);
  const project = path.join(directory, 'my software project');
  await mkdir(project);
  await writeFile(path.join(project, 'AGENTS.md'), 'Keep these project instructions\n');
  // Exercise npm's actual executable shim, not the checkout's CLI.
  const installed = npm(['exec', '--offline', '--no', '--', 'devthread', 'install', '--project', project], consumer);
  assert.equal(installed.status, 0, installed.stderr);
  const skill = path.join(project, '.agents', 'skills', 'devthread');
  for (const resource of await resources(source)) assert.deepEqual(await readFile(path.join(skill, resource)), await readFile(path.join(source, resource)));

  const python = process.env.DEVTHREAD_TEST_PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
  for (const [script, args] of [['init.py', []], ['validate.py', []], ['status.py', ['--json']]]) {
    const result = command(python, [path.join(skill, 'scripts', script), project, ...args], consumer);
    assert.equal(result.status, 0, result.stderr);
    if (script === 'status.py') assert.deepEqual(JSON.parse(result.stdout).eligible, []);
  }
  assert.equal(await readFile(path.join(project, 'AGENTS.md'), 'utf8'), 'Keep these project instructions\n');
  const repeat = npm(['exec', '--offline', '--no', '--', 'devthread', 'install', '--project', project], consumer);
  assert.equal(repeat.status, 1);
  assert.match(repeat.stderr, /Destination already exists/);
});
