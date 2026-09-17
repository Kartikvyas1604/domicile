import { Logo } from "@/components/logo";

export function GateHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-2.5">
          <Logo className="h-6 w-6 text-foreground" />
          <span className="font-mono text-sm font-semibold uppercase tracking-widest">
            Mintgate
          </span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            agent mint-trust gate
          </span>
        </div>
        <p className="hidden font-mono text-[11px] uppercase tracking-wider text-muted-foreground md:block">
          deny → evacuate → allow
        </p>
      </div>
    </header>
  );
}
