import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const css = await readFile(new URL('../app/globals.css', import.meta.url), 'utf8');
function rgb(hex) {
  const expanded = hex.length === 4 ? '#' + [...hex.slice(1)].map(value => value + value).join('') : hex;
  return expanded.slice(1).match(/../g).map(value => parseInt(value, 16));
}
function luminance(color) {
  const [r, g, b] = (Array.isArray(color) ? color : rgb(color)).map(value => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => x - y);
  return (values[1] + 0.05) / (values[0] + 0.05);
}

let count = 0;
let minimum = Infinity;
for (const selector of [':root', '.dark']) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const block = css.match(new RegExp(escaped + '\\s*\\{([^}]+)\\}'))?.[1];
  assert.ok(block, `Missing ${selector} palette`);
  const colors = Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[\da-f]{3,6})\s*;/gi)].map(match => [match[1], match[2]]));
  const pairs = ['ink', 'muted', 'action', 'caution'].flatMap(foreground => ['canvas', 'surface', 'soft'].map(background => [foreground, background]));
  pairs.push(['action-ink', 'action']);
  for (const [foreground, background] of pairs) {
    assert.ok(colors[foreground] && colors[background], `Missing ${selector} color: ${foreground}/${background}`);
    const ratio = contrast(colors[foreground], colors[background]);
    assert.ok(ratio >= 4.5, `${selector} ${foreground}/${background}: ${ratio.toFixed(2)}:1 is below 4.5:1`);
    minimum = Math.min(minimum, ratio);
    count++;
  }
  const grid = block.match(/--grid:\s*rgba\(([^)]+)\)/)?.[1].split(',').map(Number);
  assert.ok(grid?.length === 4 && grid.every(Number.isFinite), `Missing ${selector} grid color`);
  // The two grid gradients overlap at intersections. Test the darkest/lightest
  // resulting background as well as the plain surfaces behind normal text.
  const coverage = 1 - (1 - grid[3]) ** 2;
  const intersection = rgb(colors.canvas).map((channel, i) => channel * (1 - coverage) + grid[i] * coverage);
  for (const foreground of ['ink', 'muted', 'action', 'caution']) {
    const ratio = contrast(colors[foreground], intersection);
    assert.ok(ratio >= 4.5, `${selector} ${foreground}/grid intersection: ${ratio.toFixed(2)}:1 is below 4.5:1`);
    minimum = Math.min(minimum, ratio);
    count++;
  }
}
console.log(`Passed ${count} palette and hero-grid text contrast checks; minimum ${minimum.toFixed(2)}:1. Rendered syntax colors, other overlays, and browser behavior require separate review.`);
