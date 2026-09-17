import type {
  GateDecision,
  MintPolicy,
  MintStatus,
  EvacuateMode,
} from "./types";

export function computeReasons(
  mint: MintStatus,
  policy: MintPolicy,
  auditorOnline: boolean
): string[] {
  const reasons: string[] = [];
  if (!policy.allowlist.includes(mint.url)) {
    reasons.push("not on allowlist");
  }
  if (auditorOnline) {
    if (mint.auditorOk < policy.minAuditorSuccessRate) {
      reasons.push(
        `auditor ${Math.round(mint.auditorOk * 100)}% < ${Math.round(
          policy.minAuditorSuccessRate * 100
        )}% floor`
      );
    }
    if (mint.kymScore < policy.minKymScore) {
      reasons.push(
        `KYM ${mint.kymScore.toFixed(2)} < ${policy.minKymScore.toFixed(
          2
        )} floor`
      );
    }
  }
  return reasons;
}

export function evaluateGate(
  mints: MintStatus[],
  policy: MintPolicy,
  auditorOnline: boolean
): GateDecision {
  const blockingMints = mints.filter(
    (m) => m.balanceSats > 0 && computeReasons(m, policy, auditorOnline).length > 0
  );
  return {
    decision: blockingMints.length > 0 ? "DENY" : "ALLOW",
    blockingMints,
    next: blockingMints.length > 0 ? "evacuate" : "none",
  };
}

export function planLabel(mode: EvacuateMode): string {
  return mode === "melt_ln" ? "Melt to LN" : "Rebalance to trusted mint";
}

export function nowTs(): string {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}
