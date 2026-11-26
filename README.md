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
app developer nor the server operator can read into. Every entry is reviewed and maintained by
the community or their code-owners.

## Contents

- [🚀 Start here](#-start-here)
- [🎬 Demos](#-demos) — end-to-end apps you can run, fork or modify
- [🔐 Workflows](#-workflows) — confidential functions that run sealed in the enclave
- [🧰 Tools](#-tools) — SDKs, scanners, CLIs, MCP servers
- [🤖 Agents](#-agents) — trusted agents you can use today
- [📚 Learn](#-learn) — how to build safe agentic solutions, workflows and processes
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

Tags such as `privacy` or `spend-control` name the security control an entry demonstrates.

<!-- registry:start -->
<!-- Generated from registry/ by `npm run build`. Edit the YAML, not this block. -->

## 🎬 Demos

End-to-end apps you can run, fork or modify.

- [Safe Flight Booking for Muse](https://github.com/wardumb-t3/safe-flight-booking-muse) ![Built by T3N](https://img.shields.io/badge/built_by-T3N-0b2a4a) — Meta's Muse agent books real flights without ever seeing the passport. It's scanned on the phone, sealed to the user's vault and sent to Duffel from the enclave. `privacy` `delegation` · rust, wasm, node, vite · Uses Z-Tenant Flight, Private Doc Scanner
- [Spend-Controlled Call-Centre Agent](https://github.com/Terminal-3/adk-circle-call-centre-agent-demo) ![Built by T3N](https://img.shields.io/badge/built_by-T3N-0b2a4a) — Support agent buys paid lookups over x402/USDC with an allowlist, per-call cap, session budget, tamper-evident ledger and one-click revoke. `spend-control` `audit` · typescript, rust, wasm, nextjs · Uses Spend Guard

## 🔐 Workflows

Confidential functions that run sealed in the enclave. Deploy or fork.

- [Agent Vault Starter](https://github.com/Terminal-3/agent-vault-starter) ![Built by T3N](https://img.shields.io/badge/built_by-T3N-0b2a4a) — Lets an AI ask yes/no questions about a customer, like "over 18?" or "KYC verified?", and get only true or false, never the record itself. `privacy` `credentials` · rust, wasm
- [Spend Guard](https://github.com/Terminal-3/adk-circle-call-centre-agent-demo/tree/main/contract) ![Built by T3N](https://img.shields.io/badge/built_by-T3N-0b2a4a) — Lets an AI pay for services only to approved payees, within a per-payment cap and a total budget; every payment is logged and can be stopped instantly. `spend-control` `audit` · rust, wasm · [Source](https://github.com/Terminal-3/adk-circle-call-centre-agent-demo)
- [Z-Tenant Flight](https://github.com/Terminal-3/z-tenant-flight) ![Built by T3N](https://img.shields.io/badge/built_by-T3N-0b2a4a) — Lets an AI search and book flights while the traveller's name, contact and passport details go only to the airline, straight from a sealed enclave. `privacy` `egress-control` · rust, wasm, typescript

## 🧰 Tools

SDKs, scanners, CLIs and MCP servers.

- [Private Doc Scanner](https://github.com/Terminal-3/private-doc-scanner) ![Built by T3N](https://img.shields.io/badge/built_by-T3N-0b2a4a) — On-device OCR for passports, payslips and bank statements — the user confirms fields, only those are sealed to their vault, and enclave checks return pass/fail. `privacy` `credentials` · typescript, rust, wasm, pwa

## 🤖 Agents

Trusted agents you can use today.

_Nothing here yet. [Be the first →](CONTRIBUTING.md)_

## 📚 Learn

Guides, courses, talks and patterns for building safe agentic solutions, workflows and processes, on any stack.

_Nothing here yet. [Be the first →](CONTRIBUTING.md)_

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
