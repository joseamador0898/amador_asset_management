import { Sparkles } from "lucide-react";
import { getBrief } from "@/lib/signals";
import { formatAsOf } from "./Panel";

/** Gemini-written, data-grounded summary. Hidden entirely when unavailable. */
export async function MorningNote({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const brief = await getBrief();
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
  return (
    <section className={dark ? "term-panel p-5" : "border border-line bg-paper p-6"} aria-label="Analyst commentary">
      <p className={`flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-wider ${dark ? "text-brass-light" : "text-brass"}`}>
        <Sparkles className="h-3.5 w-3.5" aria-hidden /> Analyst commentary · AI summary of {brief.gs ? "Goldman Sachs and market data" : "market data"}
      </p>
      <ul className="mt-4 space-y-3">
        {bullets.map((b, i) => (
          <li key={i} className={`flex gap-3 text-sm leading-relaxed ${dark ? "text-paper/85" : "text-ink/85"}`}>
            <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${dark ? "bg-brass-light" : "bg-brass"}`} aria-hidden />
            {b}
          </li>
        ))}
      </ul>
      <p className={`mt-4 text-[0.66rem] leading-relaxed ${dark ? "text-paper/35" : "text-muted"}`}>
        Written by an AI model ({brief.model}) from the data on this page, not by a human analyst · {formatAsOf(brief.asOf)}.
        May contain errors. Not investment advice.
      </p>
    </section>
  );
}
