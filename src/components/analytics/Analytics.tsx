"use client";

import { useEffect } from "react";
import {
  CONNECTION_STRING,
  OPTOUT_KEY,
  classify,
  environmentOf,
  optedOut,
  routeTemplate,
  sanitize,
  sdkConfig,
  visibilityOf,
  visitorId,
  type Context,
  type Route,
  type TelemetryItem,
} from "@/lib/analytics";

/*
 * Loads Azure Application Insights for visitor statistics (lib/analytics.ts has the rules). The vendored Microsoft SDK
 * (same origin, 180 KB) is added only after the load event and the first interaction or idle moment, so it never delays
 * the first paint or an interaction. Without NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING (local development) nothing loads.
 */

const SDK_SRC = "/vendor/ai.3.4.4.gbl.min.js";
const INTERACTIONS = ["pointerdown", "keydown", "touchstart", "wheel", "scroll"];
const START_MAX_MS = 5000;

type PageView = { name?: string; uri?: string; refUri?: string };
type Plugin = { trackPageView(pageView?: PageView, properties?: Record<string, unknown>): unknown };
type Sdk = {
  loadAppInsights(): void;
  addTelemetryInitializer(initializer: (item: TelemetryItem) => boolean): void;
  trackPageView(pageView: PageView): void;
  appInsights?: Plugin;
};
type SdkWindow = Window & { Microsoft?: { ApplicationInsights?: { ApplicationInsights?: new (options: { config: object }) => Sdk } } };

let started = false;

/** amadoram.com/?noanalytics=1 turns statistics off in this browser (the team's own visits); ?noanalytics=0 turns them on. */
function applyOptOutParam(win: Window) {
  const url = new URL(win.location.href);
  const flag = url.searchParams.get("noanalytics");
  if (flag === null) return;
  try {
    if (flag === "0") win.localStorage.removeItem(OPTOUT_KEY);
    else win.localStorage.setItem(OPTOUT_KEY, "1");
  } catch {
    /* storage blocked: nothing to remember */
  }
  url.searchParams.delete("noanalytics");
  win.history.replaceState(win.history.state, "", url.pathname + url.search + url.hash);
}

function optedOutHere(win: Window) {
  try {
    return win.localStorage.getItem(OPTOUT_KEY) === "1";
  } catch {
    return false;
  }
}

function storageOf(win: Window) {
  try {
    return win.localStorage;
  } catch {
    return null;
  }
}

function whenLoaded(win: Window, run: () => void) {
  if (win.document.readyState === "complete") run();
  else win.addEventListener("load", run, { once: true });
}

/**
 * After the load event, waits for the FIRST of an interaction or an idle moment (5 s at the latest). mark() runs once at
 * that signal, before the interaction can change the route; run() runs after the next paint, so the SDK never lengthens
 * the interaction that started it.
 */
function startWhen(win: Window, mark: () => void, run: () => void) {
  let marked = false;
  let done = false;
  let idle: number | null = null;
  let timer: number | null = null;
  const listen = { capture: true, passive: true };
  function first() {
    if (marked) return false;
    marked = true;
    for (const type of INTERACTIONS) win.removeEventListener(type, onInput, listen);
    mark();
    return true;
  }
  function go() {
    if (done) return;
    done = true;
    if (idle !== null && typeof win.cancelIdleCallback === "function") win.cancelIdleCallback(idle);
    if (timer !== null) win.clearTimeout(timer);
    run();
  }
  function onInput() {
    if (first()) win.requestAnimationFrame(() => win.setTimeout(go, 0));
  }
  function onIdle() {
    first();
    go();
  }
  for (const type of INTERACTIONS) win.addEventListener(type, onInput, listen);
  if (typeof win.requestIdleCallback === "function") idle = win.requestIdleCallback(onIdle, { timeout: START_MAX_MS });
  else timer = win.setTimeout(onIdle, START_MAX_MS);
}

function start(win: Window) {
  applyOptOutParam(win);
  if (optedOut(win) || optedOutHere(win)) return;
  const connectionString = process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING ?? "";
  if (!CONNECTION_STRING.test(connectionString)) return;

  const doc = win.document;
  const nav = win.navigator as Navigator & { userAgentData?: { brands?: Array<{ brand: string }> } };
  const host = win.location.hostname.toLowerCase();
  const labels = classify({
    webdriver: nav.webdriver === true,
    ua: nav.userAgent,
    brands: (nav.userAgentData?.brands ?? []).map((b) => String(b.brand)),
    width: win.innerWidth,
    height: win.innerHeight,
  });
  labels.ambiente = environmentOf(host);
  labels.visibilidad = visibilityOf(doc);

  let last = "";
  let landing: Route | null = null; // the route when statistics started (startWhen's mark)
  const ctx: Context = {
    labels,
    host,
    origin: win.location.origin,
    wrapped: false,
    vid: visitorId(storageOf(win), Date.now(), win.crypto),
    here: () => routeTemplate(win.location.pathname),
    countRoute: (route) => {
      if (route === last) return false;
      last = route;
      return true;
    },
  };

  function init() {
    const AI = (win as SdkWindow).Microsoft?.ApplicationInsights;
    if (!AI || typeof AI.ApplicationInsights !== "function") return;
    const app = new AI.ApplicationInsights({ config: sdkConfig(connectionString) });
    app.loadAppInsights();
    app.addTelemetryInitializer((item) => {
      try {
        return sanitize(item, ctx);
      } catch {
        return false; // an item that cannot be made safe is never sent
      }
    });
    // Route changes (the SDK's own page views carry the title and full URL) go through the same template and dedupe.
    // The first view is the route when statistics started; a route reached before the SDK arrived follows as its own view.
    const first = landing ?? ctx.here();
    const plugin = app.appInsights;
    if (plugin && typeof plugin.trackPageView === "function") {
      const original = plugin.trackPageView;
      const track = (here: Route, pageView?: PageView, properties?: Record<string, unknown>) => {
        if (!ctx.countRoute(here.route)) return undefined;
        const view = pageView ?? {};
        view.name = here.route;
        view.uri = ctx.origin + here.route;
        return original.call(plugin, view, properties);
      };
      plugin.trackPageView = (pageView, properties) => track(ctx.here(), pageView, properties);
      ctx.wrapped = true;
      track(first);
      track(ctx.here(), { refUri: ctx.origin + "/" });
    } else {
      app.trackPageView({ name: first.route, uri: ctx.origin + first.route });
    }
  }

  whenLoaded(win, () =>
    startWhen(
      win,
      () => {
        landing = ctx.here();
      },
      () => {
        const script = doc.createElement("script");
        script.async = true;
        script.src = SDK_SRC;
        script.onload = () => {
          try {
            init();
          } catch {
            /* statistics never break a page */
          }
        };
        (doc.head || doc.documentElement).appendChild(script);
      },
    ),
  );
}

export function Analytics() {
  useEffect(() => {
    if (started) return;
    started = true;
    try {
      start(window);
    } catch {
      /* never break the page */
    }
  }, []);
  return null;
}
