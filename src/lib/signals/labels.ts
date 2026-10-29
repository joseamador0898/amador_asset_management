import type { Lang } from "@/lib/i18n";

/*
 * Spanish names for the data labels the Signals panels show. Providers return English labels; the Spanish pages map them
 * here at render time, so the same cached data serves both languages. Anything not listed shows as the provider sent it.
 */

const MACRO_ES: Record<string, { label: string; description: string }> = {
  DGS10: { label: "Tesoro 10A", description: "Rendimiento del bono del Tesoro de EE. UU. a 10 años (vencimiento constante)" },
  DGS2: { label: "Tesoro 2A", description: "Rendimiento del bono del Tesoro de EE. UU. a 2 años (vencimiento constante)" },
  T10Y2Y: { label: "Curva 10A–2A", description: "Diferencial entre los bonos del Tesoro a 10 y a 2 años" },
  DFF: { label: "Fondos federales", description: "Tasa efectiva de fondos federales" },
  CPIAUCSL: { label: "Inflación (CPI)", description: "Precios al consumidor de EE. UU., cambio anual" },
  UNRATE: { label: "Desempleo", description: "Tasa de desempleo civil de EE. UU." },
  T10YIE: { label: "Inflación implícita 10A", description: "Expectativa de inflación a 10 años implícita en el mercado" },
  NFCI: { label: "Condiciones financieras", description: "NFCI de la Fed de Chicago (negativo = más laxas que el promedio)" },
  GS_FCI: { label: "GS Cond. financieras", description: "Índice de Condiciones Financieras de EE. UU. de Goldman Sachs (más alto = más restrictivas)" },
  GS_CAI: { label: "GS Nowcast de actividad", description: "Indicador de Actividad Actual de EE. UU. de Goldman Sachs, ritmo de crecimiento anualizado" },
  GS_MAP: { label: "GS Sorpresas de datos", description: "Índice MAP de sorpresas de datos macro de EE. UU. de Goldman Sachs, promedio de 21 días" },
  GS_RAI: { label: "GS Apetito por riesgo", description: "Indicador global de Apetito por Riesgo de Goldman Sachs" },
  GS_SOCIAL: { label: "GS Sentimiento social", description: "Índice de sentimiento económico en redes sociales de EE. UU. de Goldman Sachs" },
};
const CHANGE_ES: Record<string, string> = { prior: "anterior" };
const UNIT_ES: Record<string, string> = { "% y/y": "% anual" };

const TERMS_ES: Record<string, string> = {
  "Developed ex-US": "Desarrollados ex-EE. UU.",
  "Emerging Mkts": "Mercados emergentes",
  "20Y+ Treasuries": "Tesoro 20A+",
  "7–10Y Treasuries": "Tesoro 7–10A",
  "High Yield": "Alto rendimiento",
  "High yield": "Alto rendimiento",
  Gold: "Oro",
  Silver: "Plata",
  Copper: "Cobre",
  "WTI Crude": "Petróleo WTI",
  "WTI crude": "Petróleo WTI",
  "Brent crude": "Petróleo Brent",
  "Natural gas": "Gas natural",
  "US Dollar": "Dólar de EE. UU.",
  "US dollar": "Dólar de EE. UU.",
  Technology: "Tecnología",
  Financials: "Financiero",
  Energy: "Energía",
  "Health care": "Salud",
  Industrials: "Industrial",
  "Cons. discretionary": "Consumo discrecional",
  "Cons. staples": "Consumo básico",
  Utilities: "Servicios públicos",
  Materials: "Materiales",
  "Real estate": "Bienes raíces",
  Communication: "Comunicaciones",
};

/** Commodity names with their article, for alert sentences in Spanish. */
const COMMODITY_PHRASE_ES: Record<string, string> = {
  Gold: "el oro",
  Copper: "el cobre",
  Silver: "la plata",
  "WTI crude": "el petróleo WTI",
  "Brent crude": "el petróleo Brent",
};

const COUNTRY_ES: Record<string, string> = {
  US: "Estados Unidos", MX: "México", CA: "Canadá", BR: "Brasil", CL: "Chile", AR: "Argentina", PE: "Perú",
  GB: "Reino Unido", DE: "Alemania", FR: "Francia", ES: "España", IT: "Italia",
  JP: "Japón", CN: "China", HK: "Hong Kong", IN: "India", KR: "Corea del Sur", TW: "Taiwán", AU: "Australia",
  ZA: "Sudáfrica", SA: "Arabia Saudita",
};

const REGION_ES: Record<string, string> = {
  Americas: "América",
  Europe: "Europa",
  "Asia-Pacific": "Asia-Pacífico",
  "Middle East & Africa": "Medio Oriente y África",
};

const INSIDER_ES: Record<string, string> = {
  "Open-market buy": "Compra en mercado abierto",
  "Open-market sale": "Venta en mercado abierto",
  "Grant / award": "Otorgamiento",
  "Option exercise": "Ejercicio de opciones",
  "Tax withholding": "Retención de impuestos",
  Gift: "Donación",
  "Disposition to issuer": "Disposición al emisor",
  Conversion: "Conversión",
};

const OUTCOME_ES: Record<string, string> = { Yes: "Sí", No: "No" };

const pick = (map: Record<string, string>, key: string, lang: Lang) => (lang === "es" ? (map[key] ?? key) : key);

/** A quote, sector or commodity label. */
export const termLabel = (label: string, lang: Lang) => pick(TERMS_ES, label, lang);
export const countryName = (code: string, english: string, lang: Lang) => (lang === "es" ? (COUNTRY_ES[code] ?? english) : english);
export const regionName = (region: string, lang: Lang) => pick(REGION_ES, region, lang);
export const outcomeLabel = (label: string, lang: Lang) => pick(OUTCOME_ES, label, lang);
export const insiderLabel = (label: string, lang: Lang) => (lang === "es" ? (INSIDER_ES[label] ?? label.replace(/^Code /, "Código ")) : label);
export const commodityPhrase = (label: string) => COMMODITY_PHRASE_ES[label] ?? label;

/** Label, description, unit and comparison of a macro series in the page's language. */
export function macroText(s: { id: string; label: string; description: string; unit: string; changeLabel: string }, lang: Lang) {
  if (lang === "en") return { label: s.label, description: s.description, unit: s.unit, changeLabel: s.changeLabel };
  const es = MACRO_ES[s.id];
  return {
    label: es?.label ?? s.label,
    description: es?.description ?? s.description,
    unit: UNIT_ES[s.unit] ?? s.unit,
    changeLabel: CHANGE_ES[s.changeLabel] ?? s.changeLabel,
  };
}
