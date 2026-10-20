import "server-only";
import { USER_AGENT } from "../http";

/*
 * AI brief: a short, strictly data-grounded summary of the dashboard, written
 * by Gemini. Enabled when GEMINI_API_KEY is set. The prompt forbids
 * recommendations and any figure that is not in the supplied data.
 */

export function geminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

export async function generateBrief(facts: string): Promise<string | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const prompt = [
    "You write the 'Morning Note' for Amador Asset Management's public market dashboard.",
    "Using ONLY the data below, write 3 short bullet points (max 28 words each) describing what stands out across markets,",
    "rates/macro, options activity, insider filings and prediction markets.",
    "Rules: no investment advice, no recommendations, no predictions, no numbers or facts that are not in the data,",
    "neutral institutional tone, plain text bullets starting with '- '.",
    "",
    "DATA:",
    facts,
  ].join("\n");

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key, "User-Agent": USER_AGENT },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 400, thinkingConfig: { thinkingBudget: 0 } },
      }),
      signal: AbortSignal.timeout(20000),
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn(`[signals] gemini -> HTTP ${res.status}`);
      return null;
    }
    const json = (await res.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim();
    return text || null;
  } catch (err) {
    console.warn(`[signals] gemini -> ${(err as Error).name}`);
    return null;
  }
}
