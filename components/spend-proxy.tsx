"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { GateDecision } from "@/lib/gate/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SpendProxy({
  decision,
  onSpend,
}: {
  decision: GateDecision;
  onSpend: (amountSats: number) => void;
}) {
  const [amount, setAmount] = useState("500");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [lastResult, setLastResult] = useState<
    { allowed: boolean; reason?: string } | null
  >(null);

  const parsed = Number(amount);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!Number.isInteger(parsed) || parsed <= 0) {
      setError("Enter a whole sat amount above 0");
      return;
    }
    setError(null);
    setChecking(true);
    setLastResult(null);
    window.setTimeout(() => {
      setChecking(false);
      const allowed = decision.decision === "ALLOW";
      setLastResult({
        allowed,
        reason: allowed
          ? undefined
          : decision.blockingMints[0]?.reasons.join("; "),
      });
      onSpend(parsed);
    }, 400);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spend proxy</CardTitle>
        <Badge variant="neutral">POST /spend</Badge>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div className="space-y-1.5">
            <label
              htmlFor="spend-amount"
              className="text-xs text-muted-foreground"
            >
              Agent spend amount (sats)
            </label>
            <input
              id="spend-amount"
              name="spend-amount"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError(null);
              }}
              autoComplete="off"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "spend-amount-error" : undefined}
              className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm tabular-nums text-foreground transition-colors duration-100 placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
            {error && (
              <p id="spend-amount-error" className="text-xs text-danger">
                {error}
              </p>
            )}
          </div>
          <Button type="submit" variant="secondary" disabled={checking} aria-busy={checking} className="w-full">
            {checking ? (
              <>
                <span
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent motion-reduce:animate-none"
                  aria-hidden="true"
                />
                Gate checking…
              </>
            ) : (
              <>
                Attempt spend
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </>
            )}
          </Button>
        </form>

        {lastResult && (
          <div
            role="status"
            className={
              lastResult.allowed
                ? "mt-3 rounded-md border border-success/40 bg-success/10 p-3"
                : "mt-3 rounded-md border border-danger/40 bg-danger/10 p-3"
            }
          >
            <p
              className={
                lastResult.allowed
                  ? "text-xs font-medium text-success"
                  : "text-xs font-medium text-danger"
              }
            >
              {lastResult.allowed
                ? "ALLOW — proxy forwarded the spend"
                : "DENY — proxy refused the spend"}
            </p>
            {lastResult.reason && (
              <p className="mt-1 break-words font-mono text-[11px] text-danger/90">
                {lastResult.reason}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
