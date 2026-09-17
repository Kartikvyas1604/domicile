"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { EvacuateMode, MintStatus } from "@/lib/gate/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatSats } from "@/lib/utils";

export function EvacuatePanel({
  blocking,
  executing,
  step,
  onExecute,
}: {
  blocking: MintStatus;
  executing: boolean;
  step: number;
  onExecute: (mode: EvacuateMode) => void;
}) {
  return (
    <Card id="evacuate-panel" className="scroll-mt-24 border-accent/40">
      <CardHeader>
        <CardTitle>Evacuate</CardTitle>
        <Badge variant="warn">
          {formatSats(blocking.balanceSats)} sats at risk
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <fieldset className="grid gap-3 sm:grid-cols-2" disabled={executing}>
          <legend className="sr-only">Evacuation mode</legend>
          <ModeOption
            mode="rebalance"
            title="Rebalance"
            detail="Swap proofs → mint.minibits.cash"
            executing={executing}
            onExecute={onExecute}
          />
          <ModeOption
            mode="melt_ln"
            title="Melt to LN"
            detail="Melt proofs → bolt11 invoice"
            executing={executing}
            onExecute={onExecute}
          />
        </fieldset>

        {executing && <EvacuateSteps step={step} />}
      </CardContent>
    </Card>
  );
}

function ModeOption({
  mode,
  title,
  detail,
  executing,
  onExecute,
}: {
  mode: EvacuateMode;
  title: string;
  detail: string;
  executing: boolean;
  onExecute: (mode: EvacuateMode) => void;
}) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      <Button
        size="sm"
        variant="secondary"
        className="mt-3 w-full"
        disabled={executing}
        aria-busy={executing}
        onClick={() => onExecute(mode)}
      >
        Execute
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
    </div>
  );
}

function EvacuateSteps({ step }: { step: number }) {
  const steps: string[] = [
    `Fetching proofs from ${"mint.roulettesats.xyz"}`,
    "Moving proofs",
    "Verifying settlement",
  ];
  return (
    <ol className="space-y-2 border-t border-border pt-4" aria-live="polite">
      {steps.map((s, i) => {
        const state = i < step ? "done" : i === step ? "active" : "pending";
        return (
          <li key={s} className="flex items-center gap-2.5 text-xs">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center">
              {state === "done" ? (
                <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
              ) : state === "active" ? (
                <span
                  className="h-3 w-3 animate-spin rounded-full border-2 border-accent border-t-transparent motion-reduce:animate-none"
                  aria-hidden="true"
                />
              ) : (
                <span className="h-2 w-2 rounded-full bg-muted" aria-hidden="true" />
              )}
            </span>
            <span
              className={
                state === "pending"
                  ? "text-muted-foreground"
                  : state === "active"
                    ? "font-mono text-accent"
                    : "font-mono text-muted-foreground line-through decoration-border"
              }
            >
              {s}
            </span>
            {state === "active" && (
              <ArrowRight
                className="h-3 w-3 shrink-0 text-accent"
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
