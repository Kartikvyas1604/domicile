import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GateHeader } from "@/components/gate-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "MINTGATE — agent mint-trust gate",
    template: "%s · MINTGATE",
  },
  description:
    "Local-first DENY → evacuate → ALLOW gate for Cashu agent spend. Not a wallet.",
  openGraph: {
    title: "MINTGATE — agent mint-trust gate",
    description: "DENY spend on bad mints. Evacuate. Then allow.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <a
          href="#gate-main"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-20 focus-visible:rounded-md focus-visible:bg-accent focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:text-accent-foreground"
        >
          Skip to main content
        </a>
        <GateHeader />
        <main id="gate-main" className="flex-1">
          {children}
        </main>
        <footer className="border-t border-border py-6">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 md:flex-row md:items-center md:justify-between md:px-6">
            <p className="text-xs text-muted-foreground">
              Local daemon UI · FOSS · Mint-trust gate for agents — not another
              Cashu wallet.
            </p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/70">
              deny → evacuate → allow
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
