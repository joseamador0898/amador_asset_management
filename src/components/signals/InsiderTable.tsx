"use client";

import { useMemo, useState } from "react";
import type { InsiderTrade } from "@/lib/signals/types";
import { cn, fmt } from "@/lib/utils";

export function InsiderTable({ trades }: { trades: InsiderTrade[] }) {
  const [side, setSide] = useState<"all" | "buy" | "sell">("all");
  const rows = useMemo(() => trades.filter((t) => side === "all" || t.side === side), [trades, side]);
  const buys = trades.filter((t) => t.side === "buy").length;

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1 font-mono text-[0.62rem] uppercase tracking-wider transition-colors",
      active ? "border-paper/60 bg-paper text-term" : "border-term-line text-paper/55 hover:text-paper",
    );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-4">
        <div className="flex gap-2" role="group" aria-label="Filter insider transactions">
          {(["all", "buy", "sell"] as const).map((s) => (
            <button key={s} type="button" className={chip(side === s)} onClick={() => setSide(s)} aria-pressed={side === s}>
              {s === "all" ? "All" : s === "buy" ? "Buys" : "Sales"}
            </button>
          ))}
        </div>
        <p className="font-mono text-[0.62rem] uppercase tracking-wider text-paper/45">{buys} open-market buys in latest filings</p>
      </div>
      <div className="term-scroll mt-3 max-h-[420px] overflow-auto">
        <table className="w-full min-w-[700px] text-left font-mono text-[0.72rem] tabular">
          <thead className="sticky top-0 bg-term-2 text-[0.6rem] uppercase tracking-wider text-paper/40">
            <tr className="border-b border-term-line">
              <th className="px-5 py-2 font-normal">Ticker</th>
              <th className="px-2 py-2 font-normal">Insider</th>
              <th className="px-2 py-2 font-normal">Type</th>
              <th className="px-2 py-2 text-right font-normal">Shares</th>
              <th className="px-2 py-2 text-right font-normal">Price</th>
              <th className="px-2 py-2 text-right font-normal">Value</th>
              <th className="px-5 py-2 text-right font-normal">Trade date</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-6 text-center text-paper/45">
                  None in the latest batch of filings.
                </td>
              </tr>
            )}
            {rows.map((t, i) => (
              <tr key={`${t.accession}-${i}`} className="border-b border-term-line/60 hover:bg-term-3">
                <td className="px-5 py-2.5">
                  <a href={t.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-paper hover:underline">
                    {t.ticker}
                  </a>
                  <p className="max-w-[10rem] truncate font-sans text-[0.62rem] text-paper/40">{t.issuer}</p>
                </td>
                <td className="px-2 py-2.5">
                  <p className="max-w-[11rem] truncate text-paper/85">{t.insider}</p>
                  <p className="max-w-[11rem] truncate font-sans text-[0.62rem] text-paper/40">{t.role}</p>
                </td>
                <td className="px-2 py-2.5">
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[0.6rem] font-semibold",
                      t.side === "buy" ? "bg-up/15 text-up" : t.side === "sell" ? "bg-down/15 text-down" : "bg-paper/10 text-paper/60",
                    )}
                  >
                    {t.label}
                  </span>
                </td>
                <td className="px-2 py-2.5 text-right text-paper/80">{fmt.int(t.shares)}</td>
                <td className="px-2 py-2.5 text-right text-paper/60">{t.price ? `$${t.price.toFixed(2)}` : "–"}</td>
                <td className="px-2 py-2.5 text-right text-paper">{t.value ? fmt.usdCompact(t.value) : "–"}</td>
                <td className="px-5 py-2.5 text-right text-paper/50">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
