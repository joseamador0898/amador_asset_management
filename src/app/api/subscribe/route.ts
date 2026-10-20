import { subscribeSchema, BRIEFING_TOPICS } from "@/lib/forms/schemas";
import { parseRequest } from "@/lib/forms/handler";
import { deliver, esc } from "@/lib/forms/deliver";
import { site } from "@/lib/site";

export async function POST(req: Request) {
  const parsed = await parseRequest(req, subscribeSchema);
  if (!parsed.ok) return parsed.response;
  const { email, name, topics, watchlist } = parsed.data;
  const labels = topics.map((id) => BRIEFING_TOPICS.find((t) => t.id === id)?.label ?? id);

  await deliver(
    "subscribe",
    { email, name, topics: labels, watchlist },
    {
      subject: `New briefing subscriber: ${email}`,
      confirmTo: email,
      confirmSubject: `You're subscribed to ${site.name} briefings`,
      confirmHtml: `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.6;color:#0a0e16"><p>Thank you${name ? `, ${esc(name)}` : ""}.</p><p>You'll receive: ${esc(labels.join(", "))}.</p><p style="color:#6b665c;font-size:13px">Briefings are informational and are not investment advice. Reply to this email to change your preferences or unsubscribe.</p></div>`,
    },
  );
  return Response.json({ ok: true });
}
