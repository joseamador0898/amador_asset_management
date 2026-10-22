/**
 * Central configuration for the Amador Asset Management site.
 * Edit names, contact details and navigation here; every page reads from it.
 */

import { studioLive } from "@/content/studio";

export const site = {
  name: "Amador Asset Management",
  shortName: "Amador",
  legalName: "Amador Asset Management", // TODO: replace with the registered entity name (e.g. "Amador Asset Management LLC").
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Amador Asset Management is an independent investment firm built on research, risk discipline and transparency: portfolio research, live market signals, investor education and the forthcoming Amador Nautilus Fund.",
  // Public contact email (contact page and footer). NEXT_PUBLIC_CONTACT_EMAIL overrides it.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@amadoram.com",
  // TODO: confirm the city shown publicly.
  location: "Chicago, Illinois",
  founder: {
    name: "Jose Luis Amador Jaime",
    role: "Founder & Chief Investment Officer",
    // Used on the business card and email signature (npm run brand), not shown on the site.
    email: "jose@amadoram.com",
  },
  socials: [
    // TODO: add the real handles. Empty hrefs are hidden automatically.
    { label: "YouTube", href: "" },
    { label: "X", href: "" },
    { label: "LinkedIn", href: "" },
    { label: "Instagram", href: "" },
    { label: "TikTok", href: "" },
    { label: "GitHub", href: "https://github.com/joseamador0898" },
  ],
} as const;

/** The flagship fund. Change the name in one place. */
export const fund = {
  name: "Amador Nautilus Fund",
  legalName: "Amador Nautilus Fund I, LP",
  shortName: "Nautilus Fund",
  taglineEs: "Firme en mar fuerte.",
  taglineEn: "Steady in rough seas.",
  status: "Pre-launch",
} as const;

export type NavItem = { label: string; href: string; description?: string };

// Studio shows in the navigation once it has published media (content/studio.ts).
const withStudio = (items: NavItem[]) => items.filter((i) => i.href !== "/studio" || studioLive);

export const mainNav: NavItem[] = withStudio([
  { label: "Firm", href: "/firm", description: "Who we are and how we think" },
  { label: "Approach", href: "/approach", description: "Process, risk and research" },
  { label: "Insights", href: "/insights", description: "Frameworks, research and memos" },
  { label: "Studio", href: "/studio", description: "Clips, explainers and episodes" },
  { label: "Signals", href: "/signals", description: "Live market dashboard" },
  { label: "Nautilus Fund", href: "/fund", description: "Our forthcoming flagship" },
]);

export const utilityNav: NavItem[] = [
  { label: "Briefings & Alerts", href: "/briefings" },
  { label: "Register interest", href: "/fund#register" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Firm",
    items: [
      { label: "About", href: "/firm" },
      { label: "Approach", href: "/approach" },
      { label: "Book a consultation", href: "/book" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Research",
    items: withStudio([
      { label: "Insights", href: "/insights" },
      { label: "Studio", href: "/studio" },
      { label: "Signals", href: "/signals" },
      { label: "Briefings & Alerts", href: "/briefings" },
    ]),
  },
  {
    title: "Fund",
    items: [
      { label: fund.shortName, href: "/fund" },
      { label: "Register interest", href: "/fund#register" },
      { label: "Important disclosures", href: "/legal/disclosures" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Disclosures", href: "/legal/disclosures" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms of use", href: "/legal/terms" },
    ],
  },
];
