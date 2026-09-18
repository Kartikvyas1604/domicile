import Link from "next/link";
import { PageIntro } from "@/components/page-intro";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
      <PageIntro eyebrow="404" title="No route through this gate">
        This path does not exist. Head back to the dashboard — the gate state
        lives there.
      </PageIntro>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
