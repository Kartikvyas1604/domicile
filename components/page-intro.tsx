import type { ReactNode } from "react";

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="max-w-2xl space-y-2">
      <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
        {eyebrow}
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {children && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {children}
        </p>
      )}
    </div>
  );
}
