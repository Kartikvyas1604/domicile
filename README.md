# MINTGATE — agent mint-trust gate

Local-first **DENY → evacuate → ALLOW** gate for Cashu agent spend. MINTGATE
DENYs agent spend against mints that fail auditor/KYM thresholds, then
auto-evacuates (melt → LN or rebalance → trusted mint) before the agent may
continue.

**Not a Cashu wallet.** Not CLERK. Not escrow. Not NWC/L402/CoinJoin/PayJoin.

Built for the Bitshala BOSS Battle · Machine Money track — ship by Oct 5, 2026.

## Demo law

The UI opens with **DENY**: 1,250 sats held on `mint.roulettesats.xyz` (auditor
41% < 95% floor, KYM 0.12 < 0.60). Never lead with wallet UX.

Demo script (≤ 4 min):

1. Policy allowlist + auditor floor (20s)
2. Proofs on a bad mint (30s)
3. Agent tries spend → **DENY** on screen (45s)
4. `Evacuate` — melt to LN or rebalance to trusted mint (60–90s)
5. Spend allowed → **ALLOW** (30s)
6. "Mint-trust gate for agents — not another Cashu wallet." (10s)

## UI surface

- **DENY hero** — blocking mint, held balance, reason codes, `Evacuate now` CTA
- **Evacuate panel** — pick `Rebalance` or `Melt to LN`, step timeline
- **Mint cards** — balances (mono, tabular), auditor success-rate + KYM meters
  with policy floor markers
- **Spend proxy** — simulate an agent spend; refused while DENY is active
- **Event log** — `DENY` / `EVACUATE_START` / `EVACUATE_OK` / `ALLOW` timeline
- **Auditor outage** — simulate `audit.8333.space` being down; cached scores +
  allowlist-only mode

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Honesty

- Venture Readiness 72/100, accepted via FOSS-bar override for this event only.
- Auditor scores are **signal, not ground truth** — documented in the UI.
- Demo funds/flows are simulated; the real daemon (CLI) is the source of truth.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Geist Sans/Mono ·
lucide-react. Near-black UI, one amber accent, mono for mint URLs and balances.
