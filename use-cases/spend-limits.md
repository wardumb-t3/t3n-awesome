# Spend limits

**Problem:** an agent that can pay for things can be tricked into paying the wrong party, or simply
loop and drain the budget. Policy written into the prompt isn't enforcement.

**Pattern:** the payment credential lives in the enclave, not with the agent. Every payment request
goes through a workflow that checks it against policy *before* paying, and writes it to a
tamper-evident ledger.

```text
Agent ──"pay 0.05 USDC to lookup-api"──▶ policy workflow (enclave)
                                          ├─ payee on allowlist?
                                          ├─ under per-call cap?
                                          ├─ within session budget?
                                          ├─ not a duplicate (idempotency key)?
                                          └─ pay ─▶ ledger entry
Operator ──revoke──▶ workflow refuses all further payments
```

**What makes it safe**

- The agent can ask for a payment but can't make one directly. It never holds the credential.
- The limits are enforced in code running in the enclave, so neither the agent nor the app server
  can bypass them.
- The ledger shows exactly what was spent, on what, and under which policy.

**Run it**

- [Spend-Controlled Call-Centre Agent](https://github.com/Terminal-3/adk-circle-call-centre-agent-demo): x402/USDC payments with allowlist, caps, budget, ledger and revoke
- Standards: [x402](https://github.com/coinbase/x402), [AP2](https://github.com/google-agentic-commerce/AP2)

**Mitigates:** [T2 runaway or unauthorised spend](../threats/README.md#t2-runaway-or-unauthorised-spend), [T5 no audit trail](../threats/README.md#t5-no-audit-trail)
