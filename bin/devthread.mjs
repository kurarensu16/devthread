#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { parseArguments, destinationFor, installSkill, validateProject } from '../lib/install.mjs';

const help = `DevThread skill installer

Usage: devthread install [options]

  --project PATH  Install into PATH/.agents/skills/devthread (PATH must exist)
  --global        Install into ~/.agents/skills/devthread
  --dest PATH     Install into this exact skill directory
  --dry-run       Show the destination without writing files
  --help          Show this help
  --version       Print the package version

Default: install into .agents/skills/devthread in the current project.
Existing destinations are never replaced. Python 3 is required for skill scripts.
`;

try {
  const options = parseArguments(process.argv.slice(2));
  if (options.command === 'help') {
    console.log(help);
  } else if (options.command === 'version') {
    const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    console.log(pkg.version);
  } else {
    await validateProject(options);
    const destination = destinationFor(options);
    const result = await installSkill({ destination, dryRun: options.dryRun });
    console.log(`${result.dryRun ? 'Would install' : 'Installed'} DevThread (${result.fileCount} files) to ${destination}`);
    if (!result.dryRun) {
      console.log('Open a fresh Codex chat in your project and request: Use $devthread to understand this repository.');
    }
  }
} catch (error) {
  console.error(`DevThread: ${error.message}`);
  process.exitCode = 1;
}
