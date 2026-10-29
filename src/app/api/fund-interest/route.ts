import { fundInterestSchema, INVESTOR_STATUSES } from "@/lib/forms/schemas";
import { parseRequest } from "@/lib/forms/handler";
import { deliver } from "@/lib/forms/deliver";
import { fund } from "@/lib/site";

export async function POST(req: Request) {
  const parsed = await parseRequest(req, fundInterestSchema);
  if (!parsed.ok) return parsed.response;
  const f = parsed.data;
  await deliver(
    "fund-interest",
    {
      name: f.name,
      email: f.email,
      country: f.country,
      investorStatus: INVESTOR_STATUSES.find((s) => s.id === f.status)?.label ?? f.status,
      indicativeSize: f.ticket,
      message: f.message,
      acknowledgedNotAnOffer: f.attestation,
      language: f.lang === "es" ? "Spanish" : "English",
    },
    { subject: `${fund.shortName} interest: ${f.name} (${f.status})${f.lang === "es" ? " [ES]" : ""}`, replyTo: f.email },
  );
  return Response.json({ ok: true });
}
