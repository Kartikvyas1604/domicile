import { Logo } from "@/components/logo";
import { GateNav } from "@/components/gate-nav";

export function GateHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <Logo className="h-6 w-6 shrink-0 text-foreground" />
          <span className="shrink-0 font-mono text-sm font-semibold uppercase tracking-widest">
            Mintgate
          </span>
          <span className="hidden min-w-0 truncate text-xs text-muted-foreground xl:inline">
            agent mint-trust gate
          </span>
        </div>
        <GateNav />
      </div>
    </header>
  );
}
