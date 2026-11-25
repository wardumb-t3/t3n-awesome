import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { ROOT, REGISTRY, SECTIONS, loadEntries } from './lib.mjs';

const ajv = new Ajv({ allErrors: true, useDefaults: false });
addFormats(ajv);
const validate = ajv.compile(JSON.parse(readFileSync(join(REGISTRY, 'schema.json'), 'utf8')));

const errors = [];
const warnings = [];
const seenIds = new Map();
const seenUrls = new Map();

for (const { dir, file, path, data } of loadEntries()) {
  const where = relative(ROOT, path);
  if (!validate(data)) {
    for (const e of validate.errors) errors.push(`${where}: ${e.instancePath || '/'} ${e.message}`);
    continue;
  }
  if (data.id !== file) errors.push(`${where}: id "${data.id}" must match the file name "${file}"`);
  const expected = SECTIONS.find((s) => s.dir === dir).type;
  if (data.type !== expected) errors.push(`${where}: type "${data.type}" belongs in registry/${SECTIONS.find((s) => s.type === data.type).dir}/`);
  if (seenIds.has(data.id)) errors.push(`${where}: duplicate id, also in ${seenIds.get(data.id)}`);
  const urlKey = data.url.toLowerCase();
  if (seenUrls.has(urlKey)) errors.push(`${where}: duplicate url, also in ${seenUrls.get(urlKey)}`);
  seenIds.set(data.id, where);
  seenUrls.set(urlKey, where);
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
if (errors.length) process.exit(1);
console.log(`ok    ${seenIds.size} entries valid`);
