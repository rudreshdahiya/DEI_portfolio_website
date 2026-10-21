# Changelog

## Project: Pratik Aggarwal Portfolio / Blooming in Pain

A personal portfolio + disability storytelling site for Pratik Aggarwal.
Stack: Vite + React 19 + TypeScript + React Router + Tailwind CSS v4 + Shadcn UI

---

## Current State (2026-06-16)

### Routes (src/main.tsx)
- `/` → `src/pages/home.tsx`
- `/about` → `src/pages/about.tsx`
- `/services` → `src/pages/services.tsx`
- `/work` → `src/pages/work.tsx`
- `/blooming-in-pain` → `src/pages/blooming-in-pain.tsx`

### Layout (src/layout.tsx)
- Sticky header with nav: About, Services, Blooming in Pain, Connect
- Mobile hamburger menu
- Footer: 3-column grid (brand/role, nav links, contact/socials)
- Person: Pratik Aggarwal — disability inclusion expert, Director at ASTHA, Founder of Blooming in Pain
- Contact: hello@bloominginpain.com | Instagram: bloominginpain | LinkedIn: pratikaggarwal
- Accessibility statement link in footer

### Pages
- `home.tsx` — landing page
- `about.tsx` — about Pratik
- `services.tsx` — services offered
- `work.tsx` — portfolio/work showcase
- `blooming-in-pain.tsx` — Blooming in Pain project page

### Missing / Placeholder Routes
- `/connect` — nav link exists but no route/page yet
- `/accessibility` — footer link exists but no route/page yet

### Notes
- Font: Fraunces (serif) for name/brand, Comic Neue signals mockup
- Monochrome palette only
- No real functionality — all static placeholder data

---

## Update Log

| Date | Change |
|------|--------|
| 2026-06-16 | Changelog created. Captured current project state. |
| 2026-06-16 | Contact page built (`src/pages/contact.tsx`). Route `/contact` added to `main.tsx`. Nav link updated from `/connect` to `/contact` in `layout.tsx`. Includes inquiry type selector (4 types), name, organisation, email, message fields, client-side validation with accessible error messages, and success state. |
| 2026-06-16 | Accessibility Statement page built (`src/pages/accessibility.tsx`). Route `/accessibility` added to `main.tsx`. Footer link was already in place. Covers commitment, WCAG 2.1 AA, what's been done, known limitations, issue reporting, and review date. |
| 2026-06-16 | Vercel Analytics installed (`@vercel/analytics`). `<Analytics />` added to `main.tsx`. Custom events: `contact_form_submitted` (inquiry_type), `cta_clicked` (label + location) on hero and split-section CTAs, `outbound_click` (destination + location) on Instagram and LinkedIn links in home and footer. |
| 2026-06-16 | SEO implemented. `react-helmet-async` installed. `<HelmetProvider>` added to `main.tsx`. `PageMeta` component created at `src/components/page-meta.tsx`. Per-page title + description + OG + Twitter card meta added to all 7 pages. `index.html` updated with home-page static defaults. `public/robots.txt` and `public/sitemap.xml` created. Placeholder domain: `pratikaggarwal.in` — update before launch. Placeholder OG image: `/og-image.jpg` — needs to be created. |
| 2026-06-17 | Story submission page built (`src/pages/blooming-in-pain-submit.tsx`). Route `/blooming-in-pain/submit` added. Form: name (with pseudonym note), email, condition (optional), working title (optional), story (required), anything else (optional), consent checkbox. Validation + success state. `story_submitted` analytics event. Added to sitemap. Formspree endpoint still needs wiring (production step). |
| 2026-06-17 | Accessibility audit. Fixed 6 issues: (1) Darkened primary teal #2E8B8B → #1B6B6B across app.css and all 5 pages — was failing WCAG AA 4.5:1 (~3.7:1 on sand), now passes (~5.0:1 on sand, ~5.5:1 on white). (2) Fixed contact form focus management — `getElementById("inquiryType")` targeted null; now maps to correct input IDs. (3) Added `has-[:focus-visible]:outline` to radio card labels so keyboard focus is visible on styled cards. (4) Removed `role="img"` + `aria-label` from placeholder divs in work.tsx — set `aria-hidden` instead. (5) Added Escape key handler + hamburger ref in layout.tsx — Escape closes mobile menu and returns focus to trigger. (6) Changed `<ol>` → `<ul>` for engagements list on home page. |
| 2026-06-16 | GEO/AEO pass. `JsonLd` component created (`src/components/json-ld.tsx`). Schema.org JSON-LD added to all 7 pages: Person + WebSite (home), Person + Organization/ASTHA (about), ItemList of Services + FAQPage (services), ItemList of Events (work), Organization + FAQPage (blooming-in-pain), ContactPage (contact), WebPage (accessibility). BreadcrumbList added to inner pages. PageMeta updated with `author` + `keywords` meta. FAQ sections added to Services and Blooming in Pain pages. Broken `/connect` links fixed to `/contact` on services, work, and blooming-in-pain. Medium outbound tracking added to blooming-in-pain. |
| 2026-06-17 | Formspree wiring complete. `.env.example` created with `VITE_CONTACT_FORM_ENDPOINT` and `VITE_STORY_FORM_ENDPOINT`. Both forms (`contact.tsx` and `blooming-in-pain-submit.tsx`) updated: async `handleSubmit` POSTs JSON to env-var endpoint, button disabled + shows "Sending…"/"Submitting…" during submission, `submitError` shown via `role="alert"`. `tsc --noEmit` passes. |
| 2026-06-18 | "Made Visible" design system applied site-wide. Complete palette migration: Warm Sand/Healing Teal/Invisible Plum → --ground/#F6F4F7, --plum/#5C2A57, --bloom/#C04C7A, --sage/#4F6F5C, --ink/#1E1A24 in `app.css`. Font: Atkinson Hyperlegible → Public Sans (body), Fraunces retained for headings. `home.tsx` rebuilt: hero with cycling role word (aria-live), Made Visible signal-line reveal (hover/tap/keyboard/reduced-motion), EngagementsSection with per-engagement intent-triggered background overlay, dominant/subordinate split CTA section. `layout.tsx`: sticky mobile CTA collapsed to single "Start a partnership" action. |
| 2026-06-20 | Accessibility baseline audit — WCAG 2.1 AA. All 7 pages pass: one h1 per page, no heading skips, all inputs have programmatic labels (sr-only label[for] or aria-label), no unlabelled buttons, main+nav landmarks present, html[lang="en"] set. Contrast audit: --bloom (#C04C7A) failed at 4.21:1 on --ground for small text — darkened to #B84472 (4.67:1 on ground, 5.11:1 on white). All other palette pairs pass AA. accessibility.tsx + blooming-in-pain-submit.tsx remaining old-token sweep: #1B6B6B → var(--bloom), #6E4C7E → var(--bloom) (eyebrows) / var(--plum) (CTAs/buttons), #F8F4FB → var(--ground). about.tsx portrait placeholder gradient updated to Made Visible lilac palette. home.tsx ASTHA + ARNEC org chips → sage tint (#E2EDE7/#1F3D2A); Purple Fest chip → plum tint (#EDE4EF/#3D1E3C). |
| 2026-06-20 | Token sweep across all pages. `services.tsx`: pillar numbers + bullet dash markers updated from `#1B6B6B` → `var(--bloom)`; CTA section bg `#F2EEE7` → `var(--surface)`. `work.tsx`: role pill colors (Keynote/Speaker/Trainer/Lecturer → sage-tint #E2EDE7/#1F3D2A; Panelist/Moderator → plum-tint #EDE4EF/#3D1E3C; Advisory → muted tokens); EventPhoto placeholder gradient updated to Made Visible lilac palette; old Atkinson Hyperlegible `fontFamily` → Public Sans; CTA section bg → `var(--surface)`; photo placeholder RGBA → ink RGBA. `blooming-in-pain.tsx`: card gradients updated to Made Visible palette; all `#6E4C7E` → `var(--plum)` (links/CTAs) or `var(--bloom)` (eyebrows); `#F8F4FB` backgrounds → `var(--ground)` (hero) / `var(--surface)` (share CTA). `about.tsx`: pull-quote border colors + CTA button `#6E4C7E` → `var(--plum)`, `#1B6B6B` blockquote → `var(--sage)`, placeholder RGBA → ink RGBA. Site-wide: no more old Warm Sand, Healing Teal, or Invisible Plum hex values. |
| 2026-06-20 | Mad-Libs conversational contact form. `contact.tsx` rewritten: radio card form replaced with inline sentence — "Hi Pratik, I'm [name] from [org], reaching out about [select]. Reach me at [email]." Each blank is a real labeled field (sr-only labels, aria-required, aria-invalid, aria-describedby). Error summary block links to erroring fields via anchor href. Submit with Formspree, success state, analytics tracking unchanged. Added `.ml-field` / `.ml-select` CSS classes to `app.css` for underline-only inline field treatment with focus (--bloom) and error (--destructive) states. `about.tsx`: replaced hardcoded hex colors (#1B6B6B, #6E4C7E) with CSS variable references (var(--sage), var(--plum)). |
| 2026-06-20 | `llms.txt` added at `public/llms.txt`. Machine-readable profile of Pratik for AI systems: identity, expertise, services, engagements, Blooming in Pain, publications, values, and what he is not. "Ask Claude" and "Ask ChatGPT" pill links added to the about page header — pre-filled deep links pointing to `pratikaggarwal.in/llms.txt`, following the pattern from thatgurjot.com. |
| 2026-06-20 | Testimonials section added to home page. `TestimonialsSection` component with 4 testimonials (HCL Foundation, UNICEF India, NDMA, Blooming in Pain community). Click/keyboard disclosure pattern: each card shows name + role + teaser by default; "Read more ↓" button expands full quote with max-height CSS transition. `aria-expanded` + `aria-controls` + `aria-label` on each button. Escape key collapses open card. `prefers-reduced-motion`: all quotes shown expanded on initial render (lazy `useState` initializer avoids flash). Section inserted between Selected Engagements and the split CTA on the home page. |
| 2026-09-06 | Real media features & photo asset integration pass across site. (1) `work.tsx`: Integrated real engagement photographs (`/images/work-engagements_2.jpeg` for Purple Fest Goa and `/images/work-engagements_3.jpeg` for UNICEF Bihar); created "Media Features & Podcasts" section with YouTube podcast episodes, Safdarjung Hospital sensory garden coverage, Outlook India, Times of India, and Samuhik Pahal; updated `EventPhoto` component to render real image tags. (2) `home.tsx`: Embedded podcasts and national media feature grid (The Better India, Indian Express, Outlook India, Times of India, Samuhik Pahal). (3) `about.tsx`: Integrated real portrait photograph (`/images/pratik-about-page.jpeg`), updated Umang Vatika sensory garden citations, and linked national press coverage. (4) `blooming-in-pain.tsx`: Wired 9 curated community stories linking to archived Medium publication PDFs/HTMLs in `/public/medium/` (Sujatha Rao, Zanna Barrett, ME/CFS, Tracheostomy, Endometriosis, Long COVID, Neuroplastic Pain, Neuropsychologist Founder Story). (5) Code health: resolved syntax formatting issue in `blooming-in-pain.tsx`, verified `npx tsc --noEmit` with 0 errors, and confirmed clean production build (`npm run build`). |
| 2026-10-21 | Fixed stale admin content (e.g. Pratik's email on /contact showing old values). Causes: (1) public pages are prerendered with settings at build time, but saving in admin never triggered a build; (2) `fetchSetting` preferred a `localStorage` copy whenever its `_updatedAt` (set from the saving device's clock) looked newer than Supabase, and fell back to hard-coded defaults when Supabase was unreachable; (3) the contact page fell back from `contact.recipient_email` to the footer email. Fixes: new Vercel Function `api/rebuild.js` (verifies the caller with `public.is_admin()`, then POSTs to the server-only `VERCEL_DEPLOY_HOOK_URL`), called after every successful `saveSetting`; `fetchSetting` now reads Supabase only and, on failure, keeps the build-time seed instead of localStorage/defaults; localStorage settings cache and cross-tab `storage` listeners removed; `vercel.json` rewrite excludes `/api/`; contact page uses only `recipient_email`; admin email fields relabelled; admin save messages now say changes are live within a couple of minutes. |

---

## Current Status

### Completed Pages & Components

* **Home Page** (`/`): Hero word cycler, Made Visible reveal interaction, Engagements section, YouTube Podcasts grid, National Media feature cards, Blooming in Pain platform block, Split CTA.
* **About Page** (`/about`): Portrait image (`pratik-about-page.jpeg`), ASTHA field work story, Blooming in Pain origin, Umang Vatika sensory garden citations, Samuhik Pahal author link, national media press links, "Ask AI" widget linked to `llms.txt`.
* **Services Page** (`/services`): Strategic DEI Consulting, Workshops, Advocacy, Research & Policy pillars, FAQ section with JSON-LD schema.
* **Work & Engagements** (`/work`): Keynote photo cards (`work-engagements_2.jpeg`, `work-engagements_3.jpeg`), Media Features & Podcasts section, category filter, role pills, outbound links.
* **Blooming in Pain** (`/blooming-in-pain`): 9 curated community stories linking to Medium PDFs/HTMLs in `/public/medium/`, story submission page (`/blooming-in-pain/submit`), community FAQ.
* **Contact Page** (`/contact`): Mad-Libs conversational form, accessible fields, error summary, Formspree integration (`VITE_CONTACT_FORM_ENDPOINT`).
* **Accessibility Page** (`/accessibility`): Commitment statement, WCAG 2.1 AA audit compliance, reporting channels.
* **Technical & SEO/GEO Foundation**: `llms.txt`, Schema.org JSON-LD structured data on all 7 pages, `sitemap.xml`, `robots.txt`, Vercel Analytics.

---

## Outstanding Work Before Deployment

### Pre-Launch Checklist

* [x] All 7 core pages built & WCAG 2.1 AA audited
* [x] Formspree endpoints wired via `.env` variables
* [x] Analytics & SEO JSON-LD structured data configured
* [x] `llms.txt` active
* [ ] Create `public/og-image.jpg` social sharing banner (1200x630px)
* [ ] Update final domain in `src/components/page-meta.tsx` and `index.html` upon deployment
* [ ] Screen reader smoke test (VoiceOver / NVDA)

---

## 2026-10-11: Admin Social Links & Social Sharing Fixes

### 1. Contact Page Social Links Configurable via Admin
- Added `instagram_url` and `linkedin_url` to `ContactSettings` in `src/lib/supabase.ts` with default fallback links.
- Added "Social Media Links (Follow & Connect Sidebar)" card in `/admin/contact` (`src/admin/contact-settings.tsx`) allowing Pratik to edit Instagram and LinkedIn URLs directly from the admin panel and persist to Supabase.
- Updated `src/pages/contact.tsx` to read dynamic social URLs with outbound click tracking to Vercel and local analytics.

### 2. Blooming in Pain Page Sharing & Dedicated Meta Fix
- **Issue Diagnosed**: Vite is an SPA; when crawlers (WhatsApp, LinkedIn, Twitter/X, Facebook, Slack, iMessage) unfurl links like `/blooming-in-pain`, they received `index.html` where `og:url`, `og:title`, and `og:description` were hardcoded to the homepage, leading platforms like LinkedIn to collapse shares into the generic homepage preview.
- **Static Page Generation**: Added `scripts/generate-static-pages.js` hooked into `npm run build` to generate static HTML for all routes (`/blooming-in-pain`, `/about`, `/services`, `/work`, `/contact`, `/accessibility`, `/blooming-in-pain/submit`) with route-specific `<title>`, `<meta property="og:title">`, `<meta property="og:url">`, `<meta property="og:image">`, `<meta property="og:description">`, and `<link rel="canonical">`.
- **Clean URLs**: Added `"cleanUrls": true` in `vercel.json` so static HTML files are served by Vercel for inner routes without rewriting to root `index.html`.
- **Dedicated OG Image**: Added `public/blooming-in-pain-og.jpeg` specifically for Blooming in Pain social previews.
- **Interactive Share Component**: Built `src/components/share-button.tsx` with Web Share API support, 1-click clipboard link copying, WhatsApp, LinkedIn, X (Twitter), and Email sharing buttons, integrated into both the hero and community contribute sections of the Blooming in Pain page.

---

## 2026-10-20: Admin Security & Crawler Prerendering

### 1. Admin security
- **Issue**: The admin password was a `VITE_` variable (shipped in the public JS bundle), and two hard-coded fallback passwords (`pratik2024`, `admin2024`) were always accepted. `supabase_setup.sql` let anyone insert, update and delete `site_settings` and read/delete analytics. (Production was never actually connected to Supabase: Vercel had no `VITE_SUPABASE_*` variables, so admin edits only ever saved to the editor's own browser.)
- **Login**: `src/admin/admin-layout.tsx` now signs in with Supabase Auth (email + password, verified server-side). `VITE_ADMIN_PASSWORD` and the fallback passwords are removed.
- **Database rules**: `supabase_setup.sql` rewritten as one secure script: creates `site_settings`, `analytics_events` and the `site-images` bucket; public can read content, view images and record analytics; only emails in `public.admin_users` can change content, upload images, or read/clear analytics.
- **Honest saves**: `saveSetting` in `src/lib/supabase.ts` now writes to Supabase first and throws if it fails, so the admin screen shows an error instead of "Saved" for changes that never left the browser.

### 2. Prerendering for search engines and AI crawlers
- **Issue**: Every page shipped an empty `<div id="root">`; content and JSON-LD only existed after JavaScript ran, so most AI crawlers and link unfurlers saw blank pages.
- **Shared app tree**: Routes and providers moved from `src/main.tsx` into `src/app.tsx` (`AppProviders`, `AppRoutes`), used by both the browser entry and the new `src/entry-server.tsx`.
- **Build step**: `scripts/prerender.js` renders all 8 public routes with the real components at build time and writes full HTML (body text, title, meta, canonical, JSON-LD) into each route's static file. The browser app replaces it on load.
- **Build script**: `npm run build` now runs client build → SSR build (`dist-ssr/`, git-ignored) → `generate-static-pages.js` → `prerender.js`.
- **Admin pages**: generated `/admin*` pages carry `noindex, nofollow`.
- **Saved content in prerendered pages**: `entry-server.tsx` loads the saved Supabase settings before rendering (via the existing `fetch*Settings`), so crawlers see the same text as visitors. Each page embeds only the settings it renders (`window.__SITE_SETTINGS__`: shared `global` + its own section), and the providers start from those values (`src/lib/settings-seed.ts`), so the first paint already shows saved content instead of flashing the defaults.
- **Note**: the saved `home` settings contain a ~180 KB image stored as a data URL (uploads fell back to base64 because the `site-images` bucket never existed). Re-upload it from the admin panel after setup so it moves to storage and the home page gets lighter.

### 3. Footer year always current (2026-10-20)
- `src/layout.tsx`: `currentYearCopyright()` replaces the year in a saved "© YYYY …" footer with the current year (year ranges untouched), so a stale saved value like "© 2025" no longer shows.
