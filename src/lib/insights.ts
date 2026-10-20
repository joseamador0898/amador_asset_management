import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const DIR = path.join(process.cwd(), "src", "content", "insights");

export const CATEGORIES = ["Research", "Frameworks", "Risk", "Markets", "Signals", "Education"] as const;
export type Category = (typeof CATEGORIES)[number];
export type CoverTheme = "dendrogram" | "nautilus" | "waves" | "bars" | "rings" | "grid";

export type ArticleMeta = {
  slug: string;
  title: string;
  dek: string;
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

function parse(file: string): { meta: ArticleMeta; content: string; draft: boolean } {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  const slug = file.replace(/\.mdx?$/, "");
  const meta: ArticleMeta = {
    slug,
    title: String(data.title ?? slug),
    dek: String(data.dek ?? ""),
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

function files() {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR).filter((f) => /\.mdx?$/.test(f));
}

/** Published articles, newest first. Drafts appear only in development. */
export function getAllArticles(): ArticleMeta[] {
  const showDrafts = process.env.NODE_ENV === "development";
  return files()
    .map(parse)
    .filter((a) => showDrafts || !a.draft)
    .map((a) => a.meta)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
}

export function getArticle(slug: string) {
  const file = files().find((f) => f.replace(/\.mdx?$/, "") === slug);
  if (!file) return null;
  const parsed = parse(file);
  if (parsed.draft && process.env.NODE_ENV !== "development") return null;
  return parsed;
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
  const all = getAllArticles().filter((a) => a.slug !== meta.slug);
  const score = (a: ArticleMeta) =>
    (a.series && a.series === meta.series ? 4 : 0) + (a.category === meta.category ? 2 : 0) + a.tags.filter((t) => meta.tags.includes(t)).length;
  return all.sort((a, b) => score(b) - score(a)).slice(0, limit);
}
