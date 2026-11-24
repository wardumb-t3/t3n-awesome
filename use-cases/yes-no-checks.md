# Yes/no checks

**Problem:** most of the time an agent doesn't need a person's data, only a fact about it: are they
over 18, have they passed KYC, is their income above a threshold. Handing over the record to
answer the question exposes far more than the answer.

**Pattern:** store the record in the enclave once. Agents that have been granted access ask a
question and get back `true` or `false`. The person can delete the record at any time.

```text
Customer ──store──▶ vault (enclave)
Agent ──"over 18?"──▶ check workflow ──▶ true
Customer ──forget──▶ record deleted
```

**What makes it safe**

- The agent learns one bit, not a birthdate, ID number or salary.
- Only agents the customer granted access can ask.
- `forget` gives the customer a real delete.

**Run it**

- [Agent Vault Starter](https://github.com/Terminal-3/agent-vault-starter): the `store` / `check` / `forget` template, and the best first workflow to fork
- [Private Doc Scanner](https://github.com/Terminal-3/private-doc-scanner): fills the vault from a passport, payslip or bank statement read on the device
- Docs: [Write, build & register a workflow](https://docs.terminal3.io/developers/adk/get-started/walkthrough/write-contract)

**Mitigates:** [T1 data exfiltration via prompt injection](../threats/README.md#t1-data-exfiltration-via-prompt-injection), [T4 over-broad access](../threats/README.md#t4-over-broad-access)
