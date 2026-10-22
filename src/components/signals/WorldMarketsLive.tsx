"use client";

import { useEffect, useState } from "react";
import type { LiveBoard, WorldMarket } from "@/lib/signals/types";
import { cn } from "@/lib/utils";

const REGIONS: WorldMarket["region"][] = ["Americas", "Europe", "Asia-Pacific", "Middle East & Africa"];
const COMPACT = ["US", "MX", "CA", "BR", "GB", "DE", "JP", "CN"];

const time = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit", second: "2-digit" });
const num = (v: number, max = 2) => v.toLocaleString("en-US", { minimumFractionDigits: max, maximumFractionDigits: max });
const tone = (v: number | null) => (v === null ? "text-paper/40" : v > 0 ? "text-up" : v < 0 ? "text-down" : "text-paper/60");
const pct = (v: number | null) => (v === null ? "–" : `${v > 0 ? "+" : ""}${v.toFixed(2)}%`);

/**
 * World markets, refreshed every 15 seconds while the tab is visible: local
 * index levels (delayed) next to US-listed country ETFs (real-time IEX).
 */
export function WorldMarketsLive({ initial, compact = false }: { initial: LiveBoard; compact?: boolean }) {
  const [board, setBoard] = useState(initial);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/markets/live", { cache: "no-store" });
        if (res.ok && active) setBoard((await res.json()) as LiveBoard);
      } catch {
        /* keep the last good board */
      }
    };
    void refresh();
    const id = window.setInterval(refresh, 15_000);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, []);

  const rows = compact ? board.world.filter((w) => COMPACT.includes(w.code)) : board.world;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4 font-mono text-[0.62rem] uppercase tracking-wider text-paper/45">
        <span className="flex items-center gap-2">
          <span className={cn("h-1.5 w-1.5 rounded-full", board.live ? "animate-pulse-dot bg-up" : "bg-amber")} aria-hidden />
          {board.live ? "Live" : "Waiting for data"} · updated {time(board.asOf)} ET
        </span>
        <span>Index levels delayed · country ETFs real-time (IEX)</span>
      </div>

      {(compact ? ["all"] : REGIONS).map((region) => {
        const list = compact ? rows : rows.filter((r) => r.region === region);
        if (!list.length) return null;
        return (
          <div key={region} className="px-5 pb-2 pt-3">
            {!compact && <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-paper/45">{region}</p>}
            <ul className={cn("grid gap-px bg-term-line", compact ? "grid-cols-2 md:grid-cols-4" : "sm:grid-cols-2 xl:grid-cols-3")}>
              {list.map((w) => (
                <li key={w.code} className="flex items-center justify-between gap-3 bg-term-2 px-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-7 w-9 shrink-0 place-items-center rounded-sm border border-term-line font-mono text-[0.62rem] font-semibold text-paper/80">
                      {w.code}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-paper">{w.country}</p>
                      <p className="truncate font-mono text-[0.6rem] text-paper/40">
                        {w.indexName}
                        {w.indexLevel !== null && <span className="text-paper/60"> {num(w.indexLevel)}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right font-mono tabular">
                    <p className={cn("text-sm", tone(w.indexChangePct ?? w.etfChangePct))}>{pct(w.indexChangePct ?? w.etfChangePct)}</p>
                    <p className="text-[0.6rem] text-paper/45">
                      {w.etf} {w.etfPrice !== null ? `$${num(w.etfPrice)}` : "–"}{" "}
                      <span className={tone(w.etfChangePct)}>{pct(w.etfChangePct)}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {!compact && board.quotes.length > 0 && (
        <div className="px-5 pb-4 pt-3">
          <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-paper/45">US indices, sectors and assets · real-time</p>
          <ul className="grid grid-cols-2 gap-px bg-term-line sm:grid-cols-4 lg:grid-cols-7">
            {board.quotes.map((q) => (
              <li key={q.symbol} className="bg-term-2 px-3 py-2.5">
                <p className="flex justify-between font-mono text-[0.62rem] text-paper/50">
                  <span className="font-semibold text-paper/80">{q.symbol}</span>
                  <span className={tone(q.changePct)}>{pct(q.changePct)}</span>
                </p>
                <p className="mt-1 truncate text-[0.66rem] text-paper/55">{q.label}</p>
                <p className="font-mono text-xs tabular text-paper">${num(q.price)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
