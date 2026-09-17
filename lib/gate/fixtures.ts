import type { MintPolicy } from "./types";

export const DEMO_POLICY: MintPolicy = {
  allowlist: [
    "https://mint.minibits.cash/Bitcoin",
    "https://mint.coinos.io",
  ],
  minAuditorSuccessRate: 0.95,
  minKymScore: 0.6,
  trustedMints: ["https://mint.minibits.cash/Bitcoin"],
};

export const TRUSTED_MINT = {
  url: "https://mint.minibits.cash/Bitcoin",
  host: "mint.minibits.cash",
  balanceSats: 3200,
  auditorOk: 0.98,
  kymScore: 0.82,
  trusted: true,
  reasons: [],
};

export const BAD_MINT = {
  url: "https://mint.roulettesats.xyz/v1",
  host: "mint.roulettesats.xyz",
  balanceSats: 1250,
  auditorOk: 0.41,
  kymScore: 0.12,
  trusted: false,
  reasons: [],
};

export const WATCH_MINT = {
  url: "https://mint.legacypool.net",
  host: "mint.legacypool.net",
  balanceSats: 0,
  auditorOk: 0.77,
  kymScore: 0.55,
  trusted: false,
  reasons: [],
};

export const DEMO_MINTS = [TRUSTED_MINT, BAD_MINT, WATCH_MINT];

export const FAKE_INVOICE =
  "lnbc12u1p5xexample1qdzqsp5perfeyq9qcppjwv8h7s4rkx9f6hq8zge5v8r2qzpsz3jnqvsp5hxlnkwejq";
