import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const REGISTRY = join(ROOT, 'registry');

// Folder name ↔ entry type. The folder is what contributors see; the type is what the Directory syncs.
export const SECTIONS = [
  { dir: 'demos', type: 'demo', title: '🎬 Demos', blurb: 'End-to-end apps you can run, fork or modify.' },
  { dir: 'workflows', type: 'workflow', title: '🔐 Workflows', blurb: 'Confidential functions that run sealed in the enclave. Deploy or fork.' },
  { dir: 'tools', type: 'tool', title: '🧰 Tools', blurb: 'SDKs, scanners, CLIs and MCP servers.' },
  { dir: 'agents', type: 'agent', title: '🤖 Agents', blurb: 'Trusted agents you can use today.' },
  { dir: 'learn', type: 'learn', title: '📚 Learn', blurb: 'Guides and tutorials for building on T3N.' },
];

export function loadEntries() {
  const entries = [];
  for (const dir of [...new Set(SECTIONS.map((s) => s.dir))]) {
    const path = join(REGISTRY, dir);
    for (const file of readdirSync(path).filter((f) => f.endsWith('.yml')).sort()) {
      const full = join(path, file);
      entries.push({ dir, file: basename(file, '.yml'), path: full, data: parse(readFileSync(full, 'utf8')) });
    }
  }
  return entries;
}
