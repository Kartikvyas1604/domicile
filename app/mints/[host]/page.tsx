import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldAlert, ShieldCheck } from "lucide-react";
import { DEMO_MINTS, DEMO_POLICY } from "@/lib/gate/fixtures";
import { computeReasons } from "@/lib/gate/engine";
import { formatSats, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Meter } from "@/components/mint-card";
import { PageIntro } from "@/components/page-intro";

export function generateStaticParams() {
  return DEMO_MINTS.map((mint) => ({ host: mint.host }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ host: string }>;
}): Promise<Metadata> {
  const { host } = await params;
  return { title: host };
}

export default async function MintDetailPage({
  params,
}: {
  params: Promise<{ host: string }>;
}) {
  const { host } = await params;
  const mint = DEMO_MINTS.find((m) => m.host === host);
  if (!mint) notFound();

  const reasons = computeReasons(mint, DEMO_POLICY, true);
  const failing = reasons.length > 0;
  const holding = mint.balanceSats > 0;
  const blocking = failing && holding;
  const onAllowlist = DEMO_POLICY.allowlist.includes(mint.url);
  const auditorPass = mint.auditorOk >= DEMO_POLICY.minAuditorSuccessRate;
  const kymPass = mint.kymScore >= DEMO_POLICY.minKymScore;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6">
      <Link
        href="/mints"
        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        All mints
      </Link>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <PageIntro eyebrow="Mint detail" title={mint.host}>
          {mint.url}
        </PageIntro>
        {blocking ? (
          <Badge variant="deny">Blocking spend</Badge>
        ) : mint.trusted ? (
          <Badge variant="allow">Trusted</Badge>
        ) : holding ? (
          <Badge variant="warn">Watch</Badge>
        ) : (
          <Badge variant="neutral">No proofs</Badge>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card className={cn(blocking && "border-danger/50")}>
            <CardContent className="space-y-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2.5">
                  {mint.trusted ? (
                    <ShieldCheck
                      className="mt-0.5 h-5 w-5 shrink-0 text-success"
                      aria-hidden="true"
                    />
                  ) : (
                    <ShieldAlert
                      className="mt-0.5 h-5 w-5 shrink-0 text-danger"
                      aria-hidden="true"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="break-all font-mono text-sm text-foreground">
                      {mint.url}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {mint.trusted
                        ? "On the trusted-mint list — proofs may live here."
                        : "Not trusted — proofs held here are evacuation candidates."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-2 border-t border-border pt-4">
                <span className="font-mono text-4xl font-medium tabular-nums text-foreground">
                  {formatSats(mint.balanceSats)}
                </span>
                <span className="text-xs text-muted-foreground">
                  sats held at this mint
                </span>
              </div>

              <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
                <Meter
                  label="Auditor success"
                  value={`${Math.round(mint.auditorOk * 100)}%`}
                  fraction={mint.auditorOk}
                  floor={DEMO_POLICY.minAuditorSuccessRate}
                  pass={auditorPass}
                />
                <Meter
                  label="KYM score"
                  value={mint.kymScore.toFixed(2)}
                  fraction={mint.kymScore}
                  floor={DEMO_POLICY.minKymScore}
                  pass={kymPass}
                />
              </div>

              <div className="border-t border-border pt-4">
                <ul className="space-y-1.5 text-xs">
                  <li className="flex items-baseline gap-2 font-mono">
                    <span
                      className={onAllowlist ? "text-success" : "text-danger"}
                    >
                      {onAllowlist ? "✓" : "✕"}
                    </span>
                    <span className="text-muted-foreground">
                      {onAllowlist
                        ? "on policy allowlist"
                        : "not on policy allowlist"}
                    </span>
                  </li>
                  <li className="flex items-baseline gap-2 font-mono">
                    <span
                      className={auditorPass ? "text-success" : "text-danger"}
                    >
                      {auditorPass ? "✓" : "✕"}
                    </span>
                    <span className="text-muted-foreground">
                      auditor {Math.round(mint.auditorOk * 100)}% ≥{" "}
                      {Math.round(DEMO_POLICY.minAuditorSuccessRate * 100)}%
                      floor
                    </span>
                  </li>
                  <li className="flex items-baseline gap-2 font-mono">
                    <span className={kymPass ? "text-success" : "text-danger"}>
                      {kymPass ? "✓" : "✕"}
                    </span>
                    <span className="text-muted-foreground">
                      KYM {mint.kymScore.toFixed(2)} ≥{" "}
                      {DEMO_POLICY.minKymScore.toFixed(2)} floor
                    </span>
                  </li>
                </ul>
              </div>

              {failing && (
                <ul className="space-y-1 border-t border-border pt-4">
                  {reasons.map((r) => (
                    <li key={r} className="font-mono text-xs text-danger">
                      ✕ {r}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gate action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              {blocking ? (
                <>
                  <p>
                    Proofs held here block every agent pay/send. The spend
                    proxy refuses until they are evacuated.
                  </p>
                  <Link
                    href="/evacuate"
                    className="inline-block rounded-md bg-accent px-3 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    How evacuation works
                  </Link>
                </>
              ) : (
                <p>
                  Nothing to evacuate. The gate stays quiet for this mint until
                  its scores drop below the floors in{" "}
                  <Link
                    href="/policy"
                    className="underline decoration-border underline-offset-2 hover:text-foreground"
                  >
                    policy
                  </Link>
                  .
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other mints</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {DEMO_MINTS.filter((m) => m.host !== mint.host).map((m) => (
                  <li key={m.host}>
                    <Link
                      href={`/mints/${m.host}`}
                      className="block break-all rounded-md px-2 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {m.host}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
