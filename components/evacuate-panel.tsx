"use client";

import { Check, Loader2 } from "lucide-react";
import type { EvacuateMode, MintStatus } from "@/lib/gate/types";
import { FAKE_INVOICE } from "@/lib/gate/fixtures";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatSats } from "@/lib/utils";

const REBALANCE_STEPS = ["Fetch proofs", "Swap to trusted mint", "Verify received proofs"];
const MELT_STEPS = ["Fetch proofs", "Melt to bolt11 invoice", "Verify LN settlement"];

export function EvacuatePanel({
  blocking,
  mode,
  step,
  onExecute,
}: {
  blocking: MintStatus;
  mode: EvacuateMode | null;
  step: number;
  onExecute: (mode: EvacuateMode) => void;
}) {
  const executing = mode !== null;

  return (
    <Card id="evacuate-panel" className="scroll-mt-24 border-accent/40">
      <CardHeader>
        <CardTitle>Evacuate</CardTitle>
        <Badge variant="warn">
          {formatSats(blocking.balanceSats)} sats at risk
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {formatSats(blocking.balanceSats)} sats on{" "}
          <span className="font-mono text-foreground">{blocking.host}</span>.
          Pick the exit route — spend stays DENY until this completes.
        </p>

        {!executing ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <ModeOption
              mode="rebalance"
              title="Rebalance"
              summary={`${formatSats(blocking.balanceSats)} sats → mint.minibits.cash`}
              note="Swap proofs for fresh proofs on the trusted mint."
              onExecute={onExecute}
            />
            <ModeOption
              mode="melt_ln"
              title="Melt to LN"
              summary={`${formatSats(blocking.balanceSats)} sats → bolt11`}
              note="Melt proofs into a Lightning invoice. Funds leave the mint entirely."
              onExecute={onExecute}
            />
          </div>
        ) : (
          <EvacuateSteps
            steps={mode === "melt_ln" ? MELT_STEPS : REBALANCE_STEPS}
            step={step}
            invoice={mode === "melt_ln" ? FAKE_INVOICE : undefined}
          />
        )}
      </CardContent>
    </Card>
  );
}

function ModeOption({
  mode,
  title,
  summary,
  note,
  onExecute,
}: {
  mode: EvacuateMode;
  title: string;
  summary: string;
  note: string;
  onExecute: (mode: EvacuateMode) => void;
}) {
  void mode;
  return (
    <div className="flex flex-col rounded-md border border-border bg-background p-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 font-mono text-xs text-accent">{summary}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
      <Button
        size="sm"
        className="mt-4 w-full"
        onClick={() => onExecute(mode)}
      >
        Execute
      </Button>
    </div>
  );
}

function EvacuateSteps({
  steps,
  step,
  invoice,
}: {
  steps: string[];
  step: number;
  invoice?: string;
}) {
  return (
    <ol className="space-y-3 border-t border-border pt-4" aria-live="polite">
      {invoice && (
        <li className="break-all rounded-md border border-border bg-background p-2.5 font-mono text-[11px] text-muted-foreground">
          {invoice}
        </li>
      )}
      {steps.map((s, i) => {
        const state = i < step ? "done" : i === step ? "active" : "pending";
        return (
          <li key={s} className="flex items-center gap-2.5 text-xs">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
              {state === "done" ? (
                <>
                  <span className="sr-only">Done</span>
                  <Check
                    className="h-4 w-4 text-success"
                    aria-hidden="true"
                  />
                </>
              ) : state === "active" ? (
                <Loader2
                  className="h-4 w-4 animate-spin text-accent motion-reduce:animate-none"
                  aria-hidden="true"
                />
              ) : (
                <span
                  className="h-2 w-2 rounded-full bg-muted"
                  aria-hidden="true"
                />
              )}
            </span>
            <span
              className={
                state === "pending"
                  ? "text-muted-foreground"
                  : state === "active"
                    ? "text-accent"
                    : "text-muted-foreground"
              }
            >
              {s}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
