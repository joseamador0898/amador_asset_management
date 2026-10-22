import { site } from "@/lib/site";

/*
 * robots.txt, the same policy as Juricio's: AI search and user-triggered fetchers are welcome by name; training crawlers
 * fall under "*", which allows them (the status quo; a group with "Disallow: /" would opt out of training). A bot obeys
 * only the most specific group that names it, so every group repeats every rule. Only standard directives: validators
 * (Lighthouse, Search Console) flag unknown ones such as Content-Signal.
 */

const SEARCH_BOTS = ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "Claude-SearchBot", "Claude-User", "Googlebot", "Bingbot", "Applebot"];
const RULES = ["Allow: /", "Disallow: /api/", "Disallow: /insights-md/"];

export function GET() {
  const group = (agents: string[]) => [...agents.map((a) => `User-agent: ${a}`), ...RULES].join("\n");
  const body = [group(["*"]), group(SEARCH_BOTS), `Sitemap: ${site.url}/sitemap.xml`].join("\n\n") + "\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
