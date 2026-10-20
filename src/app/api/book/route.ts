import { bookingSchema, CONSULTATION_TYPES } from "@/lib/forms/schemas";
import { parseRequest } from "@/lib/forms/handler";
import { deliver, esc } from "@/lib/forms/deliver";
import { site } from "@/lib/site";

export async function POST(req: Request) {
  const parsed = await parseRequest(req, bookingSchema);
  if (!parsed.ok) return parsed.response;
  const b = parsed.data;
  const type = CONSULTATION_TYPES.find((t) => t.id === b.type);
  const when = `${b.date} at ${b.time} (${b.timezone})`;

  await deliver(
    "booking",
    { consultation: type?.label ?? b.type, minutes: type?.minutes, when, name: b.name, email: b.email, phone: b.phone, company: b.company, notes: b.notes },
    {
      subject: `Consultation request: ${type?.label ?? b.type}, ${when}`,
      replyTo: b.email,
      confirmTo: b.email,
      confirmSubject: `We received your request: ${type?.label ?? "consultation"} on ${b.date}`,
      confirmHtml: `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.6;color:#0a0e16"><p>Hello ${esc(b.name)},</p><p>Thank you for requesting a <strong>${esc(type?.label ?? "consultation")}</strong> on <strong>${esc(when)}</strong>. We'll confirm the time, or propose an alternative, by email within one business day.</p><p style="color:#6b665c;font-size:13px">${esc(site.name)}. Consultations are informational until any engagement terms are agreed in writing.</p></div>`,
    },
  );
  return Response.json({ ok: true });
}
