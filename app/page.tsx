import { GateConsole } from "@/components/gate-console";
import { GateHeader } from "@/components/gate-header";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <a
        href="#gate-main"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-20 focus-visible:rounded-md focus-visible:bg-accent focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:text-accent-foreground"
      >
        Skip to gate status
      </a>
      <GateHeader />
      <main id="gate-main" className="flex-1 pt-8">
        <GateConsole />
      </main>
      <footer className="border-t border-border py-6">
        <p className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground md:px-6">
          Local daemon UI · FOSS · Mint-trust gate for agents — not another
          Cashu wallet.
        </p>
      </footer>
    </div>
  );
}
