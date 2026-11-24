# Agent Threat Catalogue

What goes wrong when agents handle sensitive data or money, and which patterns and entries stop it.
Each threat links to a use case with runnable code.

| # | Threat | Mitigation | See |
| --- | --- | --- | --- |
| T1 | Data exfiltration via prompt injection | Keep the data out of the agent's context | [Blind booking](../use-cases/blind-booking.md), [Yes/no checks](../use-cases/yes-no-checks.md) |
| T2 | Runaway or unauthorised spend | Enforce limits in the enclave, before payment | [Spend limits](../use-cases/spend-limits.md) |
| T3 | Credential leakage | Credentials never leave the enclave | [Blind booking](../use-cases/blind-booking.md), [Spend limits](../use-cases/spend-limits.md) |
| T4 | Over-broad access | Grant answers, not records; scope grants per agent | [Yes/no checks](../use-cases/yes-no-checks.md) |
| T5 | No audit trail | Log every action with the policy that allowed it | [Spend limits](../use-cases/spend-limits.md) |

## T1. Data exfiltration via prompt injection

Anything in an agent's context can be leaked by text the agent reads: a web page, an email, a tool
result. Content filters reduce the risk but don't remove it. **Mitigation:** don't put the data
in the context. Have an enclave workflow use it on the agent's behalf and return only what the
agent needs.

## T2. Runaway or unauthorised spend

An agent with a payment method can be told to pay an attacker, or can loop and drain a budget.
Instructions in the prompt are suggestions, not limits. **Mitigation:** hold the credential in the
enclave and check every payment against an allowlist, a per-call cap and a session budget before it
happens.

## T3. Credential leakage

API keys, card numbers and passwords given to an agent end up in logs, traces and model provider
data. **Mitigation:** seal credentials in the enclave and have the workflow use them for outbound
calls, restricted to the hosts they're meant for.

## T4. Over-broad access

To answer one question, agents are often given a whole record or a whole account. **Mitigation:**
return the answer (`true` / `false`) instead of the record, and grant access per agent so it can
be revoked.

## T5. No audit trail

When an agent does something wrong, it's often impossible to show what it did and who authorised
it. **Mitigation:** record each action, with the policy that allowed it, somewhere neither the
agent nor the operator can rewrite.

---

Seen an incident or a threat that isn't here? Open a pull request. Real incidents with a public
source are especially welcome.
