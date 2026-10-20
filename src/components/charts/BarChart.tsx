import { cn } from "@/lib/utils";

export type BarDatum = { label: string; value: number; error?: number; highlight?: boolean; note?: string };

/**
 * Horizontal bar chart (SVG, no client JS). Handles negative values with a
 * zero axis, optional error bars (e.g. ±1 sd across seeds) and highlights.
 */
export function BarChart({
  data,
  title,
  caption,
  format = (v: number) => v.toFixed(2),
  tone = "light",
  className,
}: {
  data: BarDatum[];
  title?: string;
  caption?: string;
  format?: (v: number) => string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const rowH = 30;
  const labelW = 132;
  const valueW = 76;
  const width = 640;
  const plotW = width - labelW - valueW;
  const lo = Math.min(0, ...data.map((d) => d.value - (d.error ?? 0)));
  const hi = Math.max(0, ...data.map((d) => d.value + (d.error ?? 0)));
  const span = hi - lo || 1;
  const x = (v: number) => labelW + ((v - lo) / span) * plotW;
  const height = data.length * rowH + 8;
  const dark = tone === "dark";

  return (
    <figure className={cn("not-prose my-8", className)}>
      {title && <figcaption className={cn("mb-3 font-sans text-xs font-semibold uppercase tracking-[0.16em]", dark ? "text-paper/60" : "text-muted")}>{title}</figcaption>}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={title ?? "Bar chart"}>
        <line x1={x(0)} x2={x(0)} y1={0} y2={height - 4} stroke={dark ? "#3a4252" : "#cfc7b6"} strokeWidth="1" />
        {data.map((d, i) => {
          const y = i * rowH + 6;
          const x0 = x(Math.min(0, d.value));
          const w = Math.abs(x(d.value) - x(0));
          const fillColor = d.highlight ? "var(--color-brass)" : dark ? "#4b5568" : "#b9b1a1";
          return (
            <g key={d.label}>
              <text x={labelW - 10} y={y + 15} textAnchor="end" className="font-sans" fontSize="12" fill={dark ? "#c9cfd9" : "#3d4250"} fontWeight={d.highlight ? 600 : 400}>
                {d.label}
              </text>
              <rect x={x0} y={y + 4} width={Math.max(w, 1)} height={rowH - 12} fill={fillColor} rx="1.5" />
              {d.error ? (
                <g stroke={dark ? "#e5e7eb" : "#1d222c"} strokeWidth="1">
                  <line x1={x(d.value - d.error)} x2={x(d.value + d.error)} y1={y + 13} y2={y + 13} />
                  <line x1={x(d.value - d.error)} x2={x(d.value - d.error)} y1={y + 9} y2={y + 17} />
                  <line x1={x(d.value + d.error)} x2={x(d.value + d.error)} y1={y + 9} y2={y + 17} />
                </g>
              ) : null}
              <text x={width - 4} y={y + 15} textAnchor="end" className="font-sans tabular" fontSize="12" fill={dark ? "#e5e7eb" : "#1d222c"} fontWeight={d.highlight ? 600 : 400}>
                {format(d.value)}
                {d.error ? ` ±${format(d.error)}` : ""}
              </text>
            </g>
          );
        })}
      </svg>
      {caption && <figcaption className={cn("mt-3 font-sans text-xs leading-relaxed", dark ? "text-paper/50" : "text-muted")}>{caption}</figcaption>}
    </figure>
  );
}
