import { buildGsAlerts } from "@/lib/signals/alerts";
import { getGsMacro } from "@/lib/signals";
import { termLabel } from "@/lib/signals/labels";
import { formatDateFor, type Lang } from "@/lib/i18n";
import { Panel } from "./Panel";
import { MacroGrid } from "./MacroGrid";
import { AlertList } from "./AlertList";
import { fmt } from "@/lib/utils";

const money = (v: number | null) => (v === null ? "–" : `$${fmt.int(v)}`);
const rate = (v: number | null) => (v === null ? "–" : v >= 100 ? v.toFixed(1) : v.toFixed(v >= 10 ? 2 : 4));
const short = { month: "short", day: "numeric", year: "numeric" } as const;

const COPY = {
  en: {
    alerts: "Signal alerts",
    alertsSub: "Rule-based alerts on Goldman Sachs macro indicators and GIR forecasts, highest priority first",
    lens: "Goldman Sachs macro lens",
    lensSub: "Financial conditions, growth nowcast, data surprises, risk appetite, and GIR commodity and FX forecasts",
    commodities: "GIR commodity forecasts",
    commodity: "Commodity",
    twelve: "12 months",
    three: "3 months",
    spot: (d: string) => `Spot forecasts published ${d}.`,
    fx: "GIR FX forecasts",
    pair: "Pair",
    published: (d: string) => `Published ${d}.`,
    note: "Goldman Sachs data shown for research context; © Goldman Sachs. Forecasts are GIR's, not Amador's, and are not recommendations. Higher FCI readings mean tighter financial conditions; the activity nowcast is an annualized growth pace.",
  },
  es: {
    alerts: "Alertas de señales",
    alertsSub: "Alertas basadas en reglas sobre indicadores macro y pronósticos de GIR de Goldman Sachs, de mayor a menor prioridad",
    lens: "Lente macro de Goldman Sachs",
    lensSub: "Condiciones financieras, nowcast de crecimiento, sorpresas de datos, apetito por riesgo y pronósticos de materias primas y divisas de GIR",
    commodities: "Pronósticos de materias primas de GIR",
    commodity: "Materia prima",
    twelve: "12 meses",
    three: "3 meses",
    spot: (d: string) => `Pronósticos spot publicados el ${d}.`,
    fx: "Pronósticos cambiarios de GIR",
    pair: "Par",
    published: (d: string) => `Publicados el ${d}.`,
    note: "Datos de Goldman Sachs mostrados como contexto de investigación; © Goldman Sachs. Los pronósticos son de GIR, no de Amador, y no son recomendaciones. Lecturas más altas del FCI indican condiciones financieras más restrictivas; el nowcast de actividad es un ritmo de crecimiento anualizado.",
  },
};

/** Rule-based alerts from Goldman Sachs data. Renders nothing unless the licensed feed is enabled. */
export async function GsAlertsPanel({ limit, lang = "en" }: { limit?: number; lang?: Lang }) {
  const feed = await getGsMacro();
  if (!feed) return null;
  const alerts = buildGsAlerts(feed.data, lang);
  if (!alerts.length) return null;
  const t = COPY[lang];
  return (
    <Panel title={t.alerts} subtitle={t.alertsSub} source={feed.source} className="lg:col-span-3" lang={lang}>
      <AlertList alerts={alerts} limit={limit} lang={lang} />
    </Panel>
  );
}

/** Goldman Sachs Marquee macro lens. Renders nothing unless the licensed feed is enabled. */
export async function GsMacroPanel({ lang = "en" }: { lang?: Lang }) {
  const feed = await getGsMacro();
  if (!feed) return null;
  const { tiles, commodities, fx } = feed.data;
  const t = COPY[lang];

  return (
    <Panel title={t.lens} subtitle={t.lensSub} source={feed.source} className="lg:col-span-3" lang={lang}>
      <div className="grid gap-px bg-term-line">
        <div className="bg-term-2">
          <MacroGrid series={tiles} gridClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" lang={lang} />
        </div>
        <div className="grid gap-px bg-term-line lg:grid-cols-2">
          {commodities.length > 0 && (
            <div className="bg-term-2 p-5">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-paper/55">{t.commodities}</p>
              <table className="mt-3 w-full font-mono text-xs tabular">
                <thead className="text-[0.6rem] uppercase tracking-wider text-paper/60">
                  <tr className="border-b border-term-line">
                    <th className="py-2 text-left font-normal">{t.commodity}</th>
                    <th className="py-2 text-right font-normal">{commodities[0].quarterLabel}</th>
                    <th className="py-2 text-right font-normal">{t.twelve}</th>
                  </tr>
                </thead>
                <tbody>
                  {commodities.map((c) => (
                    <tr key={c.label} className="border-b border-term-line/60">
                      <td className="py-2.5 font-sans text-paper/85">
                        {termLabel(c.label, lang)} <span className="text-[0.6rem] text-paper/60">{c.unit}</span>
                      </td>
                      <td className="py-2.5 text-right text-paper">{money(c.quarter)}</td>
                      <td className="py-2.5 text-right text-brass-light">{money(c.twelveMonth)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-[0.62rem] text-paper/60">{t.spot(formatDateFor(commodities[0].date, lang, short))}</p>
            </div>
          )}
          {fx.length > 0 && (
            <div className="bg-term-2 p-5">
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-paper/55">{t.fx}</p>
              <table className="mt-3 w-full font-mono text-xs tabular">
                <thead className="text-[0.6rem] uppercase tracking-wider text-paper/60">
                  <tr className="border-b border-term-line">
                    <th className="py-2 text-left font-normal">{t.pair}</th>
                    <th className="py-2 text-right font-normal">{t.three}</th>
                    <th className="py-2 text-right font-normal">{t.twelve}</th>
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
              <p className="mt-3 text-[0.62rem] text-paper/60">{t.published(formatDateFor(fx[0].date, lang, short))}</p>
            </div>
          )}
        </div>
      </div>
      <p className="border-t border-term-line px-5 py-2.5 text-[0.62rem] leading-relaxed text-paper/60">{t.note}</p>
    </Panel>
  );
}
