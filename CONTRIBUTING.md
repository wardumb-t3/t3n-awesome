# Contributing

Thanks for helping make agents safer. Adding an entry takes about five minutes.

## Add an entry

**The quick way:** open a [Submit an entry](../../issues/new?template=submit-entry.yml) issue. A
maintainer turns it into a pull request.

**The direct way:**

1. Copy [`registry/_template.yml`](registry/_template.yml) to `registry/<folder>/<id>.yml`.
   Folders: `demos`, `workflows`, `tools`, `agents`, `learn`.
2. Fill it in. The file name must match `id`.
3. Run `npm install && npm run validate && npm run build`, then commit both your YAML file and the regenerated `README.md`.
4. Open a pull request.

Don't edit the generated block of `README.md` by hand. CI regenerates it from `registry/` and fails
if the two disagree.

## What gets accepted

- ✅ **It's built on T3N.** It uses the T3N SDK or ADK, or ships a workflow that runs in a T3N
  enclave, and `t3n_features` says which parts. You don't need T3N installed to submit, but the
  project itself must use it.
- ✅ It solves an agent security or governance problem: identity, delegation, privacy, spend
  control, egress control, human-in-the-loop or audit.
- ✅ It's open source under an OSI-approved license, in a public repo, with a README that says how
  to run it.
- ✅ It works today. Demos need a video, GIF or live URL.
- ✅ The summary says what the agent can do safely, in one sentence, without marketing adjectives.
- ❌ Not built on T3N, closed source, paywalled, abandoned (no commits in 12 months), or a
  marketing page.

New to T3N? Start with the [ADK quickstart](https://docs.terminal3.io/developers/adk/get-started/quickstart)
and fork [Agent Vault Starter](https://github.com/Terminal-3/agent-vault-starter).

**Ecosystem & Standards** is curated by maintainers as background reading and isn't open for
submissions. To suggest a standard, open a discussion.

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

A maintainer will respond within three business days. Merged entries are announced in the monthly
roundup and appear on the Agent Directory.

By contributing you agree to the [Code of Conduct](CODE_OF_CONDUCT.md), and that your changes to
this list are released under [CC0](LICENSE).
