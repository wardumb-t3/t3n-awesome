// Finds evidence that a checked-out repo is built with T3N, without running any of its code.
// Usage: node scripts/detect-t3n.mjs <dir>
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

const SKIP_DIRS = new Set(['.git', 'node_modules', 'target', 'dist', 'build', '.next', 'vendor']);
const SOURCE = /\.(rs|ts|tsx|js|mjs|cjs|py|go|json|toml|ya?ml)$/;
const MAX_BYTES = 256 * 1024;
const MAX_FILES = 5000;

// Host interfaces that say nothing about what the workflow does with user data.
const NEUTRAL_IMPORTS = new Set(['logging', 'clock']);
const IMPORT_FEATURE = { 'kv-store': 'sealed-maps', http: 'outbound-http', 'http-with-placeholders': 'http-placeholders' };

function* walk(dir, root = dir, seen = { n: 0 }) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full, { throwIfNoEntry: false });
    if (!st || st.isSymbolicLink()) continue;
    if (st.isDirectory()) yield* walk(full, root, seen);
    else if (st.size <= MAX_BYTES && ++seen.n <= MAX_FILES) yield { full, rel: relative(root, full) };
  }
}

/** The text inside `interface <name> { ... }`, matching braces so nested records don't end it early. */
function interfaceBody(wit, name) {
  const start = wit.search(new RegExp(`^\\s*interface\\s+${name}\\s*\\{`, 'm'));
  if (start < 0) return '';
  const open = wit.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < wit.length; i++) {
    if (wit[i] === '{') depth++;
    else if (wit[i] === '}' && --depth === 0) return wit.slice(open + 1, i);
  }
  return '';
}

export function detect(dir) {
  const features = new Map(); // feature -> first file that showed it
  const workflows = [];
  const add = (f, rel) => features.has(f) || features.set(f, rel);

  for (const { full, rel } of walk(dir)) {
    if (rel.endsWith('.wit')) {
      // Vendored host packages under wit/deps/ declare every interface; only the contract's own world counts.
      if (rel.split('/').includes('deps')) continue;
      const wit = readFileSync(full, 'utf8');
      const world = wit.match(/^\s*world\s+([a-z0-9-]+)/m);
      if (!world) continue;
      const pkg = wit.match(/^\s*package\s+[a-z0-9-]+:[a-z0-9-]+@([0-9][^;\s]*)\s*;/m);
      let isT3n = false;
      for (const [, ns, iface] of wit.matchAll(/^\s*import\s+host:(tenant|interfaces)\/([a-z0-9-]+)/gm)) {
        isT3n = true;
        if (ns === 'tenant') add('tenant-contract', rel);
        else if (!NEUTRAL_IMPORTS.has(iface)) add(IMPORT_FEATURE[iface] ?? iface, rel);
      }
      // The functions an agent can call: those declared in the world's exported `contracts` interface.
      const body = interfaceBody(wit, 'contracts');
      const functions = [...body.matchAll(/^\s*([a-z][a-z0-9-]*)\s*:\s*func\s*\(/gm)].map((m) => m[1]);
      if (isT3n) workflows.push({ path: rel, wit_world: world[1], version: pkg?.[1] ?? null, functions });
      continue;
    }
    if (!SOURCE.test(rel)) continue;
    const text = readFileSync(full, 'utf8');
    if (rel.endsWith('package.json') && /"@terminal3\/t3n-sdk"\s*:/.test(text)) add('t3n-sdk', rel);
    if (/\{\{\s*profile\.[a-z_]/i.test(text)) add('http-placeholders', rel);
  }

  return {
    builtWithT3n: features.size > 0,
    features: [...features.keys()].sort(),
    evidence: Object.fromEntries([...features].sort()),
    workflows,
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!process.argv[2]) {
    console.error('usage: node scripts/detect-t3n.mjs <dir>');
    process.exit(2);
  }
  console.log(JSON.stringify(detect(process.argv[2]), null, 2));
}
