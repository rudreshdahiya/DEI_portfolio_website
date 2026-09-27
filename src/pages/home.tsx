import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router";
import { track } from "@vercel/analytics";
import { trackEvent } from "@/lib/analytics";
import { PageMeta } from "@/components/page-meta";

import { JsonLd } from "@/components/json-ld";
import { Building2, Users, GraduationCap, Landmark, Sparkles } from "lucide-react";
import { ClickableImage } from "@/components/image-lightbox";
import { useHomeSettings } from "@/hooks/use-home-settings";
import type { HomePersonaHighlight } from "@/lib/supabase";

// ── Icon map for persona iconKey ─────────────────────────────────────────────
const PERSONA_ICONS: Record<string, typeof Building2> = {
  users: Users,
  landmark: Landmark,
  "graduation-cap": GraduationCap,
  building2: Building2,
  sparkles: Sparkles,
};

export type AudienceId = string;

// ── Cycling role word component (reads from Supabase) ─────────────────────────

function HeroRoleWord({ roleWords }: { roleWords: { word: string; styleClass: string }[] }) {
  const variants = roleWords.length > 0 ? roleWords : [{ word: "Expert", styleClass: "text-plum font-serif font-bold italic" }];
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      const tid = setTimeout(() => {
        setIndex((i) => (i + 1) % variants.length);
        setVisible(true);
      }, 350);
      return () => clearTimeout(tid);
    }, 3200);
    return () => clearInterval(id);
  }, [variants.length]);

  const current = variants[index];

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
    <div ref={containerRef} className="p-2 sm:p-3.5 rounded-xl border border-border bg-card/80 shadow-2xs text-center sm:text-left flex flex-col justify-center">
      <p
        className="text-xl sm:text-3xl text-foreground font-extrabold mb-0.5 font-serif tabular-nums"
        aria-label={`${numeric}${suffix} ${label}`}
      >
        {count}{suffix}
      </p>
      <p className="text-[10px] sm:text-[11px] text-muted-foreground leading-snug sm:leading-tight">{label}</p>
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

function OrgMarquee({ logos }: { logos: { name: string; initials: string; bg: string; color: string }[] }) {
  const tripled = [...logos, ...logos, ...logos];
  return (
    <div className="w-full overflow-hidden relative" role="region" aria-label="Organisations Pratik has worked with">
      <div className="marquee-track gap-3 py-1">
        {tripled.map((org, i) => (
          <OrgChip key={`${org.name}-${i}`} {...org} />
        ))}
      </div>
    </div>
  );
}

function MediaMarquee({ items }: { items: { outlet: string; category: string; title: string; description: string; url: string }[] }) {
  const tripled = [...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-2" role="region" aria-label="National media features infinite scroll">
      <div className="marquee-track gap-4 py-2">
        {tripled.map((item, i) => (
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
  const { settings } = useHomeSettings();
  const [selectedAudience, setSelectedAudience] = useState<AudienceId>("training");
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  const personas = settings.personas;
  const currentPersona: HomePersonaHighlight = personas.find((p) => p.id === selectedAudience) || personas[0];

  // Auto-cycle through personas until user interacts manually
  useEffect(() => {
    if (!isAutoCycling || personas.length === 0) return;
    const timer = setInterval(() => {
      setSelectedAudience((prev) => {
        const currentIndex = personas.findIndex((p) => p.id === prev);
        const nextIndex = (currentIndex + 1) % personas.length;
        return personas[nextIndex]?.id ?? prev;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [isAutoCycling, personas]);

  // Reset selected audience when personas change
  useEffect(() => {
    if (personas.length > 0 && !personas.find(p => p.id === selectedAudience)) {
      setSelectedAudience(personas[0].id);
    }
  }, [personas]);

  const handleAudienceSelect = (id: AudienceId) => {
    setIsAutoCycling(false);
    setSelectedAudience(id);
    track("audience_personalized", { selected: id });
  };

  if (!currentPersona) return null;

  return (
    <>
      <PageMeta
        title="Pratik Aggarwal — Disability Inclusion Expert & Executive Director ASTHA"
        description="Pratik Aggarwal is Executive Director at ASTHA and founder of Blooming in Pain. Work with him on Training, Consulting, Keynotes, or Research."
        path="/"
        keywords="disability inclusion expert India, invisible disability speaker, corporate disability sensitization, NGO capacity building disability, Executive Director ASTHA"
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
      <section aria-labelledby="hero-heading" className="px-4 sm:px-6 pt-6 pb-8 md:pt-10 md:pb-12 border-b border-border bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-6 lg:gap-12 items-center">
            
            {/* Left Column: Role Headline, Description, 3 Stat Boxes, & Swapped CTAs */}
            <div className="md:col-span-7 space-y-5">
              <div className="space-y-3">
                <h1
                  id="hero-heading"
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  {settings.hero_prefix} <HeroRoleWord roleWords={settings.role_words} />
                </h1>

                <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  {settings.hero_bio}
                </p>
              </div>

              {/* 3 Count-up Stat Boxes directly under text */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3.5 pt-1">
                {settings.stats.map((stat) => (
                  <AnimatedStat key={stat.label} {...stat} />
                ))}
              </div>

              {/* Swapped Action CTAs */}
              <div className="flex flex-row flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                <Link
                  to={settings.hero_cta1_href}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-opacity shadow-md text-white hover:opacity-90"
                  style={{ backgroundColor: "var(--plum)" }}
                  onClick={() => {
                    track("cta_clicked", { label: settings.hero_cta1_label, location: "hero" });
                    trackEvent("cta_clicked", { label: settings.hero_cta1_label, location: "hero" });
                  }}
                >
                  {settings.hero_cta1_label}
                </Link>
                <Link
                  to={settings.hero_cta2_href}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-xs sm:text-sm hover:bg-muted transition-colors"
                  onClick={() => {
                    track("cta_clicked", { label: settings.hero_cta2_label, location: "hero" });
                    trackEvent("cta_clicked", { label: settings.hero_cta2_label, location: "hero" });
                  }}
                >
                  {settings.hero_cta2_label}
                </Link>
              </div>

            </div>

            {/* Right Column: Compact Hero Portrait pulled up */}
            <div className="md:col-span-5 flex justify-center md:justify-end">
              <ClickableImage
                src={settings.hero_photo_url}
                alt={settings.hero_photo_alt}
                title="Keynote Speaker & Practitioner"
                caption={settings.hero_photo_caption}
                containerClassName="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[4/5] rounded-2xl border-2 border-border shadow-lg bg-card group"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. AUTO-CYCLING AUDIENCE ANGLE SELECTOR ("{settings.persona_section_heading}") ── */}
      <section
        aria-labelledby="persona-selector-heading"
        className="px-4 sm:px-6 py-8 md:py-14 border-b border-border bg-ground"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-4 sm:mb-8">
            <h2
              id="persona-selector-heading"
              className="text-2xl sm:text-3xl md:text-4xl text-foreground font-serif mb-1 sm:mb-2"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {settings.persona_section_heading}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {settings.persona_section_subheading}
            </p>
          </div>

          {/* Auto-Cycling Persona Filter Tabs */}
          <div
            className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-4 sm:mb-8"
            role="tablist"
            aria-label="Select your organization or interest"
          >
            {personas.map((persona) => {
              const IconComponent = PERSONA_ICONS[persona.iconKey] ?? Building2;
              const isSelected = selectedAudience === persona.id;
              return (
                <button
                  key={persona.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleAudienceSelect(persona.id)}
                  className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-plum text-white border-plum shadow-md scale-[1.02]"
                      : "bg-card text-foreground border-border hover:border-plum/40 hover:bg-muted"
                  }`}
                  style={{
                    backgroundColor: isSelected ? "var(--plum)" : undefined,
                    color: isSelected ? "#FFFFFF" : undefined,
                  }}
                >
                  <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="sm:hidden">{persona.shortLabel}</span>
                  <span className="hidden sm:inline">{persona.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tailored Card Output */}
          <div
            className="p-4 sm:p-8 rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 relative overflow-hidden"
            aria-live="polite"
          >
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <span
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-plum/10 text-plum"
                  >
                    {currentPersona.badge}
                  </span>
                </div>

                <h3
                  className="text-2xl md:text-3xl font-serif leading-snug"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  {currentPersona.tagline}
                </h3>

                <p className="text-sm md:text-base leading-relaxed text-foreground/90">
                  {currentPersona.leadText}
                </p>

                {/* Key highlights */}
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
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
                <div className="pt-3">
                  <Link
                    to={currentPersona.ctaHref}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs md:text-sm text-white transition-opacity shadow-sm hover:opacity-90"
                    style={{ backgroundColor: "var(--plum)" }}
                  >
                    {currentPersona.ctaLabel}
                  </Link>
                </div>
              </div>

              {/* Persona Context Photo Card */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-border bg-muted/40 shadow-sm group">
                  <img
                    src={currentPersona.photoUrl}
                    alt={currentPersona.photoAlt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">Sector Context</p>
                    <p className="text-xs font-medium text-white/90 font-serif" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                      {currentPersona.photoCaption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.5 AUTHENTIC FIELDWORK & ENGAGEMENT PHOTOGRAPHY SHOWCASE ── */}
      <section aria-labelledby="authentic-gallery-heading" className="px-6 py-14 border-b border-border bg-card">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-plum mb-1">
                {settings.gallery_section_badge}
              </p>
              <h2
                id="authentic-gallery-heading"
                className="text-3xl md:text-4xl text-foreground font-serif"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {settings.gallery_section_heading}
              </h2>
            </div>
            <Link
              to="/work"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-plum underline underline-offset-4 hover:opacity-80"
            >
              View Full Interactive Visual Impact Archive →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-border bg-black/5 shadow-xs">
              <ClickableImage
                src="/images/Pratik%20Pictures/ARNEC%20Manila/image%20(8).png"
                alt="Pratik Aggarwal speaking on global policy panel at ARNEC Manila"
                title="Global Policy"
                caption="ARNEC Conference, Manila"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Global Policy</span>
                <p className="text-xs font-medium text-white/90 font-serif" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>ARNEC Conference, Manila</p>
              </div>
            </div>

            <div className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-border bg-black/5 shadow-xs">
              <ClickableImage
                src="/images/Pratik%20Pictures/Award%20by%20Jai%20vakeel%20foundation%20to%20ASTHA/8K7A4285%20(1).JPG"
                alt="Pratik Aggarwal receiving organizational award for ASTHA"
                title="Leadership Award"
                caption="Jai Vakeel Award to ASTHA"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Leadership Award</span>
                <p className="text-xs font-medium text-white/90 font-serif" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Jai Vakeel Award to ASTHA</p>
              </div>
            </div>

            <div className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-border bg-black/5 shadow-xs">
              <ClickableImage
                src="/images/Pratik%20Pictures/Sensory%20Park%20Safdarjung/DSCF6747%20(1).JPG"
                alt="Pratik Aggarwal co-creating Umang Vatika Sensory Garden at Safdarjung Hospital"
                title="Accessible Design"
                caption="Umang Vatika Sensory Garden"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Accessible Design</span>
                <p className="text-xs font-medium text-white/90 font-serif" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Umang Vatika Sensory Garden</p>
              </div>
            </div>

            <div className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-border bg-black/5 shadow-xs">
              <ClickableImage
                src="/images/Pratik%20Pictures/Purple%20Fest%20-%20Census%20and%20Disability%20/IMG_9575.jpeg"
                alt="Pratik Aggarwal delivering keynote at Delhi Purple Fest"
                title="National Keynote"
                caption="Delhi Purple Fest 2024"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">National Keynote</span>
                <p className="text-xs font-medium text-white/90 font-serif" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Delhi Purple Fest 2024</p>
              </div>
            </div>

            <div className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-border bg-black/5 shadow-xs">
              <ClickableImage
                src="/images/Pratik%20Pictures/ToT%20on%20Neuro%20developmentak%20disabilities%20for%20TMF/TMF.jpg"
                alt="Pratik Aggarwal conducting Training of Trainers for Tech Mahindra Foundation"
                title="Capacity Building"
                caption="ToT Workshop, Tech Mahindra"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Capacity Building</span>
                <p className="text-xs font-medium text-white/90 font-serif" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>ToT Workshop, Tech Mahindra</p>
              </div>
            </div>

            <div className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-border bg-black/5 shadow-xs">
              <ClickableImage
                src="/images/Pratik%20Pictures/Kirori%20Mal%20College,%20DU,%20Panelist/KMC%20DU%20event%202.jpg"
                alt="Pratik Aggarwal addressing students at Kirori Mal College Delhi University"
                title="Academic Keynote"
                caption="Kirori Mal College, DU"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white pointer-events-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Academic Keynote</span>
                <p className="text-xs font-medium text-white/90 font-serif" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Kirori Mal College, DU</p>
              </div>
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
                {settings.podcasts_section_badge}
              </p>
              <h2
                id="media-heading"
                className="text-3xl md:text-4xl text-foreground font-serif"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {settings.podcasts_section_heading}
              </h2>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground max-w-md">
              {settings.podcasts_section_subheading}
            </p>
          </div>

          {/* Featured Podcast Main Embed: Nothing About Us, Without Us */}
          <div className="grid lg:grid-cols-12 gap-8 items-center bg-card p-6 rounded-2xl border border-border shadow-xs">
            <div className="lg:col-span-7 aspect-video rounded-xl overflow-hidden shadow-xs border border-border bg-black">
              <iframe
                src="https://www.youtube-nocookie.com/embed/onm9zJjB_PI"
                title="Nothing About Us, Without Us: Disability Rights in the Classroom - Postcards Series #6"
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
                Nothing About Us, Without Us: Disability Rights in the Classroom
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Discussion on rights-based education, lived authority, classroom inclusion, and disability rights with Pratik Aggarwal (Postcards Series #6).
              </p>
              <div>
                <a
                  href="https://youtu.be/onm9zJjB_PI?si=EcPvzmQ1VJkHIxrn"
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
              {/* Podcast 2: Disability & Social Realities in India (Ep. 32 Part 1) */}
              <div className="bg-card p-4 rounded-xl border border-border flex flex-col justify-between shadow-2xs space-y-3">
                <div className="aspect-video rounded-lg overflow-hidden border border-border bg-black">
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/eUSRzBr0FFc"
                    title="Disability & Social Realities in India - Pratik Aggarwal (ASTHA NGO) Podcast Ep. 32 Part 1"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-plum block">
                    Podcast Ep. 32 (Part 1)
                  </span>
                  <h4 className="text-sm font-semibold text-foreground leading-snug font-serif" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                    Disability &amp; Social Realities in India
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Pratik Aggarwal (Executive Director at ASTHA) discusses frontline community advocacy, lived experience, disability rights, and systemic change in India.
                  </p>
                </div>
                <a
                  href="https://www.youtube.com/watch?v=eUSRzBr0FFc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-bold text-plum underline underline-offset-4 hover:opacity-80 pt-0.5"
                >
                  Watch on YouTube →
                </a>
              </div>

              {/* Podcast 3: Disability, Poverty & Inclusive Education (Ep. 32 Part 2) */}
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
              {settings.media_section_heading}
            </h3>
            <MediaMarquee items={settings.media_highlights} />
          </div>
        </div>
      </section>

      {/* ── 5. BLOOMING IN PAIN COMMUNITY & FOOTER CTA ──────────────────── */}
      <section aria-labelledby="bip-heading" className="px-6 py-16 bg-card/40">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-plum/10 text-plum">
            {settings.bip_section_badge}
          </span>
          <h2
            id="bip-heading"
            className="text-3xl md:text-4xl font-serif max-w-2xl mx-auto"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            {settings.bip_section_heading}
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {settings.bip_section_text}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to={settings.bip_cta_href}
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold text-sm text-white transition-opacity shadow-sm hover:opacity-90"
              style={{ backgroundColor: "var(--plum)" }}
            >
              {settings.bip_cta_label}
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
