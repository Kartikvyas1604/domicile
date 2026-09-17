import type { GateEvent, GateEventType } from "@/lib/gate/types";
import { cn } from "@/lib/utils";

function eventText(payload: GateEventType): string {
  switch (payload.kind) {
    case "SCAN_OK":
      return payload.detail;
    case "DENY":
      return `DENY(${payload.mint}, ${payload.reason})`;
    case "SPEND_DENIED":
      return `spend proxy refused ${payload.amountSats} sats — ${payload.reason}`;
    case "SPEND_OK":
      return `spend allowed — ${payload.amountSats} sats sent`;
    case "EVACUATE_START":
      return `EVACUATE_START ${payload.mode === "melt_ln" ? "melt→LN" : "rebalance"} from ${payload.from}`;
    case "EVACUATE_STEP":
      return payload.detail;
    case "EVACUATE_OK":
      return `EVACUATE_OK ${payload.detail}`;
    case "ALLOW":
      return "ALLOW — all proofs on trusted mints";
    case "AUDITOR_OFFLINE":
      return "auditor unreachable — cached scores, allowlist-only mode";
    case "AUDITOR_ONLINE":
      return "auditor reachable — floors enforced";
    case "SYSTEM":
      return payload.detail;
  }
}

function eventTone(kind: GateEventType["kind"]): string {
  if (kind === "DENY" || kind === "SPEND_DENIED" || kind === "AUDITOR_OFFLINE")
    return "text-danger";
  if (kind === "ALLOW" || kind === "SPEND_OK" || kind === "EVACUATE_OK")
    return "text-success";
  if (kind.startsWith("EVACUATE")) return "text-accent";
  return "text-muted-foreground";
}

export function EventLog({ events }: { events: GateEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-xs text-muted-foreground">
        Waiting for gate events. Deny and evacuate actions will appear here.
      </p>
    );
  }
  return (
    <ol
      className="max-h-72 space-y-2 overflow-y-auto px-4 py-3"
      role="log"
      aria-label="Gate event log"
    >
      {events.map((e) => (
        <li key={e.id} className="flex items-baseline gap-2 font-mono text-xs">
          <span className="shrink-0 text-muted-foreground/70 tabular-nums">
            {e.ts}
          </span>
          <span className={cn("min-w-0 break-words", eventTone(e.payload.kind))}>
            {eventText(e.payload)}
          </span>
        </li>
      ))}
    </ol>
  );
}
