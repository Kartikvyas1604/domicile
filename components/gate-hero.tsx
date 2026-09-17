"use client";

import { ShieldAlert, ShieldCheck, Zap } from "lucide-react";
import type { GateDecision, Phase } from "@/lib/gate/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/card";
import { formatSats } from "@/lib/utils";

export function GateHero({
  phase,
  decision,
  onEvacuateClick,
  onReset,
  evacuating,
}: {
  phase: Phase;
  decision: GateDecision;
  onEvacuateClick: () => void;
  onReset: () => void;
  evacuating: boolean;
}) {
  if (phase === "booting") {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-8 w-72 max-w-full" />
        <Skeleton className="mt-3 h-4 w-56 max-w-full" />
      </div>
    );
  }

  const blocking = decision.blockingMints[0];

  if (evacuating) {
    return (
      <section
        className="rounded-lg border border-accent/50 bg-accent/[0.06] p-6 shadow-sm"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-accent" aria-hidden="true" />
          <Badge variant="warn">Evacuating</Badge>
        </div>
        <p className="mt-3 text-xl font-semibold tracking-tight text-foreground">
          Moving proofs off untrusted mint
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Spend stays DENY until the last proof lands on a trusted mint.
        </p>
      </section>
    );
  }

  if (decision.decision === "DENY" && blocking) {
    return (
      <section
        className="rounded-lg border border-danger/50 bg-danger/[0.06] p-6 shadow-sm"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-danger" aria-hidden="true" />
          <Badge variant="deny">Spend denied</Badge>
        </div>
        <p className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {formatSats(blocking.balanceSats)} sats held on{" "}
          <span className="font-mono text-danger">
            {blocking.host}
          </span>
        </p>
        <ul className="mt-2 space-y-1">
          {blocking.reasons.map((r) => (
            <li key={r} className="font-mono text-xs text-danger/90">
              ✕ {r}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted-foreground">
          The spend proxy will refuse every pay/send until these proofs are
          evacuated.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={onEvacuateClick} size="lg">
            Evacuate now
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="rounded-lg border border-success/50 bg-success/[0.06] p-6 shadow-sm"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
        <Badge variant="allow">Spend allowed</Badge>
      </div>
      <p className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        All proofs sit on trusted mints
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        The gate stays quiet until a failing mint appears again.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={onReset}>
          Reset demo
        </Button>
      </div>
    </section>
  );
}
