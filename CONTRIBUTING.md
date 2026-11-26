# Contributing

Thanks for helping make agents safer. Adding an entry takes about five minutes.

## Add an entry

**The quick way:** open a [Submit an entry](../../issues/new?template=submit-entry.yml) issue.
When a maintainer approves it, a bot checks your repo for T3N usage, writes the entry and opens the
pull request. You don't need to touch git.

**Not on GitHub?** Business users can apply through the
[Agent Directory](https://agents.terminal3.io/build?ref=awesome). The Directory files the issue here
for you.

**The direct way:**

1. Copy [`registry/_template.yml`](registry/_template.yml) to `registry/<folder>/<id>.yml`.
   Folders: `demos`, `workflows`, `tools`, `agents`, `learn`.
2. Fill it in. The file name must match `id`.
3. Open a pull request. You can do all of this in the GitHub web editor.

CI validates your entry. You don't need to touch `README.md`: it's regenerated from `registry/`
after merge. To check locally first, run `npm install && npm run validate`.

## What gets accepted

- ✅ **Demos, workflows, tools and agents are built on T3N.** They use the T3N SDK or ADK, or ship
  a workflow that runs in a T3N enclave, and `t3n_features` says which parts. You don't need T3N
  installed to submit, but the project itself must use it.
- ✅ It solves an agent security or governance problem: identity, delegation, privacy, spend
  control, egress control, human-in-the-loop or audit.
- ✅ Developers can try it or learn from it: a public repo, docs, a demo or a product page that
  explains what it does and how to use it. Open source is welcome but not required.
- ✅ It works today. Demos need a video, GIF or live URL.
- ✅ The summary says what the agent can do safely, in one sentence, without marketing adjectives.
- ❌ A demo, workflow, tool or agent not built on T3N, nothing a developer can try or read, abandoned (no commits in 12 months), or a
  marketing page.

**Learn** is broader. It takes guides, courses, talks, papers and patterns on building safe agentic
solutions, workflows and processes, whatever stack they use. A Learn entry must teach something
practical about agent identity, permissions, privacy, spend control, human oversight or audit, and
be free to read or watch.

New to T3N? Start with the [ADK quickstart](https://docs.terminal3.io/developers/adk/get-started/quickstart)
and fork [Agent Vault Starter](https://github.com/Terminal-3/agent-vault-starter).

## Badges

| Badge | How to get it |
| --- | --- |
| *(none)* | Merged: a maintainer ran it and it does what the summary says |
| **Secured on T3N** | Verified: the workflow runs on T3N, its WASM hash (`contract.wasm_sha256`) reproduces from the tagged source, and two maintainers reviewed it |
| **Built by T3N** | Made and maintained by the Terminal 3 team, held to the same bar |

Leave `badge: none` in your submission. To be considered for **Secured on T3N**, ask for
verification in your pull request.

## Writing a good entry

- **`summary`**: lead with the outcome. "Agent books flights without seeing the passport" beats
  "A powerful, privacy-first booking solution".
- **`pain`, `protects`, `flow`**: these become your card on the
  [Agent Directory](https://agents.terminal3.io/?ref=awesome). Write them for a security reviewer.
- **`pillars`**: pick the controls the entry actually demonstrates, not every one it touches.

## Review

**How submissions are processed:** a maintainer reads the issue and adds the `approved` label. The
bot then clones your repo (it never runs your code) and looks for T3N usage: a contract WIT world
importing T3N host interfaces, the `@terminal3/t3n-sdk` package, or `{{profile.*}}` placeholders. If
it finds some, it fills in `t3n_features` and opens a pull request for final review. If it doesn't,
it replies on the issue explaining why.

A maintainer will respond within three business days. Merged entries are announced in the monthly
roundup and appear on the Agent Directory.

By contributing you agree to the [Code of Conduct](CODE_OF_CONDUCT.md), and that your changes to
this list are released under [CC0](LICENSE).
