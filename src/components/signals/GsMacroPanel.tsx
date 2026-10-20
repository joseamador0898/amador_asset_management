import { getGsMacro } from "@/lib/signals";
import { Panel } from "./Panel";
import { MacroGrid } from "./MacroGrid";
import { fmt, formatDate } from "@/lib/utils";

const money = (v: number | null) => (v === null ? "–" : `$${fmt.int(v)}`);

/** Goldman Sachs Marquee macro lens. Renders nothing unless the licensed feed is enabled. */
export async function GsMacroPanel() {
  const feed = await getGsMacro();
  if (!feed) return null;
  const { tiles, commodities } = feed.data;

  return (
    <Panel
      title="Goldman Sachs macro lens"
      subtitle="Financial conditions, growth nowcast, data surprises, risk appetite and GIR commodity forecasts"
      source={feed.source}
      className="lg:col-span-3"
    >
      <div className="grid gap-px bg-term-line">
        <div className="bg-term-2">
          <MacroGrid series={tiles} gridClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" />
        </div>
        {commodities.length > 0 && (
          <div className="bg-term-2 p-5">
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-paper/55">GIR commodity forecasts</p>
            <table className="mt-3 w-full max-w-2xl font-mono text-xs tabular">
              <thead className="text-[0.6rem] uppercase tracking-wider text-paper/40">
                <tr className="border-b border-term-line">
                  <th className="py-2 text-left font-normal">Commodity</th>
                  <th className="py-2 text-right font-normal">{commodities[0].quarterLabel}</th>
                  <th className="py-2 text-right font-normal">12 months</th>
                </tr>
              </thead>
              <tbody>
                {commodities.map((c) => (
                  <tr key={c.label} className="border-b border-term-line/60">
                    <td className="py-2.5 font-sans text-paper/85">
                      {c.label} <span className="text-[0.6rem] text-paper/40">{c.unit}</span>
                    </td>
                    <td className="py-2.5 text-right text-paper">{money(c.quarter)}</td>
                    <td className="py-2.5 text-right text-brass-light">{money(c.twelveMonth)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[0.62rem] leading-relaxed text-paper/40">
              Goldman Sachs Global Investment Research spot forecasts, published {formatDate(commodities[0].date, { month: "short", day: "numeric", year: "numeric" })}.
              Forecasts, not recommendations.
            </p>
          </div>
        )}
      </div>
      <p className="border-t border-term-line px-5 py-2.5 text-[0.62rem] leading-relaxed text-paper/40">
        Licensed Goldman Sachs data shown for research context; © Goldman Sachs. Higher FCI readings mean tighter financial conditions.
        Activity nowcast is an annualized growth pace; surprise and sentiment indices are standardized.
      </p>
    </Panel>
  );
}
