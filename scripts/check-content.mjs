// Validates Insights articles: frontmatter fields and MDX compilation.
// Usage: npm run check:content
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

const dir = path.join(process.cwd(), "src", "content", "insights");
const CATEGORIES = ["Research", "Frameworks", "Risk", "Markets", "Signals", "Education"];
const COVERS = ["dendrogram", "nautilus", "waves", "bars", "rings", "grid"];
const COMPONENTS = ["Callout", "KeyStats", "Chart", "PullQuote", "Figure"];

let failures = 0;
// English articles live in the folder itself; Spanish translations in es/ (same rules, plus translationOf).
const files = [
  ...fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")),
  ...(fs.existsSync(path.join(dir, "es")) ? fs.readdirSync(path.join(dir, "es")).filter((f) => f.endsWith(".mdx")).map((f) => `es/${f}`) : []),
];
for (const file of files) {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const { data, content } = matter(raw);
  const problems = [];
  for (const key of ["title", "dek", "date", "category", "author", "cover"]) if (!data[key]) problems.push(`missing frontmatter "${key}"`);
  if (data.category && !CATEGORIES.includes(data.category)) problems.push(`unknown category "${data.category}"`);
  if (data.cover && !COVERS.includes(data.cover)) problems.push(`unknown cover "${data.cover}"`);
  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(String(data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date)))
    problems.push(`date must be YYYY-MM-DD`);
  if (file.startsWith("es/")) {
    const twin = data.translationOf ? path.join(dir, `${data.translationOf}.mdx`) : null;
    if (!twin) problems.push('a translation needs frontmatter "translationOf" (the English slug)');
    else if (!fs.existsSync(twin)) problems.push(`translationOf "${data.translationOf}" does not match an English article`);
    if (data.seoTitle && `${data.seoTitle} | Amador`.length > 60) problems.push(`seoTitle too long (${data.seoTitle.length} + suffix > 60)`);
    if (data.description && data.description.length > 155) problems.push(`description too long (${data.description.length} > 155)`);
  }
  if (/^#\s/m.test(content)) problems.push("do not use a level-1 heading; the title comes from frontmatter");
  if (/<!--/.test(content)) problems.push("HTML comments are not allowed in MDX");
  for (const m of content.matchAll(/<([A-Z][A-Za-z]+)/g)) if (!COMPONENTS.includes(m[1])) problems.push(`unknown component <${m[1]}>`);
  try {
    await compile(content, { remarkPlugins: [remarkGfm, remarkMath] });
  } catch (err) {
    problems.push(`MDX compile error: ${err.message}${err.line ? ` (line ${err.line})` : ""}`);
  }
  const words = content.split(/\s+/).filter(Boolean).length;
  if (problems.length) {
    failures++;
    console.log(`✗ ${file}\n  - ${[...new Set(problems)].join("\n  - ")}`);
  } else {
    console.log(`✓ ${file} (${words} words)`);
  }
}
if (failures) {
  console.error(`\n${failures} file(s) need attention.`);
  process.exit(1);
}
console.log(`\nAll ${files.length} articles passed.`);
