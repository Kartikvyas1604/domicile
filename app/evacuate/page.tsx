import type { Metadata } from "next";
import Link from "next/link";
import { Zap } from "lucide-react";
import { FAKE_INVOICE, TRUSTED_MINT } from "@/lib/gate/fixtures";
import { MELT_STEPS, REBALANCE_STEPS } from "@/lib/gate/engine";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Evacuate",
  description:
    "Two exit routes out of a failing mint: rebalance to a trusted mint or melt to Lightning.",
};

export default function EvacuatePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6">
      <PageIntro eyebrow="Exit routes" title="Evacuate">
        While DENY is active the spend proxy refuses every pay/send. Evacuation
        moves the proofs off the failing mint — the gate flips to ALLOW only
        when the last proof lands somewhere trusted.
      </PageIntro>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rebalance</CardTitle>
            <Badge variant="warn">proof swap</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-mono text-xs text-accent">
              proofs → {TRUSTED_MINT.host}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Swap the failing mint&apos;s proofs for fresh proofs on the trusted
              mint. Value stays in e-cash; the balance just moves houses.
            </p>
            <StepList steps={REBALANCE_STEPS} />
            <p className="border-t border-border pt-3 text-xs text-muted-foreground">
              Use when you still trust the receiving mint and want to keep
              spending e-cash.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Melt to LN</CardTitle>
            <Badge variant="warn">bolt11</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-mono text-xs text-accent">proofs → bolt11</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Melt the proofs into a Lightning invoice. Funds leave the mint
              entirely — no custody left behind.
            </p>
            <p className="break-all rounded-md border border-border bg-background p-2.5 font-mono text-[11px] text-muted-foreground">
              {FAKE_INVOICE}
            </p>
            <StepList steps={MELT_STEPS} />
            <p className="border-t border-border pt-3 text-xs text-muted-foreground">
              Use when you want out of e-cash altogether for that balance.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-accent/40">
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <Zap className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-foreground">
                During evacuation, DENY holds
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                The proxy keeps refusing until the final step verifies. Failed
                evacuations return to the DENY state.
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="shrink-0 rounded-md bg-accent px-3 py-2 text-center text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Run it live
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-2.5 border-t border-border pt-4">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-2.5 text-xs">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-muted font-mono text-[10px] tabular-nums text-muted-foreground">
            {i + 1}
          </span>
          <span className="text-muted-foreground">{step}</span>
        </li>
      ))}
    </ol>
  );
}
