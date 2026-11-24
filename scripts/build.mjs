// Renders the README's registry block and dist/registry.json (the feed the Agent Directory syncs from).
// `--check` fails instead of writing when the README is out of date, so CI catches hand edits.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, SECTIONS, loadEntries } from './lib.mjs';

const START = '<!-- registry:start -->';
const END = '<!-- registry:end -->';
const BADGES = {
  'built-by-t3n': '![Built by T3N](https://img.shields.io/badge/built_by-T3N-0b2a4a)',
  'secured-on-t3n': '![Secured on T3N](https://img.shields.io/badge/secured_on-T3N-1f8fbf)',
  none: '',
};

const entries = loadEntries().map((e) => e.data);

function line(e) {
  const tags = e.pillars.map((p) => `\`${p}\``).join(' ');
  const stack = e.stack?.length ? ` · ${e.stack.join(', ')}` : '';
  const demo = e.demo_url ? ` · [Live demo](${e.demo_url})` : '';
  const listed = e.directory?.listed ? ' · 🏪 Recommended on Agent Directory' : '';
  const badge = BADGES[e.badge] ? ` ${BADGES[e.badge]}` : '';
  return `- [${e.name}](${e.url})${badge} — ${e.summary} ${tags}${stack}${demo}${listed}`;
}

function renderBlock() {
  const out = [START, '<!-- Generated from registry/ by `npm run build`. Edit the YAML, not this block. -->', ''];
  for (const s of SECTIONS) {
    const items = entries
      .filter((e) => e.type === s.type && (!s.filter || s.filter(e)))
      .sort((a, b) => a.name.localeCompare(b.name));
    out.push(`## ${s.title}`, '', s.blurb, '');
    out.push(...(items.length ? items.map(line) : ['_Nothing here yet. [Be the first →](CONTRIBUTING.md)_']), '');
  }
  out.push(END);
  return out.join('\n');
}

const readmePath = join(ROOT, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
const [head, rest] = readme.split(START);
if (rest === undefined || !rest.includes(END)) throw new Error(`README.md must contain ${START} and ${END}`);
const next = head + renderBlock() + rest.slice(rest.indexOf(END) + END.length);

if (process.argv.includes('--check')) {
  if (next !== readme) {
    console.error('error README.md is out of date with registry/. Run `npm run build` and commit the result.');
    process.exit(1);
  }
  console.log('ok    README.md is up to date');
} else {
  writeFileSync(readmePath, next);
  const feed = { version: 1, entries: [...entries].sort((a, b) => a.id.localeCompare(b.id)) };
  mkdirSync(join(ROOT, 'dist'), { recursive: true });
  writeFileSync(join(ROOT, 'dist', 'registry.json'), JSON.stringify(feed, null, 2) + '\n');
  console.log(`ok    wrote README.md and dist/registry.json (${entries.length} entries)`);
}
