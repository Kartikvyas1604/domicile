import type { GateEvent, GateEventType } from "@/lib/gate/types";
import { cn } from "@/lib/utils";

function eventText(payload: GateEventType): string {
  switch (payload.kind) {
    case "SCAN_OK":
      return payload.detail;
    case "DENY":
      return `${payload.mint} — ${payload.reason}`;
    case "SPEND_DENIED":
      return `proxy refused ${payload.amountSats} sats — ${payload.reason}`;
    case "SPEND_OK":
      return `${payload.amountSats} sats sent`;
    case "EVACUATE_START":
      return `${payload.mode === "melt_ln" ? "melt→LN" : "rebalance"} from ${payload.from}`;
    case "EVACUATE_STEP":
      return payload.detail;
    case "EVACUATE_OK":
      return payload.detail;
    case "ALLOW":
      return "all proofs on trusted mints";
    case "AUDITOR_OFFLINE":
      return "cached scores, allowlist-only mode";
    case "AUDITOR_ONLINE":
      return "floors enforced";
    case "SYSTEM":
      return payload.detail;
  }
}

type Tag = { label: string; tone: string };

function eventTag(kind: GateEventType["kind"]): Tag {
  if (kind === "DENY" || kind === "SPEND_DENIED" || kind === "AUDITOR_OFFLINE")
    return { label: "DENY", tone: "text-danger border-danger/40 bg-danger/10" };
  if (kind === "ALLOW" || kind === "SPEND_OK" || kind === "EVACUATE_OK")
    return { label: "OK", tone: "text-success border-success/40 bg-success/10" };
  if (kind.startsWith("EVACUATE"))
    return { label: "EVAC", tone: "text-accent border-accent/40 bg-accent/10" };
  if (kind === "SCAN_OK") return { label: "SCAN", tone: "text-muted-foreground border-border bg-muted" };
  if (kind === "SYSTEM") return { label: "SYS", tone: "text-muted-foreground border-border bg-muted" };
  return { label: "AUDIT", tone: "text-muted-foreground border-border bg-muted" };
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
      className="max-h-80 space-y-2 overflow-y-auto px-4 py-3"
      role="log"
      aria-label="Gate event log"
    >
      {events.map((e) => {
        const tag = eventTag(e.payload.kind);
        return (
          <li
            key={e.id}
            className="animate-enter flex items-baseline gap-2 text-xs"
          >
            <span className="shrink-0 text-muted-foreground/60 tabular-nums">
              {e.ts}
            </span>
            <span
              className={cn(
                "shrink-0 rounded border px-1 py-px font-mono text-[10px] font-medium uppercase leading-4 tracking-wider",
                tag.tone
              )}
            >
              {tag.label}
            </span>
            <span className="min-w-0 break-words text-muted-foreground">
              {eventText(e.payload)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
