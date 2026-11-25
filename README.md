<div align="center">

# Awesome Trusted AI [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

<sub>powered by <a href="https://agents.terminal3.io/?ref=awesome">T3N</a></sub>

**Agents, workflows & tools that run sealed inside TEEs.**<br>
Private by default · Permissioned by design · Auditable by proof

[Start here](#-start-here) · [Demos](#-demos) · [Workflows](#-workflows) · [Tools](#-tools) · [Threats](threats/) · [**Add yours →**](CONTRIBUTING.md)

</div>

AI agents are being handed passports, payment cards and API keys. This list collects working code
that lets an agent **use** that data without **seeing** it, spend money without overspending, and
prove afterwards what it did and who allowed it.

Every entry is built on [T3N](https://docs.terminal3.io/?ref=awesome), so its sensitive work runs
inside a Trusted Execution Environment (TEE): hardware-isolated code that neither the agent, the
app developer nor the server operator can read into. Every entry is open source and reviewed.

## Contents

- [🚀 Start here](#-start-here)
- [🎬 Demos](#-demos) — end-to-end apps you can run
- [🔐 Workflows](#-workflows) — confidential functions that run sealed in the enclave
- [🧰 Tools](#-tools) — SDKs, scanners, CLIs, MCP servers
- [🤖 Agents](#-agents) — agents you can use today
- [📚 Learn](#-learn) — guides for building on T3N
- [🌐 Ecosystem & Standards](#-ecosystem--standards)
- [🧩 Use cases](use-cases/) — problem → pattern → code
- [🛑 Agent Threat Catalogue](threats/) — what goes wrong, and which entry stops it

## 🚀 Start here

| I want to… | Go to |
| --- | --- |
| Ship my first confidential workflow | [Agent Vault Starter](https://github.com/Terminal-3/agent-vault-starter) |
| Let an agent book or buy without seeing user data | [Blind booking pattern](use-cases/blind-booking.md) |
| Cap what an agent can spend | [Spend limits pattern](use-cases/spend-limits.md) |
| Check a document without uploading it | [Private Doc Scanner](https://github.com/Terminal-3/private-doc-scanner) |
| Answer "is this user over 18?" without revealing a birthdate | [Yes/no checks pattern](use-cases/yes-no-checks.md) |
| Understand what can go wrong | [Agent Threat Catalogue](threats/) |

## Badges

| Badge | Meaning |
| --- | --- |
| ![Built by T3N](https://img.shields.io/badge/built_by-T3N-0b2a4a) | Made and maintained by the Terminal 3 team |
| ![Secured on T3N](https://img.shields.io/badge/secured_on-T3N-1f8fbf) | Community entry, **verified**: it runs on T3N, its WASM hash reproduces from source, and two maintainers reviewed it |
| 🏪 | Recommended on the [Agent Directory](https://agents.terminal3.io/?ref=awesome) |

Tags such as `privacy` or `spend-control` name the security control an entry demonstrates.

<!-- registry:start -->
<!-- Generated from registry/ by `npm run build`. Edit the YAML, not this block. -->

## 🎬 Demos

End-to-end apps you can run.

- [Safe Flight Booking for Muse](https://github.com/wardumb-t3/safe-flight-booking-muse) ![Built by T3N](https://img.shields.io/badge/built_by-T3N-0b2a4a) — Meta's Muse agent books real flights without ever seeing the passport. It's scanned on the phone, sealed to the user's vault and sent to Duffel from the enclave. `privacy` `delegation` · rust, wasm, node, vite
- [Spend-Controlled Call-Centre Agent](https://github.com/Terminal-3/adk-circle-call-centre-agent-demo) ![Built by T3N](https://img.shields.io/badge/built_by-T3N-0b2a4a) — Support agent buys paid lookups over x402/USDC with an allowlist, per-call cap, session budget, tamper-evident ledger and one-click revoke. `spend-control` `audit` · typescript, rust, wasm, nextjs

## 🔐 Workflows

Confidential functions that run sealed in the enclave. Deploy or fork.

- [Agent Vault Starter](https://github.com/Terminal-3/agent-vault-starter) ![Built by T3N](https://img.shields.io/badge/built_by-T3N-0b2a4a) — The store / check / forget template — agents ask "over 18?" or "KYC verified?" and get true/false, never the underlying record. Best first workflow. `privacy` `credentials` · rust, wasm
- [Z-Tenant Flight](https://github.com/Terminal-3/z-tenant-flight) ![Built by T3N](https://img.shields.io/badge/built_by-T3N-0b2a4a) — Enclave workflow that searches and books Duffel flights; traveller PII stays in sealed maps and outbound calls are locked to one host. `privacy` `egress-control` · rust, wasm, typescript

## 🧰 Tools

SDKs, scanners, CLIs and MCP servers.

- [Private Doc Scanner](https://github.com/Terminal-3/private-doc-scanner) ![Built by T3N](https://img.shields.io/badge/built_by-T3N-0b2a4a) — On-device OCR for passports, payslips and bank statements — the user confirms fields, only those are sealed to their vault, and enclave checks return pass/fail. `privacy` `credentials` · typescript, rust, wasm, pwa

## 🤖 Agents

Agents you can use today.

_Nothing here yet. [Be the first →](CONTRIBUTING.md)_

## 📚 Learn

Guides for building on T3N.

- [Placeholders in Outbound Calls](https://docs.terminal3.io/developers/adk/tips/placeholders-outbound-calls) ![Built by T3N](https://img.shields.io/badge/built_by-T3N-0b2a4a) — How a workflow calls a third-party API with the user's data filled in inside the enclave, so the agent never handles the values. `privacy` `egress-control`
- [T3N ADK Quickstart](https://docs.terminal3.io/developers/adk/get-started/quickstart) ![Built by T3N](https://img.shields.io/badge/built_by-T3N-0b2a4a) — Connect to T3N, create an organisation and invoke your first enclave workflow from TypeScript — the starting point for everything in this list. `privacy` `delegation`
- [Write, Build & Register a Workflow](https://docs.terminal3.io/developers/adk/get-started/walkthrough/write-contract) ![Built by T3N](https://img.shields.io/badge/built_by-T3N-0b2a4a) — Step-by-step walkthrough — write a Rust workflow, build it to WASM, register it and invoke it from an agent. `privacy`

## 🌐 Ecosystem & Standards

The open standards T3N builds on. Curated by maintainers as background reading.

- [Agent Payments Protocol (AP2)](https://github.com/google-agentic-commerce/AP2) — Protocol for agent-initiated payments built on signed mandates that prove what the user authorised. `spend-control` `delegation` `audit`
- [Agent2Agent (A2A) Protocol](https://github.com/a2aproject/A2A) — Open protocol for agents to discover each other and exchange tasks, including agent cards and authentication. `identity`
- [MCP Authorization](https://modelcontextprotocol.io/specification/draft/basic/authorization) — The Model Context Protocol's OAuth-based authorization spec — how agents get scoped access to MCP servers. `identity` `delegation`
- [OpenID for Verifiable Presentations](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html) — How a holder presents verifiable credentials to a verifier — the presentation layer T3N's credential flows build on. `credentials` `identity`
- [W3C Decentralized Identifiers](https://www.w3.org/TR/did-core/) — The DID standard behind agent and user identities on T3N — identifiers the subject controls, with no central registry. `identity`
- [W3C Verifiable Credentials 2.0](https://www.w3.org/TR/vc-data-model-2.0/) — The W3C data model for tamper-evident credentials that can be checked without calling the issuer. `credentials`
- [x402](https://github.com/coinbase/x402) — HTTP 402-based payments standard that lets agents pay for API calls with stablecoins, per request. `spend-control`

<!-- registry:end -->

## 🤝 Contributing

Built something that makes agents safer? **Add it in one file** — see [CONTRIBUTING.md](CONTRIBUTING.md).
Looking for something to build? Browse issues labelled
[`good first workflow`](../../labels/good%20first%20workflow) and [`bounty`](../../labels/bounty).

Every merged entry also appears on the [Agent Directory](https://agents.terminal3.io/?ref=awesome),
where teams look for agents and building blocks they can trust.

## License

[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png)](LICENSE)

The list is dedicated to the public domain under [CC0](LICENSE). Each linked project keeps its own license.

<sub>Maintained by the community · Stewarded by Terminal 3</sub>
