import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router";
import { track } from "@vercel/analytics";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";
import { Building2, Users, GraduationCap, Landmark, Sparkles } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { numeric: 9, suffix: "+", label: "Years in Disability Practice" },
  { numeric: 40, suffix: "+", label: "Talks & Panels" },
  { numeric: 20, suffix: "+", label: "Partner Organisations" },
];

const orgLogos = [
  { name: "UNICEF", initials: "UN", bg: "#E8F4FA", color: "#00689D" },
  { name: "HCL Foundation", initials: "HCL", bg: "#FEF0E6", color: "#C44B00" },
  { name: "Tech Mahindra", initials: "TM", bg: "#F2EAF7", color: "#5C1F7A" },
  { name: "ASTHA", initials: "AS", bg: "#E2EDE7", color: "#1F3D2A" },
  { name: "Delhi University", initials: "DU", bg: "#E6EBF1", color: "#1B3A5B" },
  { name: "IIT Delhi", initials: "IIT", bg: "#F7E8E8", color: "#8B1A1A" },
  { name: "Safdarjung Hospital", initials: "SH", bg: "#EDE4EF", color: "#3D1E3C" },
  { name: "NDMA + UN India", initials: "ND", bg: "#E6EFF6", color: "#3D6B8F" },
  { name: "Samuhik Pahal", initials: "SP", bg: "#EBF2EA", color: "#2B5329" },
  { name: "The Print", initials: "TP", bg: "#F5F0E6", color: "#6B4B00" },
  { name: "Times of India", initials: "TOI", bg: "#F9E8E8", color: "#AA151B" },
  { name: "Outlook India", initials: "OI", bg: "#E6EBF5", color: "#003580" },
];

export type AudienceId = "corporate" | "ngo" | "advisory" | "talks";

interface AudiencePersona {
  id: AudienceId;
  label: string;
  shortLabel: string;
  badge: string;
  icon: typeof Building2;
  tagline: string;
  leadText: string;
  keyHighlights: string[];
  ctaLabel: string;
  ctaHref: string;
}

const audiencePersonas: AudiencePersona[] = [
  {
    id: "corporate",
    label: "Corporate & Foundation",
    shortLabel: "Corporate",
    badge: "Workplace Inclusion & Sensitization",
    icon: Building2,
    tagline: "Shifting Corporate Inclusion from Policy to Culture",
    leadText:
      "Helping HR leaders, corporate teams, and CSR foundations build genuine disability inclusion — moving beyond slide-deck compliance to deep workplace empathy, non-visual accessibility, and inclusive communication.",
    keyHighlights: [
      "Full & half-day corporate sensitization workshops",
      "Understanding non-visual & invisible disabilities in teams",
      "CSR strategy & inclusive programme design",
      "Executive panel talks and leadership sessions",
    ],
    ctaLabel: "Book Corporate Sensitization →",
    ctaHref: "/services#corporate",
  },
  {
    id: "ngo",
    label: "NGOs & Community",
    shortLabel: "NGOs",
    badge: "Frontline Capacity Building",
    icon: Users,
    tagline: "Equipping Frontline Teams for Meaningful Inclusion",
    leadText:
      "Providing civil society organisations and frontline teams with rights-based frameworks, training of trainers (ToT), and accessible community delivery systems to ensure disability inclusion is built into every project.",
    keyHighlights: [
      "Frontline staff capacity building & training modules",
      "Connecting communities to disability welfare schemes",
      "Inclusive education & child rights advocacy",
      "Institutional policy reviews & field mentorship",
    ],
    ctaLabel: "Explore NGO Capacity Building →",
    ctaHref: "/services#ngo",
  },
  {
    id: "advisory",
    label: "Government & Advisory",
    shortLabel: "Gov Advisory",
    badge: "Policy & Infrastructure Advisory",
    icon: Landmark,
    tagline: "Embedding Disability Reality in Infrastructure & Policy",
    leadText:
      "Advising government bodies, municipal planning authorities, hospitals, and multilateral organisations on emergency crisis advocacy, sensory infrastructure, and national health data inclusion.",
    keyHighlights: [
      "North India's 1st gov sensory garden (Umang Vatika)",
      "Disability-inclusive disaster risk reduction (NDMA + UN)",
      "Policy critiques (NFHS-6 disability data omission)",
      "Crisis response advocacy & emergency access",
    ],
    ctaLabel: "Consult on Advisory Project →",
    ctaHref: "/services#advisory",
  },
  {
    id: "talks",
    label: "Speaking & Keynotes",
    shortLabel: "Keynotes",
    badge: "Keynotes & University Lectures",
    icon: GraduationCap,
    tagline: "Challenging Conventional Disability Narratives",
    leadText:
      "Delivering compelling keynote addresses, panel interventions, and guest lectures at conferences, universities, and festivals — grounding policy and research in lived authority and disability rights.",
    keyHighlights: [
      "Keynote addresses on invisible disability & lived authority",
      "University guest lectures & student interactive workshops",
      "National conference panels (e.g. Purple Fest Goa)",
      "Media, podcast, and public dialogue facilitation",
    ],
    ctaLabel: "Invite Pratik to Speak →",
    ctaHref: "/services#talks",
  },
];

const mediaHighlights = [
  {
    outlet: "The Better India",
    category: "Sensory Garden Pioneer",
    title: "At Safdarjung Hospital, ‘Umang Vatika’ Lets Children With Disabilities Play Freely & Safely",
    description: "North India’s first government sensory garden designed for neurodivergent children in collaboration with ASTHA.",
    url: "https://thebetterindia.com/innovation/umang-vatika-safdarjung-hospital-delhi-sensory-park-children-disabilities-astha-11168102",
  },
  {
    outlet: "The Indian Express",
    category: "Sensory Garden Feature",
    title: "From visual art installations to mud pits: Sensory garden for neurodivergent children opens at Delhi’s Safdarjung Hospital",
    description: "Visual art installations, mud pits, and accessible sensory pathways in New Delhi.",
    url: "https://indianexpress.com/article/cities/delhi/from-visual-art-installations-to-mud-pits-sensory-garden-for-neurodivergent-children-opens-at-delhis-safdarjung-hospital-10461086/",
  },
  {
    outlet: "DD News",
    category: "National Broadcast",
    title: "वीएमएमसी एवं सफदरजंग अस्पताल में ‘उमंग वाटिका’ का उद्घाटन — उत्तर भारत का पहला सरकारी सेंसरी गार्डन",
    description: "DD News national television coverage on North India's first government sensory garden.",
    url: "https://ddnews.gov.in/inauguration-of-umang-vatika-at-vmmc-and-safdarjung-hospital-the-first-government-sensory-garden-in-north-india/",
  },
  {
    outlet: "The Print",
    category: "Ground Report",
    title: "How Delhi’s 'Viklang Basti' lost everything in a fire and fought to get new wheelchairs",
    description: "Field reporting on emergency crisis response, disability rights advocacy, and wheelchair access.",
    url: "https://theprint.in/ground-reports/delhis-viklang-basti-lost-fire-fought-new-wheelchairs/2971119/",
  },
  {
    outlet: "Outlook India",
    category: "Policy & Data",
    title: "India’s Persons With Disabilities Left Out As NFHS-6 Fact Sheets Omit Disability Data",
    description: "Critical commentary on systemic data omission of persons with disabilities in national health surveys.",
    url: "https://www.outlookindia.com/national/indias-persons-with-disabilities-left-out-as-nfhs-6-fact-sheets-omit-disability-data",
  },
  {
    outlet: "Times of India",
    category: "Media Quote",
    title: "Out of sight, out of support: Disability care lags in Delhi’s slums in most trying of times",
    description: "Expert opinion on informal settlement care deficits during climate and health shocks.",
    url: "https://timesofindia.indiatimes.com/city/delhi/out-of-sight-out-of-support-disability-care-lags-in-delhis-slums-in-most-trying-of-times/articleshow/122526141.cms",
  },
  {
    outlet: "Citizen Matters",
    category: "Education Rights",
    title: "Most urban schools violate law, exclude children with disabilities",
    description: "Analysis of urban school non-compliance with the Rights of Persons with Disabilities Act.",
    url: "https://citizenmatters.in/most-urban-schools-violate-law-exclude-children-with-disabilities/",
  },
  {
    outlet: "Samuhik Pahal",
    category: "Thought Leadership",
    title: "Thirty years of working with communities: Reflections and Opinions",
    description: "Reflections on 30 years of rights-based community engagement and organizational learning.",
    url: "https://samuhikpahal.org/reflections-and-opinions/thirty-years-of-working-with-communities/",
  },
];

// ── Cycling role word ─────────────────────────────────────────────────────────

const roleVariants = [
  { word: "Expert", styleClass: "text-plum font-serif font-bold italic underline decoration-plum/40 decoration-2 underline-offset-4" },
  { word: "Researcher", styleClass: "text-[#1F3D2A] bg-[#E2EDE7] px-3 py-0.5 rounded-lg font-mono text-2xl sm:text-3xl md:text-4xl shadow-2xs" },
  { word: "Speaker", styleClass: "text-[#5C1F7A] font-serif underline decoration-plum/60 decoration-wavy decoration-2" },
  { word: "Director @ ASTHA", styleClass: "text-foreground font-semibold bg-plum/10 text-plum px-3 py-0.5 rounded-full text-xl sm:text-2xl md:text-3xl" },
];

function HeroRoleWord() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      const tid = setTimeout(() => {
        setIndex((i) => (i + 1) % roleVariants.length);
        setVisible(true);
      }, 350);
      return () => clearTimeout(tid);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const current = roleVariants[index];

  return (
    <span
      aria-live="polite"
      aria-atomic="true"
      className={`inline-block transition-all duration-300 ${current.styleClass}`}
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(4px)" }}
    >
      {current.word}
    </span>
  );
}

// ── Animated count-up stat hook ───────────────────────────────────────────────

function useCountUp(target: number, duration = 3000) {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setCount(target);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          let startTs: number | null = null;
          const tick = (ts: number) => {
            if (!startTs) startTs = ts;
            const p = Math.min((ts - startTs) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, containerRef };
}

function AnimatedStat({ numeric, suffix, label }: { numeric: number; suffix: string; label: string }) {
  const { count, containerRef } = useCountUp(numeric, 3000);
  return (
    <div ref={containerRef} className="p-3.5 rounded-xl border border-border bg-card/80 shadow-2xs">
      <p
        className="text-2xl sm:text-3xl text-foreground font-extrabold mb-0.5 font-serif tabular-nums"
        aria-label={`${numeric}${suffix} ${label}`}
      >
        {count}{suffix}
      </p>
      <p className="text-[11px] text-muted-foreground leading-tight">{label}</p>
    </div>
  );
}

// ── Org logo chip & Infinite Marquee ──────────────────────────────────────────

function OrgChip({ name, initials, bg, color }: { name: string; initials: string; bg: string; color: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/60 bg-card shrink-0 select-none"
      aria-label={name}
    >
      <span
        className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold shrink-0"
        style={{ backgroundColor: bg, color }}
        aria-hidden="true"
      >
        {initials}
      </span>
      <span className="text-xs font-semibold text-foreground whitespace-nowrap">{name}</span>
    </div>
  );
}

function OrgMarquee() {
  return (
    <div className="w-full overflow-hidden relative" role="region" aria-label="Organisations Pratik has worked with">
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10"
        style={{ background: "linear-gradient(to right, var(--background), transparent)" }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10"
        style={{ background: "linear-gradient(to left, var(--background), transparent)" }}
      />
      <div className="marquee-track gap-3 py-1">
        {[...orgLogos, ...orgLogos, ...orgLogos].map((org, i) => (
          <OrgChip key={`${org.name}-${i}`} {...org} />
        ))}
      </div>
    </div>
  );
}

function MediaMarquee() {
  const marqueeItems = [...mediaHighlights, ...mediaHighlights, ...mediaHighlights];

  return (
    <div className="relative w-full overflow-hidden py-2" role="region" aria-label="National media features infinite scroll">
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-16 sm:w-28 bg-gradient-to-r from-background to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-16 sm:w-28 bg-gradient-to-l from-background to-transparent"
        aria-hidden="true"
      />

      <div className="marquee-track gap-4 py-2">
        {marqueeItems.map((item, i) => (
          <a
            key={`${item.title}-${i}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-[280px] sm:w-[320px] shrink-0 p-5 rounded-xl border border-border bg-card flex flex-col justify-between hover:border-plum/40 transition-all shadow-2xs hover:shadow-xs select-none"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider block mb-2 px-2.5 py-0.5 rounded w-fit bg-muted text-foreground">
                {item.outlet}
              </span>
              <h4 className="text-sm font-semibold text-foreground leading-snug mb-2 group-hover:text-plum transition-colors line-clamp-2">
                {item.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            </div>
            <span className="text-xs font-bold text-plum underline underline-offset-4 mt-4 block">
              Read feature →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────────

export default function Home() {
  const [selectedAudience, setSelectedAudience] = useState<AudienceId>("corporate");
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  const currentPersona = audiencePersonas.find((p) => p.id === selectedAudience) || audiencePersonas[0];

  // Auto-cycle through personas until user interacts manually
  useEffect(() => {
    if (!isAutoCycling) return;
    const timer = setInterval(() => {
      setSelectedAudience((prev) => {
        const currentIndex = audiencePersonas.findIndex((p) => p.id === prev);
        const nextIndex = (currentIndex + 1) % audiencePersonas.length;
        return audiencePersonas[nextIndex].id;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [isAutoCycling]);

  const handleAudienceSelect = (id: AudienceId) => {
    setIsAutoCycling(false);
    setSelectedAudience(id);
    track("audience_personalized", { selected: id });
  };

  return (
    <>
      <PageMeta
        title="Pratik Aggarwal — Disability Inclusion Expert & Storyteller"
        description="Pratik Aggarwal is a disability inclusion expert, speaker, and researcher with 9+ years of experience. Director at ASTHA. Work with him on sensitization, capacity building, or advisory engagements."
        path="/"
        keywords="disability inclusion expert India, invisible disability speaker, corporate disability sensitization, NGO capacity building disability"
      />
      <JsonLd
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Pratik Aggarwal",
            "url": "https://pratik-aggarwal-website.vercel.app",
            "description":
              "Personal website of Pratik Aggarwal — disability inclusion expert, speaker, researcher, and founder of Blooming in Pain.",
          },
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": "https://pratik-aggarwal-website.vercel.app/#pratik-aggarwal",
            "name": "Pratik Aggarwal",
            "url": "https://pratik-aggarwal-website.vercel.app",
            "jobTitle": "Disability Inclusion Expert",
            "description":
              "Pratik Aggarwal is a disability inclusion expert, speaker, researcher, and storyteller based in New Delhi, India.",
          },
        ]}
      />

      {/* ── 1. HERO SECTION ──────────────────────────────────────────────── */}
      <section aria-labelledby="hero-heading" className="px-6 pt-10 pb-12 border-b border-border bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Role Headline, Description, 3 Stat Boxes, & Swapped CTAs */}
            <div className="md:col-span-7 space-y-5">
              <div className="space-y-3">
                <h1
                  id="hero-heading"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  Disability Inclusion <HeroRoleWord />
                </h1>

                <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  Bringing together lived authority, community engagement, research, and public policy to help organisations build meaningful disability practices beyond compliance.
                </p>
              </div>

              {/* 3 Count-up Stat Boxes directly under text */}
              <div className="grid grid-cols-3 gap-3.5 pt-1">
                {stats.map((stat) => (
                  <AnimatedStat key={stat.label} {...stat} />
                ))}
              </div>

              {/* Swapped Action CTAs (Explore My Work = Primary, Start a Partnership = Secondary) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/work"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-opacity shadow-md text-white hover:opacity-90"
                  style={{ backgroundColor: "var(--plum)" }}
                  onClick={() => track("cta_clicked", { label: "Explore My Work", location: "hero" })}
                >
                  Explore My Work →
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-colors"
                  onClick={() => track("cta_clicked", { label: "Start a Partnership", location: "hero" })}
                >
                  Start a Partnership →
                </Link>
              </div>
            </div>

            {/* Right Column: Compact Hero Portrait pulled up */}
            <div className="md:col-span-5 flex justify-center md:justify-end">
              <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-2xl overflow-hidden border-2 border-border shadow-lg bg-card">
                <img
                  src="/images/pratik-homepage-hero.jpeg"
                  alt="Portrait photograph of Pratik Aggarwal"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.src = "/images/seo_sharing.jpeg";
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. AUTO-CYCLING AUDIENCE ANGLE SELECTOR ("What represents you best today?") ── */}
      <section
        aria-labelledby="persona-selector-heading"
        className="px-6 py-14 border-b border-border bg-ground"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2
              id="persona-selector-heading"
              className="text-3xl md:text-4xl text-foreground font-serif mb-2"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              What represents you best today?
            </h2>
            <p className="text-sm text-muted-foreground">
              Select your context below to view tailored solutions, engagements, and impact focus.
            </p>
          </div>

          {/* Auto-Cycling Persona Filter Tabs */}
          <div
            className="flex flex-wrap items-center justify-center gap-2.5 mb-8"
            role="tablist"
            aria-label="Select your organization or interest"
          >
            {audiencePersonas.map((persona) => {
              const IconComponent = persona.icon;
              const isSelected = selectedAudience === persona.id;
              return (
                <button
                  key={persona.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleAudienceSelect(persona.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-plum text-white border-plum shadow-md scale-[1.03]"
                      : "bg-card text-foreground border-border hover:border-plum/40 hover:bg-muted"
                  }`}
                  style={{
                    backgroundColor: isSelected ? "var(--plum)" : undefined,
                    color: isSelected ? "#FFFFFF" : undefined,
                  }}
                >
                  <IconComponent className="w-4 h-4 shrink-0" />
                  <span>{persona.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tailored Card Output */}
          <div
            className="p-6 md:p-8 rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 relative overflow-hidden"
            aria-live="polite"
          >
            <div className="mb-3">
              <span
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-plum/10 text-plum"
              >
                {currentPersona.badge}
              </span>
            </div>

            <h3
              className="text-2xl md:text-3xl font-serif leading-snug mb-3"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {currentPersona.tagline}
            </h3>

            <p className="text-sm md:text-base leading-relaxed mb-6 text-foreground/90 max-w-3xl">
              {currentPersona.leadText}
            </p>

            {/* Key highlights */}
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {currentPersona.keyHighlights.map((highlight) => (
                <div key={highlight} className="flex items-start gap-2.5">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-plum/10 text-plum text-[10px] shrink-0 mt-0.5 font-bold">
                    ✓
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-foreground">{highlight}</span>
                </div>
              ))}
            </div>

            {/* Sector Action */}
            <div className="pt-1">
              <Link
                to={currentPersona.ctaHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs md:text-sm text-white transition-opacity shadow-sm hover:opacity-90"
                style={{ backgroundColor: "var(--plum)" }}
              >
                {currentPersona.ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. IN THE NEWS & DISCUSSIONS ─────────────────────────────────── */}
      <section aria-labelledby="media-heading" className="px-6 py-14 border-b border-border bg-card/20">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-plum mb-1">
                Podcasts &amp; Press Features
              </p>
              <h2
                id="media-heading"
                className="text-3xl md:text-4xl text-foreground font-serif"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                In the News &amp; Discussions
              </h2>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground max-w-md">
              Selected podcast conversations, national ground reports, policy critiques, and media features.
            </p>
          </div>

          {/* Featured Podcast Main Embed (Part 1 as requested!) */}
          <div className="grid lg:grid-cols-12 gap-8 items-center bg-card p-6 rounded-2xl border border-border shadow-xs">
            <div className="lg:col-span-7 aspect-video rounded-xl overflow-hidden shadow-xs border border-border bg-black">
              <iframe
                src="https://www.youtube-nocookie.com/embed/eUSRzBr0FFc"
                title="Disability & Social Realities in India - Pratik Aggarwal (ASTHA NGO) Podcast Ep. 32 Part 1"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="lg:col-span-5 space-y-3.5">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-plum/10 text-plum">
                Featured Podcast Episode
              </span>
              <h3 className="text-2xl font-serif leading-snug" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                Disability &amp; Social Realities in India (Ep. 32 Part 1)
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pratik Aggarwal (Director at ASTHA) discusses frontline community advocacy, lived experience, disability rights, and systemic change in India.
              </p>
              <div>
                <a
                  href="https://www.youtube.com/watch?v=eUSRzBr0FFc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-bold text-plum underline underline-offset-4 hover:opacity-80"
                >
                  Watch full video on YouTube →
                </a>
              </div>
            </div>
          </div>

          {/* Secondary Podcast Embeds Grid */}
          <div>
            <h3 className="text-lg font-serif mb-5" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              More Podcast Conversations
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Podcast Embed 1: Postcards Series #6 */}
              <div className="bg-card p-4 rounded-xl border border-border flex flex-col justify-between shadow-2xs space-y-3">
                <div className="aspect-video rounded-lg overflow-hidden border border-border bg-black">
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/onm9zJjB_PI"
                    title="Nothing About Us, Without Us: Disability Rights in the Classroom - Postcards Series #6"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-plum block">
                    Postcards Series #6
                  </span>
                  <h4 className="text-sm font-semibold text-foreground leading-snug font-serif" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                    Nothing About Us, Without Us: Disability Rights in the Classroom
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Discussion on rights-based education, lived authority, and classroom inclusion with Pratik Aggarwal.
                  </p>
                </div>
                <a
                  href="https://youtu.be/onm9zJjB_PI?si=EcPvzmQ1VJkHIxrn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-bold text-plum underline underline-offset-4 hover:opacity-80 pt-0.5"
                >
                  Watch on YouTube →
                </a>
              </div>

              {/* Podcast Embed 2: Ep. 32 Part 2 */}
              <div className="bg-card p-4 rounded-xl border border-border flex flex-col justify-between shadow-2xs space-y-3">
                <div className="aspect-video rounded-lg overflow-hidden border border-border bg-black">
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/eUSRzBr0FFc?start=1345"
                    title="Disability, Poverty & Inclusive Education - Podcast Ep. 32 Part 2"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-plum block">
                    Podcast Ep. 32 (Part 2)
                  </span>
                  <h4 className="text-sm font-semibold text-foreground leading-snug font-serif" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                    Disability, Poverty &amp; Inclusive Education
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    In-depth interview on urban poverty in Delhi slums, early intervention, and inclusive schooling.
                  </p>
                </div>
                <a
                  href="https://www.youtube.com/watch?v=eUSRzBr0FFc&t=1345s"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-bold text-plum underline underline-offset-4 hover:opacity-80 pt-0.5"
                >
                  Watch on YouTube →
                </a>
              </div>
            </div>
          </div>

          {/* National Media Features Infinite Marquee */}
          <div className="pt-2 border-t border-border/60">
            <h3 className="text-lg font-serif mb-4" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              National Media Features &amp; Thought Leadership
            </h3>
            <MediaMarquee />
          </div>
        </div>
      </section>

      {/* ── 5. BLOOMING IN PAIN COMMUNITY & FOOTER CTA ──────────────────── */}
      <section aria-labelledby="bip-heading" className="px-6 py-16 bg-card/40">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-plum/10 text-plum">
            Blooming in Pain Community
          </span>
          <h2
            id="bip-heading"
            className="text-3xl md:text-4xl font-serif max-w-2xl mx-auto"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Centering Stories of Invisible Illness &amp; Chronic Pain
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Founded by Pratik in 2021 to create space for un-sanitised stories about living with persistent illness and non-visual disability.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/blooming-in-pain"
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-sm text-white transition-opacity shadow-sm hover:opacity-90"
              style={{ backgroundColor: "var(--plum)" }}
            >
              Read Community Stories →
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-colors"
            >
              Start a Partnership
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
