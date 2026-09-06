import { useState } from "react";
import { Link } from "react-router";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";
import { useRevealAll } from "@/hooks/use-reveal-all";

// ── Ask AI widget ─────────────────────────────────────────────────────────────

const LLMS_URL = "https://pratik-aggarwal-website.vercel.app/llms.txt";
const DEFAULT_Q = "Tell me about Pratik Aggarwal and his work";

function AskAI() {
  const [question, setQuestion] = useState("");

  const buildUrl = (base: string) => {
    const q = question.trim() || DEFAULT_Q;
    const prompt = `${q}. Use this document for context: ${LLMS_URL}`;
    return `${base}?q=${encodeURIComponent(prompt)}`;
  };

  return (
    <div className="mt-7" style={{ maxWidth: "52ch" }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--muted-text)" }}>
        Ask an AI about Pratik
      </p>
      <div
        className="flex items-center rounded-xl border border-border bg-card overflow-hidden"
        style={{ boxShadow: "0 1px 3px rgba(30,26,36,0.06)" }}
      >
        <label htmlFor="ask-ai-question" className="sr-only">
          Your question about Pratik
        </label>
        <input
          id="ask-ai-question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What does Pratik work on?"
          className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
          style={{
            color: "var(--ink)",
            fontFamily: "'Public Sans', system-ui, sans-serif",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && question.trim()) {
              window.open(buildUrl("https://claude.ai/new"), "_blank", "noopener,noreferrer");
            }
          }}
        />
      </div>
      <div className="flex flex-wrap gap-2.5 mt-2.5">
        <a
          href={buildUrl("https://claude.ai/new")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setQuestion("")}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
          style={{
            backgroundColor: "var(--plum)",
            color: "#ffffff",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4A2246")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--plum)")}
        >
          Ask Claude →
          <span className="sr-only">(opens in new tab)</span>
        </a>
        <a
          href={buildUrl("https://chat.openai.com")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setQuestion("")}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-xs font-semibold transition-colors hover:border-primary/50"
          style={{ color: "var(--ink)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--plum)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink)")}
        >
          Ask ChatGPT →
          <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>
    </div>
  );
}

// ── Reusable pull-quote ───────────────────────────────────────────────────────

function PullQuote({
  children,
  accent = "teal",
}: {
  children: React.ReactNode;
  accent?: "teal" | "plum";
}) {
  const color = accent === "teal" ? "var(--sage)" : "var(--plum)";
  return (
    <blockquote
      className="reveal my-14 pl-7 border-l-4"
      style={{ borderColor: color }}
    >
      <p
        className="text-2xl md:text-3xl text-foreground italic leading-relaxed"
        style={{ fontFamily: "'Fraunces', Georgia, serif" }}
      >
        {children}
      </p>
    </blockquote>
  );
}

// ── Reusable portrait placeholder ─────────────────────────────────────────────

function Portrait({
  src,
  alt,
  caption,
  aspectRatio = "16/7",
  size = "full",
}: {
  src?: string;
  alt: string;
  caption: string;
  aspectRatio?: string;
  size?: "full" | "contained";
}) {
  return (
    <figure className={`my-14 ${size === "contained" ? "max-w-[480px] mx-auto" : "-mx-4 md:-mx-12"}`}>
      <div
        className="relative w-full rounded-xl overflow-hidden bg-muted"
        style={{ aspectRatio }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-sm italic px-6 text-center"
            style={{
              background:
                "linear-gradient(140deg, #EDE9EF 0%, #D8D0DC 55%, #C8BDD2 100%)",
              color: "rgba(30,26,36,0.2)",
            }}
            aria-label={alt}
            role="img"
          >
            [{alt}]
          </div>
        )}
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground text-center italic">
        {caption}
      </figcaption>
    </figure>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function About() {
  useRevealAll();
  return (
    <article aria-labelledby="about-heading">
      <PageMeta
        title="About Pratik Aggarwal"
        description="Pratik Aggarwal has fibromyalgia and 9+ years of experience in disability inclusion. Learn how lived experience shapes his work with organisations, governments, and communities."
        path="/about"
        keywords="who is Pratik Aggarwal, fibromyalgia advocate India, invisible disability expert, ASTHA director, disability storyteller"
      />
      <JsonLd schema={[
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pratik-aggarwal-website.vercel.app" },
            { "@type": "ListItem", "position": 2, "name": "About", "item": "https://pratik-aggarwal-website.vercel.app/about" }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": "https://pratik-aggarwal-website.vercel.app/#pratik-aggarwal",
          "name": "Pratik Aggarwal",
          "url": "https://pratik-aggarwal-website.vercel.app/about",
          "jobTitle": "Disability Inclusion Expert, Speaker & Director",
          "description": "Pratik Aggarwal is a disability inclusion expert and storyteller based in New Delhi, India. He lives with fibromyalgia — a chronic invisible disability — and has spent over nine years working at the intersection of disability, public policy, community development, and storytelling. He is Director of ASTHA, a non-profit working with children with disabilities in Delhi's urban informal settlements, and founder of Blooming in Pain, a storytelling platform for people living with invisible disabilities.",
          "hasCredential": [
            {
              "@type": "EducationalOccupationalCredential",
              "name": "Published in The Journal of Pain — on invisible chronic pain, healthcare access, and the politics of medical legitimacy"
            },
            {
              "@type": "EducationalOccupationalCredential",
              "name": "Op-Ed in The Telegraph — on disability, identity, and the language we use to talk about bodies that don't conform"
            }
          ],
          "worksFor": {
            "@type": "Organization",
            "@id": "https://pratik-aggarwal-website.vercel.app/#astha",
            "name": "ASTHA",
            "url": "https://asthaindia.in"
          },
          "knowsAbout": [
            "Fibromyalgia", "Invisible disabilities", "Chronic illness", "Disability inclusion",
            "Disability sensitization", "Inclusive development", "Public policy",
            "Community storytelling", "Child disability rights", "Accessibility",
            "DEI", "Rights of Persons with Disabilities Act 2016", "Social model of disability",
            "Intersectionality of disability, poverty, and gender"
          ],
          "address": { "@type": "PostalAddress", "addressLocality": "New Delhi", "addressCountry": "IN" },
          "sameAs": [
            "https://linkedin.com/in/pratikaggarwal",
            "https://instagram.com/bloominginpain",
            "https://medium.com/@BloomingInPain",
            "https://asthaindia.in"
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://pratik-aggarwal-website.vercel.app/#astha",
          "name": "ASTHA",
          "url": "https://asthaindia.in",
          "description": "ASTHA is a New Delhi-based non-profit organisation working with children with disabilities in urban informal settlements. Pratik Aggarwal serves as its Director.",
          "areaServed": { "@type": "City", "name": "New Delhi" },
          "founder": { "@type": "Person", "name": "ASTHA founding team" },
          "employee": { "@id": "https://pratik-aggarwal-website.vercel.app/#pratik-aggarwal" }
        }
      ]} />

      {/* ── Page header ───────────────────────────────────────────────── */}
      <header className="px-6 pt-20 pb-14 border-b border-border">
        <div className="max-w-[70ch] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
            About Pratik
          </p>
          <h1
            id="about-heading"
            className="text-5xl md:text-6xl text-foreground mb-5 tracking-tight"
            style={{ fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.07 }}
          >
            Practice &amp; Story
          </h1>
          <p className="text-lg text-muted-foreground max-w-[52ch] leading-relaxed">
            Working at the intersection of disability rights, accessibility, community engagement, public policy, and storytelling to build practices beyond compliance.
          </p>

          <AskAI />
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="px-6 py-16">
        <div className="max-w-[70ch] mx-auto">

          {/* ── 1. Lead: Professional Practice & Skills ───────────────── */}
          <section aria-label="Professional practice and skills in disability inclusion">
            <div className="space-y-6 text-lg text-foreground leading-relaxed">
              <p>
                Pratik Aggarwal works at the intersection of disability, inclusion, accessibility, communication, and social change. His work brings together <span data-key-info>lived experience, community engagement, research, advocacy, facilitation, and storytelling</span> to help organisations understand disability beyond compliance and build more meaningful, accessible, and inclusive practices.
              </p>
              <p>
                For over nine years, he has led field-based programmes, policy reviews, and institutional training. <span data-key-info>As Director of ASTHA — a Delhi-based organisation working with children with disabilities in urban informal settlements</span> — he works face-to-face with disability in its most unprotected forms: in homes without reliable sanitation, in families navigating multi-layered crises, and in systems unprepared to provide accessible care.
              </p>
              <p>
                His work spans consultancy, corporate DEI and disability training, NGO capacity building, government advisory, and spatial accessibility. Notably, he co-created <span className="font-semibold">Umang Vatika</span> at Safdarjung Hospital, North India's first government sensory garden designed for neurodivergent children, and led disability rights advocacy following emergency crisis events like the Delhi <em>Viklang Basti</em> fire.
              </p>
            </div>

            <PullQuote accent="teal">
              "Inclusion isn't a checklist slide or a policy clause. It is the unromanticised, daily commitment to building spaces that honour lived complexity."
            </PullQuote>
          </section>

          <Portrait
            src="/images/work-engagements_1.jpeg"
            alt="Pratik Aggarwal conducting disability inclusion workshop"
            caption="Pratik Aggarwal — facilitating community-based disability training and capacity-building workshops."
            aspectRatio="16/9"
          />

          {/* ── 2. Lived Authority & Fibromyalgia Narrative ─────────────── */}
          <section aria-label="Lived authority and personal origin story">
            <div className="space-y-6 text-lg text-foreground leading-relaxed">
              <h2 className="text-2xl font-serif text-foreground mt-8 mb-4" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                Lived Authority &amp; Invisible Disability
              </h2>
              <p>
                Running alongside his professional practice is his own lived reality: <span data-key-info>Pratik has fibromyalgia, a chronic condition characterised by widespread pain, fatigue, and cognitive difficulty that leaves no visible trace</span> on medical scans or routine charts.
              </p>
              <p>
                What he learned through years of diagnostic uncertainty and medical disbelief was the grinding exhaustion of proof — the constant requirement to justify your body's reality to doctors, employers, and social institutions. Pain, he realised, is socially acceptable primarily when it is legible. When it isn't, society defaults to doubt.
              </p>
              <p>
                Rather than treating his condition as a separate private struggle, <span data-key-info>Pratik turned that lived reality into the cornerstone of his work</span>. It provides an unromanticised understanding of what it costs to be disabled in an inaccessible world, and a deep impatience with inclusion efforts that stay comfortable.
              </p>
            </div>

            <PullQuote accent="plum">
              "Nine years ago, I decided that what I live with every day could become the most useful thing I offer."
            </PullQuote>
          </section>

          <Portrait
            src="/images/pratik-about-page.jpeg"
            alt="Portrait photograph of Pratik Aggarwal"
            caption="Pratik Aggarwal — disability inclusion expert, researcher, and founder of Blooming in Pain."
            aspectRatio="3/2"
            size="contained"
          />

          {/* ── 3. Storytelling & Blooming in Pain ──────────────────────── */}
          <section aria-label="Storytelling and Blooming in Pain platform">
            <div className="space-y-6 text-lg text-foreground leading-relaxed">
              <h2 className="text-2xl font-serif text-foreground mt-8 mb-4" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                Blooming in Pain
              </h2>
              <p>
                In 2021, <span data-key-info>Pratik founded <em>Blooming in Pain</em>, a storytelling platform dedicated to people living with invisible chronic illnesses and disabilities</span> — fibromyalgia, endometriosis, lupus, chronic fatigue, and psychosocial conditions.
              </p>
              <p>
                The platform was born out of a simple gap: the absence of honest, un-sanitised stories about living with persistent illness without falling into dramatic overcoming tropes or tragedy arcs. Today, Blooming in Pain serves as a vital community space where lived accounts are documented, shared, and believed.
              </p>
            </div>
          </section>

          {/* ── 4. Credibility (understated) ──────────────────────────── */}
          <section aria-label="Roles, publications, and affiliations">
            <div className="reveal border-t border-b border-border py-9 my-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
                Roles &amp; publications
              </p>
              <ul className="space-y-4 list-none m-0 p-0">
                <li className="text-base text-foreground leading-snug">
                  Director,{" "}
                  <a
                    href="https://asthaindia.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                  >
                    ASTHA
                    <span className="sr-only">(opens in new tab)</span>
                  </a>{" "}
                  <span className="text-muted-foreground">
                    — non-profit working with children with disabilities in
                    Delhi's urban informal settlements
                  </span>
                </li>
                <li className="text-base text-foreground leading-snug">
                  Co-creator of <span className="font-semibold">Umang Vatika</span>{" "}
                  <span className="text-muted-foreground">
                    — North India’s first government sensory garden for children with disabilities at Safdarjung Hospital, featured in{" "}
                    <a href="https://thebetterindia.com/innovation/umang-vatika-safdarjung-hospital-delhi-sensory-park-children-disabilities-astha-11168102" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-primary font-medium">The Better India</a>,{" "}
                    <a href="https://indianexpress.com/article/cities/delhi/from-visual-art-installations-to-mud-pits-sensory-garden-for-neurodivergent-children-opens-at-delhis-safdarjung-hospital-10461086/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-primary font-medium">The Indian Express</a>, and{" "}
                    <a href="https://ddnews.gov.in/inauguration-of-umang-vatika-at-vmmc-and-safdarjung-hospital-the-first-government-sensory-garden-in-north-india/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-primary font-medium">DD News</a>.
                  </span>
                </li>
                <li className="text-base text-foreground leading-snug">
                  Author in{" "}
                  <cite className="not-italic font-semibold">
                    <a href="https://samuhikpahal.org/reflections-and-opinions/thirty-years-of-working-with-communities/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-primary font-medium">Samuhik Pahal</a>
                  </cite>{" "}
                  <span className="text-muted-foreground">
                    — "Thirty years of working with communities: Reflections and Opinions" on community-led rights advocacy.
                  </span>
                </li>
                <li className="text-base text-foreground leading-snug">
                  Featured & Quoted Expert in National Media{" "}
                  <span className="text-muted-foreground">
                    — including ground reporting in{" "}
                    <a href="https://theprint.in/ground-reports/delhis-viklang-basti-lost-fire-fought-new-wheelchairs/2971119/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-primary font-medium">The Print</a> (Viklang Basti fire advocacy),{" "}
                    <a href="https://www.outlookindia.com/national/indias-persons-with-disabilities-left-out-as-nfhs-6-fact-sheets-omit-disability-data" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-primary font-medium">Outlook India</a> (NFHS-6 policy analysis),{" "}
                    <a href="https://timesofindia.indiatimes.com/city/delhi/out-of-sight-out-of-support-disability-care-lags-in-delhis-slums-in-most-trying-of-times/articleshow/122526141.cms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-primary font-medium">Times of India</a>, and{" "}
                    <a href="https://citizenmatters.in/most-urban-schools-violate-law-exclude-children-with-disabilities/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-primary font-medium">Citizen Matters</a>.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* ── 5. Soft CTA ───────────────────────────────────────────── */}
          <section aria-label="Read more or work together">
            <p className="reveal text-lg text-muted-foreground mb-9 max-w-[58ch] leading-relaxed">
              If any of this resonates — whether you live with an invisible
              disability, work in inclusion, or simply want to understand the
              experience better — there's a place for you here.
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <Link
                to="/blooming-in-pain"
                className="inline-flex items-center px-7 py-3.5 rounded-md font-semibold text-base text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--plum)" }}
              >
                Read more stories
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center px-7 py-3.5 rounded-md bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors"
              >
                Work with me
              </Link>
            </div>
          </section>

        </div>
      </div>
    </article>
  );
}
