import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { formatDateFor, type Lang } from "@/lib/i18n";
import type { SignalAlert } from "@/lib/signals/types";
import { cn } from "@/lib/utils";

const levelStyle = {
  high: { label: { en: "High", es: "Alta" }, dark: "border-down/40 bg-down/10 text-down", light: "border-oxblood/40 bg-oxblood/10 text-oxblood" },
  medium: { label: { en: "Medium", es: "Media" }, dark: "border-amber/40 bg-amber/10 text-amber", light: "border-brass/50 bg-brass/10 text-brass" },
  info: { label: { en: "Info", es: "Info" }, dark: "border-term-line bg-term-3 text-paper/60", light: "border-line bg-paper-2 text-muted" },
} as const;

/** Rule-based alerts list (dark terminal or light page tone). The alerts arrive already written in the page's language. */
export function AlertList({ alerts, tone = "dark", limit, lang = "en" }: { alerts: SignalAlert[]; tone?: "dark" | "light"; limit?: number; lang?: Lang }) {
  const dark = tone === "dark";
  const items = limit ? alerts.slice(0, limit) : alerts;
  return (
    <ul className={cn("divide-y", dark ? "divide-term-line" : "divide-line")}>
      {items.map((a) => {
        const Icon = a.direction === "up" ? ArrowUpRight : a.direction === "down" ? ArrowDownRight : ArrowRight;
        const style = levelStyle[a.level];
        return (
          <li key={a.id} className={cn("flex gap-4 py-4", dark ? "px-5" : "px-0")}>
            <span
              className={cn(
                "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border",
                dark ? "border-term-line text-paper/70" : "border-line text-ink/70",
              )}
              aria-hidden
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className={cn("text-sm font-semibold", dark ? "text-paper" : "text-ink")}>{a.title}</p>
                <span className={cn("rounded-full border px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-wider", dark ? style.dark : style.light)}>
                  {style.label[lang]}
                </span>
              </div>
              <p className={cn("mt-1 text-[0.82rem] leading-relaxed", dark ? "text-paper/65" : "text-muted")}>{a.detail}</p>
              <p className={cn("mt-1 font-mono text-[0.6rem] uppercase tracking-wider", dark ? "text-paper/60" : "text-muted")}>
                {a.source} · {formatDateFor(a.date, lang, { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
