"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Console" },
  { href: "/mints", label: "Mints" },
  { href: "/evacuate", label: "Evacuate" },
  { href: "/policy", label: "Policy" },
  { href: "/log", label: "Log" },
  { href: "/about", label: "About" },
];

export function GateNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="flex items-center gap-0.5 overflow-x-auto"
    >
      {NAV_LINKS.map(({ href, label }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "whitespace-nowrap rounded-md px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
