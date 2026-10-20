import "server-only";
import type { z } from "zod";
import { clientKey, rateLimited } from "./deliver";

/** Shared POST handling: rate limit, JSON parse, schema validation, honeypot. */
export async function parseRequest<S extends z.ZodType>(
  req: Request,
  schema: S,
): Promise<{ ok: true; data: z.infer<S> } | { ok: false; response: Response }> {
  if (rateLimited(`${new URL(req.url).pathname}:${clientKey(req)}`)) {
    return { ok: false, response: Response.json({ ok: false, error: "Too many requests. Please try again in a minute." }, { status: 429 }) };
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { ok: false, response: Response.json({ ok: false, error: "Invalid request." }, { status: 400 }) };
  }
  // Silently accept bot submissions that fill the honeypot.
  if (body && typeof body === "object" && "website" in body && (body as { website?: unknown }).website) {
    return { ok: false, response: Response.json({ ok: true }) };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, response: Response.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, { status: 422 }) };
  }
  return { ok: true, data: parsed.data };
}
