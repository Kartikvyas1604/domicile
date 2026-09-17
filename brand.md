# Brand — MINTGATE

_Decided by codegen at the user's request ("pick what fits best"). Source of
truth for every color, font, and copy decision in this project._

## Palette (dark-only, by spec: near-black, one accent)

| Token | Value | Use |
|---|---|---|
| `--background` | `#09090b` | Page base |
| `--surface` | `#101012` | Cards, elevated panels |
| `--muted` | `#1a1a1d` | Skeletons, meter tracks, hover fills |
| `--muted-foreground` | `#9b9ba1` | Secondary text (≥ 4.5:1 on base) |
| `--foreground` | `#ececed` | Primary text |
| `--border` | `#232327` | 1px separators only |
| `--accent` | `#f5b52e` | Amber — CTAs, evacuate flow, gate ring |
| `--accent-foreground` | `#09090b` | Text on amber |
| `--success` | `#4ade80` | ALLOW / trusted only |
| `--danger` | `#f87171` | DENY / blocking only |

Why amber: keeps green reserved for ALLOW and red for DENY, and reads as
Bitcoin-native without purple-SaaS vibes. Semantic colors never double as
decoration.

## Typography

- **Geist Sans** — UI text, headings.
- **Geist Mono** — mint URLs, balances (`tabular-nums`), event log, reason
  codes, badges. The product speaks in machine voice; mono carries it.

## Voice

Terse, active, operator-grade. "Evacuate now" not "Click here to evacuate."
Reason codes stay raw (`auditor 41% < 95% floor`) — that is intentional.

## Logo — "Gate & Proof"

One geometric mark tells the whole product story: an **arched gate**
(2px stroke, `#ECECED` on dark) holding an **amber proof square** (`#F5B52E`,
rx 1) centered in the doorway. The gate decides whether the proof passes —
DENY is the resting state of the mark.

- Mark geometry lives in `components/logo.tsx` (currentColor strokes, proof
  square via `fill-accent`, override with `proofClassName` on amber surfaces).
- `app/icon.svg` — favicon: mark on near-black tile `#09090b`, rx 7.
- `public/logo-mark.svg` — transparent, two-color.
- `public/logo-mark-badge.svg` — inverted amber tile with dark mark (avatars).
- `public/logo-lockup.svg` — mark + wordmark; `MINT` muted `#9B9BA1`,
  `GATE` bright `#ECECED` (the product is the gate, not the mint).
- Wordmark is Geist Mono, 600, letter-spacing 2.5 — machine voice everywhere.

## Layout law

- max-w-6xl container, 4px-grid spacing
- DENY hero opens the page (demo law) — never wallet UX first
- Sidebar (policy / proxy / log) at ≥ 1024px, stacks below
