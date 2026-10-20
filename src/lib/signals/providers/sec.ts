import "server-only";
import { getText, mapLimit, sleep } from "../http";
import type { InsiderTrade } from "../types";

/*
 * Insider transactions from SEC EDGAR Form 4 filings (public domain).
 * SEC fair-access policy: identify yourself in the User-Agent and stay well
 * under 10 requests/second. Set SEC_USER_AGENT to "Company contact@email".
 */

const CODE_LABELS: Record<string, { label: string; side: InsiderTrade["side"] }> = {
  P: { label: "Open-market buy", side: "buy" },
  S: { label: "Open-market sale", side: "sell" },
  A: { label: "Grant / award", side: "other" },
  M: { label: "Option exercise", side: "other" },
  F: { label: "Tax withholding", side: "other" },
  G: { label: "Gift", side: "other" },
  D: { label: "Disposition to issuer", side: "other" },
  C: { label: "Conversion", side: "other" },
  X: { label: "Option exercise", side: "other" },
};

function secHeaders() {
  return { "User-Agent": process.env.SEC_USER_AGENT || "Amador Asset Management admin@example.com" };
}

const tag = (xml: string, name: string) => xml.match(new RegExp(`<${name}>\\s*([\\s\\S]*?)\\s*</${name}>`))?.[1]?.trim() ?? "";
const valueOf = (xml: string, name: string) => {
  const block = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1] ?? "";
  return tag(block, "value") || block.trim();
};
const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

function roleOf(xml: string) {
  const rel = xml.match(/<reportingOwnerRelationship>([\s\S]*?)<\/reportingOwnerRelationship>/)?.[1] ?? "";
  const yes = (k: string) => /^(1|true)$/i.test(tag(rel, k));
  const title = decode(tag(rel, "officerTitle"));
  if (yes("isOfficer") && title) return title;
  if (yes("isDirector")) return "Director";
  if (yes("isTenPercentOwner")) return "10% owner";
  if (yes("isOfficer")) return "Officer";
  return "Other";
}

function parseForm4(xml: string, accession: string, filedAt: string, url: string): InsiderTrade[] {
  const issuer = decode(tag(xml, "issuerName"));
  const ticker = tag(xml, "issuerTradingSymbol").toUpperCase();
  const insider = decode(tag(xml, "rptOwnerName"));
  const role = roleOf(xml);
  const rows = xml.match(/<nonDerivativeTransaction>[\s\S]*?<\/nonDerivativeTransaction>/g) ?? [];
  return rows.map((row) => {
    const code = tag(row, "transactionCode");
    const shares = Number(valueOf(row, "transactionShares")) || 0;
    const price = Number(valueOf(row, "transactionPricePerShare")) || 0;
    const meta = CODE_LABELS[code] ?? { label: `Code ${code || "?"}`, side: "other" as const };
    return {
      accession,
      issuer,
      ticker,
      insider,
      role,
      code,
      label: meta.label,
      side: meta.side,
      shares,
      price,
      value: shares * price,
      date: valueOf(row, "transactionDate").slice(0, 10),
      filedAt,
      url,
    };
  });
}

export async function fetchSecInsiders(maxFilings = 36): Promise<InsiderTrade[] | null> {
  const atom = await getText(
    "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=4&owner=only&count=100&output=atom",
    { headers: secHeaders() },
  );
  if (!atom) return null;

  const seen = new Set<string>();
  const filings: Array<{ accession: string; index: string; filedAt: string }> = [];
  for (const entry of atom.split("<entry>").slice(1)) {
    const index = entry.match(/<link[^>]*href="([^"]+-index\.htm)"/)?.[1];
    const accession = entry.match(/accession-number=([\d-]+)/)?.[1];
    const filedAt = entry.match(/<updated>([^<]+)<\/updated>/)?.[1] ?? "";
    if (!index || !accession || seen.has(accession)) continue;
    seen.add(accession);
    filings.push({ accession, index, filedAt });
    if (filings.length >= maxFilings) break;
  }

  const results = await mapLimit(filings, 3, async (f) => {
    await sleep(150); // stay far below SEC's 10 req/s limit
    const indexHtml = await getText(f.index, { headers: secHeaders(), timeoutMs: 7000 });
    const xmlPath = indexHtml?.match(/href="(\/Archives\/edgar\/data\/[^"]+\.xml)"/g)
      ?.map((h) => h.slice(6, -1))
      .find((p) => !p.includes("/xsl"));
    if (!xmlPath) return [];
    const xml = await getText(`https://www.sec.gov${xmlPath}`, { headers: secHeaders(), timeoutMs: 7000 });
    return xml ? parseForm4(xml, f.accession, f.filedAt, f.index) : [];
  });

  const trades = results.flat().filter((t) => t.ticker && t.ticker !== "NONE" && t.shares > 0);
  if (!trades.length) return null;
  // Open-market buys first (the most informative insider signal), then by size.
  trades.sort((a, b) => Number(b.side === "buy") - Number(a.side === "buy") || b.value - a.value);
  return trades.slice(0, 40);
}
