import type { MintPolicy } from "@/lib/gate/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PolicyCard({
  policy,
  auditorOnline,
}: {
  policy: MintPolicy;
  auditorOnline: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Policy</CardTitle>
        <span className="font-mono text-[11px] text-muted-foreground">
          policy.yaml
        </span>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-muted-foreground">Auditor floor</span>
          <span className="font-mono tabular-nums">
            {Math.round(policy.minAuditorSuccessRate * 100)}%
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-muted-foreground">KYM floor</span>
          <span className="font-mono tabular-nums">
            {policy.minKymScore.toFixed(2)}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-muted-foreground">Auditor</span>
          <span
            className={
              auditorOnline
                ? "font-mono text-success"
                : "font-mono text-danger"
            }
          >
            {auditorOnline ? "online" : "offline"}
          </span>
        </div>
        <div className="border-t border-border pt-3">
          <p className="mb-2 text-muted-foreground">Allowlist</p>
          <ul className="space-y-1.5">
            {policy.allowlist.map((url) => (
              <li
                key={url}
                className="break-all font-mono text-[11px] text-muted-foreground"
              >
                {url}
              </li>
            ))}
          </ul>
        </div>
        <p className="border-t border-border pt-3 leading-relaxed text-muted-foreground/80">
          Auditor scores are signal, not ground truth. Cached scores are used
          while the auditor is unreachable.
        </p>
      </CardContent>
    </Card>
  );
}
