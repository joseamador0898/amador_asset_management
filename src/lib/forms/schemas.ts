import { z } from "zod";

const email = z.email("Enter a valid email address.").max(200);
const name = z.string().trim().min(2, "Please enter your name.").max(120);
const optionalText = (max: number) => z.string().trim().max(max).optional().default("");
// Honeypot: real people never see or fill this field.
const honeypot = z.string().max(0).optional().default("");

export const BRIEFING_TOPICS = [
  { id: "daily-brief", label: "Daily Brief", description: "Markets, rates and what moved, before the open." },
  { id: "weekly-memo", label: "Weekly Memo", description: "One framework or research idea, explained properly." },
  { id: "flow-alerts", label: "Unusual Options Activity", description: "Digest of the largest unusual options trades." },
  { id: "insider-alerts", label: "Insider Buying", description: "Open-market insider purchases from SEC Form 4s." },
  { id: "macro-odds", label: "Macro & Prediction Markets", description: "FOMC, CPI and jobs: data plus market odds." },
  { id: "research", label: "Research Papers", description: "New Amador research, like our Deep HRP work." },
  { id: "fund-updates", label: "Nautilus Fund Updates", description: "Launch timeline and investor events (eligible investors)." },
] as const;

export const CONSULTATION_TYPES = [
  { id: "discovery", label: "Discovery call", minutes: 30, description: "A first conversation about your goals and how we work." },
  { id: "portfolio-review", label: "Portfolio review", minutes: 60, description: "A structured walk through allocation, risk and costs." },
  { id: "fund-intro", label: "Nautilus Fund introduction", minutes: 45, description: "For eligible investors interested in the forthcoming fund." },
  { id: "media", label: "Media, speaking & research", minutes: 30, description: "Interviews, panels, collaborations and academic work." },
] as const;

export const subscribeSchema = z.object({
  email,
  name: optionalText(120),
  topics: z.array(z.enum(BRIEFING_TOPICS.map((t) => t.id) as [string, ...string[]])).min(1, "Choose at least one briefing."),
  watchlist: optionalText(200),
  consent: z.literal(true, { error: "Please confirm you agree to receive these emails." }),
  website: honeypot,
});

export const bookingSchema = z.object({
  type: z.enum(CONSULTATION_TYPES.map((t) => t.id) as [string, ...string[]]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date."),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Choose a time."),
  timezone: z.string().max(60),
  name,
  email,
  phone: optionalText(40),
  company: optionalText(120),
  notes: optionalText(2000),
  consent: z.literal(true, { error: "Please accept the privacy notice." }),
  website: honeypot,
});

export const contactSchema = z.object({
  name,
  email,
  topic: z.enum(["general", "advisory", "fund", "media", "research", "careers"]),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters).").max(4000),
  consent: z.literal(true, { error: "Please accept the privacy notice." }),
  website: honeypot,
});

export const INVESTOR_STATUSES = [
  { id: "accredited-individual", label: "Accredited investor (individual)" },
  { id: "qualified-purchaser", label: "Qualified purchaser" },
  { id: "institution", label: "Institution / family office" },
  { id: "advisor", label: "Financial advisor or consultant" },
  { id: "not-yet", label: "Not currently accredited" },
] as const;

export const fundInterestSchema = z.object({
  name,
  email,
  country: z.string().trim().min(2).max(80),
  status: z.enum(INVESTOR_STATUSES.map((s) => s.id) as [string, ...string[]]),
  ticket: z.enum(["undisclosed", "lt-100k", "100k-500k", "500k-1m", "1m-5m", "gt-5m"]).default("undisclosed"),
  message: optionalText(2000),
  attestation: z.literal(true, { error: "Please confirm the acknowledgement." }),
  consent: z.literal(true, { error: "Please accept the privacy notice." }),
  website: honeypot,
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type FundInterestInput = z.infer<typeof fundInterestSchema>;
