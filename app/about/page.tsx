import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, ShieldCheck, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "About",
  description:
    "MINTGATE is a local-first mint-trust gate for Cashu agent spend — not a wallet.",
};

const NOT_LIST = [
  "Not a Cashu wallet — the CLI daemon owns the proofs, this UI watches the gate.",
  "Not CLERK, not escrow — nobody holds funds on your behalf.",
  "Not NWC, L402, CoinJoin, or PayJoin — none of those plumbing tricks are involved.",
  "Not a rating agency — auditor scores are signal, not ground truth.",
];

const LOOP = [
  {
    icon: ShieldAlert,
    tone: "text-danger",
    title: "DENY",
    body: "Agent spend hits a failing mint: below auditor floor, below KYM floor, or off the allowlist. Every pay/send is refused — on screen, with reason codes.",
  },
  {
    icon: Zap,
    tone: "text-accent",
    title: "Evacuate",
    body: "Proofs leave the bad mint by rebalance to a trusted mint or melt to Lightning. The gate stays shut until the last proof verifies.",
  },
  {
    icon: ShieldCheck,
    tone: "text-success",
    title: "ALLOW",
    body: "Once all proofs sit on trusted mints, the proxy forwards again. The gate goes quiet until the next failing mint appears.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 md:px-6">
      <PageIntro eyebrow="What this is" title="A mint-trust gate for agents">
        Autonomous agents hold e-cash. MINTGATE decides — locally, by policy —
        which mints that e-cash may sit on, and refuses spend against mints
        that fail the floors.
      </PageIntro>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {LOOP.map(({ icon: Icon, tone, title, body }) => (
          <Card key={title} className="animate-status-in">
            <CardContent className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${tone}`} aria-hidden="true" />
                <p className="font-mono text-sm font-semibold tracking-tight text-foreground">
                  {title}
                </p>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader>
            <CardTitle>What MINTGATE is not</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {NOT_LIST.map((item) => (
                <li
                  key={item}
                  className="border-b border-border pb-2.5 text-xs leading-relaxed text-muted-foreground last:border-0 last:pb-0"
                >
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Honesty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>
                This is a demo UI. Funds and flows are simulated; the real
                daemon (CLI) is the source of truth.
              </p>
              <p>
                Auditor scores measure audit success and KYM posture — they do
                not certify a mint is solvent today.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stack</CardTitle>
            </CardHeader>
            <CardContent className="font-mono text-xs leading-relaxed text-muted-foreground">
              Next.js App Router · TypeScript · Tailwind CSS v4 · Geist
              Sans/Mono · lucide-react. Near-black UI, one amber accent, mono
              for mint URLs and balances.
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Built for the Bitshala BOSS Battle · Machine Money track. Start at the{" "}
        <Link
          href="/console"
          className="underline decoration-border underline-offset-2 hover:text-foreground"
        >
          console
        </Link>{" "}
        or read the{" "}
        <Link
          href="/policy"
          className="underline decoration-border underline-offset-2 hover:text-foreground"
        >
          policy
        </Link>
        .
      </p>
    </div>
  );
}
