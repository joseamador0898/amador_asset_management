import { getAllArticles } from "@/lib/insights";
import { fund, site } from "@/lib/site";

/*
 * llms.txt (llmstxt.org): a plain map of the site for AI assistants. Google says it needs no such file; other assistants
 * and agents may read it. Only indexable pages, each linked at its canonical address, with factual one-line notes.
 */

export function GET() {
  const url = (path: string) => `${site.url}${path}`;
  const articles = getAllArticles();
  const lines = [
    `# ${site.name}`,
    `> ${site.description} Everything on the site is educational and not investment advice. The ${fund.name} is pre-launch: nothing on the site is an offer to sell or a solicitation of an offer to buy any security.`,
    `Every article is also available as markdown at its address plus ".md"${articles[0] ? ` (for example ${url(`/insights/${articles[0].slug}.md`)})` : ""}, and ${url("/llms-full.txt")} holds all of them in one file.`,
    "## Research and insights",
    articles.map((a) => `- [${a.title}](${url(`/insights/${a.slug}`)}): ${a.dek}`).join("\n"),
    "## Tools",
    [
      `- [Amador Signals](${url("/signals")}): live market dashboard with macro indicators, world markets, options activity, SEC insider filings and prediction-market odds, each labeled with its source and delay.`,
      `- [Briefings and alerts](${url("/briefings")}): the latest rule-based market alerts and the email briefings readers can subscribe to.`,
    ].join("\n"),
    "## The firm",
    [
      `- [The firm](${url("/firm")}): who we are, the founder (${site.founder.name}, ${site.founder.role}) and our values.`,
      `- [Approach](${url("/approach")}): our investment process and risk principles.`,
      `- [${fund.name}](${url("/fund")}): our forthcoming flagship, a risk-balanced multi-asset strategy (${fund.status.toLowerCase()}).`,
      `- [Book a consultation](${url("/book")}): portfolio reviews and research consultations.`,
      `- [Contact](${url("/contact")}): ${site.email}.`,
    ].join("\n"),
    "## Optional",
    [
      `- [Important disclosures](${url("/legal/disclosures")})`,
      `- [Privacy notice](${url("/legal/privacy")})`,
      `- [Terms of use](${url("/legal/terms")})`,
    ].join("\n"),
  ];
  return new Response(lines.join("\n\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
