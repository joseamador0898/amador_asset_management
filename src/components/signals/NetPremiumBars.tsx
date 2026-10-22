import type { TickerFlow } from "@/lib/signals/types";
import { cn, fmt } from "@/lib/utils";

/** Diverging bars: estimated call premium (right) vs put premium (left) per ticker. */
export function NetPremiumBars({ tickers }: { tickers: TickerFlow[] }) {
  const max = Math.max(1, ...tickers.flatMap((t) => [t.callPremium, t.putPremium]));
  return (
    <div className="px-5 py-4">
      <div className="mb-3 flex justify-between font-mono text-[0.6rem] uppercase tracking-wider text-paper/60">
        <span>← Put premium</span>
        <span>Call premium →</span>
      </div>
      <ul className="space-y-2.5">
        {tickers.map((t) => (
          <li key={t.ticker} className="grid grid-cols-[3.25rem_1fr_4.5rem] items-center gap-3">
            <div>
              <p className="font-mono text-xs font-semibold text-paper">{t.ticker}</p>
              <p className={cn("font-mono text-[0.6rem] tabular", t.changePct >= 0 ? "text-up" : "text-down")}>{fmt.pct(t.changePct, 1)}</p>
            </div>
            <div className="relative h-4" title={`Calls ${fmt.usdCompact(t.callPremium)} · Puts ${fmt.usdCompact(t.putPremium)} · P/C vol ${t.putCallVolume.toFixed(2)}`}>
              <div className="absolute inset-y-0 left-1/2 w-px bg-term-line" />
              <div className="absolute inset-y-0.5 right-1/2 rounded-l-sm bg-down/70" style={{ width: `${(t.putPremium / max) * 50}%` }} />
              <div className="absolute inset-y-0.5 left-1/2 rounded-r-sm bg-up/70" style={{ width: `${(t.callPremium / max) * 50}%` }} />
            </div>
            <p className={cn("text-right font-mono text-[0.7rem] tabular", t.net >= 0 ? "text-up" : "text-down")}>{fmt.usdCompact(t.net)}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[0.68rem] leading-relaxed text-paper/60">
        Net = estimated call premium minus put premium traded today (volume × last price × 100). Premium is not direction: many
        large trades are hedges or spreads.
      </p>
    </div>
  );
}
