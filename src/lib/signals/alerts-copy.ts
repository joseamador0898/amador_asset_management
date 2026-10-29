import type { Lang } from "@/lib/i18n";
import { commodityPhrase } from "./labels";

/* The wording of the rule-based alerts (lib/signals/alerts.ts) in each language. Numbers are formatted the same way in both. */

const signed = (v: number, d = 2) => `${v > 0 ? "+" : ""}${v.toFixed(d)}`;
const pct = (v: number) => `${v > 0 ? "+" : ""}${(v * 100).toFixed(0)}%`;
const usd = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;

export const ALERT_COPY = {
  en: {
    fciTighter: "US financial conditions tightened",
    fciEasier: "US financial conditions eased",
    fciFlat: "US financial conditions little changed",
    fciDetail: (v: number, d: number) => `GS Financial Conditions Index at ${v.toFixed(2)}, ${signed(d)} over the past month (higher = tighter).`,
    caiMoved: (up: boolean, v: number) => `US growth nowcast ${up ? "accelerated" : "slowed"} to ${v.toFixed(1)}%`,
    caiSteady: (v: number) => `US growth nowcast steady at ${v.toFixed(1)}%`,
    caiDetail: (d: number) => `GS Current Activity Indicator ${signed(d, 1)} pp versus the prior reading (annualized pace).`,
    mapNeutral: "US data surprises near neutral",
    mapDown: "US data surprising to the downside",
    mapUp: "US data surprising to the upside",
    mapTurned: (negative: boolean) => `US data surprises turned ${negative ? "negative" : "positive"}`,
    mapDetail: (v: number, d: number) => `GS MAP surprise index (21-day average) at ${v.toFixed(2)}, ${signed(d)} over the month.`,
    raiNeutral: "Global risk appetite neutral",
    raiOff: "Global risk appetite in risk-off territory",
    raiOn: "Global risk appetite in risk-on territory",
    raiSharp: (fell: boolean) => `Global risk appetite ${fell ? "fell" : "rose"} sharply`,
    raiDetail: (v: number, d: number) => `GS Risk Appetite Indicator at ${v.toFixed(2)}, ${signed(d)} over the month.`,
    socialTitle: (up: boolean) => `Social-media economic sentiment ${up ? "improved" : "deteriorated"}`,
    socialDetail: (v: number, d: number) => `GS US social-media sentiment index at ${v.toFixed(2)}, ${signed(d)} over the month.`,
    socialSource: "GS Social Sentiment",
    commodityTitle: (label: string, up: boolean) => `GS sees ${label} ${up ? "higher" : "lower"} in 12 months`,
    commodityDetail: (twelve: number, quarter: number, quarterLabel: string, move: number, unit: string) =>
      `GIR forecast ${usd(twelve)} in 12 months vs ${usd(quarter)} for ${quarterLabel} (${pct(move)}, ${unit}).`,
    commoditySource: "GIR commodity forecasts",
    mxnTitle: (v: number) => `GS forecasts USD/MXN at ${v.toFixed(2)} in 12 months`,
    mxnDetail: (a: number, b: number) => `GIR FX forecast: ${a.toFixed(2)} in 3 months, ${b.toFixed(2)} in 12 months.`,
    mxnSource: "GIR FX forecasts",
  },
  es: {
    fciTighter: "Las condiciones financieras de EE. UU. se endurecieron",
    fciEasier: "Las condiciones financieras de EE. UU. se relajaron",
    fciFlat: "Condiciones financieras de EE. UU. con pocos cambios",
    fciDetail: (v: number, d: number) => `Índice de Condiciones Financieras de GS en ${v.toFixed(2)}, ${signed(d)} en el último mes (más alto = más restrictivas).`,
    caiMoved: (up: boolean, v: number) => `El nowcast de crecimiento de EE. UU. se ${up ? "aceleró" : "desaceleró"} a ${v.toFixed(1)}%`,
    caiSteady: (v: number) => `Nowcast de crecimiento de EE. UU. estable en ${v.toFixed(1)}%`,
    caiDetail: (d: number) => `Indicador de Actividad Actual de GS ${signed(d, 1)} pp frente a la lectura anterior (ritmo anualizado).`,
    mapNeutral: "Sorpresas de datos de EE. UU. cerca de neutral",
    mapDown: "Los datos de EE. UU. sorprenden a la baja",
    mapUp: "Los datos de EE. UU. sorprenden al alza",
    mapTurned: (negative: boolean) => `Las sorpresas de datos de EE. UU. se volvieron ${negative ? "negativas" : "positivas"}`,
    mapDetail: (v: number, d: number) => `Índice de sorpresas MAP de GS (promedio de 21 días) en ${v.toFixed(2)}, ${signed(d)} en el mes.`,
    raiNeutral: "Apetito global por riesgo neutral",
    raiOff: "Apetito global por riesgo en terreno de aversión (risk-off)",
    raiOn: "Apetito global por riesgo en terreno de búsqueda de riesgo (risk-on)",
    raiSharp: (fell: boolean) => `El apetito global por riesgo ${fell ? "cayó" : "subió"} con fuerza`,
    raiDetail: (v: number, d: number) => `Indicador de Apetito por Riesgo de GS en ${v.toFixed(2)}, ${signed(d)} en el mes.`,
    socialTitle: (up: boolean) => `El sentimiento económico en redes sociales ${up ? "mejoró" : "empeoró"}`,
    socialDetail: (v: number, d: number) => `Índice de sentimiento en redes sociales de EE. UU. de GS en ${v.toFixed(2)}, ${signed(d)} en el mes.`,
    socialSource: "GS Sentimiento social",
    commodityTitle: (label: string, up: boolean) => `GS prevé que ${commodityPhrase(label)} ${up ? "suba" : "baje"} en 12 meses`,
    commodityDetail: (twelve: number, quarter: number, quarterLabel: string, move: number, unit: string) =>
      `Pronóstico de GIR: ${usd(twelve)} en 12 meses frente a ${usd(quarter)} para ${quarterLabel} (${pct(move)}, ${unit}).`,
    commoditySource: "Pronósticos de materias primas de GIR",
    mxnTitle: (v: number) => `GS prevé el USD/MXN en ${v.toFixed(2)} en 12 meses`,
    mxnDetail: (a: number, b: number) => `Pronóstico cambiario de GIR: ${a.toFixed(2)} en 3 meses, ${b.toFixed(2)} en 12 meses.`,
    mxnSource: "Pronósticos cambiarios de GIR",
  },
} satisfies Record<Lang, unknown>;
