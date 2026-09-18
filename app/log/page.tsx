import type { Metadata } from "next";
import Link from "next/link";
import type { GateEvent } from "@/lib/gate/types";
import { FAKE_INVOICE } from "@/lib/gate/fixtures";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventLog } from "@/components/event-log";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Log",
  description:
    "Every decision the gate makes hits the event log — DENY, evacuate steps, ALLOW.",
};

const KINDS: { kind: string; tag: string; meaning: string }[] = [
  { kind: "SCAN_OK", tag: "SCAN", meaning: "A mint scan completed; balances and floors were checked." },
  { kind: "DENY", tag: "DENY", meaning: "A holding mint failed policy — agent spend is refused." },
  { kind: "SPEND_DENIED", tag: "DENY", meaning: "The spend proxy refused a pay/send while DENY was active." },
  { kind: "SPEND_OK", tag: "OK", meaning: "The spend proxy forwarded a pay/send after ALLOW." },
  { kind: "EVACUATE_START", tag: "EVAC", meaning: "An evacuation run started from a blocking mint." },
  { kind: "EVACUATE_STEP", tag: "EVAC", meaning: "A step of the evacuation plan completed." },
  { kind: "EVACUATE_OK", tag: "OK", meaning: "All proofs landed on the destination; funds are clear." },
  { kind: "ALLOW", tag: "OK", meaning: "No blocking mints remain — the proxy forwards again." },
  { kind: "AUDITOR_OFFLINE", tag: "AUDIT", meaning: "Auditor unreachable: cached scores, allowlist-only mode." },
  { kind: "AUDITOR_ONLINE", tag: "AUDIT", meaning: "Auditor reconnected: full floors enforced again." },
  { kind: "SYSTEM", tag: "SYS", meaning: "Daemon housekeeping — resets, config loads, boot notes." },
];

const TRANSCRIPT: GateEvent[] = [
  { id: "t1", ts: "14:02:11", payload: { kind: "SCAN_OK", detail: "scanned 3 mints, 4,450 sats" } },
  { id: "t2", ts: "14:02:11", payload: { kind: "DENY", mint: "mint.roulettesats.xyz", reason: "auditor 41% < 95% floor" } },
  { id: "t3", ts: "14:02:24", payload: { kind: "SPEND_DENIED", amountSats: 250, reason: "auditor 41% < 95% floor" } },
  { id: "t4", ts: "14:03:02", payload: { kind: "EVACUATE_START", mode: "rebalance", from: "mint.roulettesats.xyz" } },
  { id: "t5", ts: "14:03:03", payload: { kind: "EVACUATE_STEP", detail: "fetch proofs from bad mint (1/3)" } },
  { id: "t6", ts: "14:03:04", payload: { kind: "EVACUATE_STEP", detail: "swap to trusted mint (2/3)" } },
  { id: "t7", ts: "14:03:05", payload: { kind: "EVACUATE_STEP", detail: "verify received proofs (3/3)" } },
  { id: "t8", ts: "14:03:06", payload: { kind: "EVACUATE_OK", detail: "1,250 sats rebalanced → mint.minibits.cash" } },
  { id: "t9", ts: "14:03:06", payload: { kind: "ALLOW" } },
  { id: "t10", ts: "14:04:41", payload: { kind: "SPEND_OK", amountSats: 250 } },
  { id: "t11", ts: "14:05:12", payload: { kind: "AUDITOR_OFFLINE" } },
  { id: "t12", ts: "14:06:03", payload: { kind: "AUDITOR_ONLINE" } },
  { id: "t13", ts: "14:06:30", payload: { kind: "SYSTEM", detail: `demo reset — bolt11 sample ${FAKE_INVOICE.slice(0, 12)}…` } },
];

export default function LogPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6">
      <PageIntro eyebrow="Timeline" title="Event log">
        The gate speaks in events. Every scan, refusal, evacuation step, and
        flip lands here — machine-readable, append-only, no silent state.
      </PageIntro>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Sample transcript</CardTitle>
            <Badge variant="neutral">one full cycle</Badge>
          </CardHeader>
          <EventLog events={TRANSCRIPT} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event kinds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {KINDS.map(({ kind, tag, meaning }) => (
              <div
                key={kind}
                className="flex items-start gap-2.5 border-b border-border pb-2.5 last:border-0 last:pb-0"
              >
                <span className="mt-px shrink-0 rounded border border-border bg-muted px-1 py-px font-mono text-[10px] font-medium uppercase leading-4 tracking-wider text-muted-foreground">
                  {tag}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-xs text-foreground">{kind}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {meaning}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        The live log runs on the{" "}
        <Link
          href="/"
          className="underline decoration-border underline-offset-2 hover:text-foreground"
        >
          console
        </Link>
        . This page shows a recorded cycle so you can read the vocabulary
        without running the daemon.
      </p>
    </div>
  );
}
