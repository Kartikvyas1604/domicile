import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageIntro } from "@/components/page-intro";

const MECHANISM = [
  {
    n: "01",
    title: "Gate the spend",
    body: "The agent tries to pay. The proxy checks every mint holding proofs against the floors — auditor success rate, KYM score, allowlist.",
  },
  {
    n: "02",
    title: "Evacuate the proofs",
    body: "A failing mint blocks everything. The daemon rebalances proofs to a trusted mint or melts them to Lightning — automatically, before the agent may continue.",
  },
  {
    n: "03",
    title: "Allow, quietly",
    body: "The last proof lands on a trusted mint and the gate goes quiet. The proxy forwards again until the next bad mint appears.",
  },
];

const SURFACES = [
  {
    href: "/console",
    title: "Console",
    body: "DENY hero, live evacuation runs, spend proxy, event log — the whole loop on one screen.",
  },
  {
    href: "/mints",
    title: "Mints",
    body: "Registry of tracked mints with balances, auditor meters, and KYM scores against policy floors.",
  },
  {
    href: "/evacuate",
    title: "Evacuate",
    body: "Rebalance to a trusted mint or melt to LN bolt11 — the two exit routes, step by step.",
  },
  {
    href: "/policy",
    title: "Policy",
    body: "The floors, the allowlist, and what degrades when the auditor is unreachable.",
  },
  {
    href: "/log",
    title: "Log",
    body: "Event vocabulary and a recorded full cycle — DENY, evacuate steps, ALLOW.",
  },
  {
    href: "/about",
    title: "About",
    body: "What MINTGATE is, and what it is not. Honesty section included.",
  },
];

export default function LandingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6">
      {/* Hero */}
      <section className="border-b border-border pb-16 pt-20 md:pt-28" aria-labelledby="hero-title">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          mint-trust gate · local-first · FOSS
        </p>
        <h1
          id="hero-title"
          className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl"
        >
          Refuse bad mints{" "}
          <span className="italic text-accent">before</span> your agent
          spends.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          MINTGATE is a DENY → evacuate → ALLOW gate for Cashu agent spend. It
          refuses pay/send against mints that fail auditor and KYM thresholds,
          evacuates the proofs, then lets the agent continue. Everyone else
          reverts.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/console"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Open the console
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            How the gate works
          </Link>
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-muted-foreground/70">
          gate for agents — not another cashu wallet
        </p>
      </section>

      {/* Mechanism — three steps */}
      <section className="border-b border-border py-16" aria-label="How the gate works">
        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {MECHANISM.map(({ n, title, body }) => (
            <li key={n} className="space-y-3">
              <p className="font-mono text-[11px] tabular-nums tracking-widest text-accent">
                {n}
              </p>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Surfaces */}
      <section className="py-16" aria-labelledby="surfaces-title">
        <div className="flex items-end justify-between gap-4">
          <PageIntro eyebrow="Site map" title="Six pages, one gate">
            Every surface of the product, linked.
          </PageIntro>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SURFACES.map(({ href, title, body }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-semibold uppercase tracking-widest text-foreground">
                    {title}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent"
                    aria-hidden="true"
                  />
                </div>
                <span className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {body}
                </span>
                <span className="mt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70 transition-colors group-hover:text-accent">
                  open
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Brand block above shared footer */}
      <section className="border-t border-border pt-10">
        <p className="font-mono text-sm font-semibold uppercase tracking-widest text-foreground">
          Mintgate
        </p>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Local-first mint-trust gate for autonomous Cashu agents. Auditor
          scores are signal, not ground truth. Demo funds and flows are
          simulated; the real daemon (CLI) is the source of truth.
        </p>
      </section>
    </div>
  );
}
