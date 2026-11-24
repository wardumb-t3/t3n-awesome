import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const REGISTRY = join(ROOT, 'registry');

// Folder name ↔ entry type. The folder is what contributors see; the type is what the Directory syncs.
export const SECTIONS = [
  { dir: 'demos', type: 'demo', title: '🎬 Demos', blurb: 'End-to-end apps you can run.' },
  { dir: 'workflows', type: 'workflow', title: '🔐 Workflows', blurb: 'Confidential functions that run sealed in the enclave. Deploy or fork.' },
  { dir: 'tools', type: 'tool', title: '🧰 Tools', blurb: 'SDKs, scanners, CLIs and MCP servers.' },
  { dir: 'agents', type: 'agent', title: '🤖 Agents', blurb: 'Agents you can use today.' },
  { dir: 'learn', type: 'learn', title: '📚 Learn', blurb: 'Guides for building on T3N.', filter: (e) => e.runtime !== 'other' },
  { dir: 'learn', type: 'learn', title: '🌐 Ecosystem & Standards', blurb: 'The open standards trusted agents are built on.', filter: (e) => e.runtime === 'other' },
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
