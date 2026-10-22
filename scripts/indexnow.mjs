// Tells the IndexNow engines (Bing, Yandex, Naver, Seznam, Yep; Google does not take part) to recrawl every page in the
// live sitemap. Bing's index feeds Copilot and ChatGPT search, so this is the fast path to AI assistants too.
// Usage: node scripts/indexnow.mjs   (deploy/deploy.sh runs it after each deploy)
const HOST = "amadoram.com";
const KEY = "27e182a82b43988a9745fc6d87a6d935"; // served at https://amadoram.com/<KEY>.txt from public/

const sitemap = await fetch(`https://${HOST}/sitemap.xml`).then((r) => (r.ok ? r.text() : Promise.reject(new Error(`sitemap HTTP ${r.status}`))));
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (!urlList.length) throw new Error("no URLs in the sitemap");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
// 200 and 202 both mean accepted; 403 means the key file is missing or wrong; 422 means a URL is not on this host.
console.log(`IndexNow: ${urlList.length} URLs -> HTTP ${res.status}${res.ok ? " (accepted)" : ` ${await res.text()}`}`);
if (!res.ok) process.exitCode = 1;
