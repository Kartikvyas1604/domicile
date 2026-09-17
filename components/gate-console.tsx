"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Radio } from "lucide-react";
import {
  DEMO_MINTS,
  DEMO_POLICY,
  FAKE_INVOICE,
  TRUSTED_MINT,
} from "@/lib/gate/fixtures";
import { evaluateGate, nowTs } from "@/lib/gate/engine";
import type {
  EvacuateMode,
  GateEvent,
  GateEventType,
  MintStatus,
} from "@/lib/gate/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@/components/ui/card";
import { GateHero } from "@/components/gate-hero";
import { MintCard } from "@/components/mint-card";
import { EventLog } from "@/components/event-log";
import { PolicyCard } from "@/components/policy-card";
import { SpendProxy } from "@/components/spend-proxy";
import { EvacuatePanel } from "@/components/evacuate-panel";

const BOOT_MS = 900;
const STEP_MS = 850;

type EvacuateState = {
  mode: EvacuateMode;
  step: number;
  active: boolean;
};

function initialMints(): MintStatus[] {
  return DEMO_MINTS.map((m) => ({ ...m, reasons: [] }));
}

export function GateConsole() {
  const [phase, setPhase] = useState<"booting" | "ready">("booting");
  const [mints, setMints] = useState<MintStatus[]>(initialMints);
  const [events, setEvents] = useState<GateEvent[]>([]);
  const [auditorOnline, setAuditorOnline] = useState(true);
  const [evacuate, setEvacuate] = useState<EvacuateState | null>(null);
  const runIdRef = useRef(0);
  const eventSeq = useRef(0);

  const pushEvent = useCallback((payload: GateEventType) => {
    eventSeq.current += 1;
    setEvents((prev) => [
      { id: eventSeq.current, ts: nowTs(), payload },
      ...prev,
    ]);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setPhase("ready");
      pushEvent({ kind: "SCAN_OK", detail: "scanned 3 mints, 4,450 sats" });
      pushEvent({
        kind: "DENY",
        mint: "mint.roulettesats.xyz",
        reason: "auditor 41% < 95% floor",
      });
    }, BOOT_MS);
    return () => window.clearTimeout(t);
  }, [pushEvent]);

  const decision = evaluateGate(mints, DEMO_POLICY, auditorOnline);
  const blocking = decision.blockingMints[0];

  const handleSpend = useCallback(
    (amountSats: number) => {
      if (decision.decision === "DENY" && blocking) {
        pushEvent({
          kind: "SPEND_DENIED",
          amountSats,
          reason: blocking.reasons.join("; "),
        });
      } else {
        pushEvent({ kind: "SPEND_OK", amountSats });
      }
    },
    [decision.decision, blocking, pushEvent]
  );

  const toggleAuditor = useCallback(() => {
    setAuditorOnline((prev) => {
      const next = !prev;
      pushEvent({
        kind: next ? "AUDITOR_ONLINE" : "AUDITOR_OFFLINE",
      });
      return next;
    });
  }, [pushEvent]);

  const scrollToEvacuate = useCallback(() => {
    document
      .getElementById("evacuate-panel")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const executeEvacuate = useCallback(
    async (mode: EvacuateMode) => {
      if (!blocking) return;
      const runId = runIdRef.current + 1;
      runIdRef.current = runId;
      const alive = () => runIdRef.current === runId;

      setEvacuate({ mode, step: 0, active: true });
      pushEvent({
        kind: "EVACUATE_START",
        mode,
        from: blocking.host,
      });

      const from = blocking.host;
      const amount = blocking.balanceSats;

      const steps: string[] =
        mode === "rebalance"
          ? [
              `EVACUATE_STEP fetching proofs from ${from}`,
              `EVACUATE_STEP swapping → mint.minibits.cash`,
              `EVACUATE_STEP verifying received proofs`,
            ]
          : [
              "EVACUATE_STEP requesting melt quote",
              `EVACUATE_STEP melting → ${FAKE_INVOICE.slice(0, 24)}…`,
              "EVACUATE_STEP verifying LN settlement",
            ];

      for (let i = 0; i < steps.length; i++) {
        await sleep(STEP_MS);
        if (!alive()) return;
        pushEvent({ kind: "EVACUATE_STEP", detail: steps[i].replace("EVACUATE_STEP ", "") });
        setEvacuate({ mode, step: i + 1, active: true });
      }

      await sleep(STEP_MS);
      if (!alive()) return;

      setMints((prev) =>
        prev.map((m) =>
          m.host === from
            ? { ...m, balanceSats: 0 }
            : m.host === TRUSTED_MINT.host && mode === "rebalance"
              ? { ...m, balanceSats: m.balanceSats + amount }
              : m.host === TRUSTED_MINT.host
                ? m
                : m
        )
      );
      setEvacuate(null);
      pushEvent({
        kind: "EVACUATE_OK",
        detail:
          mode === "rebalance"
            ? `${amount} sats rebalanced → mint.minibits.cash`
            : `${amount} sats melted to LN invoice`,
      });
      pushEvent({ kind: "ALLOW" });
    },
    [blocking, pushEvent]
  );

  const resetDemo = useCallback(() => {
    runIdRef.current += 1;
    setMints(initialMints());
    setEvacuate(null);
    pushEvent({ kind: "SYSTEM", detail: "demo reset — proofs re-injected on bad mint" });
  }, [pushEvent]);

  const evacuating = evacuate?.active === true;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6">
      <GateHero
        phase={phase}
        decision={decision}
        onEvacuateClick={scrollToEvacuate}
        onReset={resetDemo}
        evacuating={evacuating}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {phase === "booting" ? (
            <MintSkeletons />
          ) : (
            <>
              {blocking && (
                <EvacuatePanel
                  blocking={blocking}
                  executing={evacuating}
                  step={evacuate?.step ?? 0}
                  onExecute={executeEvacuate}
                />
              )}
              <section aria-label="Mint statuses" className="space-y-4">
                {mints.map((mint) => (
                  <MintCard
                    key={mint.url}
                    mint={mint}
                    policy={DEMO_POLICY}
                    auditorOnline={auditorOnline}
                  />
                ))}
              </section>
            </>
          )}
        </div>

        <div className="space-y-6">
          <AuditorCard auditorOnline={auditorOnline} onToggle={toggleAuditor} />
          <PolicyCard policy={DEMO_POLICY} auditorOnline={auditorOnline} />
          <SpendProxy decision={decision} onSpend={handleSpend} />
          <Card>
            <CardHeader>
              <CardTitle>Event log</CardTitle>
              <span
                className="h-1.5 w-1.5 rounded-full bg-accent"
                aria-hidden="true"
              />
            </CardHeader>
            <EventLog events={events} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function AuditorCard({
  auditorOnline,
  onToggle,
}: {
  auditorOnline: boolean;
  onToggle: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gate daemon</CardTitle>
        <Badge variant={auditorOnline ? "allow" : "deny"}>
          {auditorOnline ? "floors enforced" : "allowlist-only"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Radio
              className="h-4 w-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="truncate font-mono text-xs">audit.8333.space</span>
          </div>
          <Button
            variant={auditorOnline ? "ghost" : "secondary"}
            size="sm"
            onClick={onToggle}
            aria-pressed={!auditorOnline}
          >
            {auditorOnline ? "Simulate outage" : "Reconnect"}
          </Button>
        </div>
        {!auditorOnline && (
          <p className="rounded-md border border-danger/40 bg-danger/10 p-2.5 text-xs leading-relaxed text-danger">
            Auditor unreachable. Using cached scores — KYM floor skipped,
            allowlist-only mode active.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function MintSkeletons() {
  return (
    <div className="space-y-4" aria-label="Loading mint statuses">
      {Array.from({ length: pendingStepsPlaceholder() }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-surface p-4 space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-64 max-w-full" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-8 w-32" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
        </div>
      ))}
    </div>
  );
}

function pendingStepsPlaceholder() {
  return 3;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}
