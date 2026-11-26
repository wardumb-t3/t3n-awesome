# Agent Directory sync

Every merged entry in `registry/` also appears on the [Agent Directory](https://agents.terminal3.io).
This repo is where entries are written and reviewed; the Directory is where people browse them.

## The feed

On every push to `main`, [`publish.yml`](../.github/workflows/publish.yml) publishes
`registry.json` to GitHub Pages:

```json
{ "version": 1, "entries": [ { "id": "z-tenant-flight", "type": "workflow", "badge": "built-by-t3n", ... } ] }
```

Each entry follows [`registry/schema.json`](../registry/schema.json). Fields that map directly onto the
Directory:

| Registry | Directory |
| --- | --- |
| `id` | `resources.id` (join key) |
| `name`, `summary` | `name`, `oneliner` |
| `pain`, `protects` | `pain`, `protect_summary` |
| `flow.source` / `flow.enclave` / `flow.agent` | `flow_source` / `flow_enclave` / `flow_agent` |
| `business_function` | `category_slug` |
| `provider` | `providers` (upsert on slug) |
| `did` | `did` (agents only) |
| `badge` | `tier`: `built-by-t3n` → `built_by_t3n`, `secured-on-t3n` → `secured_on_t3n`, `none` → `community` |

## Directory-side schema

Curated listings stay in `agents`, untouched by the sync. Community entries go in a separate table
that only the sync writes, and the Browse page reads a view over both.

```sql
CREATE TYPE resource_kind AS ENUM ('agent','workflow','tool','demo','learn');
CREATE TYPE trust_tier    AS ENUM ('recommended','built_by_t3n','secured_on_t3n','community');

CREATE TABLE public.resources (           -- written only by the sync-registry function
  id              text PRIMARY KEY,
  kind            resource_kind NOT NULL,
  name            text NOT NULL,
  provider_id     uuid REFERENCES providers(id),
  category_slug   text REFERENCES categories(slug),
  pillars         text[] NOT NULL DEFAULT '{}',
  oneliner        text NOT NULL,
  pain            text,
  protect_summary text,
  flow_source text, flow_enclave text, flow_agent text,
  source_url      text NOT NULL,
  demo_url        text,
  stack           text[] NOT NULL DEFAULT '{}',
  license         text,                   -- optional: SPDX id or Proprietary
  tier            trust_tier NOT NULL DEFAULT 'community',
  wasm_sha256     text, wit_world text, contract_version text,
  did             text,
  agent_id        text UNIQUE REFERENCES agents(id),   -- set when promoted to Recommended
  status          text NOT NULL DEFAULT 'active',      -- archived when removed from the registry
  synced_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE agent_applications ADD COLUMN resource_id text REFERENCES resources(id), ADD COLUMN source_url text;

CREATE VIEW public.directory_items AS
  SELECT a.id, 'agent'::resource_kind AS kind, 'recommended'::trust_tier AS tier, a.name, a.provider_id,
         a.category_slug, coalesce(r.pillars, '{}') AS pillars, a.oneliner, a.pain, a.protect_summary,
         r.source_url, a.listed_at
  FROM agents a LEFT JOIN resources r ON r.agent_id = a.id
  WHERE a.status = 'approved'
UNION ALL
  SELECT r.id, r.kind, r.tier, r.name, r.provider_id, r.category_slug, r.pillars, r.oneliner, r.pain,
         r.protect_summary, r.source_url, r.synced_at::date
  FROM resources r
  WHERE r.status = 'active' AND r.agent_id IS NULL;
```

## Sync rules

1. **Repo → Directory, on every merge.** The Directory's `sync-registry` function reads the feed,
   upserts `resources` and `providers`, and archives rows whose `id` is no longer in the feed. It
   never writes to `agents`.
2. **Promotion to Recommended** goes through the existing `agent_applications` review. On approval,
   staff create the `agents` row and set `resources.agent_id`; the curated row then replaces the
   community one in `directory_items`.

Not built yet: the `sync-registry` function and the migration above.
