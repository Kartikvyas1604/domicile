"use client";

import { ShieldAlert, ShieldCheck, Zap } from "lucide-react";
import type { GateDecision, Phase } from "@/lib/gate/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/card";
import { formatSats } from "@/lib/utils";
import { cn } from "@/lib/utils";

function StatusWord({
  word,
  tone,
  pulsing,
}: {
  word: string;
  tone: string;
  pulsing: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="relative flex h-3 w-3">
        {pulsing && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-60 motion-safe:animate-ping",
              tone
            )}
            aria-hidden="true"
          />
        )}
        <span
          className={cn("relative inline-flex h-3 w-3 rounded-full", tone)}
          aria-hidden="true"
        />
      </span>
      <span
        className={cn(
          "font-mono text-4xl font-semibold tracking-tight sm:text-5xl",
          tone
        )}
      >
        {word}
      </span>
    </div>
  );
}

export function GateHero({
  phase,
  decision,
  onEvacuateClick,
  onReset,
  evacuating,
  stepDetail,
}: {
  phase: Phase;
  decision: GateDecision;
  onEvacuateClick: () => void;
  onReset: () => void;
  evacuating: boolean;
  stepDetail: string | null;
}) {
  if (phase === "booting") {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="mt-4 h-4 w-72 max-w-full" />
        <Skeleton className="mt-3 h-4 w-56 max-w-full" />
      </div>
    );
  }

  const blocking = decision.blockingMints[0];

  if (evacuating) {
    return (
      <section
        className="animate-status-in rounded-lg border border-accent/50 bg-accent/[0.06] p-6 shadow-sm"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" aria-hidden="true" />
              <Badge variant="warn">Evacuating</Badge>
            </div>
            <StatusWord
              word="DENY"
              tone="text-accent"
              pulsing={true}
            />
            <p className="font-mono text-xs text-muted-foreground">
              gate held · spend proxy still refusing
            </p>
          </div>
          <div className="max-w-md space-y-2 md:text-right">
            <p className="text-sm font-medium text-foreground">
              {stepDetail ?? "Moving proofs"}
            </p>
            <p className="text-sm text-muted-foreground">
              Allow flips only when the last proof lands on a trusted mint.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (decision.decision === "DENY" && blocking) {
    return (
      <section
        className="animate-status-in rounded-lg border border-danger/50 bg-danger/[0.06] p-6 shadow-sm"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-danger" aria-hidden="true" />
              <Badge variant="deny">Spend denied</Badge>
            </div>
            <StatusWord word="DENY" tone="text-danger" pulsing={true} />
            <p className="font-mono text-xs text-muted-foreground">
              gate decision · spend proxy active
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
            <p className="text-sm text-muted-foreground">
              Every pay/send is refused until these proofs are evacuated.
            </p>
            <div className="flex md:justify-end">
              <Button onClick={onEvacuateClick} size="lg">
                Evacuate now
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="animate-status-in rounded-lg border border-success/50 bg-success/[0.06] p-6 shadow-sm"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
            <Badge variant="allow">Spend allowed</Badge>
          </div>
          <StatusWord word="ALLOW" tone="text-success" pulsing={false} />
          <p className="font-mono text-xs text-muted-foreground">
            gate decision · spend proxy forwarding
          </p>
        </div>
        <div className="max-w-md space-y-3 md:text-right">
          <p className="text-lg font-medium tracking-tight text-foreground">
            All proofs sit on trusted mints
          </p>
          <p className="text-sm text-muted-foreground">
            The gate stays quiet until a failing mint appears again.
          </p>
          <div className="flex md:justify-end">
            <Button variant="secondary" onClick={onReset}>
              Reset demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
