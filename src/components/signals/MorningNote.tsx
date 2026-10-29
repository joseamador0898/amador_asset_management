import { Sparkles } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { getBrief } from "@/lib/signals";
import { formatAsOf } from "./Panel";

const COPY = {
  en: {
    aria: "Analyst commentary",
    label: (gs: boolean) => `Analyst commentary · AI summary of ${gs ? "Goldman Sachs and market data" : "market data"}`,
    footer: (model: string, at: string) =>
      `Written by an AI model (${model}) from the data on this page, not by a human analyst · ${at}. May contain errors. Not investment advice.`,
  },
  es: {
    aria: "Comentario del analista",
    label: (gs: boolean) => `Comentario del analista · resumen con IA de ${gs ? "datos de Goldman Sachs y del mercado" : "datos del mercado"}`,
    footer: (model: string, at: string) =>
      `Redactado por un modelo de IA (${model}) a partir de los datos de esta página, no por un analista humano · ${at}. Puede contener errores. No es asesoría de inversión.`,
  },
};

/** Gemini-written, data-grounded summary, written in the page's language. Hidden entirely when unavailable. */
export async function MorningNote({ tone = "dark", lang = "en" }: { tone?: "dark" | "light"; lang?: Lang }) {
  const brief = await getBrief(lang);
  if (!brief) return null;
  // Keep only the bullet lines; drop any preamble the model adds.
  const bullets = brief.text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^[-*•]\s+/.test(l))
    .map((l) => l.replace(/^[-*•]\s+/, "").replace(/\*\*/g, ""))
    .slice(0, 4);
  if (!bullets.length) return null;
  const dark = tone === "dark";
  const t = COPY[lang];
  return (
    <section className={dark ? "term-panel p-5" : "border border-line bg-paper p-6"} aria-label={t.aria}>
      <p className={`flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-wider ${dark ? "text-brass-light" : "text-brass"}`}>
        <Sparkles className="h-3.5 w-3.5" aria-hidden /> {t.label(brief.gs)}
      </p>
      <ul className="mt-4 space-y-3">
        {bullets.map((b, i) => (
          <li key={i} className={`flex gap-3 text-sm leading-relaxed ${dark ? "text-paper/85" : "text-ink/85"}`}>
            <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${dark ? "bg-brass-light" : "bg-brass"}`} aria-hidden />
            {b}
          </li>
        ))}
      </ul>
      <p className={`mt-4 text-[0.66rem] leading-relaxed ${dark ? "text-paper/60" : "text-muted"}`}>{t.footer(brief.model, formatAsOf(brief.asOf, lang))}</p>
    </section>
  );
}
