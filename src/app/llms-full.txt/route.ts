import { getAllArticles, getArticle } from "@/lib/insights";
import { articleMarkdown } from "@/lib/markdown";
import { site } from "@/lib/site";

/** llms-full.txt: every published article as markdown, newest first, after a short header (see llms.txt). */
export function GET() {
  const parts = getAllArticles()
    .map((meta) => getArticle(meta.slug))
    .filter((a) => a !== null)
    .map((a) => articleMarkdown(a.meta, a.content));
  const header = `# ${site.name}: research and insights\n\n> ${site.description} Educational content, not investment advice. Index: ${site.url}/llms.txt\n`;
  return new Response([header, ...parts].join("\n---\n\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
