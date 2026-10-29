import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import type { Lang } from "@/lib/i18n";

/*
 * Articles live in src/content/insights (English) and src/content/insights/es (Spanish translations, each naming
 * the English article it translates in `translationOf`). Both trees share the frontmatter rules checked by
 * scripts/check-content.mjs.
 */
const DIR = path.join(process.cwd(), "src", "content", "insights");
const dirFor = (lang: Lang) => (lang === "en" ? DIR : path.join(DIR, "es"));

export const CATEGORIES = ["Research", "Frameworks", "Risk", "Markets", "Signals", "Education"] as const;
export type Category = (typeof CATEGORIES)[number];
export type CoverTheme = "dendrogram" | "nautilus" | "waves" | "bars" | "rings" | "grid";

export type ArticleMeta = {
  slug: string;
  lang: Lang;
  /** For a translation, the English slug it translates. */
  translationOf?: string;
  title: string;
  /** Search-result title (≤ 50 characters, keyword first); the page's <title> uses it, the headline stays `title`. */
  seoTitle?: string;
  dek: string;
  /** Search-result description (≤ 155 characters); falls back to the dek, which is often longer. */
  description?: string;
  date: string;
  updated?: string;
  category: Category;
  author: string;
  tags: string[];
  series?: string;
  featured: boolean;
  cover: CoverTheme;
  readingMinutes: number;
};

export type Heading = { id: string; text: string };

function readingMinutes(text: string) {
  const words = text.replace(/```[\s\S]*?```/g, " ").replace(/\$\$[\s\S]*?\$\$/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 230));
}

function parse(file: string, lang: Lang): { meta: ArticleMeta; content: string; draft: boolean } {
  const raw = fs.readFileSync(path.join(dirFor(lang), file), "utf8");
  const { data, content } = matter(raw);
  const slug = file.replace(/\.mdx?$/, "");
  const meta: ArticleMeta = {
    slug,
    lang,
    translationOf: data.translationOf ? String(data.translationOf) : undefined,
    title: String(data.title ?? slug),
    seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
    dek: String(data.dek ?? ""),
    description: data.description ? String(data.description) : undefined,
    date: String(data.date ?? "2026-01-01"),
    updated: data.updated ? String(data.updated) : undefined,
    category: (CATEGORIES as readonly string[]).includes(data.category) ? data.category : "Research",
    author: String(data.author ?? "Amador Research"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    series: data.series ? String(data.series) : undefined,
    featured: Boolean(data.featured),
    cover: (data.cover as CoverTheme) ?? "waves",
    readingMinutes: readingMinutes(content),
  };
  return { meta, content, draft: Boolean(data.draft) };
}

function files(lang: Lang) {
  const dir = dirFor(lang);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f));
}

/** Published articles in a language, newest first. Drafts appear only in development. */
export function getAllArticles(lang: Lang = "en"): ArticleMeta[] {
  const showDrafts = process.env.NODE_ENV === "development";
  return files(lang)
    .map((f) => parse(f, lang))
    .filter((a) => showDrafts || !a.draft)
    .map((a) => a.meta)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
}

export function getArticle(slug: string, lang: Lang = "en") {
  const file = files(lang).find((f) => f.replace(/\.mdx?$/, "") === slug);
  if (!file) return null;
  const parsed = parse(file, lang);
  if (parsed.draft && process.env.NODE_ENV !== "development") return null;
  return parsed;
}

/**
 * Slug pairs across languages, both ways: English slug → Spanish slug and Spanish slug → English slug, for the
 * language switch and hreflang links. Slugs never collide across the two trees in practice; a collision would
 * only make the switch land on the index.
 */
export function getArticlePairs(): Record<string, string> {
  const pairs: Record<string, string> = {};
  for (const es of getAllArticles("es")) {
    if (es.translationOf) {
      pairs[es.translationOf] = es.slug;
      pairs[es.slug] = es.translationOf;
    }
  }
  return pairs;
}

/** The slug of the same article in the other language, when it has been translated. */
export function getTwinSlug(meta: ArticleMeta): string | undefined {
  if (meta.lang === "es") return meta.translationOf;
  return getAllArticles("es").find((a) => a.translationOf === meta.slug)?.slug;
}

/** H2 headings, slugged exactly like rehype-slug (github-slugger). */
export function getHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const out: Heading[] = [];
  let inFence = false;
  for (const line of content.split(/\r?\n/)) {
    if (line.trim().startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const m = line.match(/^(#{2,3})\s+(.+?)\s*#*$/);
    if (!m) continue;
    const text = m[2].replace(/[*_`]/g, "").replace(/\[(.+?)\]\(.+?\)/g, "$1");
    const id = slugger.slug(text);
    if (m[1] === "##") out.push({ id, text });
  }
  return out;
}

export function getRelated(meta: ArticleMeta, limit = 3) {
  const all = getAllArticles(meta.lang).filter((a) => a.slug !== meta.slug);
  const score = (a: ArticleMeta) =>
    (a.series && a.series === meta.series ? 4 : 0) + (a.category === meta.category ? 2 : 0) + a.tags.filter((t) => meta.tags.includes(t)).length;
  return all.sort((a, b) => score(b) - score(a)).slice(0, limit);
}
