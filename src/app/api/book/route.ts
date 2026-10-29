import { bookingSchema, CONSULTATION_TYPES, CONSULTATION_TYPES_ES } from "@/lib/forms/schemas";
import { parseRequest } from "@/lib/forms/handler";
import { deliver, esc } from "@/lib/forms/deliver";
import { site } from "@/lib/site";

export async function POST(req: Request) {
  const parsed = await parseRequest(req, bookingSchema);
  if (!parsed.ok) return parsed.response;
  const b = parsed.data;
  const type = CONSULTATION_TYPES.find((t) => t.id === b.type);
  const when = `${b.date} at ${b.time} (${b.timezone})`;
  const es = b.lang === "es";
  const typeEs = CONSULTATION_TYPES_ES[b.type]?.label ?? "Consulta";
  const whenEs = `${b.date} a las ${b.time} (${b.timezone})`;
  const style = "font-family:Georgia,serif;font-size:16px;line-height:1.6;color:#0a0e16";

  await deliver(
    "booking",
    { consultation: type?.label ?? b.type, minutes: type?.minutes, when, name: b.name, email: b.email, phone: b.phone, company: b.company, notes: b.notes, language: es ? "Spanish" : "English" },
    {
      subject: `Consultation request: ${type?.label ?? b.type}, ${when}${es ? " [ES]" : ""}`,
      replyTo: b.email,
      confirmTo: b.email,
      confirmSubject: es ? `Recibimos su solicitud: ${typeEs}, ${b.date}` : `We received your request: ${type?.label ?? "consultation"} on ${b.date}`,
      confirmHtml: es
        ? `<div style="${style}"><p>Hola, ${esc(b.name)}:</p><p>Gracias por su solicitud de consulta (<strong>${esc(typeEs)}</strong>) para el <strong>${esc(whenEs)}</strong>. Le confirmaremos el horario, o le propondremos otro, por correo en un día hábil.</p><p style="color:#6b665c;font-size:13px">${esc(site.name)}. Las consultas son informativas hasta que los términos de cualquier contratación se acuerden por escrito.</p></div>`
        : `<div style="${style}"><p>Hello ${esc(b.name)},</p><p>Thank you for requesting a <strong>${esc(type?.label ?? "consultation")}</strong> on <strong>${esc(when)}</strong>. We'll confirm the time, or propose an alternative, by email within one business day.</p><p style="color:#6b665c;font-size:13px">${esc(site.name)}. Consultations are informational until any engagement terms are agreed in writing.</p></div>`,
    },
  );
  return Response.json({ ok: true });
}
