import { buildGsAlerts } from "@/lib/signals/alerts";
import { getGsMacro } from "@/lib/signals";
import { Panel } from "./Panel";
import { MacroGrid } from "./MacroGrid";
import { AlertList } from "./AlertList";
import { fmt, formatDate } from "@/lib/utils";

const money = (v: number | null) => (v === null ? "–" : `$${fmt.int(v)}`);
const rate = (v: number | null) => (v === null ? "–" : v >= 100 ? v.toFixed(1) : v.toFixed(v >= 10 ? 2 : 4));

/** Rule-based alerts from Goldman Sachs data. Renders nothing unless the licensed feed is enabled. */
export async function GsAlertsPanel({ limit }: { limit?: number }) {
  const feed = await getGsMacro();
  if (!feed) return null;
  const alerts = buildGsAlerts(feed.data);
  if (!alerts.length) return null;
  return (
    <Panel
      title="Signal alerts"
      subtitle="Rule-based alerts on Goldman Sachs macro indicators and GIR forecasts, highest priority first"
      source={feed.source}
      className="lg:col-span-3"
    >
      <AlertList alerts={alerts} limit={limit} />
    </Panel>
  );
}

/** Goldman Sachs Marquee macro lens. Renders nothing unless the licensed feed is enabled. */
export async function GsMacroPanel() {
  const feed = await getGsMacro();
  if (!feed) return null;
  const { tiles, commodities, fx } = feed.data;

  return (
    <Panel
      title="Goldman Sachs macro lens"
      subtitle="Financial conditions, growth nowcast, data surprises, risk appetite, and GIR commodity and FX forecasts"
      source={feed.source}
      className="lg:col-span-3"
    >
      <div className="grid gap-px bg-term-line">
        <div className="bg-term-2">
          <MacroGrid series={tiles} gridClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" />
        </div>
        <div className="grid gap-px bg-term-line lg:grid-cols-2">
          {commodities.length > 0 && (
            <div className="bg-term-2 p-5">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-paper/55">GIR commodity forecasts</p>
              <table className="mt-3 w-full font-mono text-xs tabular">
                <thead className="text-[0.6rem] uppercase tracking-wider text-paper/60">
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
                        {c.label} <span className="text-[0.6rem] text-paper/60">{c.unit}</span>
                      </td>
                      <td className="py-2.5 text-right text-paper">{money(c.quarter)}</td>
                      <td className="py-2.5 text-right text-brass-light">{money(c.twelveMonth)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-[0.62rem] text-paper/60">
                Spot forecasts published {formatDate(commodities[0].date, { month: "short", day: "numeric", year: "numeric" })}.
              </p>
            </div>
          )}
          {fx.length > 0 && (
            <div className="bg-term-2 p-5">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-paper/55">GIR FX forecasts</p>
              <table className="mt-3 w-full font-mono text-xs tabular">
                <thead className="text-[0.6rem] uppercase tracking-wider text-paper/60">
                  <tr className="border-b border-term-line">
                    <th className="py-2 text-left font-normal">Pair</th>
                    <th className="py-2 text-right font-normal">3 months</th>
                    <th className="py-2 text-right font-normal">12 months</th>
                  </tr>
                </thead>
                <tbody>
                  {fx.map((f) => (
                    <tr key={f.pair} className="border-b border-term-line/60">
                      <td className="py-2.5 font-sans text-paper/85">{f.pair}</td>
                      <td className="py-2.5 text-right text-paper">{rate(f.threeMonth)}</td>
                      <td className="py-2.5 text-right text-brass-light">{rate(f.twelveMonth)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-[0.62rem] text-paper/60">
                Published {formatDate(fx[0].date, { month: "short", day: "numeric", year: "numeric" })}.
              </p>
            </div>
          )}
        </div>
      </div>
      <p className="border-t border-term-line px-5 py-2.5 text-[0.62rem] leading-relaxed text-paper/60">
        Goldman Sachs data shown for research context; © Goldman Sachs. Forecasts are GIR&apos;s, not Amador&apos;s, and are not
        recommendations. Higher FCI readings mean tighter financial conditions; the activity nowcast is an annualized growth pace.
      </p>
    </Panel>
  );
}
