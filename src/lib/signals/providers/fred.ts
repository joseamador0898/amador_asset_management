import "server-only";
import { getJson } from "../http";
import type { MacroSeries } from "../types";

// Public-domain U.S. government series only (no third-party copyrighted series).
const SERIES: Array<{
  id: string;
  label: string;
  unit: string;
  decimals: number;
  description: string;
  units?: "lin" | "pc1";
  daily?: boolean;
}> = [
  { id: "DGS10", label: "10Y Treasury", unit: "%", decimals: 2, daily: true, description: "10-year Treasury constant-maturity yield" },
  { id: "DGS2", label: "2Y Treasury", unit: "%", decimals: 2, daily: true, description: "2-year Treasury constant-maturity yield" },
  { id: "T10Y2Y", label: "10Y–2Y Curve", unit: "pp", decimals: 2, daily: true, description: "10-year minus 2-year Treasury spread" },
  { id: "DFF", label: "Fed Funds", unit: "%", decimals: 2, daily: true, description: "Effective federal funds rate" },
  { id: "CPIAUCSL", label: "CPI Inflation", unit: "% y/y", decimals: 1, units: "pc1", description: "Consumer prices, change from a year ago" },
  { id: "UNRATE", label: "Unemployment", unit: "%", decimals: 1, description: "Civilian unemployment rate" },
  { id: "T10YIE", label: "10Y Breakeven", unit: "%", decimals: 2, daily: true, description: "Market-implied 10-year inflation expectation" },
  { id: "NFCI", label: "Financial Conditions", unit: "index", decimals: 2, description: "Chicago Fed NFCI (negative = looser than average)" },
];

type Observations = { observations: Array<{ date: string; value: string }> };

export function fredConfigured() {
  return Boolean(process.env.FRED_API_KEY);
}

/** Keep at most `max` points, evenly spaced, always including the latest. */
function downsample(points: number[], max: number) {
  if (points.length <= max) return points;
  const step = (points.length - 1) / (max - 1);
  return Array.from({ length: max }, (_, i) => points[Math.round(i * step)]);
}

export async function fetchFredMacro(): Promise<MacroSeries[] | null> {
  const key = process.env.FRED_API_KEY;
  if (!key) return null;
  const day = 1000 * 60 * 60 * 24;
  const results = await Promise.all(
    SERIES.map(async (s) => {
      const start = new Date(Date.now() - day * (s.daily ? 400 : 800)).toISOString().slice(0, 10);
      const params = new URLSearchParams({
        series_id: s.id,
        api_key: key,
        file_type: "json",
        observation_start: start,
        units: s.units ?? "lin",
      });
      const json = await getJson<Observations>(`https://api.stlouisfed.org/fred/series/observations?${params}`);
      const obs = (json?.observations ?? []).filter((o) => o.value !== "." && o.value !== "");
      if (obs.length < 2) return null;
      const values = obs.map((o) => Number(o.value));
      const last = values[values.length - 1];
      // Daily series: compare with ~1 month ago; monthly/weekly: with the prior print.
      const ref = s.daily ? values[Math.max(0, values.length - 22)] : values[values.length - 2];
      return {
        id: s.id,
        label: s.label,
        unit: s.unit,
        decimals: s.decimals,
        description: s.description,
        value: last,
        change: last - ref,
        changeLabel: s.daily ? "1M" : "prior",
        date: obs[obs.length - 1].date,
        points: downsample(values, 80),
      } satisfies MacroSeries;
    }),
  );
  const ok = results.filter((r): r is MacroSeries => r !== null);
  return ok.length >= 4 ? ok : null;
}
