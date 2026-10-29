import type { Lang } from "@/lib/i18n";
import type { TidePoint } from "@/lib/signals/types";
import { fmt } from "@/lib/utils";

const COPY = {
  en: { aria: "Net call and put premium through the session", call: "Net call premium", put: "Net put premium" },
  es: { aria: "Prima neta de calls y puts durante la sesión", call: "Prima neta de calls", put: "Prima neta de puts" },
};

/** Intraday net call vs net put premium (two lines around a zero axis). */
export function MarketTide({ points, lang = "en" }: { points: TidePoint[]; lang?: Lang }) {
  const copy = COPY[lang];
  const W = 760;
  const H = 240;
  const P = { l: 52, r: 12, t: 14, b: 26 };
  const values = points.flatMap((p) => [p.netCall, p.netPut]);
  const lo = Math.min(0, ...values);
  const hi = Math.max(0, ...values);
  const span = hi - lo || 1;
  const x = (i: number) => P.l + (i / Math.max(1, points.length - 1)) * (W - P.l - P.r);
  const y = (v: number) => P.t + (1 - (v - lo) / span) * (H - P.t - P.b);
  const path = (key: "netCall" | "netPut") => points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p[key]).toFixed(1)}`).join(" ");
  const ticks = [hi, (hi + lo) / 2, lo];
  const labelEvery = Math.max(1, Math.round(points.length / 6));

  return (
    <div className="px-3 py-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={copy.aria}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke="#24242b" />
            <text x={P.l - 8} y={y(t) + 4} textAnchor="end" fontSize="10" fill="#8b8b96" className="font-mono">
              {fmt.usdCompact(t)}
            </text>
          </g>
        ))}
        <line x1={P.l} x2={W - P.r} y1={y(0)} y2={y(0)} stroke="#3f3f48" strokeDasharray="3 4" />
        <path d={path("netCall")} fill="none" stroke="var(--color-up)" strokeWidth="1.8" />
        <path d={path("netPut")} fill="none" stroke="var(--color-down)" strokeWidth="1.8" />
        {points.map((p, i) =>
          i % labelEvery === 0 ? (
            <text key={p.t + i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#8b8b96" className="font-mono">
              {p.t}
            </text>
          ) : null,
        )}
      </svg>
      <div className="mt-2 flex gap-5 px-2 font-mono text-[0.62rem] uppercase tracking-wider text-paper/50">
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-4 bg-up" /> {copy.call}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-4 bg-down" /> {copy.put}
        </span>
      </div>
    </div>
  );
}
