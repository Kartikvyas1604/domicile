import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { DEMO_POLICY, TRUSTED_MINT } from "@/lib/gate/fixtures";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Policy",
  description:
    "Auditor and KYM floors, the mint allowlist, and outage behavior of the gate.",
};

export default function PolicyPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6">
      <PageIntro eyebrow="policy.yaml" title="Policy">
        A mint passes only if it clears every floor. One failing floor plus
        held proofs is enough to DENY all agent spend.
      </PageIntro>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Floors</CardTitle>
              <span className="font-mono text-[11px] text-muted-foreground">
                enforced at every scan
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-border bg-background p-4">
                  <p className="font-mono text-2xl font-medium tabular-nums text-foreground">
                    {Math.round(DEMO_POLICY.minAuditorSuccessRate * 100)}%
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Auditor success-rate floor. Mints below it cannot hold
                    proofs.
                  </p>
                </div>
                <div className="rounded-md border border-border bg-background p-4">
                  <p className="font-mono text-2xl font-medium tabular-nums text-foreground">
                    {DEMO_POLICY.minKymScore.toFixed(2)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    KYM score floor. Sub-floor mints are evacuation candidates.
                  </p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Floors are judgment calls, not laws. Tune them in policy.yaml —
                raising them makes the gate stricter, lowering them makes it
                trusting.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Allowlist</CardTitle>
              <Badge variant="neutral">
                {DEMO_POLICY.allowlist.length} mints
              </Badge>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {DEMO_POLICY.allowlist.map((url) => {
                  const trusted = DEMO_POLICY.trustedMints.includes(url);
                  return (
                    <li
                      key={url}
                      className="flex items-start justify-between gap-3 rounded-md border border-border bg-background p-3"
                    >
                      <span className="min-w-0 break-all font-mono text-xs text-foreground">
                        {url}
                      </span>
                      {trusted && (
                        <Badge variant="allow" className="shrink-0">
                          Trusted
                        </Badge>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Allowlisted mints still have to clear the floors. The list is a
                necessary condition, not a free pass.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Auditor outage</CardTitle>
              <Badge variant="deny">degraded</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>
                If <span className="font-mono">audit.8333.space</span> is
                unreachable, the gate does not stop — it degrades deliberately:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                  <span>Cached auditor scores stay in force</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                  <span>Allowlist enforcement stays on</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger" aria-hidden="true" />
                  <span>
                    KYM floor is skipped — stale scores are better than no gate
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Honesty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>
                Auditor scores are signal, not ground truth. They measure
                audit success rate and KYM posture — they do not certify a
                mint is solvent today.
              </p>
              <p>
                The trusted mint of record is{" "}
                <span className="font-mono text-foreground">
                  {TRUSTED_MINT.host}
                </span>
                . Rebalancing there is a policy choice, not an endorsement.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
