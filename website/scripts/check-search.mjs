import { readFile, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { Buffer } from 'node:buffer';
import assert from 'node:assert/strict';
import { staticClient } from 'fumadocs-core/search/client/orama-static';

const root = resolve('out');
const index = await readFile(join(root, 'search-index.json'), 'utf8');
JSON.parse(index);
const endpoint = 'https://devthread-local.test/search-index.json';
const originalFetch = globalThis.fetch;
let fetches = 0;
// Use the browser adapter against the exported bytes without starting a server.
globalThis.fetch = async url => {
  assert.equal(url, endpoint);
  fetches++;
  return new globalThis.Response(index, { headers: { 'Content-Type': 'application/json' } });
};

const cases = [
  ['installation', '/docs/installation'],
  ['task lifecycle', '/docs/task-lifecycle'],
  ['legacy', '/docs/format'],
  ['safety', '/docs/safety'],
  ['verification', '/docs/evidence'],
  ['reconciliation', '/docs/reconciliation'],
];
const checked = new Set();
try {
  const client = staticClient({ from: endpoint });
  for (const [query, expectedPage] of cases) {
    const results = await client.search(query);
    assert.ok(results.some(result => new URL(result.url, endpoint).pathname.replace(/\/$/, '') === expectedPage), `No ${expectedPage} result for ${query}`);
    for (const result of results) {
      if (checked.has(result.url)) continue;
      checked.add(result.url);
      const url = new URL(result.url, endpoint);
      assert.equal(url.origin, new URL(endpoint).origin, 'Search result leaves the documentation site');
      const target = resolve(root, '.' + decodeURIComponent(url.pathname));
      assert.ok(target.startsWith(root + (process.platform === 'win32' ? '\\' : '/')), 'Search result escapes the static export');
      let destination;
      for (const candidate of [target, join(target, 'index.html'), target + '.html']) {
        try { if ((await stat(candidate)).isFile()) { destination = candidate; break; } } catch { /* try the next static form */ }
      }
      assert.ok(destination, `Missing exported search result ${result.url}`);
      if (url.hash) {
        const html = await readFile(destination, 'utf8');
        const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
        assert.ok(ids.includes(decodeURIComponent(url.hash.slice(1))), `Missing search result anchor ${result.url}`);
      }
    }
  }
  assert.deepEqual(await client.search('zzzzdevthreadnotawordqxyz'), []);
  assert.equal(fetches, 1, 'Search should reuse the downloaded static index');
  console.log(`Passed ${cases.length + 1} static search queries and ${checked.size} result destinations/anchors using the exported index (${Buffer.byteLength(index)} bytes). Browser dialog interaction requires separate review.`);
} finally {
  globalThis.fetch = originalFetch;
}
