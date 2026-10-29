import type { MacroSeries } from "@/lib/signals/types";
import { Sparkline } from "@/components/charts/Sparkline";
import { formatDateFor, type Lang } from "@/lib/i18n";
import { macroText } from "@/lib/signals/labels";
import { cn } from "@/lib/utils";

/** Grid of macro tiles; 1px gaps over a colored backdrop draw the rules. */
export function MacroGrid({
  series,
  tone = "dark",
  limit,
  wide = false,
  gridClassName,
  lang = "en",
}: {
  series: MacroSeries[];
  tone?: "dark" | "light";
  limit?: number;
  wide?: boolean;
  gridClassName?: string;
  lang?: Lang;
}) {
  const dark = tone === "dark";
  const items = limit ? series.slice(0, limit) : series;
  return (
    <ul className={cn("grid gap-px", gridClassName ?? cn("grid-cols-2 sm:grid-cols-4", wide && "xl:grid-cols-8"), dark ? "bg-term-line" : "bg-line")}>
      {items.map((s) => {
        const text = macroText(s, lang);
        const flat = Math.abs(s.change) < Math.pow(10, -s.decimals) / 2;
        const up = s.change > 0;
        const color = flat ? (dark ? "text-paper/60" : "text-muted") : up ? "text-up" : "text-down";
        return (
          <li key={s.id} className={cn("flex flex-col gap-2 p-4 sm:p-5", dark ? "bg-term-2" : "bg-paper")} title={text.description}>
            <div className="flex items-baseline justify-between gap-2">
              <p className={cn("text-[0.66rem] font-semibold uppercase tracking-[0.14em]", dark ? "text-paper/55" : "text-muted")}>{text.label}</p>
              <p className={cn("font-mono text-[0.6rem]", dark ? "text-paper/55" : "text-muted")}>{s.id}</p>
            </div>
            <p className={cn("font-mono text-2xl tabular", dark ? "text-paper" : "text-ink")}>
              {s.value.toFixed(s.decimals)}
              <span className={cn("ml-1 text-xs", dark ? "text-paper/65" : "text-muted")}>{s.unit === "index" ? "" : text.unit}</span>
            </p>
            <Sparkline points={s.points} className={cn("h-10 w-full", color)} label={lang === "es" ? `Tendencia de ${text.label}` : `${text.label} trend`} />
            <p className={cn("flex justify-between font-mono text-[0.66rem]", dark ? "text-paper/65" : "text-muted")}>
              <span className={color}>
                {flat ? "±0" : `${up ? "+" : ""}${s.change.toFixed(s.decimals)}`} {text.changeLabel}
              </span>
              <span>{formatDateFor(s.date, lang, { month: "short", day: "numeric", year: "2-digit" })}</span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}
