import type { CongressTrade, DarkPoolPrint } from "@/lib/signals/types";
import { cn, fmt } from "@/lib/utils";

export function CongressTable({ trades }: { trades: CongressTrade[] }) {
  return (
    <ul className="divide-y divide-term-line">
      {trades.slice(0, 8).map((t, i) => (
        <li key={i} className="flex items-center justify-between gap-4 px-5 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm text-paper">{t.member}</p>
            <p className="font-mono text-[0.62rem] uppercase tracking-wider text-paper/60">
              {t.chamber} · traded {t.tradedOn} · filed {t.filedOn}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-sm font-semibold text-paper">{t.ticker}</p>
            <p className={cn("font-mono text-[0.62rem]", t.side === "buy" ? "text-up" : t.side === "sell" ? "text-down" : "text-paper/50")}>
              {t.side.toUpperCase()} · {t.amount}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function DarkPoolTable({ prints }: { prints: DarkPoolPrint[] }) {
  return (
    <ul className="divide-y divide-term-line">
      {prints.slice(0, 8).map((p, i) => (
        <li key={i} className="grid grid-cols-[4rem_1fr_auto] items-center gap-4 px-5 py-3 font-mono text-xs tabular">
          <span className="font-semibold text-paper">{p.ticker}</span>
          <span className="text-paper/60">
            {fmt.int(p.size)} @ ${p.price.toFixed(2)}
          </span>
          <span className="text-paper">{fmt.usdCompact(p.premium)}</span>
        </li>
      ))}
    </ul>
  );
}
