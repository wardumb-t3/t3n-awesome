// Turns an approved "Submit an entry" issue into a registry file. Run by .github/workflows/submission.yml.
//
//   parse          read ISSUE_BODY, check it, output the repo URL to clone
//   write <dir>    detect T3N usage in the cloned repo, write registry/<folder>/<id>.yml and the PR body
//
// The issue body is untrusted: it only ever reaches this script through an environment variable, and
// the cloned repo is only read, never executed. Messages for the issue go to $RUNNER_TEMP/comment.md.
import { appendFileSync, existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { stringify } from 'yaml';
import { ROOT, REGISTRY, SECTIONS, loadEntries } from './lib.mjs';
import { detect } from './detect-t3n.mjs';

const TMP = process.env.RUNNER_TEMP ?? '.';
const COMMENT = join(TMP, 'comment.md');
const PR_BODY = join(TMP, 'pr-body.md');
const PILLARS = ['identity', 'delegation', 'privacy', 'spend-control', 'egress-control', 'human-in-loop', 'audit', 'credentials'];
const REPO_URL = /^https:\/\/github\.com\/[A-Za-z0-9-]{1,39}\/[A-Za-z0-9._-]{1,100}$/;
// The Agent Directory files issues with this marker. Its submitters aren't GitHub users, so the
// issue author (the Directory's bot account) must not become the entry's maintainer.
const DIRECTORY_MARKER = '<!-- source: agent-directory -->';
const BUSINESS_FUNCTIONS = {
  'Payroll & HR': 'payroll-hr',
  'Finance & Payments': 'finance-payments',
  'Customer Support': 'customer-support',
  Healthcare: 'healthcare',
  Insurance: 'insurance',
  'Travel & Expense': 'travel-expense',
  'Identity & KYC': 'identity-kyc',
  'Legal & Compliance': 'legal-compliance',
  Others: 'others',
};

function output(key, value) {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
  else console.log(`${key}=${value}`);
}

function stop(message) {
  writeFileSync(COMMENT, `${message}\n\nA maintainer can fix the issue and re-apply the \`approved\` label to try again.\n`);
  output('ok', 'false');
  process.exit(0);
}

// Issue forms render each field as "### <label>" followed by the answer.
function parseForm(body) {
  const fields = {};
  const parts = body.replace(/\r\n/g, '\n').split(/^### /m).slice(1);
  for (const part of parts) {
    const nl = part.indexOf('\n');
    const label = part.slice(0, nl).trim();
    const value = part.slice(nl + 1).trim();
    fields[label] = value === '_No response_' ? '' : value;
  }
  return fields;
}

function checked(text) {
  return [...(text ?? '').matchAll(/^- \[[xX]\] (.+)$/gm)].map((m) => m[1].trim());
}

const cleanUrl = (v) => (v ?? '').trim().replace(/\.git$/, '').replace(/\/$/, '');

function read() {
  const body = process.env.ISSUE_BODY ?? '';
  const f = parseForm(body);
  const url = cleanUrl(f['Link'] ?? f['Repository URL']);
  const repoField = cleanUrl(f['Source code (optional)']);
  const businessFunction = (f['Business function'] ?? '').trim();
  const type = (f['Type'] ?? '').toLowerCase();
  const section = SECTIONS.find((s) => s.type === type);
  const entry = {
    name: (f['Name'] ?? '').trim(),
    url,
    section,
    summary: (f['One-sentence summary'] ?? '').replace(/\s+/g, ' ').trim(),
    pillars: checked(f['Security controls it demonstrates']).filter((p) => PILLARS.includes(p)),
    license: (f['License (optional)'] ?? f['License (SPDX)'] ?? '').trim(),
    demo: (f['Demo link (video, GIF or live URL)'] ?? '').trim(),
    builtWithT3n: checked(f['Confirm']).some((c) => /built with T3N/i.test(c)),
    provider: (f['Built by (optional)'] ?? '').trim(),
    businessFunction: BUSINESS_FUNCTIONS[businessFunction],
    pain: (f['Business problem it solves (optional)'] ?? '').replace(/\s+/g, ' ').trim(),
    // The repo the bot scans for T3N: the Link itself if it's a GitHub repo, else the Source code field.
    repo: REPO_URL.test(url) ? url : REPO_URL.test(repoField) ? repoField : '',
    fromDirectory: body.includes(DIRECTORY_MARKER),
  };

  const problems = [];
  if (!entry.name) problems.push('**Name** is empty.');
  if (!/^https:\/\/\S+$/.test(url)) problems.push('**Link** must be an https URL.');
  if (!section) problems.push('**Type** is missing.');
  if (!entry.summary) problems.push('**One-sentence summary** is empty.');
  if (!entry.pillars.length) problems.push('Tick at least one **security control**.');
  if (!entry.builtWithT3n) problems.push('The **built with T3N** box isn\'t ticked. Demos, workflows, tools and agents must be built with T3N.');
  if (entry.demo && !/^https:\/\/\S+$/.test(entry.demo)) problems.push('**Demo link** must be an https URL.');
  if (repoField && !REPO_URL.test(repoField)) problems.push('**Source code** must look like `https://github.com/owner/repo`.');
  if (businessFunction && !entry.businessFunction) problems.push('**Business function** isn\'t one of the listed options.');
  if (section?.type === 'agent' && !entry.businessFunction) problems.push('Agents need a **Business function**.');
  // GitHub owner/repo names are case-insensitive.
  const seen = new Set([url, entry.repo].filter(Boolean).map((u) => u.toLowerCase()));
  const existing = loadEntries().find((e) => [e.data.url, e.data.repo].some((u) => u && seen.has(u.toLowerCase())));
  if (existing) problems.push(`This is already listed as \`${existing.data.id}\`.`);
  if (problems.length) stop(`I couldn't turn this into an entry:\n\n${problems.map((p) => `- ${p}`).join('\n')}`);
  if (entry.section.type === 'learn') {
    writeFileSync(COMMENT, 'Thanks! Learn resources are reviewed by a maintainer, who will add the entry by hand.\n');
    output('ok', 'false');
    process.exit(0);
  }
  if (!entry.repo) {
    writeFileSync(COMMENT, "Thanks! There's no public GitHub repo to check for T3N automatically, so a maintainer will review it and add the entry by hand.\n");
    output('ok', 'false');
    process.exit(0);
  }
  return entry;
}

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
}

const [command, dir] = process.argv.slice(2);

if (command === 'parse') {
  output('url', read().repo);
  output('ok', 'true');
} else if (command === 'write' && dir) {
  const entry = read();
  const found = detect(dir);
  if (!found.builtWithT3n) {
    stop(
      `I couldn't find T3N in ${entry.repo}. I looked for a contract WIT world that imports \`host:tenant\` or ` +
        '`host:interfaces`, a `package.json` that depends on `@terminal3/t3n-sdk`, and `{{profile.*}}` placeholders.\n\n' +
        'Only projects built with T3N are accepted. If it is built with T3N in a way I missed, a maintainer can add the entry by hand.',
    );
  }

  const id = slug(entry.name);
  const file = join(REGISTRY, entry.section.dir, `${id}.yml`);
  if (!id || existsSync(file)) stop(`An entry with the id \`${id}\` already exists. A maintainer will pick a different id.`);

  const workflow = found.workflows[0];
  const data = {
    id,
    name: entry.name,
    type: entry.section.type,
    summary: entry.summary,
    url: entry.url,
    ...(entry.repo !== entry.url && { repo: entry.repo }),
    ...(entry.demo && { demo_url: entry.demo }),
    pillars: entry.pillars,
    runtime: 't3n',
    t3n_features: found.features,
    ...(entry.license && { license: entry.license }),
    badge: 'none',
    ...(!entry.fromDirectory && process.env.ISSUE_AUTHOR && { maintainers: [`@${process.env.ISSUE_AUTHOR}`] }),
    ...(entry.businessFunction && { business_function: entry.businessFunction }),
    ...(entry.pain && { pain: entry.pain }),
    ...(entry.provider && { provider: { name: entry.provider } }),
    ...(entry.section.type === 'workflow' && workflow && {
      contract: { wit_world: workflow.wit_world, ...(workflow.version && { version: workflow.version }) },
    }),
    added: new Date().toISOString().slice(0, 10),
  };
  writeFileSync(file, stringify(data, { lineWidth: 0 }));

  try {
    execFileSync('node', [join(ROOT, 'scripts', 'validate.mjs')], { stdio: 'pipe' });
  } catch (err) {
    unlinkSync(file);
    stop(`The entry didn't pass validation:\n\n\`\`\`\n${String(err.stdout ?? '')}${String(err.stderr ?? '')}\n\`\`\``);
  }

  const blob = (path) => `${entry.repo}/blob/HEAD/${path.split('/').map(encodeURIComponent).join('/')}`;
  const evidence = Object.entries(found.evidence).map(([f, path]) => `| \`${f}\` | [${path}](${blob(path)}) |`);
  writeFileSync(
    PR_BODY,
    [
      `Adds **${entry.name}** (${entry.url}) from #${process.env.ISSUE_NUMBER}${entry.fromDirectory ? ', submitted through the Agent Directory' : ''}.`,
      '',
      '### T3N usage found',
      '',
      '| Feature | Evidence |',
      '| --- | --- |',
      ...evidence,
      '',
      '### Maintainer checklist',
      '',
      '- [ ] The project does what the summary says, and developers can try it or learn from it',
      '- [ ] Add `protects` and `flow` (and `business_function`, `pain` if missing) for a full Agent Directory card',
      '',
      'Pull requests opened by this bot don\'t trigger CI, but the entry was validated before it was opened.',
      '',
      `Closes #${process.env.ISSUE_NUMBER}`,
    ].join('\n') + '\n',
  );
  writeFileSync(COMMENT, `Thanks! I found T3N usage (${found.features.map((f) => `\`${f}\``).join(', ')}) and opened a pull request for review.\n`);
  output('id', id);
  output('path', file.slice(ROOT.length + 1));
  output('ok', 'true');
} else {
  console.error('usage: node scripts/issue-to-entry.mjs parse | write <dir>');
  process.exit(2);
}
