import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, lstat, mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { installSkill, destinationFor, parseArguments } from '../../lib/install.mjs';
import { sandbox, source, cli, command } from './helpers.mjs';

async function snapshot(directory, relative = '') {
  const result = {};
  for (const entry of await readdir(path.join(directory, relative), { withFileTypes: true })) {
    if (entry.name === '__pycache__' || /\.(pyc|pyo)$/.test(entry.name) || entry.name === '.DS_Store') continue;
    const name = path.join(relative, entry.name);
    if (entry.isDirectory()) Object.assign(result, await snapshot(directory, name));
    else result[name] = await readFile(path.join(directory, name));
  }
  return result;
}

test('CLI copies the complete skill into a spaced project and preserves its files', async t => {
  const directory = await sandbox(t);
  const project = path.join(directory, 'my project');
  await mkdir(path.join(project, '.devthread'), { recursive: true });
  await writeFile(path.join(project, 'AGENTS.md'), 'Existing instructions\n');
  await writeFile(path.join(project, '.devthread', 'PROJECT.md'), 'Existing saved context\n');
  const result = command(process.execPath, [cli, 'install'], project);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(await snapshot(path.join(project, '.agents', 'skills', 'devthread')), await snapshot(source));
  assert.equal(await readFile(path.join(project, 'AGENTS.md'), 'utf8'), 'Existing instructions\n');
  assert.equal(await readFile(path.join(project, '.devthread', 'PROJECT.md'), 'utf8'), 'Existing saved context\n');
});

test('dry run checks the package but creates no destination or parents', async t => {
  const directory = await sandbox(t);
  const result = command(process.execPath, [cli, 'install', '--dry-run'], directory);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Would install/);
  assert.deepEqual(await readdir(directory), []);
});

test('custom destinations and explicit projects work from another current directory', async t => {
  const directory = await sandbox(t);
  const project = path.join(directory, 'other project');
  await mkdir(project);
  const projectResult = command(process.execPath, [cli, 'install', '--project', project], directory);
  assert.equal(projectResult.status, 0, projectResult.stderr);
  const custom = path.join(directory, 'custom location', 'devthread');
  const customResult = command(process.execPath, [cli, 'install', '--dest', custom], directory);
  assert.equal(customResult.status, 0, customResult.stderr);
  assert.deepEqual(await snapshot(custom), await snapshot(source));
});

test('existing directories, empty directories, and files remain untouched', async t => {
  const directory = await sandbox(t);
  for (const kind of ['directory', 'empty', 'file']) {
    const destination = path.join(directory, kind);
    if (kind === 'file') await writeFile(destination, 'user data');
    else await mkdir(destination);
    if (kind === 'directory') await writeFile(path.join(destination, 'SKILL.md'), 'custom skill');
    await assert.rejects(installSkill({ destination }), /Destination already exists/);
    await assert.rejects(installSkill({ destination, dryRun: true }), /Destination already exists/);
    if (kind === 'file') assert.equal(await readFile(destination, 'utf8'), 'user data');
    else if (kind === 'directory') assert.equal(await readFile(path.join(destination, 'SKILL.md'), 'utf8'), 'custom skill');
    else assert.deepEqual(await readdir(destination), []);
  }
});

test('linked and dangling linked destinations are refused', async t => {
  const directory = await sandbox(t);
  const target = path.join(directory, 'target');
  await mkdir(target);
  await writeFile(path.join(target, 'keep.txt'), 'untouched');
  for (const [name, linkTarget] of [['linked', target], ['dangling', path.join(directory, 'missing')]]) {
    const destination = path.join(directory, name);
    await symlink(linkTarget, destination, process.platform === 'win32' ? 'junction' : 'dir');
    await assert.rejects(installSkill({ destination }), /Destination already exists/);
    assert.ok((await lstat(destination)).isSymbolicLink());
  }
  assert.equal(await readFile(path.join(target, 'keep.txt'), 'utf8'), 'untouched');
});

test('concurrent installers reserve the destination once without merging', async t => {
  const directory = await sandbox(t);
  const destination = path.join(directory, 'devthread');
  const outcomes = await Promise.allSettled([installSkill({ destination }), installSkill({ destination })]);
  assert.equal(outcomes.filter(item => item.status === 'fulfilled').length, 1);
  assert.equal(outcomes.filter(item => item.status === 'rejected').length, 1);
  assert.deepEqual(await snapshot(destination), await snapshot(source));
});

test('incomplete or linked source resources fail before destination writes', async t => {
  const directory = await sandbox(t);
  const broken = path.join(directory, 'broken');
  await cp(source, broken, { recursive: true });
  await rm(path.join(broken, 'SKILL.md'));
  const destination = path.join(directory, 'new parents', 'devthread');
  await assert.rejects(installSkill({ destination, source: broken }), /Incomplete skill package/);
  await assert.rejects(lstat(path.dirname(destination)), { code: 'ENOENT' });
  await cp(source, broken, { recursive: true });
  await symlink(source, path.join(broken, 'linked-resource'), process.platform === 'win32' ? 'junction' : 'dir');
  await assert.rejects(installSkill({ destination, source: broken }), /Linked skill resources/);
  await assert.rejects(lstat(path.dirname(destination)), { code: 'ENOENT' });
});

test('invalid CLI options and nonexistent projects fail without installing', async t => {
  const directory = await sandbox(t);
  for (const args of [['--force'], ['--global', '--dest', path.join(directory, 'dest')], ['--project'], ['--project', path.join(directory, 'missing')]]) {
    const result = command(process.execPath, [cli, 'install', ...args], directory);
    assert.equal(result.status, 1, result.stdout);
    assert.deepEqual(await readdir(directory), []);
  }
  assert.throws(() => parseArguments(['install', '--dry-run', '--dry-run']), /Repeated option/);
});

test('project, global, relative, and home paths resolve on Windows and POSIX', () => {
  for (const [paths, cwd, home] of [[path.win32, 'C:\\work\\my project', 'C:\\Users\\Test User'], [path.posix, '/work/my project', '/home/test user']]) {
    const context = { paths, cwd, homeDirectory: home };
    assert.equal(destinationFor(parseArguments(['install']), context), paths.join(cwd, '.agents', 'skills', 'devthread'));
    assert.equal(destinationFor(parseArguments(['install', '--global']), context), paths.join(home, '.agents', 'skills', 'devthread'));
    assert.equal(destinationFor(parseArguments(['install', '--project', '../another']), context), paths.join(paths.resolve(cwd, '../another'), '.agents', 'skills', 'devthread'));
    assert.equal(destinationFor(parseArguments(['install', '--dest', '~/custom/devthread']), context), paths.join(home, 'custom', 'devthread'));
  }
});

test('global scope installs into the supplied home without touching a project', async t => {
  const directory = await sandbox(t);
  const project = path.join(directory, 'project');
  const homeDirectory = path.join(directory, 'home');
  await mkdir(project);
  const destination = destinationFor(parseArguments(['install', '--global']), { cwd: project, homeDirectory });
  await installSkill({ destination });
  assert.deepEqual(await snapshot(destination), await snapshot(source));
  assert.deepEqual(await readdir(project), []);
});
