import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, join, relative } from 'node:path';

const root = resolve('out');
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]))).flat();
}
const decode = value => value.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
const all = await files(root);
const htmlFiles = all.filter(path => path.endsWith('.html'));
const htmlByPath = new Map(await Promise.all(htmlFiles.map(async path => [path, await readFile(path, 'utf8')])));
const failures = [];
let count = 0;
for (const [path, html] of htmlByPath) {
  const pagePath = '/' + relative(root, path).replaceAll('\\', '/').replace(/index\.html$/, '');
  if ([...html.matchAll(/<h1\b/g)].length !== 1) failures.push(`${pagePath}: expected one primary heading`);
  if ([...html.matchAll(/<main\b/g)].length !== 1) failures.push(`${pagePath}: expected one main landmark`);
  if (!/<html\b[^>]*\blang="[^"]+"/.test(html)) failures.push(`${pagePath}: missing document language`);
  for (const match of html.matchAll(/\bhref="([^"]+)"/g)) {
    const href = decode(match[1]);
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    count++;
    const url = new URL(href, 'http://local.test' + pagePath);
    const pathname = decodeURIComponent(url.pathname);
    const target = resolve(root, '.' + pathname);
    if (target !== root && !target.startsWith(root + (process.platform === 'win32' ? '\\' : '/'))) {
      failures.push(`${pagePath}: path escapes export directory: ${href}`);
      continue;
    }
    let destination;
    for (const candidate of [target, join(target, 'index.html'), target + '.html']) {
      try { if ((await stat(candidate)).isFile()) { destination = candidate; break; } } catch { /* try next form */ }
    }
    if (!destination) { failures.push(`${pagePath}: missing ${href}`); continue; }
    if (url.hash && destination.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      const targetHtml = htmlByPath.get(destination) ?? await readFile(destination, 'utf8');
      const ids = [...targetHtml.matchAll(/\bid="([^"]+)"/g)].map(item => decode(item[1]));
      if (!ids.includes(id)) failures.push(`${pagePath}: missing anchor ${href}`);
    }
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Checked ${count} local links and anchors, plus basic document semantics, across ${htmlFiles.length} exported HTML files.`);
