import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Gauge,
  Radio,
  ScrollText,
  ShieldAlert,
  Wallet,
  Zap,
} from "lucide-react";
import {
  DEMO_MINTS,
  DEMO_POLICY,
  TRUSTED_MINT,
} from "@/lib/gate/fixtures";
import { evaluateGate } from "@/lib/gate/engine";
import { formatSats } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Dashboard",
};

const NAV_ENTRIES = [
  {
    href: "/console",
    icon: Gauge,
    title: "Console",
    body: "Live gate: DENY hero, evacuation runs, spend proxy, event log.",
  },
  {
    href: "/mints",
    icon: Wallet,
    title: "Mints",
    body: "Registry of tracked mints with auditor and KYM meters.",
  },
  {
    href: "/evacuate",
    icon: Zap,
    title: "Evacuate",
    body: "The two exit routes out of a failing mint, step by step.",
  },
  {
    href: "/policy",
    icon: Radio,
    title: "Policy",
    body: "Floors, allowlist, and what happens when the auditor drops.",
  },
  {
    href: "/log",
    icon: ScrollText,
    title: "Log",
    body: "Event vocabulary plus a recorded full gate cycle.",
  },
];

export default function DashboardPage() {
  const decision = evaluateGate(DEMO_MINTS, DEMO_POLICY, true);
  const blocking = decision.blockingMints[0];
  const totalSats = DEMO_MINTS.reduce((sum, m) => sum + m.balanceSats, 0);
  const blockedSats = decision.blockingMints.reduce(
    (sum, m) => sum + m.balanceSats,
    0
  );

  const stats = [
    { label: "Mints tracked", value: String(DEMO_MINTS.length) },
    { label: "Sats held", value: formatSats(totalSats) },
    { label: "Sats blocked", value: formatSats(blockedSats), danger: blockedSats > 0 },
    {
      label: "Floors",
      value: `${Math.round(DEMO_POLICY.minAuditorSuccessRate * 100)}% / ${DEMO_POLICY.minKymScore.toFixed(2)}`,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6">
      <PageIntro eyebrow="Overview" title="Dashboard">
        The gate&apos;s current position at a glance. The live demo lives in
        the console — every surface below is backed by the same fixtures.
      </PageIntro>

      {decision.decision === "DENY" && blocking ? (
        <section
          className="animate-status-in mt-8 rounded-lg border border-danger/50 bg-danger/[0.06] p-6 shadow-sm"
          aria-label="Gate status"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldAlert
                  className="h-4 w-4 text-danger"
                  aria-hidden="true"
                />
                <Badge variant="deny">Spend denied</Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span
                    className="absolute inline-flex h-full w-full rounded-full bg-danger opacity-60 motion-safe:animate-ping"
                    aria-hidden="true"
                  />
                  <span
                    className="relative inline-flex h-3 w-3 rounded-full bg-danger"
                    aria-hidden="true"
                  />
                </span>
                <span className="font-mono text-4xl font-semibold tracking-tight text-danger sm:text-5xl">
                  DENY
                </span>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                gate decision · spend proxy refusing
              </p>
            </div>
            <div className="max-w-md space-y-2 md:text-right">
              <p className="text-lg font-medium tracking-tight text-foreground">
                {formatSats(blocking.balanceSats)} sats held on{" "}
                <span className="font-mono text-danger">{blocking.host}</span>
              </p>
              <ul className="space-y-1 md:text-right">
                {blocking.reasons.map((r) => (
                  <li key={r} className="font-mono text-xs text-danger/90">
                    ✕ {r}
                  </li>
                ))}
              </ul>
              <div className="flex md:justify-end">
                <Link
                  href="/console"
                  className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Open console
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section
          className="mt-8 rounded-lg border border-success/50 bg-success/[0.06] p-6 shadow-sm"
          aria-label="Gate status"
        >
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-success" aria-hidden="true" />
            <span className="font-mono text-4xl font-semibold tracking-tight text-success sm:text-5xl">
              ALLOW
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            All proofs sit on trusted mints.
          </p>
        </section>
      )}

      <dl className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-surface p-4"
          >
            <dt className="text-xs text-muted-foreground">{stat.label}</dt>
            <dd
              className={
                stat.danger
                  ? "mt-1 font-mono text-xl font-medium tabular-nums text-danger"
                  : "mt-1 font-mono text-xl font-medium tabular-nums text-foreground"
              }
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader>
            <CardTitle>Jump in</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {NAV_ENTRIES.map(({ href, icon: Icon, title, body }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col rounded-md border border-border bg-background p-4 transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    {title}
                  </span>
                  <ArrowRight
                    className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-accent"
                    aria-hidden="true"
                  />
                </div>
                <span className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {body}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gate state</CardTitle>
              <Badge variant={decision.decision === "DENY" ? "deny" : "allow"}>
                {decision.decision}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-muted-foreground">Blocking mints</span>
                <span className="font-mono tabular-nums text-danger">
                  {decision.blockingMints.length}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-muted-foreground">Next step</span>
                <span className="font-mono">
                  {decision.next === "evacuate" ? "evacuate" : "none"}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-muted-foreground">Trusted mint</span>
                <span className="truncate font-mono text-foreground">
                  {TRUSTED_MINT.host}
                </span>
              </div>
              <p className="border-t border-border pt-3 leading-relaxed text-muted-foreground">
                Daemon scans on boot and re-scores on every evacuation step.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Held where</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {DEMO_MINTS.map((m) => (
                <Link
                  key={m.host}
                  href={`/mints/${m.host}`}
                  className="flex items-baseline justify-between gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="truncate font-mono text-xs text-muted-foreground">
                    {m.host}
                  </span>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-foreground">
                    {formatSats(m.balanceSats)}
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
