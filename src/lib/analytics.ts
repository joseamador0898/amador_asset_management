/*
 * Visitor statistics with Azure Application Insights: the pure parts (route templates, traffic classification, the
 * anonymous visitor id and the filter every telemetry item passes before it leaves the browser). The page side lives in
 * components/analytics/Analytics.tsx; the Azure side in deploy/azure/analytics.sh. Ported from Juricio's analitica.js.
 *
 * Privacy: Do Not Track and Global Privacy Control load nothing. No cookies. A page is a ROUTE TEMPLATE
 * ("/insights/:slug"), never a path, query, hash or title; the referrer is a host name; nothing a person typed travels.
 * Bot and automated visits are recorded and labeled, never dropped, so the workbooks can toggle them.
 *
 * The labels keep Juricio's field names and values (tipo_trafico: persona | bot | automatizado; motivo; bot_nombre;
 * ambiente: produccion | piloto | otro; visibilidad; ruta_conocida: si | no) so the same workbook queries read both sites.
 */

export const ROLE = "amador-web";
export const OPTOUT_KEY = "amador_noanalytics"; // "1" in a browser: the team's own browsers are never recorded
const VID_KEY = "amador_vid"; // {id, created}: the anonymous visitor id, 395 days at most
const VID_MAX_MS = 395 * 24 * 3600 * 1000;
const DAY_MS = 24 * 3600 * 1000;
const OTHER = "/:other";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// ------------------------------------------------------------ route templates

const STATIC_ROUTES = [
  "/", "/firm", "/approach", "/insights", "/studio", "/signals", "/fund", "/book", "/briefings", "/contact",
  "/legal/disclosures", "/legal/privacy", "/legal/terms",
  // Spanish tree
  "/es", "/es/firma", "/es/enfoque", "/es/analisis", "/es/senales", "/es/boletines", "/es/fondo", "/es/reservar", "/es/contacto",
  "/es/legal/divulgaciones", "/es/legal/privacidad", "/es/legal/terminos",
];
// A placeholder is also accepted as input, so a template stays a template when it passes through again.
const DYNAMIC_ROUTES: Array<[RegExp, string]> = [
  [/^\/insights\/(?:[a-z0-9-]{1,120}|:slug)$/, "/insights/:slug"],
  [/^\/es\/analisis\/(?:[a-z0-9-]{1,120}|:slug)$/, "/es/analisis/:slug"],
];

export type Route = { route: string; known: boolean };

/** The route template of a path. Queries and hashes never survive; an unknown path becomes "/:other" and is flagged. */
export function routeTemplate(pathname: string): Route {
  let path = String(pathname || "/");
  if (path.length > 1) path = path.replace(/\/+$/, "") || "/";
  if (STATIC_ROUTES.includes(path)) return { route: path, known: true };
  for (const [pattern, template] of DYNAMIC_ROUTES) if (pattern.test(path)) return { route: template, known: true };
  return { route: OTHER, known: false };
}

/** An absolute http(s) URL in its parts, without the URL constructor (the SDK hands over strings). */
export function parseUrl(raw: unknown) {
  const m = /^(https?):\/\/([^/?#]*)([^?#]*)(\?[^#]*)?(#.*)?$/i.exec(String(raw || ""));
  if (!m) return null;
  return { host: m[2].replace(/^.*@/, "").replace(/:\d*$/, "").toLowerCase(), pathname: m[3] || "/" };
}

/** The referrer as its host name only; "" for a non-web or odd referrer. Our own host stays (it marks in-site moves). */
export function referrerHost(ref: unknown) {
  const u = parseUrl(ref);
  return u && /^[a-z0-9.-]{1,253}$/.test(u.host) ? u.host : "";
}

// ------------------------------------------------------------ traffic classification

const AUTOMATED: Array<[string, RegExp]> = [
  ["headlesschrome", /headlesschrome/i], ["selenium", /selenium/i], ["puppeteer", /puppeteer/i], ["playwright", /playwright/i],
  ["lighthouse", /lighthouse/i], ["pingdom", /pingdom/i], ["pagespeed", /page ?speed/i], ["gtmetrix", /gtmetrix/i],
  ["uptimerobot", /uptimerobot/i],
];
const BOTS: Array<[string, RegExp]> = [
  ["googlebot", /googlebot|adsbot-google|mediapartners-google|apis-google|googleother|google-inspectiontool|storebot-google|google-read-aloud/i],
  ["bingbot", /bingbot|bingpreview|adidxbot|msnbot/i], ["duckduckbot", /duckduckbot/i], ["baiduspider", /baiduspider/i],
  ["yandexbot", /yandex(?:bot|images|video|media|metrika|mobilebot)|yandex\.com\/bots/i], ["applebot", /applebot/i],
  ["gptbot", /gptbot|chatgpt-user|oai-searchbot/i], ["claudebot", /claudebot|claude-web|claude-user|claude-searchbot|anthropic-ai/i],
  ["perplexitybot", /perplexitybot|perplexity-user/i], ["ccbot", /ccbot/i],
  ["facebookexternalhit", /facebookexternalhit|facebot|meta-externalagent|meta-externalfetcher/i],
  ["telegrambot", /telegrambot/i], ["twitterbot", /twitterbot/i], ["linkedinbot", /linkedinbot/i], ["whatsapp", /whatsapp\/\d/i],
  ["slackbot", /slackbot|slack-imgproxy/i], ["discordbot", /discordbot/i], ["ahrefsbot", /ahrefsbot|ahrefssiteaudit/i],
  ["semrushbot", /semrushbot/i], ["mj12bot", /mj12bot/i], ["curl", /\bcurl\//i], ["wget", /\bwget\//i], ["python", /python/i],
  ["java", /\bjava\/\d|apache-httpclient|java-http-client/i], ["okhttp", /okhttp/i], ["go-http", /go-http-client/i],
  ["axios", /\baxios\//i], ["node-fetch", /node-fetch|undici/i],
];
// Any other self-declared robot ("MyCrawler/1.0", "SomethingBot"). "Cubot" is a phone maker, not a robot.
const GENERIC_BOT =
  /(?:^|[^a-z])[a-z0-9._-]*(?:bot|crawler|spider|crawl)\b|\bslurp\b|\bscraper\b|\bscrapy\b|\bfetcher\b|\barchiver\b|\bindexer\b|\bvalidator\b|\bhttp[-_ ]?client\b|\blibwww|\bmonitoring\b/i;

const matchName = (list: Array<[string, RegExp]>, ua: string) => list.find(([, re]) => re.test(ua))?.[0] ?? "";

export type Env = { webdriver: boolean; ua: string; brands: string[]; width?: number; height?: number };
export type Labels = { tipo_trafico: string; motivo: string; bot_nombre: string; ambiente?: string; visibilidad?: string };

/** The class of a visit from what the browser says. motivo is a code from a fixed vocabulary, never the user agent. */
export function classify(env: Env): Labels {
  const ua = String(env.ua || "").replace(/cubot/gi, "");
  const tool = matchName(AUTOMATED, ua);
  const bot = matchName(BOTS, ua);
  const headlessBrand = env.brands.some((b) => /headlesschrome/i.test(b));
  const name = tool || bot || "generico";
  if (env.webdriver) return { tipo_trafico: "automatizado", motivo: "webdriver", bot_nombre: name };
  if (tool === "headlesschrome" || headlessBrand) return { tipo_trafico: "automatizado", motivo: "headless", bot_nombre: "headlesschrome" };
  if (tool) return { tipo_trafico: "automatizado", motivo: "ua:" + tool, bot_nombre: tool };
  if (typeof env.width === "number" && typeof env.height === "number" && (env.width === 0 || env.height === 0)) {
    return { tipo_trafico: "automatizado", motivo: "ventana_cero", bot_nombre: bot || "generico" };
  }
  if (bot) return { tipo_trafico: "bot", motivo: "ua:" + bot, bot_nombre: bot };
  if (GENERIC_BOT.test(ua)) return { tipo_trafico: "bot", motivo: "ua:desconocido_bot", bot_nombre: "generico" };
  return { tipo_trafico: "persona", motivo: "normal", bot_nombre: "" };
}

/** produccion: amadoram.com; piloto: its subdomains; otro: anything else (localhost, previews). */
export function environmentOf(hostname: string, publicHost = "amadoram.com") {
  const h = String(hostname || "").toLowerCase();
  if (h === publicHost) return "produccion";
  if (h.endsWith("." + publicHost)) return "piloto";
  return "otro";
}

/** The state of the page when statistics start: prerendered and hidden pages are recorded and labeled. */
export function visibilityOf(doc: Document & { prerendering?: boolean }) {
  if (doc.prerendering === true || (doc.visibilityState as string) === "prerender") return "prerender";
  if (doc.visibilityState === "hidden" || doc.hidden) return "oculta";
  return "visible";
}

/** Do Not Track and Global Privacy Control are a person's choice: no SDK, no record. */
export function optedOut(win: Window) {
  const nav = win.navigator as Navigator & { msDoNotTrack?: string; globalPrivacyControl?: boolean };
  const winDnt = (win as Window & { doNotTrack?: string }).doNotTrack;
  return nav.doNotTrack === "1" || nav.doNotTrack === "yes" || nav.msDoNotTrack === "1" || winDnt === "1" ||
    winDnt === "yes" || nav.globalPrivacyControl === true;
}

// ------------------------------------------------------------ the anonymous visitor id

export function newId(cryptoObj?: Crypto): string {
  try {
    if (cryptoObj && typeof cryptoObj.randomUUID === "function") return cryptoObj.randomUUID();
  } catch {
    /* fall through */
  }
  const bytes = new Uint8Array(16);
  try {
    cryptoObj?.getRandomValues(bytes);
  } catch {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * A random UUID kept in localStorage as {id, created}, renewed once it is 395 days old (using the site never extends it).
 * Blocked storage gives a fresh id for this page load: never a cookie, never a fingerprint.
 */
export function visitorId(storage: Storage | null, now: number, cryptoObj?: Crypto): string {
  try {
    const found = JSON.parse(storage?.getItem(VID_KEY) ?? "null");
    if (found && typeof found.id === "string" && UUID.test(found.id) && typeof found.created === "number" &&
        found.created <= now + DAY_MS && now - found.created <= VID_MAX_MS) {
      return found.id;
    }
  } catch {
    /* missing, corrupt or blocked: a new one */
  }
  const fresh = { id: newId(cryptoObj), created: now };
  try {
    storage?.setItem(VID_KEY, JSON.stringify(fresh));
  } catch {
    /* blocked: this page load only */
  }
  return fresh.id;
}

// ------------------------------------------------------------ what leaves the browser

export type TelemetryItem = {
  baseType?: string;
  baseData?: { name?: string; uri?: string; url?: string; refUri?: string; properties?: Record<string, unknown> };
  data?: Record<string, unknown>;
  ext?: { user?: { id: string }; trace?: { name?: string } };
  tags?: Array<Record<string, string>>;
};

export type Context = {
  labels: Labels;
  vid: string;
  origin: string;
  host: string;
  wrapped: boolean;
  here(): Route;
  countRoute(route: string): boolean;
};

const ALLOWED_TYPES = ["PageviewData", "PageviewPerformanceData", "MetricData"];
const ALLOWED_DATA = ["duration"]; // numbers the SDK computes (page load time); every label is added below

/**
 * Rewrites one telemetry item in place and returns true, or returns false to drop it. Only page views, their load
 * timing and the PageVisitTime metric exist (everything else is switched off in sdkConfig).
 */
export function sanitize(item: TelemetryItem, ctx: Context): boolean {
  if (!item || !item.baseType || !ALLOWED_TYPES.includes(item.baseType)) return false;
  const base = (item.baseData = item.baseData || {});
  const data = (item.data = item.data || {});
  const isMetric = item.baseType === "MetricData";
  if (isMetric && base.name !== "PageVisitTime") return false;
  const raw = isMetric ? data.PageUrl : base.uri || base.url;
  const parsed = raw ? parseUrl(raw) : null;
  // An item without a URL is about the page in front of the visitor; one with a URL we cannot read is an unknown route.
  const here = parsed ? routeTemplate(parsed.pathname) : raw ? { route: OTHER, known: false } : ctx.here();
  if (item.baseType === "PageviewData" && !ctx.wrapped && !ctx.countRoute(here.route)) return false;
  const uri = ctx.origin + here.route;
  const keep: Record<string, unknown> = {};
  for (const key of ALLOWED_DATA) if (typeof data[key] === "number") keep[key] = data[key];
  if (isMetric) {
    keep.PageName = here.route;
    keep.PageUrl = uri;
  } else {
    base.name = here.route;
    base.uri = uri;
    if (item.baseType === "PageviewData" && base.refUri !== undefined) base.refUri = referrerHost(base.refUri);
  }
  Object.assign(keep, ctx.labels, { ruta_conocida: here.known ? "si" : "no" });
  item.data = keep;
  if (base.properties) for (const p of Object.keys(base.properties)) delete base.properties[p];
  item.ext = { ...item.ext, user: { id: ctx.vid }, trace: { ...item.ext?.trace, name: here.route } };
  item.tags = item.tags || [];
  item.tags.push({ "ai.user.id": ctx.vid }, { "ai.operation.name": here.route }, { "ai.cloud.role": ROLE }, { "ai.cloud.roleInstance": ctx.host });
  return true;
}

/** No cookies, no dependency, exception or correlation tracking, no remote configuration, no self-telemetry. */
export function sdkConfig(connectionString: string) {
  return {
    connectionString,
    disableCookiesUsage: true, isCookieUseDisabled: true,
    disableAjaxTracking: true, disableFetchTracking: true, disableExceptionTracking: true,
    enableUnhandledPromiseRejectionTracking: false, disableCorrelationHeaders: true, enableCorsCorrelation: false,
    enableRequestHeaderTracking: false, enableResponseHeaderTracking: false, enableAjaxPerfTracking: false,
    enableAutoRouteTracking: true, autoTrackPageVisitTime: true,
    // pagehide and visibilitychange still flush; the deprecated unload listener would block the back/forward cache.
    disablePageUnloadEvents: ["unload"],
    samplingPercentage: 100, maxBatchInterval: 3000, loggingLevelConsole: 0, loggingLevelTelemetry: 0,
    featureOptIn: { SdkStats: { mode: 2 }, iKeyUsage: { mode: 2 } },
    extensionConfig: { AppInsightsCfgSyncPlugin: { blkCdnCfg: true, syncMode: 0, cfgUrl: "" } },
  };
}

export const CONNECTION_STRING =
  /^InstrumentationKey=[0-9a-f-]{36};IngestionEndpoint=https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)*\.applicationinsights\.azure\.com\/$/;
