export type EvacuateMode = "melt_ln" | "rebalance";

export interface MintPolicy {
  allowlist: string[];
  minAuditorSuccessRate: number;
  minKymScore: number;
  trustedMints: string[];
}

export interface MintStatus {
  url: string;
  host: string;
  balanceSats: number;
  auditorOk: number;
  kymScore: number;
  trusted: boolean;
  reasons: string[];
}

export interface EvacuatePlan {
  fromMint: string;
  mode: EvacuateMode;
  toMint?: string;
  invoice?: string;
  amountSats: number;
  status: "pending" | "running" | "ok" | "failed";
}

export type GateEventType =
  | { kind: "SCAN_OK"; detail: string }
  | { kind: "DENY"; mint: string; reason: string }
  | { kind: "SPEND_DENIED"; amountSats: number; reason: string }
  | { kind: "SPEND_OK"; amountSats: number }
  | { kind: "EVACUATE_START"; mode: EvacuateMode; from: string }
  | { kind: "EVACUATE_STEP"; detail: string }
  | { kind: "EVACUATE_OK"; detail: string }
  | { kind: "ALLOW" }
  | { kind: "AUDITOR_OFFLINE" }
  | { kind: "AUDITOR_ONLINE" }
  | { kind: "SYSTEM"; detail: string };

export interface GateEvent {
  id: number;
  ts: string;
  payload: GateEventType;
}

export interface GateDecision {
  decision: "ALLOW" | "DENY";
  blockingMints: MintStatus[];
  next: "evacuate" | "none";
}

export type Phase = "booting" | "ready" | "evacuating";
