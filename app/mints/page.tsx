import type { Metadata } from "next";
import Link from "next/link";
import { DEMO_MINTS, DEMO_POLICY } from "@/lib/gate/fixtures";
import { computeReasons } from "@/lib/gate/engine";
import { formatSats } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MintCard } from "@/components/mint-card";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Mints",
  description:
    "Mint registry with auditor success rates, KYM scores, and policy floors.",
};

export default function MintsPage() {
  const totalSats = DEMO_MINTS.reduce((sum, m) => sum + m.balanceSats, 0);
  const blocked = DEMO_MINTS.filter(
    (m) => m.balanceSats > 0 && computeReasons(m, DEMO_POLICY, true).length > 0
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <PageIntro eyebrow="Registry" title="Mints">
          Every mint the daemon tracks. The gate only blocks spend when a mint
          is both failing policy and holding proofs.
        </PageIntro>
        <div className="flex items-center gap-2">
          <Badge variant="neutral">{formatSats(totalSats)} sats held</Badge>
          {blocked.length > 0 ? (
            <Badge variant="deny">
              {formatSats(
                blocked.reduce((sum, m) => sum + m.balanceSats, 0)
              )}{" "}
              sats blocked
            </Badge>
          ) : (
            <Badge variant="allow">Nothing blocked</Badge>
          )}
        </div>
      </div>

      <section aria-label="Mint statuses" className="mt-8 space-y-4">
        {DEMO_MINTS.map((mint) => (
          <Link
            key={mint.host}
            href={`/mints/${mint.host}`}
            className="block rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MintCard mint={mint} policy={DEMO_POLICY} auditorOnline={true} />
          </Link>
        ))}
      </section>

      <p className="mt-6 text-xs text-muted-foreground">
        Auditor scores are signal, not ground truth. See{" "}
        <Link
          href="/policy"
          className="underline decoration-border underline-offset-2 hover:text-foreground"
        >
          policy
        </Link>{" "}
        for the floors behind these verdicts.
      </p>
    </div>
  );
}
