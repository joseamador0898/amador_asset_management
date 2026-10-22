"use client";

import { useMemo, useState } from "react";
import type { OptionsContract } from "@/lib/signals/types";
import { cn, fmt } from "@/lib/utils";

type SortKey = "premium" | "volOi" | "volume";

export function UnusualTable({ contracts }: { contracts: OptionsContract[] }) {
  const [side, setSide] = useState<"all" | "C" | "P">("all");
  const [sort, setSort] = useState<SortKey>("premium");

  const rows = useMemo(
    () => contracts.filter((c) => side === "all" || c.type === side).sort((a, b) => b[sort] - a[sort]),
    [contracts, side, sort],
  );

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1 font-mono text-[0.62rem] uppercase tracking-wider transition-colors",
      active ? "border-paper/60 bg-paper text-term" : "border-term-line text-paper/55 hover:text-paper",
    );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-4">
        <div className="flex gap-2" role="group" aria-label="Filter by option type">
          {(["all", "C", "P"] as const).map((s) => (
            <button key={s} type="button" className={chip(side === s)} onClick={() => setSide(s)} aria-pressed={side === s}>
              {s === "all" ? "All" : s === "C" ? "Calls" : "Puts"}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-wider text-paper/60">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded border border-term-line bg-term-3 px-2 py-1 text-paper"
          >
            <option value="premium">Premium</option>
            <option value="volOi">Vol / OI</option>
            <option value="volume">Volume</option>
          </select>
        </label>
      </div>
      <div className="term-scroll mt-3 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left font-mono text-[0.72rem] tabular">
          <thead className="text-[0.6rem] uppercase tracking-wider text-paper/60">
            <tr className="border-b border-term-line">
              <th className="px-5 py-2 font-normal">Ticker</th>
              <th className="px-2 py-2 font-normal">Contract</th>
              <th className="px-2 py-2 text-right font-normal">Vol</th>
              <th className="px-2 py-2 text-right font-normal">OI</th>
              <th className="px-2 py-2 text-right font-normal">Vol/OI</th>
              <th className="px-2 py-2 text-right font-normal">Est. premium</th>
              <th className="px-2 py-2 text-right font-normal">IV</th>
              <th className="px-5 py-2 text-right font-normal">OTM</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-6 text-center text-paper/60">
                  No contracts cleared the unusual-activity screen this session.
                </td>
              </tr>
            )}
            {rows.map((c) => (
              <tr key={c.contract} className="border-b border-term-line/60 hover:bg-term-3">
                <td className="px-5 py-2.5 font-semibold text-paper">{c.ticker}</td>
                <td className="px-2 py-2.5">
                  <span className={cn("mr-2 rounded px-1.5 py-0.5 text-[0.6rem] font-semibold", c.type === "C" ? "bg-up/15 text-up" : "bg-down/10 text-down")}>
                    {c.type === "C" ? "CALL" : "PUT"}
                  </span>
                  <span className="text-paper/80">
                    ${c.strike} · {c.expiry.slice(5).replace("-", "/")}/{c.expiry.slice(2, 4)}
                  </span>
                </td>
                <td className="px-2 py-2.5 text-right text-paper/85">{fmt.int(c.volume)}</td>
                <td className="px-2 py-2.5 text-right text-paper/50">{fmt.int(c.openInterest)}</td>
                <td className={cn("px-2 py-2.5 text-right", c.volOi >= 5 ? "text-amber" : "text-paper/80")}>{c.volOi.toFixed(1)}×</td>
                <td className="px-2 py-2.5 text-right text-paper">{fmt.usdCompact(c.premium)}</td>
                <td className="px-2 py-2.5 text-right text-paper/60">{c.iv ? `${(c.iv * 100).toFixed(0)}%` : "–"}</td>
                <td className="px-5 py-2.5 text-right text-paper/60">{fmt.pct(c.moneynessPct, 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-5 py-3 text-[0.68rem] leading-relaxed text-paper/60">
        Screen: ≥1,000 contracts, volume ≥2× open interest, est. premium ≥$500K. Delayed data; not a recommendation.
      </p>
    </div>
  );
}
