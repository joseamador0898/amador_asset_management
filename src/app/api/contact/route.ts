import { contactSchema } from "@/lib/forms/schemas";
import { parseRequest } from "@/lib/forms/handler";
import { deliver } from "@/lib/forms/deliver";

export async function POST(req: Request) {
  const parsed = await parseRequest(req, contactSchema);
  if (!parsed.ok) return parsed.response;
  const c = parsed.data;
  await deliver(
    "contact",
    { name: c.name, email: c.email, topic: c.topic, message: c.message, language: c.lang === "es" ? "Spanish" : "English" },
    { subject: `Website inquiry (${c.topic}) from ${c.name}${c.lang === "es" ? " [ES]" : ""}`, replyTo: c.email },
  );
  return Response.json({ ok: true });
}
