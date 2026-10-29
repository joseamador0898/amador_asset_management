import "server-only";
import type { ArticleMeta } from "@/lib/insights";
import { ARTICLES_PATH, type Lang } from "@/lib/i18n";
import { site } from "@/lib/site";

/*
 * Markdown twins of the articles for AI assistants and agents (/insights/<slug>.md, /llms-full.txt): the same text the
 * page shows, with the MDX components turned into plain markdown and site links made absolute.
 */

const attr = (attrs: string, name: string) => attrs.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const objects = (src: string) => src.match(/\{[^{}]*\}/g) ?? [];
const field = (obj: string, name: string) =>
  obj.match(new RegExp(`\\b${name}:\\s*"([^"]*)"`))?.[1] ?? obj.match(new RegExp(`\\b${name}:\\s*(-?[0-9.]+)`))?.[1] ?? "";
const quote = (text: string) =>
  text
    .trim()
    .split("\n")
    .map((line) => (line.trim() ? `> ${line}` : ">"))
    .join("\n");
const CALLOUT_LABELS: Record<Lang, Record<string, string>> = {
  en: { note: "Note", insight: "Insight", warning: "Warning", method: "Method" },
  es: { note: "Nota", insight: "Idea clave", warning: "Precaución", method: "Método" },
};
const TABLE_HEAD: Record<Lang, string> = { en: "| Item | Value |", es: "| Elemento | Valor |" };

export function mdxToMarkdown(mdx: string, lang: Lang = "en"): string {
  return mdx
    .replace(/<Callout([^>]*)>([\s\S]*?)<\/Callout>/g, (_, attrs: string, body: string) => {
      const label = attr(attrs, "title") ?? CALLOUT_LABELS[lang][attr(attrs, "type") ?? "note"] ?? CALLOUT_LABELS[lang].note;
      return quote(`**${label}.** ${body.trim()}`);
    })
    .replace(/<PullQuote([^>]*)>([\s\S]*?)<\/PullQuote>/g, (_, attrs: string, body: string) => {
      const cite = attr(attrs, "cite");
      return quote(body.trim() + (cite ? `\n— ${cite}` : ""));
    })
    .replace(/<KeyStats\s+items=\{\[([\s\S]*?)\]\}\s*\/>/g, (_, items: string) =>
      objects(items)
        .map((o) => `- **${field(o, "value")}** ${field(o, "label")}`)
        .join("\n"),
    )
    .replace(/<Chart([\s\S]*?)\/>/g, (_, attrs: string) => {
      const title = attr(attrs, "title");
      const caption = attr(attrs, "caption");
      const rows = objects(attrs.match(/data=\{\[([\s\S]*?)\]\}/)?.[1] ?? "").map((o) => `| ${field(o, "label")} | ${field(o, "value")} |`);
      return [title && `**${title}**`, rows.length && `${TABLE_HEAD[lang]}\n|---|---|\n${rows.join("\n")}`, caption && `*${caption}*`]
        .filter(Boolean)
        .join("\n\n");
    })
    .replace(/<Figure([\s\S]*?)\/>/g, (_, attrs: string) => {
      const src = attr(attrs, "src") ?? "";
      const caption = attr(attrs, "caption");
      return `![${attr(attrs, "alt") ?? ""}](${src.startsWith("/") ? site.url + src : src})${caption ? `\n\n*${caption}*` : ""}`;
    })
    .replace(/\\\$/g, "$")
    .replace(/\]\(\//g, `](${site.url}/`)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function articleMarkdown(meta: ArticleMeta, content: string): string {
  const url = `${site.url}${ARTICLES_PATH[meta.lang]}/${meta.slug}`;
  return `# ${meta.title}\n\n> ${meta.dek}\n\n${meta.author} · ${meta.date} · ${meta.category} · ${url}\n\n${mdxToMarkdown(content, meta.lang)}\n`;
}
