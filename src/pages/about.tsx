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
      className="reveal my-10 pl-6 border-l-4"
      style={{ borderColor: color }}
    >
      <p
        className="text-xl md:text-2xl text-foreground italic leading-relaxed"
        style={{ fontFamily: "'Fraunces', Georgia, serif" }}
      >
        {children}
      </p>
    </blockquote>
  );
}

// ── Reusable portrait ─────────────────────────────────────────────────────────

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
    <figure className={`my-10 ${size === "contained" ? "max-w-[480px] mx-auto" : "-mx-4 md:-mx-8"}`}>
      <div
        className="relative w-full rounded-xl overflow-hidden bg-muted border border-border shadow-xs"
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
      <figcaption className="mt-2.5 text-xs text-muted-foreground text-center italic">
        {caption}
      </figcaption>
    </figure>
  );
}

// ── Page Component ───────────────────────────────────────────────────────────

export default function About() {
  useRevealAll();

  return (
    <article aria-labelledby="about-heading">
      <PageMeta
        title="About Pratik Aggarwal — Practice & Story"
        description="Pratik Aggarwal is Executive Director at ASTHA and founder of Blooming in Pain. Discover his professional practice in disability rights alongside his lived experience."
        path="/about"
        keywords="who is Pratik Aggarwal, fibromyalgia advocate India, invisible disability expert, Executive Director ASTHA, disability storyteller, Blooming in Pain"
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
          "jobTitle": "Executive Director, ASTHA & Disability Inclusion Expert",
          "description": "Pratik Aggarwal is a disability inclusion practitioner, Executive Director at ASTHA, and founder of Blooming in Pain.",
          "worksFor": {
            "@type": "Organization",
            "@id": "https://pratik-aggarwal-website.vercel.app/#astha",
            "name": "ASTHA",
            "url": "https://asthaindia.in"
          }
        }
      ]} />

      {/* ── Page Header ───────────────────────────────────────────────── */}
      <header className="px-6 pt-16 pb-12 border-b border-border bg-card/30">
        <div className="max-w-[70ch] mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-plum mb-3">
            Practice &amp; Story
          </p>
          <h1
            id="about-heading"
            className="text-4xl md:text-6xl text-foreground mb-4 tracking-tight font-serif"
            style={{ fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.07 }}
          >
            Professional Practice &amp; Lived Experience
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-[54ch] leading-relaxed font-normal">
            Bringing together grassroots leadership, disability rights, public policy, and lived authority to build inclusion systems that work in practice.
          </p>

          <AskAI />
        </div>
      </header>

      {/* ── Main Narrative Body (2 Strong Consolidated Sections) ───────── */}
      <div className="px-6 py-14">
        <div className="max-w-[70ch] mx-auto space-y-12">

          {/* ── SECTION 1: Practice / Professional Story ───────────────────── */}
          <section aria-label="Section 1: Practice and Professional Story" className="space-y-6">
            <div className="border-b border-border/80 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-plum block mb-1">
                Section 1
              </span>
              <h2
                className="text-2xl md:text-3xl font-serif text-foreground"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Practice &amp; Professional Leadership
              </h2>
            </div>

            <div className="space-y-5 text-base md:text-lg text-foreground/90 leading-relaxed font-normal">
              <p>
                Pratik Aggarwal is a <span data-key-info>disability inclusion practitioner and organisational leader</span> working across disability rights, community-based systems, early intervention, inclusive education, accessibility, and public policy. For over a decade, his work has been rooted in communities — particularly with children with disabilities and their families in Delhi’s urban informal settlements.
              </p>

              <p>
                <span data-key-info>As Executive Director of ASTHA</span>, he has led the organisation through a period of significant growth, while developing programmes, teams, partnerships, and systems that enable community-based approaches to reach more children and families. His experience spans early childhood development, family and community strengthening, inclusive education, frontline health systems, disability advocacy, and programme design. He has also worked on initiatives bringing together health, rehabilitation, and disability services, and has contributed to the development of inclusive public spaces and institutional practices — including co-creating <span className="font-semibold text-foreground">Umang Vatika</span>, North India’s first government sensory garden at Safdarjung Hospital.
              </p>

              <p>
                Alongside his field and organisational work, Pratik advises organisations and emerging leaders working in disability, health, education, child development, and social change. He brings a combination of <span data-key-info>grassroots experience, social work and public health training, quantitative skills, programme leadership, and practical experience</span> of building and scaling a social-impact organisation. His consultancy work includes disability inclusion, accessibility, programme development, organisational strengthening, training, research, and strategy. He is particularly interested in helping organisations move from good ideas and small pilots towards stronger systems, sustainable programmes, and meaningful scale.
              </p>
            </div>

            <PullQuote accent="teal">
              "Inclusion isn't a checklist slide or a policy clause. It is the unromanticised, daily commitment to building systems that honour lived complexity and community rights."
            </PullQuote>

            <Portrait
              src="/images/Pratik%20Pictures/RPWD%20Workshop%20for%20People%20with%20Disabilities/WhatsApp%20Image%202026-08-24%20at%202.03.24%20PM%20(1).jpeg"
              alt="Pratik Aggarwal facilitating RPwD Act disability inclusion workshop"
              caption="Pratik Aggarwal — facilitating community-based disability rights training and capacity-building workshops."
              aspectRatio="16/9"
            />
          </section>

          {/* ── SECTION 2: Lived Experience & Blooming in Pain ─────────────── */}
          <section aria-label="Section 2: Lived Experience and Blooming in Pain" className="space-y-6 pt-4 border-t border-border/80">
            <div className="border-b border-border/80 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-plum block mb-1">
                Section 2
              </span>
              <h2
                className="text-2xl md:text-3xl font-serif text-foreground"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Lived Experience &amp; Blooming in Pain
              </h2>
            </div>

            <div className="space-y-5 text-base md:text-lg text-foreground/90 leading-relaxed font-normal">
              <p>
                Alongside his professional work, Pratik brings the <span data-key-info>lived experience of fibromyalgia</span> — a chronic condition involving widespread pain, fatigue, and cognitive difficulties. Years of diagnostic uncertainty and having to repeatedly explain and prove his experience of pain shaped his understanding of how quickly invisible disability can be met with doubt when it cannot be seen or easily measured.
              </p>

              <p>
                Rather than keeping this experience separate from his professional practice, he has used it to <span data-key-info>deepen his understanding of accessibility, disability, and the everyday realities of living in an inaccessible world</span>.
              </p>

              <p>
                In 2021, he founded <em className="font-serif italic font-semibold text-plum">Blooming in Pain</em>, a storytelling platform for people living with invisible chronic illnesses and disabilities, including fibromyalgia, endometriosis, lupus, chronic fatigue, and psychosocial disabilities. The platform grew from a gap he experienced himself: the lack of honest stories about living with persistent illness without reducing people to either tragedy or stories of overcoming.
              </p>

              <p>
                Blooming in Pain creates space for people to share the complexity of illness, identity, relationships, work, and everyday life, and to have experiences that are often invisible recognised and believed.
              </p>
            </div>

            <PullQuote accent="plum">
              "Establishing lived experience and professional authority as one connected story — creating space where people are believed without having to justify their pain."
            </PullQuote>

            <Portrait
              src="/images/Pratik%20Pictures/BloomingInPain/IMG_9605.jpeg"
              alt="Pratik Aggarwal at Blooming in Pain National Art Exhibition"
              caption="Pratik Aggarwal — Executive Director at ASTHA, researcher, and founder of Blooming in Pain."
              aspectRatio="16/9"
              size="contained"
            />
          </section>

          {/* ── Roles & Publications Section ────────────────────────────────── */}
          <section aria-label="Roles and publications" className="reveal border-t border-b border-border py-8 my-8 bg-card/30 p-6 rounded-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-plum mb-5">
              Roles &amp; Publications
            </p>
            <ul className="space-y-4 list-none m-0 p-0 text-sm md:text-base">
              <li className="text-foreground leading-snug">
                <strong className="font-bold text-foreground">Executive Director, ASTHA</strong>{" "}
                <a
                  href="https://asthaindia.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-plum underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  (ASTHA website)
                  <span className="sr-only">(opens in new tab)</span>
                </a>{" "}
                <span className="text-muted-foreground block text-xs md:text-sm mt-0.5">
                  — non-profit working with children with disabilities in Delhi's urban informal settlements
                </span>
              </li>

              <li className="text-foreground leading-snug">
                <strong className="font-bold text-foreground">Co-creator of Umang Vatika</strong>{" "}
                <span className="text-muted-foreground block text-xs md:text-sm mt-0.5">
                  — North India’s first government sensory garden for children with disabilities at Safdarjung Hospital, featured in{" "}
                  <a href="https://thebetterindia.com/innovation/umang-vatika-safdarjung-hospital-delhi-sensory-park-children-disabilities-astha-11168102" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-plum font-medium">The Better India</a>,{" "}
                  <a href="https://indianexpress.com/article/cities/delhi/from-visual-art-installations-to-mud-pits-sensory-garden-for-neurodivergent-children-opens-at-delhis-safdarjung-hospital-10461086/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-plum font-medium">The Indian Express</a>, and{" "}
                  <a href="https://ddnews.gov.in/inauguration-of-umang-vatika-at-vmmc-and-safdarjung-hospital-the-first-government-sensory-garden-in-north-india/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-plum font-medium">DD News</a>.
                </span>
              </li>

              <li className="text-foreground leading-snug">
                <strong className="font-bold text-foreground">Contributing Editor, Samuhik Pahal</strong>{" "}
                <span className="text-muted-foreground block text-xs md:text-sm mt-0.5">
                  — Author of <cite className="not-italic font-semibold text-foreground">"Thirty years of working with communities: Reflections and Opinions"</cite> on community-led rights advocacy in{" "}
                  <a href="https://samuhikpahal.org/reflections-and-opinions/thirty-years-of-working-with-communities/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-plum font-medium">Samuhik Pahal</a>.
                </span>
              </li>

              <li className="text-foreground leading-snug">
                <strong className="font-bold text-foreground">Featured &amp; Quoted Expert in National Media</strong>{" "}
                <span className="text-muted-foreground block text-xs md:text-sm mt-0.5">
                  — including ground reporting in{" "}
                  <a href="https://theprint.in/ground-reports/delhis-viklang-basti-lost-fire-fought-new-wheelchairs/2971119/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-plum font-medium">The Print</a> (Viklang Basti fire advocacy),{" "}
                  <a href="https://www.outlookindia.com/national/indias-persons-with-disabilities-left-out-as-nfhs-6-fact-sheets-omit-disability-data" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-plum font-medium">Outlook India</a> (NFHS-6 policy analysis),{" "}
                  <a href="https://timesofindia.indiatimes.com/city/delhi/out-of-sight-out-of-support-disability-care-lags-in-delhis-slums-in-most-trying-of-times/articleshow/122526141.cms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-plum font-medium">Times of India</a>, and{" "}
                  <a href="https://citizenmatters.in/most-urban-schools-violate-law-exclude-children-with-disabilities/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-plum font-medium">Citizen Matters</a>.
                </span>
              </li>
            </ul>
          </section>

          {/* ── Soft Action CTAs ───────────────────────────────────────────── */}
          <section aria-label="Read more or work together" className="pt-2">
            <p className="reveal text-base md:text-lg text-muted-foreground mb-6 max-w-[58ch] leading-relaxed">
              If any of this resonates — whether you live with an invisible disability, work in inclusion, or want to build accessible practices in your organisation — let's connect.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/services"
                className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition-opacity shadow-sm"
                style={{ backgroundColor: "var(--plum)" }}
              >
                Explore Service Pillars →
              </Link>
              <Link
                to="/blooming-in-pain"
                className="inline-flex items-center px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-colors"
              >
                Read Blooming in Pain Stories
              </Link>
            </div>
          </section>

        </div>
      </div>
    </article>
  );
}
