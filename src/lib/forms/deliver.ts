import "server-only";

/*
 * Delivery for form submissions. Channels are optional and independent:
 *  - FORMS_WEBHOOK_URL  : POSTs JSON (Zapier, Make, Slack workflow, Google Apps Script, CRM)
 *  - RESEND_API_KEY     : emails the team at EMAIL_TO from EMAIL_FROM (and optional confirmations)
 *  - RESEND_AUDIENCE_ID : adds briefing subscribers to a Resend audience
 * With nothing configured, submissions are logged on the server (development mode).
 */

type Kind = "subscribe" | "booking" | "contact" | "fund-interest";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function toHtml(title: string, fields: Record<string, unknown>) {
  const rows = Object.entries(fields)
    .filter(([k]) => k !== "website")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#6b665c;font:12px sans-serif;text-transform:uppercase;letter-spacing:.08em;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;font:14px sans-serif;color:#0a0e16">${esc(Array.isArray(v) ? v.join(", ") : String(v ?? ""))}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:Georgia,serif"><h2 style="font-weight:400">${esc(title)}</h2><table>${rows}</table></div>`;
}

async function resendEmail(to: string, subject: string, html: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from || !to) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) console.error(`[forms] resend email failed: HTTP ${res.status}`);
  return res.ok;
}

async function resendAudience(email: string, name?: string) {
  const key = process.env.RESEND_API_KEY;
  const audience = process.env.RESEND_AUDIENCE_ID;
  if (!key || !audience) return false;
  const res = await fetch(`https://api.resend.com/audiences/${audience}/contacts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email, first_name: name || undefined, unsubscribed: false }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) console.error(`[forms] resend audience failed: HTTP ${res.status}`);
  return res.ok;
}

async function webhook(kind: Kind, data: Record<string, unknown>) {
  const url = process.env.FORMS_WEBHOOK_URL;
  if (!url) return false;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, submittedAt: new Date().toISOString(), data }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) console.error(`[forms] webhook failed: HTTP ${res.status}`);
  return res.ok;
}

export async function deliver(
  kind: Kind,
  data: Record<string, unknown>,
  opts: { subject: string; replyTo?: string; confirmTo?: string; confirmSubject?: string; confirmHtml?: string },
) {
  const results = await Promise.allSettled([
    webhook(kind, data),
    resendEmail(process.env.EMAIL_TO ?? "", opts.subject, toHtml(opts.subject, data), opts.replyTo),
    kind === "subscribe" && typeof data.email === "string" ? resendAudience(data.email, data.name as string) : Promise.resolve(false),
    opts.confirmTo && opts.confirmSubject && opts.confirmHtml
      ? resendEmail(opts.confirmTo, opts.confirmSubject, opts.confirmHtml)
      : Promise.resolve(false),
  ]);
  const delivered = results.some((r) => r.status === "fulfilled" && r.value);
  if (!delivered) {
    // Development fallback: no channel configured (or all failed). Never log in production silently.
    console.info(`[forms] ${kind} submission (no delivery channel configured):`, JSON.stringify({ ...data, website: undefined }));
  }
  return { delivered };
}

// Best-effort per-instance rate limit (serverless instances are short-lived).
const hits = new Map<string, number[]>();
export function rateLimited(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > limit;
}

export function clientKey(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anon";
}

export { esc };
