import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import type { SourceInfo } from "@/lib/signals/types";
import { cn } from "@/lib/utils";

export function formatAsOf(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function SourceBadge({ source, locked }: { source: SourceInfo; locked?: boolean }) {
  if (locked && !source.live) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-term-line bg-term-3 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-paper/60">
        <Lock className="h-3 w-3" aria-hidden /> Partner data
      </span>
    );
  }
  return source.live ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-up/30 bg-up/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-up">
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-up" aria-hidden /> Live
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber/30 bg-amber/10 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-amber">
      Sample
    </span>
  );
}

export function Panel({
  title,
  subtitle,
  source,
  locked = false,
  className,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  source?: SourceInfo;
  locked?: boolean;
  className?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  const showLock = locked && source && !source.live;
  return (
    <section className={cn("term-panel flex min-w-0 flex-col", className)} aria-label={title}>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-term-line px-5 py-4">
        <div>
          <h2 className="font-sans text-sm font-semibold tracking-wide text-paper">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-paper/50">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {action}
          {source && <SourceBadge source={source} locked={locked} />}
        </div>
      </header>
      <div className="relative min-w-0 flex-1">
        <div className={cn(showLock && "pointer-events-none select-none blur-[5px] opacity-60")} aria-hidden={showLock || undefined}>
          {children}
        </div>
        {showLock && (
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div className="max-w-xs">
              <Lock className="mx-auto h-5 w-5 text-brass-light" aria-hidden />
              <p className="mt-3 text-sm font-semibold text-paper">Coming with Amador Signals Pro</p>
              <p className="mt-1 text-xs leading-relaxed text-paper/55">
                This panel goes live once a licensed data partner is connected. Illustrative layout shown.
              </p>
            </div>
          </div>
        )}
      </div>
      {source && (
        <footer className="border-t border-term-line px-5 py-2.5 font-mono text-[0.62rem] uppercase tracking-wider text-paper/60">
          {source.live ? (
            <>
              Source:{" "}
              {source.url ? (
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:text-paper/70 hover:underline">
                  {source.provider}
                </a>
              ) : (
                source.provider
              )}{" "}
              · Updated {formatAsOf(source.asOf)}
            </>
          ) : (
            <>{showLock ? "Illustrative · not live data" : `Sample data · ${source.note ?? "provider not configured"}`}</>
          )}
        </footer>
      )}
    </section>
  );
}

export const upDown = (v: number) => (v > 0 ? "text-up" : v < 0 ? "text-down" : "text-paper/60");
