// SEO audit: crawls every URL in the sitemap (the live site by default) and reports titles, descriptions, headings,
// canonicals, Open Graph, structured data, images, links and word counts, then the issues it finds.
// Read-only; it only fetches public pages. Usage: npm run audit:seo [-- http://localhost:3000] [-- --json out.json]
import { writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const SITE = (args.find((a) => /^https?:\/\//.test(a)) || "https://amadoram.com").replace(/\/$/, "");
const JSON_OUT = args.includes("--json") ? args[args.indexOf("--json") + 1] : null;
const UA = "Mozilla/5.0 (compatible; amador-seo-audit/1.0; +https://amadoram.com)";

const decode = (s) =>
  s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ").replace(/&rsquo;/g, "’").replace(/&lsquo;/g, "‘").replace(/&ldquo;/g, "“").replace(/&rdquo;/g, "”").replace(/&mdash;/g, "—").replace(/&ndash;/g, "–")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));
const strip = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? decode(m[2] ?? m[3] ?? m[4] ?? "") : null;
};
const metaContent = (html, key, value) => {
  const re = new RegExp(`<meta\\s[^>]*${key}\\s*=\\s*["']${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>`, "i");
  const m = html.match(re);
  return m ? attr(m[0], "content") : null;
};
const linkRel = (html, rel) => [...html.matchAll(/<link\s[^>]*>/gi)].map((m) => m[0]).filter((t) => (attr(t, "rel") || "").toLowerCase().split(/\s+/).includes(rel));

async function page(url) {
  const t0 = Date.now();
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "text/html" }, redirect: "manual" });
  const ms = Date.now() - t0;
  const html = await res.text();
  const r = { url, status: res.status, ms, bytes: html.length, location: res.headers.get("location"), contentType: res.headers.get("content-type"), xRobots: res.headers.get("x-robots-tag") };
  if (!res.ok) return r;
  const head = html.slice(0, html.indexOf("</head>") + 7) || html;
  r.lang = attr(html.match(/<html\s[^>]*>/i)?.[0] ?? "", "lang");
  r.title = decode(head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "");
  r.description = metaContent(head, "name", "description") ?? "";
  r.robots = metaContent(head, "name", "robots");
  r.canonical = linkRel(head, "canonical").map((t) => attr(t, "href"))[0] ?? null;
  r.hreflang = linkRel(head, "alternate").filter((t) => attr(t, "hreflang")).map((t) => `${attr(t, "hreflang")}=${attr(t, "href")}`);
  r.og = { title: metaContent(head, "property", "og:title"), description: metaContent(head, "property", "og:description"), image: metaContent(head, "property", "og:image"), type: metaContent(head, "property", "og:type") };
  r.twitterCard = metaContent(head, "name", "twitter:card");
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? html;
  r.h1 = [...main.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => strip(m[1]));
  r.h2 = [...main.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => strip(m[1]));
  r.h3 = (main.match(/<h3[\s>]/gi) || []).length;
  const text = strip(main);
  r.words = text ? text.split(" ").length : 0;
  const imgs = [...main.matchAll(/<img\s[^>]*>/gi)].map((m) => m[0]);
  r.images = imgs.length;
  r.imagesNoAlt = imgs.filter((t) => attr(t, "alt") === null || attr(t, "alt") === "").length;
  const hrefs = [...main.matchAll(/<a\s[^>]*>/gi)].map((m) => attr(m[0], "href")).filter(Boolean);
  const internal = new Set(), external = new Set();
  for (const h of hrefs) {
    if (h.startsWith("#") || h.startsWith("mailto:") || h.startsWith("tel:")) continue;
    if (h.startsWith("/") || h.startsWith(SITE)) internal.add(h.replace(SITE, "").split("#")[0]);
    else if (/^https?:/.test(h)) external.add(new URL(h).hostname);
  }
  r.internalLinks = [...internal];
  r.externalHosts = [...external];
  r.jsonld = [];
  for (const m of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const j = JSON.parse(m[1]);
      const nodes = j["@graph"] ? j["@graph"] : [j];
      r.jsonld.push(...nodes.map((n) => n["@type"]));
    } catch (e) {
      r.jsonld.push(`INVALID JSON-LD: ${e.message}`);
    }
  }
  r.adsense = /adsbygoogle\.js/.test(head);
  r.textSample = text.slice(0, 160);
  return r;
}

const sitemapXml = await (await fetch(`${SITE}/sitemap.xml`, { headers: { "user-agent": UA } })).text();
// A local build's sitemap carries NEXT_PUBLIC_SITE_URL, so every entry is fetched from the site being audited.
const local = (loc) => SITE + new URL(loc).pathname.replace(/\/$/, "");
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => local(m[1]));
const lastmods = Object.fromEntries([...sitemapXml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)].map((m) => [local(m[1]), m[2] ?? null]));
console.log(`Sitemap: ${urls.length} URLs`);

const results = [];
for (const u of urls) {
  try {
    results.push(await page(u));
  } catch (e) {
    results.push({ url: u, status: "ERR", error: e.message });
  }
}

// Extra technical checks beyond the sitemap.
const extra = {};
const probe = async (label, url) => {
  try {
    const t0 = Date.now();
    const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "manual" });
    extra[label] = { status: res.status, location: res.headers.get("location"), type: res.headers.get("content-type"), ms: Date.now() - t0, len: (await res.text()).length };
  } catch (e) {
    extra[label] = { error: e.message };
  }
};
if (SITE === "https://amadoram.com") {
  await probe("http apex", "http://amadoram.com/");
  await probe("https www", "https://www.amadoram.com/");
}
await probe("trailing slash", `${SITE}/signals/`);
await probe("uppercase path", `${SITE}/Signals`);
await probe("404 page", `${SITE}/this-page-does-not-exist`);
await probe("robots.txt", `${SITE}/robots.txt`);
await probe("llms.txt", `${SITE}/llms.txt`);
await probe("article .md twin", `${SITE}/insights/the-arithmetic-of-drawdowns.md`);
await probe("opengraph-image", `${SITE}/opengraph-image`);
await probe("query string variant", `${SITE}/?utm_source=test`);

// Flags
const issues = [];
const seenTitles = new Map(), seenDesc = new Map();
for (const r of results) {
  const flag = (s) => issues.push(`${r.url.replace(SITE, "") || "/"}: ${s}`);
  if (r.status !== 200) { flag(`HTTP ${r.status}${r.location ? " → " + r.location : ""}`); continue; }
  if (!r.title) flag("missing <title>");
  else { if (r.title.length > 60) flag(`title ${r.title.length} chars (>60): "${r.title}"`); if (r.title.length < 25) flag(`title short (${r.title.length}): "${r.title}"`); }
  if (!r.description) flag("missing meta description");
  else { if (r.description.length > 160) flag(`description ${r.description.length} chars (>160)`); if (r.description.length < 70) flag(`description short (${r.description.length})`); }
  if (r.h1.length !== 1) flag(`${r.h1.length} <h1> in <main>${r.h1.length ? ": " + r.h1.map((h) => `"${h.slice(0, 60)}"`).join(" | ") : ""}`);
  if (!r.canonical) flag("no canonical"); else if (r.canonical !== r.url && r.canonical !== r.url.replace(/\/$/, "")) flag(`canonical differs: ${r.canonical}`);
  if (r.robots && /noindex/i.test(r.robots)) flag(`noindex (${r.robots})`);
  if (!r.og.title || !r.og.description || !r.og.image) flag(`incomplete Open Graph (${Object.entries(r.og).filter(([, v]) => !v).map(([k]) => k).join(", ")})`);
  if (r.imagesNoAlt) flag(`${r.imagesNoAlt}/${r.images} images without alt`);
  if (!r.jsonld.length) flag("no JSON-LD");
  if (r.jsonld.some((t) => String(t).startsWith("INVALID"))) flag(r.jsonld.find((t) => String(t).startsWith("INVALID")));
  // Streamed panels (Signals, Briefings) arrive after </main> in the HTML, so their words are not counted here.
  if (r.words < 250) flag(`thin: ${r.words} words in <main> (streamed panels not counted)`);
  if (r.internalLinks.length < 3) flag(`only ${r.internalLinks.length} internal links in <main>`);
  if (r.ms > 1500) flag(`slow TTFB+download ${r.ms} ms`);
  if (seenTitles.has(r.title)) flag(`duplicate title of ${seenTitles.get(r.title)}`); else seenTitles.set(r.title, r.url.replace(SITE, "") || "/");
  if (r.description && seenDesc.has(r.description)) flag(`duplicate description of ${seenDesc.get(r.description)}`); else if (r.description) seenDesc.set(r.description, r.url.replace(SITE, "") || "/");
}

// Orphans: sitemap pages that no crawled page links to from its main content.
const linked = new Set(results.flatMap((r) => r.internalLinks || []));
for (const r of results) {
  const p = r.url.replace(SITE, "") || "/";
  if (p !== "/" && !linked.has(p)) issues.push(`${p}: not linked from any crawled page's <main> (navigation links are not counted)`);
}

const table = results.map((r) => ({
  path: r.url.replace(SITE, "") || "/", status: r.status, ms: r.ms, kb: Math.round((r.bytes || 0) / 1024), titleLen: r.title?.length, descLen: r.description?.length, h1: r.h1?.length, h2: r.h2?.length, words: r.words, img: r.images, noAlt: r.imagesNoAlt, intLinks: r.internalLinks?.length, jsonld: (r.jsonld || []).join("+"), lastmod: lastmods[r.url] ?? "",
}));
console.table(table);
console.log("\nExtra checks:");
for (const [k, v] of Object.entries(extra)) console.log(`  ${k.padEnd(22)} ${JSON.stringify(v)}`);
console.log(`\nIssues (${issues.length}):`);
for (const i of issues) console.log("  - " + i);
if (JSON_OUT) {
  writeFileSync(JSON_OUT, JSON.stringify({ site: SITE, at: new Date().toISOString(), results, extra, issues }, null, 1));
  console.log(`\nFull data written to ${JSON_OUT}.`);
}
process.exitCode = issues.length ? 1 : 0;
