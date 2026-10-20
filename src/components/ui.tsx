import Link from "next/link";

// Shared class strings. One primary (near-black), one secondary (grey pill).
export const primaryBtn =
  "inline-flex h-11 items-center justify-center rounded-md bg-ink px-4 text-[15px] font-medium text-white active:opacity-80 disabled:opacity-50";
export const secondaryBtn =
  "inline-flex h-11 items-center justify-center rounded-md bg-raised px-4 text-[15px] font-medium text-ink active:opacity-80 disabled:opacity-50";
export const inputCls =
  "h-11 w-full rounded-md border border-control bg-surface px-3 text-[16px] placeholder:text-muted/70";

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[14px] font-medium">{label}</span>
      {children}
      {error ? (
        <span role="alert" className="mt-1.5 block text-[13px] text-negative">
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-[13px] text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-border bg-surface ${className}`}>{children}</section>
  );
}

export function SectionHeading({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-2 mt-6 flex items-baseline justify-between">
      <h2 className="text-[16px] font-semibold">{children}</h2>
      {aside ? <span className="text-[13px] text-muted">{aside}</span> : null}
    </div>
  );
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="-ml-1 flex h-11 w-fit items-center gap-1 pr-3 text-muted">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 3 5 8l5 5" />
      </svg>
      {children}
    </Link>
  );
}
