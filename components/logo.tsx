export function Logo({
  className,
  proofClassName,
}: {
  className?: string;
  proofClassName?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M5 21V9a7 7 0 0 1 14 0v12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 21h18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="9.5"
        y="8"
        width="5"
        height="5"
        rx="1"
        className={proofClassName ?? "fill-accent"}
      />
    </svg>
  );
}
