import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider",
  {
    variants: {
      variant: {
        neutral: "border-border bg-muted text-muted-foreground",
        deny: "border-danger/40 bg-danger/10 text-danger",
        allow: "border-success/40 bg-success/10 text-success",
        warn: "border-accent/40 bg-accent/10 text-accent",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
