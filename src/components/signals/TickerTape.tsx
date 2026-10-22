import type { Feed, Quote } from "@/lib/signals/types";
import { cn, fmt } from "@/lib/utils";

function Item({ q }: { q: Quote }) {
  const up = q.changePct >= 0;
  return (
    <li className="flex shrink-0 items-baseline gap-2.5 px-6">
      <span className="font-mono text-[0.7rem] font-semibold tracking-wide text-paper">{q.symbol.replace("/USD", "")}</span>
      <span className="text-[0.7rem] text-paper/65">{q.label}</span>
      <span className="font-mono text-[0.72rem] tabular text-paper/85">{fmt.price(q.price)}</span>
      <span className={cn("font-mono text-[0.72rem] tabular", up ? "text-up" : "text-down")}>
        {up ? "▲" : "▼"} {Math.abs(q.changePct).toFixed(2)}%
      </span>
    </li>
  );
}

/** CSS-only marquee: the list is rendered twice and translated by -50%. */
export function TickerTape({ feed, className }: { feed: Feed<Quote[]>; className?: string }) {
  const quotes = feed.data;
  return (
    <div className={cn("group relative overflow-hidden border-y border-term-line bg-term py-2.5", className)}>
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex" aria-hidden={copy === 1 || undefined}>
            {quotes.map((q) => (
              <Item key={`${copy}-${q.symbol}`} q={q} />
            ))}
            <li className="flex shrink-0 items-center px-6 font-mono text-[0.62rem] uppercase tracking-wider text-paper/35">
              {feed.source.live ? feed.source.provider : "Sample quotes"}
            </li>
          </ul>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-term to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-term to-transparent" />
    </div>
  );
}
