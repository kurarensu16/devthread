import { lstat, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const bundledSkill = fileURLToPath(new URL('../skill/devthread/', import.meta.url));

export function parseArguments(args) {
  if (args.length === 0 || (args.length === 1 && ['--help', '-h'].includes(args[0]))) return { command: 'help' };
  if (args.length === 1 && args[0] === '--version') return { command: 'version' };
  if (args[0] !== 'install') throw new Error('Use devthread install. Run devthread --help for options.');
  const options = { command: 'install', dryRun: false, global: false };
  const seen = new Set();
  for (let i = 1; i < args.length; i++) {
    const flag = args[i];
    if (flag === '--help' || flag === '-h') return { command: 'help' };
    if (seen.has(flag)) throw new Error(`Repeated option: ${flag}`);
    seen.add(flag);
    if (flag === '--global') options.global = true;
    else if (flag === '--dry-run') options.dryRun = true;
    else if (flag === '--project' || flag === '--dest') {
      const value = args[++i];
      if (!value || value.startsWith('--')) throw new Error(`${flag} needs a directory path.`);
      options[flag === '--project' ? 'project' : 'dest'] = value;
    } else throw new Error(`Unknown option: ${flag}`);
  }
  if ([options.global, options.project !== undefined, options.dest !== undefined].filter(Boolean).length > 1) {
    throw new Error('Choose one of --global, --project, or --dest.');
  }
  return options;
}

export function destinationFor(options, { cwd = process.cwd(), homeDirectory = homedir(), paths = path } = {}) {
  function expand(value) {
    if (value === '~') return homeDirectory;
    if (value.startsWith('~/') || value.startsWith('~\\')) return paths.join(homeDirectory, value.slice(2));
    return paths.resolve(cwd, value);
  }
  if (options.dest) return expand(options.dest);
  const root = options.global ? homeDirectory : options.project ? expand(options.project) : cwd;
  return paths.join(root, '.agents', 'skills', 'devthread');
}

async function exists(target) {
  try { await lstat(target); return true; }
  catch (error) { if (error.code === 'ENOENT') return false; throw error; }
}

async function skillFiles(root, relative = '') {
  const files = [];
  for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
    if (entry.name === '__pycache__' || /\.(pyc|pyo)$/.test(entry.name) || entry.name === '.DS_Store') continue;
    const name = path.join(relative, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Linked skill resources are unsupported: ${name}`);
    if (entry.isDirectory()) files.push(...await skillFiles(root, name));
    else if (entry.isFile()) files.push({ name, bytes: await readFile(path.join(root, name)) });
    else throw new Error(`Unsupported skill resource: ${name}`);
  }
  return files;
}

export async function installSkill({ destination, dryRun = false, source = bundledSkill }) {
  if (await exists(destination)) throw new Error(`Destination already exists: ${destination}. Review the existing installation before updating.`);
  const files = await skillFiles(source);
  const required = ['SKILL.md', 'references/planning.md', 'templates/PROJECT.md', 'scripts/init.py', 'scripts/validate.py', 'scripts/status.py', 'scripts/_state.py'];
  for (const name of required) {
    if (!files.some(file => file.name === path.normalize(name))) throw new Error(`Incomplete skill package: missing ${name}`);
  }
  const manifest = files.find(file => file.name === 'SKILL.md').bytes.toString('utf8');
  const frontmatter = manifest.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  if (!frontmatter || !/^name: devthread\r?$/m.test(frontmatter)) throw new Error('The bundled skill must declare name: devthread.');
  if (dryRun) return { destination, dryRun: true, fileCount: files.length };

  await mkdir(path.dirname(destination), { recursive: true });
  try { await mkdir(destination); }
  catch (error) {
    if (error.code === 'EEXIST') throw new Error(`Destination already exists: ${destination}. No files were replaced.`);
    throw error;
  }
  // Reserve the destination exclusively. Write the manifest last so discovery
  // cannot load an installation whose supporting resources are still copying.
  files.sort((a, b) => Number(a.name === 'SKILL.md') - Number(b.name === 'SKILL.md'));
  try {
    for (const file of files) {
      const target = path.join(destination, file.name);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, file.bytes, { flag: 'wx' });
    }
  } catch (error) {
    throw new Error(`Installation did not finish at ${destination}: ${error.message}. Review the partial directory before retrying.`);
  }
  return { destination, dryRun: false, fileCount: files.length };
}

export async function validateProject(options, { cwd = process.cwd(), homeDirectory = homedir() } = {}) {
  if (options.global || options.dest) return;
  const destination = destinationFor(options, { cwd, homeDirectory });
  const project = path.resolve(destination, '../../..');
  try {
    if (!(await stat(project)).isDirectory()) throw new Error('not a directory');
  } catch {
    throw new Error(`Project directory must already exist: ${project}`);
  }
}
