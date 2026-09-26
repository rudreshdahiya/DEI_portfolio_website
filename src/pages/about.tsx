import { useState } from "react";
import { Link } from "react-router";
import { Sparkles, Bot, HelpCircle, CheckCircle2, X } from "lucide-react";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";
import { useRevealAll } from "@/hooks/use-reveal-all";

// ── Ask AI widget ─────────────────────────────────────────────────────────────

const LLMS_URL = "https://pratik-aggarwal-website.vercel.app/llms.txt";
const DEFAULT_Q = "Tell me about Pratik Aggarwal and his work";

interface FAQOption {
  id: string;
  label: string;
  question: string;
  answer: string;
}

const PRESET_FAQS: FAQOption[] = [
  {
    id: "services",
    label: "Core Services",
    question: "What core services & consulting does Pratik offer?",
    answer: "Pratik offers 4 main pillars: (1) Interactive Training & Capacity Building for leadership and staff; (2) Institutional Advisory for disability-inclusive policies & accessibility; (3) Keynote Speaking & University Lectures on invisible disability; and (4) Research, Grant Writing & Accessible Communication.",
  },
  {
    id: "invisible-disability",
    label: "Invisible Disability",
    question: "What is invisible disability advocacy?",
    answer: "Invisible disability advocacy addresses conditions not immediately apparent visually (e.g. chronic illness, pain conditions, neurodivergence). Pratik leverages lived authority to transform institutional policies, workplace accommodations, and social perceptions beyond physical mobility frameworks.",
  },
  {
    id: "trainings",
    label: "Capacity Building",
    question: "How does Pratik conduct capacity building workshops?",
    answer: "Pratik delivers interactive, practical training across organizational levels — from C-suite leadership and HR teams to frontline community workers. Topics include disability etiquette, RPwD Act compliance, inclusive communication, and early intervention.",
  },
  {
    id: "speaking",
    label: "Keynotes & Talks",
    question: "What keynote topics does Pratik present on?",
    answer: "Pratik delivers keynotes on 'Invisible Disability & Lived Authority', 'Intersectional DEI in Practice', 'Designing Sensory & Accessible Public Spaces', and 'De-stigmatizing Chronic Conditions'. He has spoken at global conferences like ARNEC Manila and top institutions like IIT Delhi.",
  },
  {
    id: "research",
    label: "Research & Writing",
    question: "What research, policy, and grant writing work does Pratik do?",
    answer: "Pratik supports NGOs and foundations with grant proposals, donor reporting, state policy roundtables (e.g. Chhattisgarh Disability Policy), disaster risk reduction frameworks (NDMA & UN India), and accessible digital publications.",
  },
];

function AskAI() {
  const [question, setQuestion] = useState("");
  const [activeFaq, setActiveFaq] = useState<FAQOption | null>(null);

  const buildUrl = (base: string, customQ?: string) => {
    const q = (customQ || question).trim() || DEFAULT_Q;
    const prompt = `${q}. Use this document for context: ${LLMS_URL}`;
    return `${base}?q=${encodeURIComponent(prompt)}`;
  };

  const handleSelectFaq = (faq: FAQOption) => {
    if (activeFaq?.id === faq.id) {
      setActiveFaq(null);
      setQuestion("");
    } else {
      setActiveFaq(faq);
      setQuestion(faq.question);
    }
  };

  return (
    <div className="mt-8 space-y-4 max-w-[62ch]">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-widest text-plum flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-plum" />
          Ask AI About Pratik
        </p>
        <span className="text-[11px] font-medium text-muted-foreground hidden sm:inline-block">
          Select a question or type your own
        </span>
      </div>

      {/* Preset Question Pills */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Frequently Asked Questions (Click to Ask):
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Preset AI Questions">
          {PRESET_FAQS.map((faq) => {
            const isSelected = activeFaq?.id === faq.id;
            return (
              <button
                key={faq.id}
                type="button"
                onClick={() => handleSelectFaq(faq)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-plum text-white border-plum shadow-xs scale-[1.02]"
                    : "bg-card text-foreground border-border hover:border-plum/40 hover:bg-plum/5"
                }`}
              >
                <HelpCircle className={`w-3 h-3 ${isSelected ? "text-white" : "text-plum"}`} />
                <span>{faq.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input Box */}
      <div
        className="flex items-center rounded-xl border border-border bg-card overflow-hidden transition-all focus-within:border-plum focus-within:ring-2 focus-within:ring-plum/20"
        style={{ boxShadow: "0 1px 3px rgba(30,26,36,0.06)" }}
      >
        <label htmlFor="ask-ai-question" className="sr-only">
          Your question about Pratik
        </label>
        <input
          id="ask-ai-question"
          type="text"
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            if (activeFaq && e.target.value !== activeFaq.question) {
              setActiveFaq(null);
            }
          }}
          placeholder="e.g. What is Pratik's approach to disability inclusion?"
          className="flex-1 bg-transparent px-4 py-3 text-xs sm:text-sm outline-none text-foreground placeholder:text-muted-foreground"
          onKeyDown={(e) => {
            if (e.key === "Enter" && question.trim()) {
              window.open(buildUrl("https://claude.ai/new"), "_blank", "noopener,noreferrer");
            }
          }}
        />
        {question && (
          <button
            type="button"
            onClick={() => {
              setQuestion("");
              setActiveFaq(null);
            }}
            className="px-3 text-muted-foreground hover:text-foreground text-xs"
            aria-label="Clear question"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Instant Answer Box (when a preset FAQ pill is selected) */}
      {activeFaq && (
        <div className="p-4 rounded-xl border border-plum/30 bg-plum/5 space-y-2.5 transition-all">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-plum flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-plum" />
              Quick Answer:
            </span>
            <button
              type="button"
              onClick={() => {
                setActiveFaq(null);
                setQuestion("");
              }}
              className="text-[11px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Close
            </button>
          </div>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            {activeFaq.answer}
          </p>
          <div className="pt-1 flex items-center gap-2">
            <span className="text-[11px] font-medium text-muted-foreground">Need deeper analysis?</span>
            <a
              href={buildUrl("https://claude.ai/new", activeFaq.question)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-plum hover:underline inline-flex items-center gap-1"
            >
              Ask Claude for full report →
            </a>
          </div>
        </div>
      )}

      {/* Action Buttons for AI queries */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <a
          href={buildUrl("https://claude.ai/new")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 shadow-2xs"
          style={{ backgroundColor: "var(--plum)" }}
        >
          <Bot className="w-3.5 h-3.5 text-white" />
          Ask Claude →
          <span className="sr-only">(opens in new tab)</span>
        </a>
        <a
          href={buildUrl("https://chat.openai.com")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-xs font-semibold text-foreground transition-all hover:border-plum/40 hover:bg-muted"
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
              src="/images/Pratik%20Pictures/Award%20by%20Jai%20vakeel%20foundation%20to%20ASTHA/8K7A4285%20(1).JPG"
              alt="Pratik Aggarwal receiving Jai Vakeel Foundation Award for ASTHA"
              caption="Pratik Aggarwal — Executive Director at ASTHA receiving organizational leadership recognition."
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
              caption="Pratik Aggarwal — founder of Blooming in Pain, opening national pain art exhibition at Purple Fest Goa."
              aspectRatio="16/9"
              size="contained"
            />
          </section>

          {/* ── Non-Repeating Fieldwork Photography Archive Grid ─────────────── */}
          <section aria-label="Fieldwork photography archive" className="pt-6 border-t border-border/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-plum">Archive Gallery</p>
                <h3 className="text-xl font-serif font-bold text-foreground" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                  Field Engagements &amp; Community Advocacy
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-xs group bg-muted/40">
                <img
                  src="/images/Pratik%20Pictures/Sensory%20Park%20Safdarjung/DSCF6747%20(1).JPG"
                  alt="Safdarjung Hospital Umang Vatika Sensory Garden"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex items-end">
                  <span className="text-[10px] text-white font-medium">Umang Vatika Sensory Garden</span>
                </div>
              </div>

              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-xs group bg-muted/40">
                <img
                  src="/images/Pratik%20Pictures/RPWD%20Workshop%20for%20People%20with%20Disabilities/WhatsApp%20Image%202026-08-24%20at%202.03.24%20PM%20(1).jpeg"
                  alt="RPwD Act Rights Workshop"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex items-end">
                  <span className="text-[10px] text-white font-medium">RPwD Rights Training</span>
                </div>
              </div>

              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-xs group bg-muted/40">
                <img
                  src="/images/Pratik%20Pictures/Kirori%20Mal%20College,%20DU,%20Panelist/KMC%20DU%20event%202.jpg"
                  alt="Kirori Mal College Delhi University Seminar"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex items-end">
                  <span className="text-[10px] text-white font-medium">Academic Seminar DU</span>
                </div>
              </div>

              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-xs group bg-muted/40">
                <img
                  src="/images/Pratik%20Pictures/Disasters%20and%20Disability/IMGL3083.JPG"
                  alt="Disaster Risk Reduction and Disability Policy Dialogue"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex items-end">
                  <span className="text-[10px] text-white font-medium">Disaster Policy Dialogue</span>
                </div>
              </div>
            </div>
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
