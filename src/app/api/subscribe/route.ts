import { subscribeSchema, BRIEFING_TOPICS, BRIEFING_TOPICS_ES } from "@/lib/forms/schemas";
import { parseRequest } from "@/lib/forms/handler";
import { deliver, esc } from "@/lib/forms/deliver";
import { site } from "@/lib/site";

export async function POST(req: Request) {
  const parsed = await parseRequest(req, subscribeSchema);
  if (!parsed.ok) return parsed.response;
  const { email, name, topics, watchlist, lang } = parsed.data;
  const labels = topics.map((id) => BRIEFING_TOPICS.find((t) => t.id === id)?.label ?? id);
  const es = lang === "es";
  const labelsEs = topics.map((id) => BRIEFING_TOPICS_ES[id]?.label ?? id);
  const style = "font-family:Georgia,serif;font-size:16px;line-height:1.6;color:#0a0e16";

  await deliver(
    "subscribe",
    { email, name, topics: labels, watchlist, language: es ? "Spanish" : "English" },
    {
      subject: `New briefing subscriber: ${email}${es ? " [ES]" : ""}`,
      confirmTo: email,
      confirmSubject: es ? `Su suscripción a los boletines de ${site.name}` : `You're subscribed to ${site.name} briefings`,
      confirmHtml: es
        ? `<div style="${style}"><p>Gracias${name ? `, ${esc(name)}` : ""}.</p><p>Recibirá: ${esc(labelsEs.join(", "))}.</p><p>Por ahora, los boletines se envían en inglés.</p><p style="color:#6b665c;font-size:13px">Los boletines son informativos y no constituyen asesoría de inversión. Responda a este correo para cambiar sus preferencias o darse de baja.</p></div>`
        : `<div style="${style}"><p>Thank you${name ? `, ${esc(name)}` : ""}.</p><p>You'll receive: ${esc(labels.join(", "))}.</p><p style="color:#6b665c;font-size:13px">Briefings are informational and are not investment advice. Reply to this email to change your preferences or unsubscribe.</p></div>`,
    },
  );
  return Response.json({ ok: true });
}
