# CLAUDE.md

# Project Context

This repository contains the personal brand website for Pratik Aggarwal.

Pratik is a disability inclusion expert, public speaker, researcher, and Director at ASTHA. He also founded Blooming in Pain, a storytelling platform for people living with invisible disabilities.

The website serves two primary audiences:

1. Decision-makers looking to hire, partner, invite, or collaborate with Pratik.
2. Community members looking to connect with Blooming in Pain and share their stories.

The website balances emotional storytelling with professional credibility.

---

# Primary Goal

Generate qualified inquiries from:

* Corporates
* NGOs
* Government organizations
* Multilateral organizations
* Educational institutions

Success metrics:

* Partnership inquiries
* Speaking invitations
* Consulting opportunities

---

# Secondary Goals

* Grow the Blooming in Pain community
* Increase story submissions
* Increase Instagram and Medium engagement
* Strengthen Pratik's positioning as a disability inclusion thought leader

---

# Brand Positioning

Pratik turns lived experience of invisible disability into change through stories that make people believed and institutions more inclusive.

Core themes:

* Dignity over pity
* Lived authority
* Inclusion
* Accessibility
* Community
* Storytelling
* Quiet strength

Avoid:

* Inspiration-porn
* Charity framing
* Pity-based language
* Corporate jargon

---

# Design System

Color Palette ("Made Visible" System)

* Ink: `--ink` (`#1E1A24`) — Headings & primary text
* Ground: `--ground` (`#F6F4F7`) — Main background
* Surface: `--surface` (`#EFECEF`) — Secondary card background
* Plum: `--plum` (`#5C2A57`) — Primary brand accent, links, buttons
* Bloom: `--bloom` (`#B84472`) — Accent, eyebrows, focus rings (WCAG 2.1 AA compliant, 4.67:1+ ratio)
* Sage: `--sage` (`#4F6F5C`) — Secondary accent, badge chips

Typography

* Headings: `Fraunces` (serif)
* Body: `Public Sans` (sans-serif)

Design Principles

* Calm
* Minimal
* Spacious
* Accessible
* Human

---

# Accessibility Requirements

WCAG 2.1 AA compliance is mandatory.

Always maintain:

* Semantic HTML (one h1 per page, strict hierarchy)
* Keyboard navigation & focus-visible rings (`2px solid var(--bloom)`)
* Focus management on forms & mobile nav Escape key listener
* Accessible forms with `label[for]`, `aria-required`, `aria-invalid`, `aria-describedby`
* Accessible alt text for real images
* Reduced motion support (`prefers-reduced-motion` fallbacks)

Accessibility is a launch blocker.

---

# Site Architecture

Routes (`src/main.tsx`):

* `/` → `home.tsx`
* `/about` → `about.tsx`
* `/services` → `services.tsx`
* `/work` → `work.tsx`
* `/blooming-in-pain` → `blooming-in-pain.tsx`
* `/blooming-in-pain/submit` → `blooming-in-pain-submit.tsx`
* `/contact` → `contact.tsx`
* `/accessibility` → `accessibility.tsx`

---

# Technical Stack

Current Stack:

* React 19 + TypeScript
* Vite
* React Router v7
* Tailwind CSS v4
* Shadcn UI
* Vercel Analytics (`@vercel/analytics`)
* Helmet Provider (`react-helmet-async`)

Forms:

* Formspree via environment variables (`VITE_CONTACT_FORM_ENDPOINT`, `VITE_STORY_FORM_ENDPOINT`)

Machine-Readable Profile & AI GEO/AEO:

* `public/llms.txt`
* Schema.org JSON-LD (Person, Organization, ItemList, Event, FAQPage, ContactPage, BreadcrumbList)
* "Ask Claude" and "Ask ChatGPT" pills on about page

---

# Working Rules For Claude

Before making changes:

1. Read CHANGELOG.md
2. Read TODO.md
3. Review affected pages

When completing meaningful work:

1. Update CHANGELOG.md
2. Update TODO.md
3. Document architectural decisions

Always prioritize:

1. Accessibility
2. Clarity
3. Conversion
4. Performance
5. Maintainability
