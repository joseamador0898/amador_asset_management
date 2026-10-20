import "server-only";

export const USER_AGENT = "AmadorAssetManagement/1.0 (+https://github.com/joseamador0898/amador_asset_management)";

/** fetch with a hard timeout; returns null instead of throwing. */
export async function getJson<T>(url: string, init: RequestInit & { timeoutMs?: number } = {}): Promise<T | null> {
  const { timeoutMs = 9000, headers, ...rest } = init;
  try {
    const res = await fetch(url, {
      ...rest,
      headers: { "User-Agent": USER_AGENT, Accept: "application/json", ...headers },
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn(`[signals] ${new URL(url).host} -> HTTP ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[signals] ${safeHost(url)} -> ${(err as Error).name}`);
    return null;
  }
}

export async function getText(url: string, init: RequestInit & { timeoutMs?: number } = {}): Promise<string | null> {
  const { timeoutMs = 9000, headers, ...rest } = init;
  try {
    const res = await fetch(url, {
      ...rest,
      headers: { "User-Agent": USER_AGENT, ...headers },
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn(`[signals] ${safeHost(url)} -> HTTP ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.warn(`[signals] ${safeHost(url)} -> ${(err as Error).name}`);
    return null;
  }
}

function safeHost(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return "request";
  }
}

/** Run async jobs with a concurrency limit, preserving order. */
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
