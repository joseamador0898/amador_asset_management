import Link from "next/link";
import { MARK_PATH } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * The A reads as a sail; its crossbar is a horizon that runs past both legs,
 * a vessel holding its course. Small gaps around the horizon keep it legible
 * in one color. Master files and exports live in /public/brand.
 */
export function Monogram({ className, title = "Amador", horizon = "var(--color-brass)" }: { className?: string; title?: string; horizon?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label={title}>
      <path d={MARK_PATH} fill="currentColor" />
      <rect x="2" y="41" width="60" height="4" fill={horizon} />
    </svg>
  );
}

export function Logo({ tone = "dark", className, compact = false }: { tone?: "dark" | "light"; className?: string; compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Amador Asset Management, home"
      className={cn("group inline-flex items-center gap-3", tone === "light" ? "text-paper" : "text-ink", className)}
    >
      <Monogram
        className="h-10 w-10 shrink-0 transition-transform duration-500 group-hover:-translate-y-0.5"
        horizon={tone === "light" ? "var(--color-brass-light)" : "var(--color-brass)"}
      />
      {!compact && (
        <span className="flex flex-col whitespace-nowrap leading-none">
          <span className="font-serif text-[1.35rem] font-medium tracking-[0.22em]">AMADOR</span>
          <span className={cn("mt-1 text-[0.56rem] font-semibold tracking-[0.3em]", tone === "light" ? "text-brass-light" : "text-muted")}>
            ASSET MANAGEMENT
          </span>
        </span>
      )}
    </Link>
  );
}
