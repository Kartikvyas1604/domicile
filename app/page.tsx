import { GateConsole } from "@/components/gate-console";
import { GateHeader } from "@/components/gate-header";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <GateHeader />
      <main className="flex-1 pt-8">
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
