import { ShieldAlert, ShieldCheck } from "lucide-react";
import type { MintStatus } from "@/lib/gate/types";
import { computeReasons } from "@/lib/gate/engine";
import type { MintPolicy } from "@/lib/gate/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatSats } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Meter({
  label,
  value,
  fraction,
  floor,
  pass,
}: {
  label: string;
  value: string;
  fraction: number;
  floor: number;
  pass: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span
          className={cn(
            "font-mono text-xs tabular-nums",
            pass ? "text-muted-foreground" : "text-danger"
          )}
        >
          {value}
        </span>
      </div>
      <div
        className="relative h-1 overflow-hidden rounded-full bg-muted"
        role="meter"
        aria-label={label}
        aria-valuenow={Math.round(fraction * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "absolute inset-0 origin-left rounded-full motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out",
            pass ? "bg-success" : "bg-danger"
          )}
          style={{ transform: `scaleX(${Math.max(0.02, fraction)})` }}
        />
        <div
          className="absolute inset-y-0 w-px bg-foreground/40"
          style={{ left: `${floor * 100}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export function MintCard({
  mint,
  policy,
  auditorOnline,
}: {
  mint: MintStatus;
  policy: MintPolicy;
  auditorOnline: boolean;
}) {
  const reasons = computeReasons(mint, policy, auditorOnline);
  const failing = reasons.length > 0;
  const holding = mint.balanceSats > 0;
  const blocking = failing && holding;
  const auditorPass = mint.auditorOk >= policy.minAuditorSuccessRate;
  const kymPass = mint.kymScore >= policy.minKymScore;

  return (
    <Card className={cn(blocking && "border-danger/50")}>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2">
            {mint.trusted ? (
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-success"
                aria-hidden="true"
              />
            ) : (
              <ShieldAlert
                className="mt-0.5 h-4 w-4 shrink-0 text-danger"
                aria-hidden="true"
              />
            )}
            <div className="min-w-0">
              <p className="truncate font-mono text-sm text-foreground">
                {mint.host}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {mint.url}
              </p>
            </div>
          </div>
          {blocking ? (
            <Badge variant="deny">Blocking</Badge>
          ) : mint.trusted ? (
            <Badge variant="allow">Trusted</Badge>
          ) : holding ? (
            <Badge variant="warn">Watch</Badge>
          ) : (
            <Badge variant="neutral">No proofs</Badge>
          )}
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-medium tabular-nums text-foreground">
            {formatSats(mint.balanceSats)}
          </span>
          <span className="text-xs text-muted-foreground">sats</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Meter
            label={auditorOnline ? "Auditor success" : "Auditor (cached)"}
            value={`${Math.round(mint.auditorOk * 100)}%`}
            fraction={mint.auditorOk}
            floor={policy.minAuditorSuccessRate}
            pass={auditorPass}
          />
          <Meter
            label="KYM score"
            value={mint.kymScore.toFixed(2)}
            fraction={mint.kymScore}
            floor={policy.minKymScore}
            pass={kymPass}
          />
        </div>

        {failing && (
          <ul className="space-y-1 border-t border-border pt-3">
            {reasons.map((r) => (
              <li key={r} className="font-mono text-xs text-danger">
                ✕ {r}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
