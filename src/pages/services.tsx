import { useState } from "react";
import { Link } from "react-router";
import { ChevronDown } from "lucide-react";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";
import { useRevealAll } from "@/hooks/use-reveal-all";

// ── Data ──────────────────────────────────────────────────────────────────────

const pillars = [
  {
    id: "corporate",
    number: "01",
    title: "Corporate Sensitization",
    outcome: (
      <>
        Your <span data-key-info>teams understand disability</span>, your language and policies become inclusive.
      </>
    ),
    includes: [
      "DEI training workshops for teams and senior leadership",
      "Language and communication guidance for internal and external use",
      "Review and input on disability-related HR and DEI policies",
      "Training of Trainers — so the work continues after I leave",
    ],
    for: ["Corporates", "Foundations"],
  },
  {
    id: "ngo",
    number: "02",
    title: "NGO Capacity Building",
    outcome: (
      <>
        Your <span data-key-info>frontline teams and beneficiaries access the right welfare schemes</span> and accessible services.
      </>
    ),
    includes: [
      "Connecting communities to relevant government welfare schemes",
      "Building accessibility into programmes, facilities, and communication",
      "Training frontline workers on disability-inclusive practice",
      "System strengthening for consistent, rights-based service delivery",
    ],
    for: ["Small NGOs", "Large NGOs"],
  },
  {
    id: "talks",
    number: "03",
    title: "Academic & Public Talks",
    outcome: (
      <>
        Your <span data-key-info>students and audience leave with a lived understanding</span> of disability.
      </>
    ),
    includes: [
      "Guest lectures and academic seminars",
      "Panel discussions at disability, DEI, and public health conferences",
      "Keynote addresses for events and institutional summits",
      "Orientation and sensitisation sessions for students",
    ],
    for: ["Universities & colleges", "Conferences & events"],
  },
  {
    id: "advisory",
    number: "04",
    title: "Government & Multilateral Advisory",
    outcome: (
      <>
        <span data-key-info>Inclusive, accessible programs and infrastructure</span> that reach the people who need them.
      </>
    ),
    includes: [
      "Child protection policy advisory and programme input",
      "Inclusive education framework development",
      "Women empowerment and disability intersectionality",
      "Accessible infrastructure and service delivery planning",
    ],
    for: ["State governments", "Multilateral organisations"],
  },
];

const faqItems = [
  {
    q: "What is disability sensitization and why does it matter?",
    a: (
      <>
        Disability sensitization is the process of <span data-key-info>helping individuals and organisations understand disability</span> — particularly invisible disabilities — from a rights-based and human perspective, not a charity or pity frame. It matters because most inclusion initiatives fail not due to policy gaps but due to attitudinal barriers: people don't know how to talk about disability, what reasonable accommodations look like, or that many disabilities are invisible. Pratik's sensitization work combines lived experience of fibromyalgia with nine years of professional practice, making it <span data-key-info>grounded in reality rather than theory</span>.
      </>
    ),
  },
  {
    q: "Who typically works with Pratik?",
    a: (
      <>
        <span data-key-info>Corporates and foundations</span> seeking DEI training, <span data-key-info>NGOs</span> building disability-inclusive programmes, <span data-key-info>universities and conferences</span> looking for speakers on invisible disability, and <span data-key-info>government bodies and multilateral organisations</span> needing advisory input on inclusive policy. Past engagements include UNICEF India, HCL Foundation, Tech Mahindra Foundation, and the National Disaster Management Authority.
      </>
    ),
  },
  {
    q: "Does Pratik work with organisations outside India?",
    a: (
      <>
        Yes. While most frontline work is based in India, he has spoken at international events including the <span data-key-info>ARNEC Regional Conference in Manila</span> and diplomatic events at the Spanish and Finnish embassies in New Delhi. He is open to international partnerships and speaking invitations.
      </>
    ),
  },
  {
    q: "What's the difference between sensitization and capacity building?",
    a: (
      <>
        Corporate sensitization <span data-key-info>shifts attitudes</span> — helping people understand what disability is and how it shows up in the workplace. Capacity building goes further: it <span data-key-info>builds the skills, systems, and institutional knowledge for frontline staff to deliver disability-inclusive services consistently</span> — connecting communities to welfare schemes, designing accessible programmes, and training trainers so the work continues.
      </>
    ),
  },
  {
    q: "How long does a typical engagement last?",
    a: (
      <>
        It varies. A conference talk may be 45–90 minutes. A corporate workshop may be a half-day or full-day. <span data-key-info>NGO capacity building and government advisory projects typically span weeks or months.</span> Every engagement starts with a conversation about what your context actually needs.
      </>
    ),
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Services() {
  useRevealAll();
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  return (
    <div>
      <PageMeta
        title="Services — Disability Inclusion Consulting & Speaking"
        description="Work with Pratik Aggarwal on corporate sensitization, NGO capacity building, academic and public talks, or government and multilateral advisory. Disability inclusion rooted in lived experience."
        path="/services"
        keywords="disability sensitization training India, disability inclusion consulting, book disability speaker, NGO disability capacity building, inclusive development advisory"
      />
      <JsonLd schema={[
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pratik-aggarwal-website.vercel.app" },
            { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://pratik-aggarwal-website.vercel.app/services" }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Disability Inclusion Services by Pratik Aggarwal",
          "description": "Pratik Aggarwal offers disability inclusion services to corporates, NGOs, governments, and educational institutions — rooted in lived experience and nine years of professional practice.",
          "itemListElement": [
            {
              "@type": "ListItem", "position": 1,
              "item": {
                "@type": "Service",
                "name": "Corporate Disability Sensitization",
                "description": "DEI training workshops, language guidance, HR policy review, and Training of Trainers programmes to help corporate teams understand and include people with invisible disabilities.",
                "provider": { "@id": "https://pratik-aggarwal-website.vercel.app/#pratik-aggarwal" },
                "areaServed": "IN",
                "audience": { "@type": "Audience", "audienceType": "Corporates and foundations" }
              }
            },
            {
              "@type": "ListItem", "position": 2,
              "item": {
                "@type": "Service",
                "name": "NGO Disability Capacity Building",
                "description": "Helping NGOs connect communities to government welfare schemes, build accessibility into programmes, and train frontline workers on disability-inclusive, rights-based practice.",
                "provider": { "@id": "https://pratik-aggarwal-website.vercel.app/#pratik-aggarwal" },
                "areaServed": "IN",
                "audience": { "@type": "Audience", "audienceType": "Small and large NGOs" }
              }
            },
            {
              "@type": "ListItem", "position": 3,
              "item": {
                "@type": "Service",
                "name": "Academic & Public Speaking on Disability",
                "description": "Guest lectures, keynote addresses, panel discussions, and orientation sessions on invisible disability, chronic illness, and disability inclusion for universities, conferences, and institutions.",
                "provider": { "@id": "https://pratik-aggarwal-website.vercel.app/#pratik-aggarwal" },
                "areaServed": "Worldwide",
                "audience": { "@type": "Audience", "audienceType": "Universities, colleges, and conferences" }
              }
            },
            {
              "@type": "ListItem", "position": 4,
              "item": {
                "@type": "Service",
                "name": "Government & Multilateral Disability Advisory",
                "description": "Policy advisory and programme input on disability-inclusive child protection, inclusive education, women empowerment, and accessible infrastructure for state governments and multilateral organisations.",
                "provider": { "@id": "https://pratik-aggarwal-website.vercel.app/#pratik-aggarwal" },
                "areaServed": "IN",
                "audience": { "@type": "Audience", "audienceType": "State governments and multilateral organisations" }
              }
            }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is disability sensitization and why does it matter?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Disability sensitization is the process of helping individuals and organisations understand disability — particularly invisible disabilities — from a rights-based and human perspective, not a charity or pity frame. It matters because most inclusion initiatives fail not due to policy gaps but due to attitudinal barriers: people don't know how to talk about disability, what reasonable accommodations look like, or that many disabilities are invisible. Pratik Aggarwal's sensitization work combines lived experience of fibromyalgia with nine years of professional practice, making it grounded in reality rather than theory."
              }
            },
            {
              "@type": "Question",
              "name": "Who typically hires Pratik Aggarwal?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Pratik works with corporates and foundations seeking DEI training, NGOs building disability-inclusive programmes, universities and conferences looking for speakers on invisible disability and chronic illness, and government bodies and multilateral organisations needing advisory input on inclusive policy and infrastructure. Past clients include UNICEF India, HCL Foundation, Tech Mahindra Foundation, and the National Disaster Management Authority."
              }
            },
            {
              "@type": "Question",
              "name": "Does Pratik Aggarwal work with organisations outside India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. While most of Pratik's frontline work is based in India, he has spoken at international events and engages with multilateral organisations. His speaking engagements have included diplomatic events at the Embassy of Spain and Embassy of Finland in New Delhi, and the ARNEC Regional Conference in Manila. He is open to international partnerships and speaking invitations."
              }
            },
            {
              "@type": "Question",
              "name": "What is the difference between corporate sensitization and capacity building?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Corporate sensitization focuses on shifting attitudes — helping employees and leaders understand what disability actually is, how to talk about it, and how it shows up in the workplace, including invisible and chronic conditions. Capacity building, offered for NGOs and development organisations, goes further: it builds the skills, systems, and knowledge for frontline staff to deliver disability-inclusive services consistently and sustainably — connecting communities to welfare schemes, designing accessible programmes, and training trainers so the knowledge persists."
              }
            },
            {
              "@type": "Question",
              "name": "How long does an engagement with Pratik Aggarwal typically last?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Engagements vary widely. A speaking slot at a conference may be a single session of 45–90 minutes. A corporate sensitization programme may be a half-day or full-day workshop, or a series over several weeks. Capacity building projects with NGOs or advisory work with government bodies are typically longer — spanning weeks or months. Every engagement starts with a conversation about what your context actually needs."
              }
            }
          ]
        }
      ]} />

      {/* ── Page header ───────────────────────────────────────────────── */}
      <header className="px-6 pt-20 pb-14 border-b border-border">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_auto] md:items-end gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              Services
            </p>
            <h1
              className="text-5xl md:text-6xl text-foreground tracking-tight"
              style={{ fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.07 }}
            >
              How I help
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-[42ch] leading-relaxed md:text-right md:pb-1">
            <span data-key-info>Moving organisations from awareness to inclusion</span> — through training,
            advisory, and the kind of knowledge that only comes from lived
            experience.
          </p>
        </div>
      </header>

      {/* ── Pillars ───────────────────────────────────────────────────── */}
      <div className="divide-y divide-border">
        {pillars.map((pillar) => (
          <section
            key={pillar.id}
            id={pillar.id}
            aria-labelledby={`${pillar.id}-heading`}
            className="px-6 py-16 md:py-20"
          >
            <div className="reveal-stagger max-w-5xl mx-auto grid md:grid-cols-[240px_1fr] gap-10 md:gap-16">

              {/* ── Left col: number + title + for ────────────────────── */}
              <div className="flex flex-col gap-5">
                <span
                  className="text-sm font-semibold tabular-nums"
                  style={{ color: "var(--bloom)" }}
                  aria-hidden="true"
                >
                  {pillar.number}
                </span>

                <h2
                  id={`${pillar.id}-heading`}
                  className="text-2xl md:text-3xl text-foreground leading-snug"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  {pillar.title}
                </h2>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">
                    Best suited for
                  </p>
                  <ul className="flex flex-wrap gap-2 list-none m-0 p-0" role="list">
                    {pillar.for.map((org) => (
                      <li key={org}>
                        <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                          {org}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ── Right col: outcome + bullets ──────────────────────── */}
              <div>
                <div className="mb-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    What you gain
                  </p>
                  <p
                    className="text-xl md:text-2xl text-foreground leading-snug font-semibold"
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  >
                    {pillar.outcome}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                    What's included
                  </p>
                  <ul className="space-y-3 list-none m-0 p-0" role="list">
                    {pillar.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span
                          className="mt-[0.45em] flex-none text-sm leading-none font-bold"
                          style={{ color: "var(--bloom)" }}
                          aria-hidden="true"
                        >
                          —
                        </span>
                        <span className="text-base text-foreground leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </section>
        ))}
      </div>

      {/* ── FAQ (Hover-expandable) ───────────────────────────────────────── */}
      <section
        aria-labelledby="faq-heading"
        className="px-6 py-20 border-t border-border"
      >
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h2
              id="faq-heading"
              className="text-3xl md:text-4xl text-foreground mb-3"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Common questions
            </h2>
            <p className="text-base text-muted-foreground">
              Things people usually ask before we start a conversation.
            </p>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {faqItems.map((item, index) => {
              const isOpen = activeFaqIndex === index;
              return (
                <div
                  key={index}
                  className="py-6 transition-colors group cursor-pointer"
                  onMouseEnter={() => setActiveFaqIndex(index)}
                  onMouseLeave={() => setActiveFaqIndex(null)}
                  onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3
                      className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-snug"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      {item.q}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-primary" : "group-hover:translate-y-0.5"
                      }`}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 text-base text-muted-foreground leading-relaxed max-w-[70ch] ${
                      isOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
                    }`}
                  >
                    <div>{item.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Single CTA ────────────────────────────────────────────────── */}
      <section
        aria-labelledby="cta-heading"
        className="px-6 py-20 border-t border-border"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="reveal max-w-5xl mx-auto grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <h2
              id="cta-heading"
              className="text-3xl md:text-4xl text-foreground mb-3"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Ready to work together?
            </h2>
            <p className="text-base text-muted-foreground max-w-[52ch] leading-relaxed">
              Every engagement starts with a conversation. Tell me what you're
              working on — I'll tell you honestly whether and how I can help.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-flex items-center px-9 py-4 rounded-md bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors whitespace-nowrap self-center"
          >
            Partner with me
          </Link>
        </div>
      </section>

    </div>
  );
}
