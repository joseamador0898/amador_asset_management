import type { PredictionMarket } from "@/lib/signals/types";
import { cn, fmt } from "@/lib/utils";

export function Predictions({ markets, tone = "dark", limit }: { markets: PredictionMarket[]; tone?: "dark" | "light"; limit?: number }) {
  const dark = tone === "dark";
  const items = limit ? markets.slice(0, limit) : markets;
  return (
    <ul className={cn("divide-y", dark ? "divide-term-line" : "divide-line")}>
      {items.map((m) => (
        <li key={m.id} className="px-5 py-4">
          <a href={m.url} target="_blank" rel="noopener noreferrer" className={cn("text-sm leading-snug hover:underline", dark ? "text-paper" : "text-ink")}>
            {m.title}
          </a>
          <ul className="mt-3 space-y-1.5">
            {m.outcomes.slice(0, 3).map((o) => (
              <li key={o.label} className="grid grid-cols-[1fr_auto] items-center gap-3">
                <div className={cn("relative h-6 overflow-hidden rounded-sm", dark ? "bg-term-3" : "bg-paper-2")}>
                  <div
                    className={cn("absolute inset-y-0 left-0", dark ? "bg-cyan/20" : "bg-sea/15")}
                    style={{ width: `${Math.max(2, o.probability * 100)}%` }}
                  />
                  <span className={cn("relative block truncate px-2 text-[0.7rem] leading-6", dark ? "text-paper/80" : "text-ink/80")}>{o.label}</span>
                </div>
                <span className={cn("w-11 text-right font-mono text-xs tabular", dark ? "text-cyan" : "text-sea")}>{(o.probability * 100).toFixed(0)}%</span>
              </li>
            ))}
          </ul>
          <p className={cn("mt-2 font-mono text-[0.6rem] uppercase tracking-wider", dark ? "text-paper/35" : "text-muted")}>
            24h volume {fmt.usdCompact(m.volume24h)}
          </p>
        </li>
      ))}
    </ul>
  );
}
