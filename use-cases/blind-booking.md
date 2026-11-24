# Blind booking

**Problem:** to book a flight, an agent needs the traveller's name, contact details and passport.
Give those to the agent and they're in its context, its logs, and anywhere a prompt injection can
send them.

**Pattern:** the agent never receives the data. It asks an enclave workflow to make the booking.
The workflow fills the traveller's details into the outbound API call inside the enclave and sends
them only to the one host it's allowed to reach.

```text
Traveller's phone ──scan──▶ sealed vault (enclave)
                                   │
Agent ──"book offer X"──▶ workflow fills {{profile.*}} ──▶ api.duffel.com
  ▲                                │
  └──────── booking reference ─────┘
```

**What makes it safe**

- The traveller's data is sealed to their vault and readable only inside the enclave.
- Placeholders (`{{profile.passport_number}}`) are resolved in the enclave, so the agent's request
  never contains the values.
- An egress grant limits the workflow to a single host, so it can't be talked into sending the data
  anywhere else.

**Run it**

- [Z-Tenant Flight](https://github.com/Terminal-3/z-tenant-flight): the booking workflow
- [Safe Flight Booking for Muse](https://github.com/wardumb-t3/safe-flight-booking-muse): an end-to-end demo with a real agent
- [Private Doc Scanner](https://github.com/Terminal-3/private-doc-scanner): reads the passport on the phone
- Docs: [Placeholders in outbound calls](https://docs.terminal3.io/developers/adk/tips/placeholders-outbound-calls)

**Mitigates:** [T1 data exfiltration via prompt injection](../threats/README.md#t1-data-exfiltration-via-prompt-injection), [T3 credential leakage](../threats/README.md#t3-credential-leakage)
