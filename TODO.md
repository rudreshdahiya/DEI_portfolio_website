# TODO.md

## Immediate Priority

### Contact Page

Status: Complete

Tasks

* [x] Create /contact route
* [x] Mad-Libs conversational form (name / org / inquiry type / email inline sentence)
* [x] Every blank is a labeled field (sr-only labels, aria-required, aria-invalid, aria-describedby)
* [x] Error summary with anchor links to erroring fields
* [x] Inquiry type as inline select with underline-only styling
* [x] Message textarea below sentence
* [x] Validation + focus management on submit
* [x] Success state
* [x] Fallback email contact link
* [x] Sidebar with email, socials, Blooming in Pain link
* [x] Keyboard accessible — all 4 fields navigable, errors described by id
* [x] Mobile responsive — sentence wraps naturally
* [x] Wire Formspree endpoint (env var in .env.local — production step)

---

## Accessibility Statement Page

Status: Complete

Tasks

* [x] Create /accessibility route
* [x] Write accessibility commitment
* [x] Add WCAG compliance statement
* [x] Add reporting/contact mechanism
* [x] Link from footer

---

## Analytics

Status: Complete

Tasks

* [x] Enable Vercel Analytics
* [x] Track contact form submissions
* [x] Track CTA clicks
* [ ] Track outbound Medium clicks (no Medium links exist in site yet)
* [x] Track outbound Instagram clicks
* [x] Track outbound LinkedIn clicks

---

## SEO

Status: Complete

Tasks

* [x] Home page metadata
* [x] About page metadata
* [x] Services page metadata
* [x] Work page metadata
* [x] Blooming in Pain metadata
* [x] Contact page metadata
* [x] Open Graph tags
* [x] Sitemap (`public/sitemap.xml`)
* [x] Robots.txt (`public/robots.txt`)
* [ ] OG image — create `/og-image.jpg` and place in `public/` before launch
* [ ] Confirm final domain and replace `pratikaggarwal.in` in `src/components/page-meta.tsx` and `index.html`

---

## Accessibility Audit

Status: Complete (code audit + contrast) — screen reader test pending

Tasks

* [x] Heading hierarchy — all 7 pages: one h1, no skips, clean tree
* [x] Landmark audit — main + nav on every page, aside on contact/submit sidebars
* [x] Input labels — all fields have label[for] or aria-label; Mad-Libs blanks have sr-only labels
* [x] Button names — all buttons have text or aria-label
* [x] html[lang="en"] present
* [x] Contrast audit v2 — --bloom darkened from #C04C7A → #B84472 (4.67:1 on ground, passes AA); all palette pairs now pass AA for normal text
* [x] Focus ring — 2px solid var(--bloom) via :focus-visible; 4.67:1+ on all backgrounds
* [x] Reduced motion — CSS transitions suppressed globally; HeroRoleWord stops cycling; MadeVisibleReveal shows portrait by default
* [x] Skip to main content link in layout
* [ ] Screen reader test — requires real browser + VoiceOver/NVDA

---

## GEO / AEO

Status: Complete

* [x] `llms.txt` at `public/llms.txt` — machine-readable profile for AI systems
* [x] "Ask Claude" + "Ask ChatGPT" deep-link pills on about page header
* [x] Schema.org JSON-LD on all 7 pages
* [x] Person entity with knowsAbout, sameAs, affiliation
* [x] Organization schema for ASTHA and Blooming in Pain
* [x] Service ItemList schema on Services
* [x] Event schemas on Work
* [x] FAQPage schema on Services and Blooming in Pain
* [x] BreadcrumbList on all inner pages
* [x] author + keywords meta in PageMeta
* [x] FAQ sections on Services and Blooming in Pain pages
* [x] Medium outbound tracking added

---

## Testimonials

Status: Deferred — needs real quotes

Notes

* Component pattern is designed and ready (disclosure, aria-expanded/controls, reduced-motion support)
* Removed from home page until Pratik collects real attributed quotes with permission
* Re-add to `home.tsx` between EngagementsSection and the split CTA once real testimonials are available

---

## Media & Asset Integration

Status: Complete

* [x] Integrated real engagement photos (`/images/work-engagements_2.jpeg`, `/images/work-engagements_3.jpeg`)
* [x] Integrated About page portrait image (`/images/pratik-about-page.jpeg`)
* [x] Added Media Features & Podcasts section (YouTube podcasts, Safdarjung Hospital sensory garden, Outlook India, Times of India, Samuhik Pahal)
* [x] Wired 9 curated Blooming in Pain story PDFs/HTMLs in `/public/medium/`

---

## Launch Checklist

* [x] Contact page complete
* [x] Accessibility page complete
* [x] Analytics configured
* [x] SEO configured
* [x] Accessibility review complete (code audit — screen reader test pending)
* [x] Story submission page (/blooming-in-pain/submit)
* [x] Wire Formspree endpoint on contact form + story submission form — copy `.env.example` to `.env.local` and fill in real form IDs before deploying
* [x] Production build passes (`npm run build`)
* [ ] Create OG image (1200×630px → public/og-image.jpg)
* [ ] Confirm domain → update SITE_URL in page-meta.tsx + index.html
* [ ] Deploy to Vercel
* [ ] Final QA review
