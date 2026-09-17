# agent.md — Domincil(Agent Mint-Trust Gate)

> Build-ready spec. COS PASS 2026-09-16 (Kartik FOSS-bar override — VR **72** accepted for Bitshala $1k FOSS track; org ≥75 waived **this event only**).
> Event: Bitshala BOSS Battle · Machine Money · https://boss-battle.devfolio.co/ · Ship by **Oct 5, 2026**.
> Cadence / Escapement / LATCH / ETHOnline **parked** — do not merge.
> Biggest risk: “Amethyst for agents” — **demo law = DENY → evacuate → ALLOW**. Never lead as generic Cashu wallet.

---

## One-Liner

**MINTGATE** is a local FOSS **agent mint-trust gate**: DENY Cashu agent spend against mints that fail auditor/KYM thresholds, then **auto-evacuate** (melt→LN or rebalance→trusted mint) before the agent may continue.

Not a Cashu wallet. Not CLERK (LN spend-policy). Not escrow. Not NWC/L402/CoinJoin/PayJoin.

**If mint-trust gate disappears:** agent can spend proofs on untrusted mints with no DENY+evacuate loop — product dead as designed.

---

## Problem & Target User

### Problem
Cashu mint trust is a real human UX problem (Amethyst EvacuateMintDialog). Agent Cashu wallets (cashu-agent, Ippon, hexnuts, cashu-skill) hold proofs on multi-mint setups with health/preferredMint — but **no** documented product **DENYs spend until evacuate** completes. Agents inherit mint panic without Amethyst.

### Target users
Builders running Cashu-backed agents who will hold proofs on random mints (cashu-agent / Ippon / hexnuts / cashu-skill builders).

### JTBD
"Put a gate in front of my agent so it cannot spend on a bad mint — and evacuate me first."

### Invention
Object: **mint-risk control plane** for agents — policy allowlist + auditor/KYM floor + DENY spend proxy + evacuate melt/rebalance.

### Explicit ≠ siblings

| | Amethyst evacuate | MintRadar / KYM | cashu-agent | CLERK (dead) | **MINTGATE** |
|---|---|---|---|---|---|
| Who | Human client | Monitor | Agent wallet | LN policy | **Agent mint-trust gate** |
| DENY spend | UI prompt | No | No | LN-side | **Yes until evacuate** |


---

## Hackathon Fit

| Field | Value |
|---|---|
| Event | Bitshala BOSS Battle (online) Sep 7 – Oct 5, 2026 · Results Oct 12 |
| Track | **Machine Money** ($1k) — Bitcoin × AI agents / automation / machine-to-machine |
| Delivery | FOSS · shippable demo by Oct 5 · team 1–3 |
| Honesty | VR **72** Mixed-leaning-strong; FOSS-bar override this event only. No guaranteed win. No fake TAM. |

**Disappear test:** Without DENY+evacuate as the hero, product collapses to Cashu tooling / Amethyst clone — fail originality.

---

## Market Validation Summary

| Field | Value |
|---|---|
| Venture Readiness | **72/100** (override PASS) |
| Twin similarity | **~35–45%** (Amethyst evacuate + cashu-agent health) — under 50% |
| Exact twin | **0** agent deny+auto-evacuate gate found |
| Biggest risk | “Amethyst for agents” + melt demo fragility |
| Cheapest test | 48h CLI to 5 Cashu agent builders: put Domincilin front of Ippon/cashu-agent? |

Pillars: Demand **7** · Timing **8** · Competition **8** · Customer **7** · GTM **7** · Execution **7** · Unit econ **6**. No pillar ≤5.

---

## MVP vs Forbidden

### MVP (law)

1. Policy file: allowlist mint URLs + min auditor success-rate / KYM floor.
2. `Domincilcheck` → **DENY** on bad mint with balance (exit non-zero + human-readable reason).
3. `Domincilevacuate` → melt to LN invoice **or** swap/rebalance to trusted mint.
4. Agent spend proxy: **refuse** send/pay while untrusted proofs remain.
5. Demo ≤4 min: inject bad-mint proofs → DENY → evacuate → ALLOW.
6. Consume external auditor/KYM (e.g. audit.8333.space / cashu-kym) — do not rebuild auditor.

### Forbidden
Rebuild full Cashu wallet · NWC wrapper · CLERK ledger · hold-invoice escrow · PayJoin · CoinJoin · L402 proxy · zap client · soft-sell as generic Cashu tooling · Cadence/Escapement/LATCH merge


---

## Non-Functionals

| NFR | Requirement |
|---|---|
| Demo law | Lead DENY → evacuate → ALLOW — never “we built Cashu” |
| FOSS | Open source; reproducible local install |
| Scope | CLI + minimal UI by Oct 5 |
| Dependency honesty | Auditor is signal not ground truth — document |
| UI | Near-black, one accent, mono for mint URLs/balances; no purple SaaS |
| Parked | Cadence / Escapement / LATCH untouched |

---

## Architecture and Stack

```
Agent (cashu-agent / Ippon / etc.)
        |
   Domincilspend proxy / check
        |
   Policy: allowlist + KYM/auditor floor
        |
   DENY if untrusted mint has proofs
        |
   evacuate: melt→LN  OR  rebalance→trusted mint
        |
   ALLOW only when all proofs on trusted mints
```

| Layer | Choice |
|---|---|
| Runtime | Local daemon/CLI (Rust or TypeScript — pick one; Prefer TS for Oct 5 speed unless Rust already in stack) |
| Cashu | Consume existing Cashu libs (nutshell client / cashu-ts) — **do not** rewrite wallet |
| Auditor | HTTP client to audit.8333.space and/or cashu-kym scores |
| LN melt | Via Cashu mint melt to bolt11 (trusted path) |
| UI | Minimal local web or TUI status (optional thin Next/Vite local) |
| Host | Local-first; GitHub FOSS |

---

## Data Model

**MintPolicy**
- `allowlist: string[]` (mint URLs)
- `minAuditorSuccessRate: number` (0–1)
- `minKymScore: number` (optional)
- `trustedMints: string[]`

**MintStatus**
- `url`, `balanceProofs`, `auditorOk`, `kymScore`, `trusted: bool`, `reason`

**EvacuatePlan**
- `fromMint`, `mode: MeltLN | Rebalance`, `toMint?`, `invoice?`, `amount`, `status`

**GateDecision**
- `ALLOW | DENY`, `blockingMints[]`, `next: evacuate | none`


---

## API / Program Spec (CLI)

```
Domincilinit                 # write default policy.yaml
Domincilpolicy show|set      # allowlist / floors
Domincilcheck [--json]       # scan wallets/proofs → ALLOW|DENY
Domincilevacuate [--melt|--rebalance]  # execute plan
Domincilproxy start          # local proxy agents call for spend
Domincilstatus               # trusted vs blocking mints
```

### Invariants
1. `check` returns DENY if any proof balance sits on mint failing policy.
2. Spend proxy refuses pay/send while DENY active.
3. `evacuate` must complete (or fail loud) before ALLOW.
4. Never silently spend on untrusted mint.

### Events / logs
`DENY(mint, reason)` · `EVACUATE_START` · `EVACUATE_OK` · `ALLOW`

---

## UX Flow

### Narrative law
Open with **DENY**. Judges must see blocked spend, then evacuate, then green ALLOW. Never open with wallet UX.

### Demo script (≤4 min)
1. Show policy allowlist + auditor floor (20s)
2. Inject / load proofs on a **bad** mint (30s)
3. Agent tries spend → **DENY** on screen (45s)
4. `evacuate` melt or rebalance → trusted mint (60–90s)
5. Spend allowed → **ALLOW** (30s)
6. One line: “Mint-trust gate for agents — not another Cashu wallet” (10s)

### Minimal UI (optional)
Status page: blocking mints · balances · Evacuate button · ALLOW/DENY badge.

---

## Success Metrics

| Metric | Target by Oct 5 |
|---|---|
| DENY path | Works on camera |
| Evacuate | Melt or rebalance succeeds in demo |
| ALLOW after | Only after evacuate |
| Twin distance | Narrative ≠ Amethyst/wallet |
| FOSS | Public repo + README |
| Demo | ≤4 min |

---

## Risks

| Risk | Mitigation |
|---|---|
| Amethyst-for-agents | Demo law DENY→evacuate→ALLOW |
| Melt fails live | Pre-bake trusted mint + fallback export path labeled honesty |
| Auditor down | Cache last scores + offline allowlist-only mode |
| Scope creep to full wallet | Forbidden — consume libs only |
| VR 72 override | Document FOSS-bar honesty in README |

---

## Build Roadmap

| Window | Ship |
|---|---|
| Week 1 | policy.yaml + `check` DENY + auditor client |
| Week 2 | `evacuate` melt/rebalance + spend proxy refuse |
| Week 3 | Demo script polish + minimal UI + README |
| Buffer | Second evacuate path; builder feedback |

Kill switch: if melt unstable by Sep 28 → ship DENY + export proofs + labeled “evacuate: rebalance only” — still DENY-first.

---

## Build Instructions for Codegen

Imperative. Near-black UI, one accent (amber or lime), mono mint URLs. No purple SaaS.

1. Scaffold FOSS repo `mintgate` with CLI.
2. Implement `policy.yaml` allowlist + auditor/KYM floors.
3. Integrate Cashu lib for proof inventory — **do not** rebuild wallet UX.
4. `Domincilcheck` → DENY with reason codes.
5. `Domincilevacuate` melt to bolt11 or rebalance to trusted mint.
6. Spend proxy refuses while DENY.
7. Demo fixture: bad-mint proofs → DENY → evacuate → ALLOW.
8. README: Machine Money track, ≠ Amethyst/wallet/CLERK, FOSS-bar VR 72 honesty, demo law.
9. Multi-commit history. Forbidden shapes never appear.

### Acceptance
≤4 min DENY→evacuate→ALLOW. No full Cashu wallet. No NWC/CLERK/escrow/CoinJoin/PayJoin. Cadence parked.

