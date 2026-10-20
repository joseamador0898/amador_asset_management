<p align="center">
  <img src="public/brand/png/logo-horizontal-2000.png" alt="Amador Asset Management" width="520">
</p>

# Amador Asset Management: website

The website of **Amador Asset Management**, an independent investment research and management firm, and home of the forthcoming **Amador Nautilus Fund** (*firme en mar fuerte · steady in rough seas*).

It's built in the style of the leading institutional managers: an editorial serif and ivory/ink palette, research-first navigation and restrained motion. Around that, it adds the products the firm offers:

| Area | Route | What it does |
|---|---|---|
| Home | `/` | Firm story, services, latest research, fund teaser, live Signals preview |
| Firm & Approach | `/firm`, `/approach` | Who we are, values, founder, investment process and evidence standard |
| Insights | `/insights` | MDX articles with math (KaTeX), charts, callouts; category filter; Deep HRP research series |
| Studio | `/studio` | Clips, video series (EN/ES), podcast, click-to-load YouTube player |
| Signals | `/signals` | Live market terminal: quotes, macro, unusual options activity, SEC insider filings, prediction markets, AI Morning Note |
| Briefings & Alerts | `/briefings` | Email products (Daily Brief, Weekly Memo, flow and insider alerts, macro odds, research, fund updates) |
| Nautilus Fund | `/fund` | Flagship fund page with investor-type acknowledgement, strategy, indicative terms, timeline, FAQ, register-interest form |
| Book | `/book` | Consultation booking flow (type → date and time in the visitor's zone → details → .ics), or a Cal.com embed |
| Contact & legal | `/contact`, `/legal/*` | Contact form, disclosures, privacy notice, terms |

## Tech stack

- **Next.js 16** (App Router, Turbopack, Cache Components / Partial Prerendering), **React 19**, **TypeScript**
- **Tailwind CSS v4** with brand tokens in `src/app/globals.css`
- **MDX** articles via `next-mdx-remote`, `remark-gfm`, `remark-math`, `rehype-katex`
- **zod** validation on every API route; no client-side secrets
- Fonts: Newsreader (display/editorial), Inter (UI), JetBrains Mono (data)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the keys you have
npm run dev                  # http://localhost:3000
```

| Script | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript |
| `npm run check:content` | Validates article frontmatter and compiles every MDX file |
| `npm run brand` | Regenerates the logo kit (SVG + PNG) in `public/brand` |

## Environment variables

Every variable is optional. Without keys, panels show clearly labelled sample data and forms log to the server console. See `.env.example` for the full list.

| Variable | Used for |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph |
| `FRED_API_KEY` | Macro dashboard (FRED) |
| `APCA_API_KEY_ID`, `APCA_API_SECRET_KEY` | Quotes ticker (Alpaca market data, 15-minute delayed consolidated feed) |
| `SEC_USER_AGENT` | SEC EDGAR fair-access identification for Form 4 insider filings |
| `SIGNALS_CBOE=on` | Options Pulse and unusual activity from Cboe delayed chains |
| `UNUSUAL_WHALES_API_KEY` | Market Tide, Congressional trades, Dark pool panels (paid plan) |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | AI Morning Note on `/signals` |
| `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`, `RESEND_AUDIENCE_ID` | Form emails, confirmations and subscriber list |
| `FORMS_WEBHOOK_URL` | Send every form submission to Zapier, Make, Slack, a CRM, etc. |
| `NEXT_PUBLIC_CALCOM_LINK` | Replace the booking request flow with a live Cal.com calendar |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense verification tag, script and `/ads.txt` |

Keys are read only on the server (route handlers and cached server functions). The Signals code calls read-only market-data endpoints and never trading endpoints.

## Amador Signals: data sources and licensing

| Panel | Source | Key | Notes |
|---|---|---|---|
| Quotes ticker | Alpaca Markets | yes | Delayed SIP, IEX fallback |
| Macro dashboard | FRED, Federal Reserve Bank of St. Louis | yes | Public-domain U.S. government series only |
| Options pulse, unusual activity | Cboe delayed quotes | no (`SIGNALS_CBOE=on`) | Premium is estimated (volume × last × 100) |
| Insider filings | SEC EDGAR Form 4 | no | Open-market buys listed first |
| Prediction markets | Polymarket Gamma API | no | Macro and market events only |
| Market tide, Congress, Dark pool | Unusual Whales | yes (paid) | Shown as "Partner data" until a valid key is set |
| Morning Note | Google Gemini | yes | Summarizes only the data on the page; labelled as AI-generated |

> **Before a public launch,** confirm that each provider's terms allow public display of its data: Alpaca, Cboe and Unusual Whales in particular. FRED, SEC EDGAR and Polymarket's public API are generally fine with attribution. Data is cached server-side (`cacheLife` profiles `signals` and `filings` in `next.config.ts`) to keep provider usage low.

## Writing content

**Articles** live in `src/content/insights/*.mdx`:

```yaml
---
title: "Article title"
dek: "One-sentence summary."
date: "2026-10-19"
category: "Research"   # Research | Frameworks | Risk | Markets | Signals | Education
author: "Jose Luis Amador Jaime"
tags: ["tag"]
series: "Deep HRP"     # optional
featured: false
cover: "dendrogram"    # dendrogram | nautilus | waves | bars | rings | grid
draft: false           # drafts show only in development
---
```

Use `##` and `###` headings, `$…$` / `$$…$$` math, GFM tables and these components: `<Callout type="note|insight|warning|method">`, `<KeyStats items={[…]} />`, `<Chart data={[…]} />`, `<PullQuote>`, `<Figure>`. In prose, write a literal dollar sign as `\$` and avoid raw `<` or `{` characters. Run `npm run check:content` before committing.

**Studio** clips, series and podcast episodes: `src/content/studio.ts`. **Names, navigation, contact details and the fund name**: `src/lib/site.ts`.

## Brand kit

The logo (designed on a Claude Design canvas) is an **A drawn as a sail on a brass horizon** that runs past both legs: a vessel holding its course. All files are generated by `npm run brand` into `public/brand/`:

| File | Use |
|---|---|
| `amador-logo-horizontal(-reverse).svg`, `amador-logo-stacked(-reverse).svg` | Primary lockups (outlined, no font dependency) |
| `amador-mark*.svg`, `amador-icon*.svg` | Monogram, one-color versions, app icon |
| `png/stripe-icon-512.png` | Stripe → Settings → Branding → **Icon** (square, ≥128 px, under 512 KB) |
| `png/stripe-logo-1200x300.png` | Stripe **Logo**. Brand color `#A8834A`, accent color `#0A0E16` |
| `png/google-ads-logo-square-1200.png`, `png/google-ads-icon-square-1200*.png` | Google Ads square logo (1:1) |
| `png/google-ads-logo-landscape-1200x300.png` | Google Ads landscape logo (4:1) |
| `png/social-avatar-1080.png` | YouTube, X, LinkedIn, Instagram avatar |
| `nautilus-fund-lockup*.svg`, `png/nautilus-fund-lockup-1600.png` | Nautilus Fund sub-brand |

Palette: Ink `#0A0E16` · Ivory `#F7F5F0` · Brass `#A8834A` · Light brass `#C9A96E` · Deep sea `#0F3B47` (fund) · Oxblood `#7D2433` (research).

## Deploying

The simplest host is **Vercel**: import the GitHub repository, add the environment variables above, and deploy. Each push to `main` redeploys. GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck, content checks and a production build on every push and pull request.

## Pre-launch checklist

- [ ] **Securities counsel review** of `/fund`, `/legal/*` and all fund-related copy. Public promotion of a private fund depends on the offering exemption (e.g. Rule 506(b) prohibits general solicitation; 506(c) allows it with verified accredited investors).
- [ ] **Adviser registration status** confirmed, and footer and disclosures updated to match. No performance (including backtests) shown without Marketing Rule-compliant disclosures.
- [ ] **Trademark clearance** for "Amador Nautilus Fund" (Class 36) and the logo. Several small advisers and funds use "Nautilus". Do not use "All Weather" (a Bridgewater trademark) for Amador products.
- [ ] **Data licenses** for every Signals provider shown publicly.
- [ ] **Email delivery** configured (Resend or webhook) with CAN-SPAM/GDPR-compliant unsubscribe handling.
- [ ] Real **contact details, location, socials and founder bio** in `src/lib/site.ts` and `/firm`.
- [ ] **Rotate API keys** that were ever exposed, then set them in the hosting provider's environment settings.

## Project structure

```
src/
  app/                 routes (pages, API routes, sitemap, robots, OG image, icons)
  components/          layout, brand, ui, signals, insights, forms, booking, fund, studio, mdx, art, charts
  content/             insights (MDX) and studio content
  lib/                 site config, brand constants, insights loader, forms, signals providers
scripts/               check-content.mjs, build-brand.mjs
public/brand/          logo kit (SVG + PNG)
```

---

© Amador Asset Management. All rights reserved. Content on this site is for informational purposes only and is not investment advice or an offer of securities.
