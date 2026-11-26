# Agent Directory sync

The repo and the [Agent Directory](https://agents.terminal3.io) are two front doors onto one list:

- **This repo** is for developers: entries are written as YAML, reviewed in pull requests and starred.
- **The Agent Directory** is for business users: they submit through a form and browse polished cards.

Every entry lives in `registry/`, whichever door it came through.

## The flow

```text
Directory "List your agent" form
  → GitHub issue in this repo (label: submission, marker <!-- source: agent-directory -->)
  → maintainer adds `approved` → submission bot checks the source repo for T3N and opens a PR
  → PR merged → registry.json republished to GitHub Pages
  → Directory reads the feed and shows the entry
```

1. **Form → issue.** The Directory files the issue with the same headings as
   [`.github/ISSUE_TEMPLATE/submit-entry.yml`](../.github/ISSUE_TEMPLATE/submit-entry.yml), so the bot
   parses both the same way. Only fields meant to be public go in the issue: name, link, type, provider,
   business function, business problem, summary, source repo and security controls. The submitter's
   contact email and traction stay in the Directory's own database.
2. **Issue → PR.** Unchanged from GitHub submissions, except the bot doesn't list the issue author as
   a maintainer, because Directory issues are filed by a bot account. A submission with no public
   GitHub repo gets a reply saying a maintainer will add it by hand.
3. **PR → feed.** `publish.yml` publishes `registry.json` on every push to `main`.
4. **Feed → Directory.** The Directory fetches the feed and caches it for an hour, so a merged entry
   appears within the hour. No database changes are needed.

## Field mapping

| Registry | Directory |
| --- | --- |
| `name`, `summary` | card title, one-liner |
| `url`, `repo` | "Visit" and "Source" links |
| `type` | the kind chip (Agent, Workflow, Tool, Demo, Learn) |
| `business_function` | category (`categories.slug`) |
| `pain` | the business problem |
| `provider.name` | "by …" |
| `pillars` | the security-control tags |
| `badge` | Built by T3N / Secured on T3N |

## Directory configuration

All of these are off unless set, so a deployment without them behaves exactly as before.

| Variable | Purpose |
| --- | --- |
| `COMMUNITY_FEED_URL` | The published `registry.json`. Turns on the community section. |
| `AWESOME_REPO` | `owner/name` of this repo. With the token, turns on filing issues from the form. |
| `AWESOME_GITHUB_TOKEN` | Fine-grained token with **Issues: read and write** on this repo only. Server-side; never `NEXT_PUBLIC_`. |
