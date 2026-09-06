import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router";
import { track } from "@vercel/analytics";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";

// ── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { numeric: 9, suffix: "+", label: "years in disability inclusion" },
  { numeric: 40, suffix: "+", label: "talks & panels" },
  { numeric: 20, suffix: "+", label: "organisations" },
];

// Expanded org list for the marquee — duplicated in JSX for seamless loop
const orgLogos = [
  { name: "UNICEF", initials: "UN", bg: "#E8F4FA", color: "#00689D" },
  { name: "HCL Foundation", initials: "HCL", bg: "#FEF0E6", color: "#C44B00" },
  { name: "Tech Mahindra", initials: "TM", bg: "#F2EAF7", color: "#5C1F7A" },
  { name: "ASTHA", initials: "AS", bg: "#E2EDE7", color: "#1F3D2A" },
  { name: "Delhi University", initials: "DU", bg: "#E6EBF1", color: "#1B3A5B" },
  { name: "TISS Mumbai", initials: "TI", bg: "#F7E8E8", color: "#8B1A1A" },
  { name: "Purple Fest Goa", initials: "PF", bg: "#EDE4EF", color: "#3D1E3C" },
  { name: "NDMA + UN India", initials: "ND", bg: "#E6EFF6", color: "#3D6B8F" },
  { name: "HRLN", initials: "HR", bg: "#EBF2EA", color: "#2B5329" },
  { name: "Keystone Institute", initials: "KI", bg: "#F5F0E6", color: "#6B4B00" },
  { name: "Embassy of Spain", initials: "ES", bg: "#F9E8E8", color: "#AA151B" },
  { name: "Embassy of Finland", initials: "FI", bg: "#E6EBF5", color: "#003580" },
  { name: "ARNEC", initials: "AR", bg: "#E2EDE7", color: "#1F3D2A" },
  { name: "Delhi 2041 / DDA", initials: "DD", bg: "#ECEEF6", color: "#4A4A8A" },
  { name: "Kirori Mal College", initials: "KM", bg: "#EEF0F2", color: "#5A6472" },
  { name: "SLIC", initials: "SL", bg: "#E6EBF1", color: "#1B3A5B" },
];

const offerings = [
  {
    title: "Corporate Sensitization",
    outcome:
      "Your teams understand invisible disability — not from a training slide, but from lived experience.",
    href: "/services#corporate",
  },
  {
    title: "NGO Capacity Building",
    outcome:
      "Your organisation gains the frameworks and confidence to include people with invisible disabilities meaningfully.",
    href: "/services#ngo",
  },
  {
    title: "Academic & Public Talks",
    outcome:
      "Your audience leaves with a changed understanding of disability that they carry into their work and lives.",
    href: "/services#talks",
  },
  {
    title: "Government & Multilateral Advisory",
    outcome:
      "Your policies reflect the reality of invisible disability — not just the visible, documented cases.",
    href: "/services#advisory",
  },
];

const podcasts = [
  {
    title: "Disability, Poverty & Inclusive Education (Part 2)",
    series: "Podcast Ep. 32 — Part 2",
    description: "In-depth conversation with Pratik Aggarwal (ASTHA NGO) on disability rights, frontline community work, and inclusive education in India.",
    embedUrl: "https://www.youtube-nocookie.com/embed/eUSRzBr0FFc?start=1345",
    linkUrl: "https://www.youtube.com/watch?v=eUSRzBr0FFc&t=1345s",
  },
  {
    title: "Nothing About Us, Without Us: Disability Rights in the Classroom",
    series: "Postcards Series #6",
    description: "Podcast episode discussing rights-based education, lived authority, and classroom inclusion.",
    embedUrl: "https://www.youtube-nocookie.com/embed/onm9zJjB_PI",
    linkUrl: "https://youtu.be/onm9zJjB_PI?si=EcPvzmQ1VJkHIxrn",
  },
  {
    title: "Disability, Poverty & Inclusive Education (Part 1)",
    series: "Podcast Ep. 32 — Part 1",
    description: "Examining urban informal settlements, community support systems, and institutional accountability.",
    embedUrl: "https://www.youtube-nocookie.com/embed/bokwVsDd6H8?start=1021",
    linkUrl: "https://www.youtube.com/watch?v=bokwVsDd6H8&t=1021s",
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

const storyPreviews = [
  {
    tag: "Fibromyalgia",
    title: "Sujatha Rao’s Journey with Fibromyalgia: Finding Hope (by Sujatha Rao)",
    href: "/blooming-in-pain",
  },
  {
    tag: "Empowerment",
    title: "Zanna Barrett’s Journey: Chronic Pain to Empowerment (by Zanna Barrett)",
    href: "/blooming-in-pain",
  },
  {
    tag: "ME / CFS",
    title: "Beyond Diagnosis: ME/CFS & Invisible Challenges (Community Voice)",
    href: "/blooming-in-pain",
  },
  {
    tag: "Tracheostomy Care",
    title: "Living With a Tracheostomy and Chronic Illness (Community Voice)",
    href: "/blooming-in-pain",
  },
];

const engagements = [
  {
    event: "Purple Fest Goa",
    org: "Goa Tourism & Disability Rights Coalition",
    description:
      "Keynote on invisible disability and cultural inclusion at India's largest disability arts festival.",
    year: "2023",
    bg: "linear-gradient(135deg, #5C2A57 0%, #8F3F85 100%)",
  },
  {
    event: "UNICEF Bihar",
    org: "UNICEF India",
    description:
      "Capacity-building workshop for district-level officers on disability-inclusive child rights programming.",
    year: "2023",
    bg: "linear-gradient(135deg, #00568A 0%, #0092CC 100%)",
  },
  {
    event: "NDMA + UN India",
    org: "National Disaster Management Authority",
    description:
      "Advisory input on disability-inclusive disaster risk reduction frameworks at the national level.",
    year: "2022",
    bg: "linear-gradient(135deg, #2D3E50 0%, #4A6480 100%)",
  },
  {
    event: "HCL Foundation Summit",
    org: "HCL Foundation",
    description:
      "Panel discussion on moving corporate disability inclusion from policy to culture.",
    year: "2022",
    bg: "linear-gradient(135deg, #704800 0%, #A87C35 100%)",
  },
];

// ── Cycling role word ─────────────────────────────────────────────────────────

const roleWords = ["Expert", "Speaker", "Researcher", "Storyteller"];

function HeroRoleWord() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => {
      setVisible(false);
      const tid = setTimeout(() => {
        setIndex((i) => (i + 1) % roleWords.length);
        setVisible(true);
      }, 380);
      return () => clearTimeout(tid);
    }, 3400);
    return () => clearInterval(id);
  }, [prefersReduced]);

  return (
    <span
      aria-live="polite"
      aria-atomic="true"
      style={{
        display: "inline-block",
        minWidth: "12ch",
        transition: visible
          ? "opacity 280ms cubic-bezier(.165,.84,.44,1)"
          : "opacity 120ms ease",
        opacity: visible ? 1 : 0,
        color: "var(--plum)",
      }}
    >
      {roleWords[index]}
    </span>
  );
}

// ── Abstract "signal" visual — Direction B ────────────────────────────────────
// Near-silent seismograph: something is always measuring, always present,
// never loud enough to show in the room.

function AbstractInvisible() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--ground)",
        overflow: "hidden",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, #000 9%, #000 91%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, #000 9%, #000 91%, transparent 100%)",
      }}
    >
      <svg
        viewBox="0 0 400 540"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        aria-hidden="true"
      >
        {/* Cluster 1 — tight pair */}
        <line x1="0" y1="34" x2="400" y2="34" stroke="var(--plum)" strokeWidth="0.6" opacity="0.10" />
        <line x1="0" y1="46" x2="400" y2="46" stroke="var(--plum)" strokeWidth="0.85" opacity="0.16" />

        {/* Gap, then single */}
        <line x1="0" y1="76" x2="400" y2="76" stroke="var(--plum)" strokeWidth="0.5" opacity="0.08" />

        {/* Blip 1 — small ECG spike */}
        <path
          d="M 0 96 L 96 96 L 101 83 L 107 110 L 113 96 L 400 96"
          stroke="var(--plum)" strokeWidth="0.75" fill="none" opacity="0.19"
        />

        {/* Cluster 2 */}
        <line x1="0" y1="114" x2="400" y2="114" stroke="var(--plum)" strokeWidth="0.6" opacity="0.09" />
        <line x1="0" y1="126" x2="400" y2="126" stroke="var(--plum)" strokeWidth="0.5" opacity="0.07" />

        {/* Gap */}
        <line x1="0" y1="154" x2="400" y2="154" stroke="var(--plum)" strokeWidth="0.6" opacity="0.10" />

        {/* Wave 1 — gentle undulation */}
        <path
          d="M 0 178 C 55 175, 110 181, 165 178 C 220 175, 275 181, 330 178 C 360 176, 385 179, 400 178"
          stroke="var(--plum)" strokeWidth="0.7" fill="none" opacity="0.13"
        />

        {/* Singles */}
        <line x1="0" y1="198" x2="400" y2="198" stroke="var(--plum)" strokeWidth="0.5" opacity="0.08" />
        <line x1="0" y1="214" x2="400" y2="214" stroke="var(--plum)" strokeWidth="0.6" opacity="0.09" />

        {/* Cluster 3 — three tight */}
        <line x1="0" y1="236" x2="400" y2="236" stroke="var(--plum)" strokeWidth="0.85" opacity="0.15" />
        <line x1="0" y1="246" x2="400" y2="246" stroke="var(--plum)" strokeWidth="0.5" opacity="0.07" />
        <line x1="0" y1="254" x2="400" y2="254" stroke="var(--plum)" strokeWidth="0.6" opacity="0.09" />

        {/* Blip 2 — further right */}
        <path
          d="M 0 276 L 242 276 L 247 265 L 253 289 L 258 276 L 400 276"
          stroke="var(--plum)" strokeWidth="0.75" fill="none" opacity="0.18"
        />

        {/* Gap */}
        <line x1="0" y1="302" x2="400" y2="302" stroke="var(--plum)" strokeWidth="0.6" opacity="0.10" />

        {/* Wave 2 — slightly longer period */}
        <path
          d="M 0 326 C 80 323, 160 329, 240 325 C 300 322, 360 328, 400 326"
          stroke="var(--plum)" strokeWidth="0.7" fill="none" opacity="0.12"
        />

        {/* Cluster 4 */}
        <line x1="0" y1="348" x2="400" y2="348" stroke="var(--plum)" strokeWidth="0.5" opacity="0.08" />
        <line x1="0" y1="360" x2="400" y2="360" stroke="var(--plum)" strokeWidth="0.75" opacity="0.14" />
        <line x1="0" y1="370" x2="400" y2="370" stroke="var(--plum)" strokeWidth="0.5" opacity="0.07" />

        {/* Singles */}
        <line x1="0" y1="394" x2="400" y2="394" stroke="var(--plum)" strokeWidth="0.6" opacity="0.09" />
        <line x1="0" y1="412" x2="400" y2="412" stroke="var(--plum)" strokeWidth="0.5" opacity="0.08" />

        {/* Blip 3 — left-of-center */}
        <path
          d="M 0 432 L 160 432 L 165 421 L 171 445 L 176 432 L 400 432"
          stroke="var(--plum)" strokeWidth="0.75" fill="none" opacity="0.17"
        />

        {/* Wave 3 — very slight */}
        <path
          d="M 0 458 C 65 455, 130 461, 200 457 C 260 454, 340 460, 400 457"
          stroke="var(--plum)" strokeWidth="0.6" fill="none" opacity="0.11"
        />

        {/* Cluster 5 — final pair */}
        <line x1="0" y1="482" x2="400" y2="482" stroke="var(--plum)" strokeWidth="0.6" opacity="0.09" />
        <line x1="0" y1="494" x2="400" y2="494" stroke="var(--plum)" strokeWidth="0.85" opacity="0.15" />

        {/* Trailing single */}
        <line x1="0" y1="514" x2="400" y2="514" stroke="var(--plum)" strokeWidth="0.5" opacity="0.08" />
      </svg>

      {/* Interaction hint — visual only, not read by SR */}
      <p
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "1.25rem",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: "0.6875rem",
          color: "var(--muted-text)",
          letterSpacing: "0.12em",
          fontFamily: "'Public Sans', system-ui, sans-serif",
          textTransform: "uppercase",
          opacity: 0.45,
        }}
      >
        hover · tap · press ↵
      </p>
    </div>
  );
}

// ── Made Visible reveal ───────────────────────────────────────────────────────

function MadeVisibleReveal() {
  const [held, setHeld] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const lastTouchTs = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Under reduced-motion: portrait shown by default — no motion required to access content
  const revealed = held || hovered || focused || prefersReduced;

  const handleMouseEnter = useCallback(() => {
    if (Date.now() - lastTouchTs.current > 600) setHovered(true);
  }, []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  const handleFocus = useCallback(() => setFocused(true), []);
  const handleBlur = useCallback(() => setFocused(false), []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setHeld((h) => !h);
    }
    if (e.key === "Escape") {
      setHeld(false);
      setHovered(false);
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    lastTouchTs.current = Date.now();
    setHeld((h) => !h);
  }, []);

  const transitionCss = "opacity 0.55s cubic-bezier(0.16,1,0.3,1)";

  return (
    <div
      tabIndex={0}
      role="button"
      aria-pressed={held}
      aria-label={
        revealed
          ? "Portrait of Pratik Aggarwal, disability inclusion expert. Press Escape to close."
          : "Abstract visual representing invisible disability. Hover, tap, or press Enter to reveal Pratik's portrait."
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onTouchEnd={handleTouchEnd}
      className="relative rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{ aspectRatio: "3 / 4" }}
    >
      {/* Abstract layer — visible by default */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: revealed ? 0 : 1,
          transition: transitionCss,
        }}
      >
        <AbstractInvisible />
      </div>

      {/* Portrait layer — revealed on intent */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: revealed ? 1 : 0,
          transition: transitionCss,
          background: "var(--ground)",
        }}
      >
        <img
          src="/images/pratik-homepage-hero.jpeg"
          alt="Portrait of Pratik Aggarwal"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* --bloom border fires on reveal */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          border: "2px solid var(--bloom)",
          opacity: revealed ? 1 : 0,
          transition: transitionCss,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ── Scroll-reveal hook ───────────────────────────────────────────────────────

function useReveal<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}

// ── Count-up hook ─────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1800) {
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
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, containerRef };
}

// ── Animated stat ─────────────────────────────────────────────────────────────

function AnimatedStat({ numeric, suffix, label }: { numeric: number; suffix: string; label: string }) {
  const { count, containerRef } = useCountUp(numeric);
  return (
    <div ref={containerRef} role="listitem">
      <p
        className="text-4xl md:text-5xl text-foreground mb-1.5 tabular-nums"
        style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        aria-label={`${numeric}${suffix} ${label}`}
        aria-live="off"
      >
        {count}{suffix}
      </p>
      <p className="text-sm text-muted-foreground leading-snug">{label}</p>
    </div>
  );
}

// ── Org logo chip ─────────────────────────────────────────────────────────────

function OrgChip({ name, initials, bg, color }: { name: string; initials: string; bg: string; color: string }) {
  return (
    <div
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-border/60 bg-card shrink-0 select-none"
      aria-label={name}
    >
      <span
        className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold shrink-0"
        style={{ backgroundColor: bg, color }}
        aria-hidden="true"
      >
        {initials}
      </span>
      <span className="text-sm font-medium text-foreground whitespace-nowrap">{name}</span>
    </div>
  );
}

// ── Infinite org marquee ──────────────────────────────────────────────────────

function OrgMarquee() {
  return (
    <div
      className="overflow-hidden"
      role="region"
      aria-label="Organisations Pratik has worked with"
    >
      {/* Visually hidden full list for assistive tech */}
      <ul className="sr-only" role="list">
        {orgLogos.map((org) => (
          <li key={org.name}>{org.name}</li>
        ))}
      </ul>

      {/* Visual marquee (aria-hidden so screen readers use the list above) */}
      <div aria-hidden="true" className="relative">
        {/* Fade edges */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10"
          style={{ background: "linear-gradient(to right, var(--background), transparent)" }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10"
          style={{ background: "linear-gradient(to left, var(--background), transparent)" }}
        />

        <div className="marquee-track gap-3 py-1">
          {/* Render twice for seamless loop */}
          {[...orgLogos, ...orgLogos].map((org, i) => (
            <OrgChip key={`${org.name}-${i}`} {...org} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Engagements with intent-triggered reveal ──────────────────────────────────

function EngagementsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enter = (i: number) => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setActiveIndex(i);
  };
  const leave = () => setActiveIndex(null);
  const focusLink = (i: number) => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setActiveIndex(i);
  };
  const blurLink = () => {
    blurTimer.current = setTimeout(() => setActiveIndex(null), 120);
  };

  useEffect(() => () => { if (blurTimer.current) clearTimeout(blurTimer.current); }, []);

  return (
    <section
      aria-labelledby="engagements-heading"
      className="relative px-6 py-20 overflow-hidden"
    >
      {/* Per-engagement background overlays — decorative, aria-hidden */}
      {engagements.map((eng, i) => (
        <div
          key={`bg-${eng.event}`}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: eng.bg,
            opacity: activeIndex === i ? 0.13 : 0,
            transition: "opacity 150ms ease",
            pointerEvents: "none",
          }}
        />
      ))}

      <div className="max-w-5xl mx-auto" style={{ position: "relative", zIndex: 1 }}>
        <div className="mb-12">
          <h2
            id="engagements-heading"
            className="text-3xl md:text-4xl mb-3"
            style={{ fontFamily: "'Fraunces', Georgia, serif", color: "var(--ink)" }}
          >
            Selected engagements
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--muted-text)" }}>
            A curated few — not an exhaustive list.
          </p>
        </div>

        <ul className="list-none m-0 p-0" role="list">
          {engagements.map((eng, i) => (
            <li
              key={eng.event}
              className={i > 0 ? "border-t border-border" : ""}
              onMouseEnter={() => enter(i)}
              onMouseLeave={leave}
            >
              <div className="flex items-start gap-4 py-5">
                {/* Mobile color dot */}
                <div
                  className="md:hidden shrink-0 rounded-full"
                  style={{ width: "8px", height: "8px", background: eng.bg, marginTop: "0.6rem", flexShrink: 0 }}
                  aria-hidden="true"
                />

                <div className="flex-1 min-w-0">
                  {/* Title + year */}
                  <div className="flex items-baseline justify-between gap-4 mb-1">
                    <Link
                      to="/work"
                      className="text-xl md:text-2xl"
                      style={{
                        fontFamily: "'Fraunces', Georgia, serif",
                        color: "var(--ink)",
                        lineHeight: 1.2,
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                      }}
                      onFocus={() => focusLink(i)}
                      onBlur={blurLink}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--plum)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink)")}
                      aria-label={`${eng.event} — ${eng.org}, ${eng.year}`}
                    >
                      {eng.event}
                    </Link>
                    <span
                      className="shrink-0 text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--muted-text)", opacity: 0.75 }}
                    >
                      {eng.year}
                    </span>
                  </div>

                  {/* Org */}
                  <p className="text-sm" style={{ color: "var(--muted-text)" }}>
                    {eng.org}
                  </p>

                  {/* Description — revealed on hover/focus */}
                  <div
                    style={{
                      overflow: "hidden",
                      maxHeight: activeIndex === i ? "6rem" : "0",
                      transition: "max-height 240ms cubic-bezier(.77, 0, .175, 1)",
                    }}
                  >
                    <p className="text-sm leading-relaxed mt-2" style={{ color: "var(--muted-text)", maxWidth: "66ch" }}>
                      {eng.description}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="border-t border-border pt-8">
          <Link
            to="/work"
            className="text-sm font-semibold underline underline-offset-4 transition-colors"
            style={{ color: "var(--plum)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--bloom)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--plum)")}
          >
            See all work →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Offer row with hover-reveal outcome ──────────────────────────────────────

function OfferItem({ title, outcome, href }: { title: string; outcome: string; href: string }) {
  const [active, setActive] = useState(false);
  return (
    <li onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}>
      <Link
        to={href}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        aria-label={`${title} — ${outcome}`}
        className="flex items-center justify-between gap-6 py-5"
        style={{ textDecoration: "none" }}
      >
        <div className="flex-1 min-w-0">
          <p
            className="text-xl md:text-2xl"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              color: active ? "var(--plum)" : "var(--ink)",
              transition: "color 0.2s ease",
            }}
          >
            {title}
          </p>
          <div
            style={{
              overflow: "hidden",
              maxHeight: active ? "5rem" : "0",
              transition: "max-height 240ms cubic-bezier(.77, 0, .175, 1)",
            }}
          >
            <p className="text-sm leading-relaxed mt-2" style={{ color: "var(--muted-text)" }}>
              {outcome}
            </p>
          </div>
        </div>
        <span
          aria-hidden="true"
          style={{
            color: "var(--plum)",
            fontSize: "1.125rem",
            opacity: active ? 1 : 0,
            transition: "opacity 0.2s ease",
            flexShrink: 0,
          }}
        >
          →
        </span>
      </Link>
    </li>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const revealOffer = useReveal<HTMLDivElement>();
  const revealBip = useReveal<HTMLDivElement>();
  const revealSplit = useReveal<HTMLDivElement>();

  return (
    <>
      <PageMeta
        title="Disability Inclusion Expert & Storyteller"
        description="Pratik Aggarwal is a disability inclusion expert, speaker, and researcher with 9+ years of experience. Founder of Blooming in Pain. Work with him on sensitization, capacity building, or advisory engagements."
        path="/"
        keywords="disability inclusion expert India, invisible disability speaker, corporate disability sensitization, NGO capacity building disability"
      />
      <JsonLd schema={[
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Pratik Aggarwal",
          "url": "https://pratik-aggarwal-website.vercel.app",
          "description": "Personal website of Pratik Aggarwal — disability inclusion expert, speaker, researcher, and founder of Blooming in Pain.",
        },
        {
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": "https://pratik-aggarwal-website.vercel.app/#pratik-aggarwal",
          "name": "Pratik Aggarwal",
          "url": "https://pratik-aggarwal-website.vercel.app",
          "jobTitle": "Disability Inclusion Expert",
          "description": "Pratik Aggarwal is a disability inclusion expert, speaker, researcher, and storyteller based in New Delhi, India.",
          "affiliation": {
            "@type": "Organization",
            "name": "ASTHA",
            "url": "https://asthaindia.in",
          },
          "sameAs": [
            "https://linkedin.com/in/pratikaggarwal",
            "https://instagram.com/blooming.in.pain",
            "https://medium.com/@BloomingInPain",
            "https://asthaindia.in",
          ]
        }
      ]} />

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="hero-heading" className="px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_300px] gap-14 items-center">

          <div>
            <h1
              id="hero-heading"
              className="text-5xl md:text-6xl lg:text-7xl text-foreground mb-5 tracking-tight"
              style={{ fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.05 }}
            >
              Pratik<br />Aggarwal
            </h1>

            {/* Role line with calm cycling word */}
            <p
              className="text-xl md:text-2xl mb-10"
              style={{ color: "var(--muted-text)", fontWeight: 400 }}
            >
              Disability inclusion{" "}
              <HeroRoleWord />
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-3.5 rounded-md font-semibold text-base transition-colors"
                style={{
                  backgroundColor: "var(--plum)",
                  color: "#FFFFFF",
                  minHeight: "44px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4A2246")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--plum)")}
                onClick={() => track("cta_clicked", { label: "Start a partnership", location: "hero" })}
              >
                Start a partnership
              </Link>
              <Link
                to="/work"
                className="text-base underline underline-offset-4 transition-colors"
                style={{ color: "var(--ink)", minHeight: "44px", display: "inline-flex", alignItems: "center" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--plum)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink)")}
                onClick={() => track("cta_clicked", { label: "Explore my work", location: "hero" })}
              >
                Explore my work →
              </Link>
            </div>
          </div>

          {/* Portrait of Pratik */}
          <div
            className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden order-first md:order-last bg-muted"
          >
            <img
              src="/images/pratik-about-page.jpeg"
              alt="Portrait photograph of Pratik Aggarwal, disability inclusion expert"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* ── 2. PROFESSIONAL PRACTICE & APPROACH ─────────────────────────── */}
      <section aria-labelledby="approach-heading" className="px-6 py-16 md:py-20 border-t border-border" style={{ backgroundColor: "var(--ground)" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-[240px_1fr] gap-8 md:gap-16 items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2" style={{ letterSpacing: "0.14em" }}>
              Core Practice
            </p>
            <h2
              id="approach-heading"
              className="text-2xl md:text-3xl text-foreground font-serif leading-snug"
              style={{ fontFamily: "'Fraunces', Georgia, serif", color: "var(--ink)" }}
            >
              Disability Inclusion Beyond Compliance
            </h2>
          </div>

          <div className="space-y-6 text-base md:text-lg leading-relaxed" style={{ color: "var(--ink)" }}>
            <p>
              Pratik works at the intersection of disability, inclusion, accessibility, communication, and social change. His work brings together lived experience, community engagement, research, advocacy, facilitation, and storytelling to help organisations understand disability beyond compliance and build more meaningful, accessible, and inclusive practices.
            </p>
            <p>
              He works with organisations, institutions, teams, and individuals through consultancy, disability and accessibility training, community-based training and engagement, research, facilitation, and strategic support. Whether you are looking to make a programme more inclusive, build the capacity of your team, meaningfully engage with the disability community, review an existing approach, or simply understand where you may be getting it wrong, Pratik brings both professional expertise and lived understanding to the conversation.
            </p>
          </div>
        </div>
      </section>

      <div className="border-t border-border" aria-hidden="true" />

      {/* ── 3. STATS + ORG MARQUEE ──────────────────────────────────────── */}
      <section aria-label="Experience and selected partners" className="py-16">

        {/* Animated stats */}
        <div
          className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-6 md:gap-16 pb-12 border-b border-border"
          role="list"
          aria-label="Key statistics"
        >
          {stats.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} />
          ))}
        </div>

        {/* Marquee header */}
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Selected partners &amp; collaborators
          </p>
        </div>

        {/* Infinite scroll */}
        <OrgMarquee />
      </section>

      <div className="border-t border-border" aria-hidden="true" />

      {/* ── PODCASTS & MEDIA HIGHLIGHTS ─────────────────────────────────── */}
      <section aria-labelledby="media-heading" className="px-6 py-20 border-t border-border" style={{ backgroundColor: "var(--ground)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-10 border-b border-border pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1" style={{ letterSpacing: "0.14em" }}>
                Podcasts &amp; Press Features
              </p>
              <h2
                id="media-heading"
                className="text-3xl md:text-4xl text-foreground font-serif"
                style={{ fontFamily: "'Fraunces', Georgia, serif", color: "var(--ink)" }}
              >
                In the News &amp; Discussions
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Selected podcast conversations, national ground reports, policy critiques, and media features.
            </p>
          </div>

          {/* Featured Podcast Player Embed */}
          <div className="grid lg:grid-cols-12 gap-8 mb-12 items-center bg-card p-6 rounded-2xl border border-border">
            <div className="lg:col-span-7 aspect-video rounded-xl overflow-hidden shadow-xs border border-border bg-black">
              <iframe
                src="https://www.youtube-nocookie.com/embed/eUSRzBr0FFc?start=1345"
                title="Disability, Poverty & Inclusive Education - Pratik Aggarwal (ASTHA NGO) Podcast Ep. 32 Part 2"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full" style={{ backgroundColor: "#EDE4EF", color: "#3D1E3C" }}>
                Featured Podcast Episode
              </span>
              <h3 className="text-2xl font-serif leading-snug" style={{ fontFamily: "'Fraunces', Georgia, serif", color: "var(--ink)" }}>
                Disability, Poverty &amp; Inclusive Education (Ep. 32)
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pratik Aggarwal (Director at ASTHA) discusses the systemic intersection of disability rights, urban poverty in Delhi slums, and inclusive education.
              </p>
              <div className="pt-2">
                <a
                  href="https://www.youtube.com/watch?v=eUSRzBr0FFc&t=1345s"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-semibold underline underline-offset-4"
                  style={{ color: "var(--plum)" }}
                >
                  Watch full video on YouTube →
                </a>
              </div>
            </div>
          </div>

          {/* Additional Podcasts Grid with Embedded Video Players */}
          <div className="grid md:grid-cols-2 gap-6 mb-14">
            {podcasts.slice(1).map((pod) => (
              <div key={pod.title} className="p-5 rounded-2xl border border-border bg-card flex flex-col justify-between space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden shadow-xs border border-border bg-black">
                  <iframe
                    src={pod.embedUrl}
                    title={pod.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block mb-1">
                    {pod.series}
                  </span>
                  <h4 className="text-base font-semibold text-foreground mb-2 leading-snug">
                    {pod.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pod.description}
                  </p>
                </div>
                <a
                  href={pod.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold underline underline-offset-4 pt-1 inline-block"
                  style={{ color: "var(--plum)" }}
                >
                  Watch on YouTube →
                </a>
              </div>
            ))}
          </div>

          {/* National Media Grid */}
          <div>
            <h3 className="text-xl font-serif mb-6" style={{ fontFamily: "'Fraunces', Georgia, serif", color: "var(--ink)" }}>
              National Media Features &amp; Thought Leadership
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mediaHighlights.map((item) => (
                <a
                  key={item.title}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 rounded-xl border border-border bg-card flex flex-col justify-between hover:border-muted-foreground/30 transition-all hover:shadow-xs"
                >
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider block mb-2 px-2 py-0.5 rounded w-fit" style={{ backgroundColor: "#E2EDE7", color: "#1F3D2A" }}>
                      {item.outlet}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-xs font-semibold underline underline-offset-4 mt-4 block" style={{ color: "var(--plum)" }}>
                    Read feature →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-border" aria-hidden="true" />

      {/* ── 4. WHAT I OFFER ─────────────────────────────────────────────── */}
      <section aria-labelledby="offer-heading" className="px-6 py-14 border-t border-border">
        <div className="reveal max-w-5xl mx-auto flex flex-col md:flex-row md:items-start gap-6 md:gap-16" ref={revealOffer}>
          <h2
            id="offer-heading"
            className="md:w-36 shrink-0 text-xs font-semibold uppercase tracking-widest pt-5"
            style={{ color: "var(--muted-text)", letterSpacing: "0.14em" }}
          >
            What I offer
          </h2>
          <ul className="flex-1 divide-y divide-border list-none m-0 p-0">
            {offerings.map((item) => (
              <OfferItem key={item.title} {...item} />
            ))}
          </ul>
        </div>
      </section>

      {/* ── 5. BLOOMING IN PAIN ─────────────────────────────────────────── */}
      <section
        aria-labelledby="bip-heading"
        className="px-6 py-12 border-t border-border"
        style={{ backgroundColor: "var(--ground)" }}
      >
        <div className="reveal max-w-5xl mx-auto" ref={revealBip}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 mb-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--sage)" }}>
                Community Platform Founded by Pratik
              </p>
              <h2
                id="bip-heading"
                className="text-2xl md:text-3xl"
                style={{ fontFamily: "'Fraunces', Georgia, serif", color: "var(--ink)" }}
              >
                Blooming in Pain: Centering Community Voices
              </h2>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://instagram.com/blooming.in.pain"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold underline underline-offset-4 transition-colors hover:text-primary"
                style={{ color: "var(--ink)" }}
                onClick={() => track("outbound_click", { destination: "instagram", location: "blooming_in_pain_section" })}
              >
                Instagram<span className="sr-only"> (opens in new tab)</span>
              </a>
              <Link
                to="/blooming-in-pain"
                className="text-sm font-semibold underline underline-offset-4 transition-colors"
                style={{ color: "var(--sage)" }}
              >
                Read stories →
              </Link>
            </div>
          </div>

          <ul className="divide-y divide-border list-none m-0 p-0" role="list">
            {storyPreviews.map((story) => (
              <li key={story.title}>
                <Link
                  to={story.href}
                  className="group flex items-center gap-5 py-4"
                  aria-label={`Read: ${story.title}`}
                  style={{ textDecoration: "none" }}
                >
                  <span
                    className="text-xs font-semibold uppercase tracking-widest shrink-0 w-28"
                    style={{ color: "var(--sage)" }}
                  >
                    {story.tag}
                  </span>
                  <span
                    className="flex-1 text-base transition-colors group-hover:text-primary"
                    style={{ fontFamily: "'Fraunces', Georgia, serif", color: "var(--ink)" }}
                  >
                    {story.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--sage)" }}
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 5. SELECTED ENGAGEMENTS ─────────────────────────────────────── */}
      <EngagementsSection />

      <div className="border-t border-border" aria-hidden="true" />

      {/* ── 6. MADE VISIBLE ─────────────────────────────────────────────── */}
      <section aria-labelledby="mv-heading" className="px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[320px_1fr] gap-14 md:gap-20 items-center">

          {/* Interactive visual — left on desktop, below heading on mobile */}
          <MadeVisibleReveal />

          {/* Text — always visible, accessible regardless of reveal state */}
          <div className="order-first md:order-last">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: "var(--bloom)", letterSpacing: "0.14em" }}
            >
              Made Visible
            </p>
            <h2
              id="mv-heading"
              className="text-3xl md:text-4xl mb-6"
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                color: "var(--ink)",
                lineHeight: 1.15,
              }}
            >
              Invisible, until you look differently.
            </h2>

            <div
              className="space-y-5 mb-8"
              style={{ fontSize: "1.0625rem", color: "var(--ink)", lineHeight: 1.7 }}
            >
              <p>
                Pratik has fibromyalgia — chronic widespread pain, fatigue,
                and cognitive difficulty that leaves no visible trace. No
                definitive test, no clear origin, and a very high likelihood
                of disbelief.
              </p>
              <p>
                It's not separate from his work. It's what makes it personal,
                grounded, and harder to dismiss.
              </p>
            </div>

            <blockquote
              style={{
                borderLeft: "2px solid var(--bloom)",
                paddingLeft: "1.25rem",
                marginBottom: "2rem",
                fontFamily: "'Fraunces', Georgia, serif",
                fontSize: "1.125rem",
                fontStyle: "italic",
                color: "var(--ink)",
                lineHeight: 1.55,
              }}
              aria-label="Quote from Pratik Aggarwal"
            >
              <p>
                "Nine years ago, I decided that what I live with every day
                could become the most useful thing I offer."
              </p>
              <footer
                style={{
                  fontFamily: "'Public Sans', system-ui, sans-serif",
                  fontSize: "0.8125rem",
                  fontStyle: "normal",
                  color: "var(--muted-text)",
                  marginTop: "0.625rem",
                }}
              >
                — Pratik Aggarwal
              </footer>
            </blockquote>

            <Link
              to="/about"
              className="font-semibold underline underline-offset-4 transition-colors"
              style={{ color: "var(--plum)", fontSize: "0.9375rem" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--bloom)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--plum)")}
            >
              Read his full story →
            </Link>

            {/* Mobile-only caption for the visual below */}
            <p
              className="md:hidden mt-6 text-xs uppercase tracking-widest"
              style={{ color: "var(--muted-text)", opacity: 0.6 }}
              aria-hidden="true"
            >
              ↓ Tap the visual to reveal
            </p>
          </div>
        </div>
      </section>

      {/* ── 7. THE SPLIT ────────────────────────────────────────────────── */}
      <section
        aria-label="Work together or join the community"
        className="px-6 py-14 border-t border-border"
      >
        <div className="reveal-stagger max-w-5xl mx-auto grid sm:grid-cols-2 gap-4" ref={revealSplit}>
          <Link
            to="/contact"
            className="group flex flex-col justify-between rounded-2xl p-7 transition-opacity hover:opacity-95"
            style={{ backgroundColor: "var(--plum)" }}
            onClick={() => track("cta_clicked", { label: "Work with me", location: "split_section" })}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em" }}
            >
              Partner · Hire · Advise
            </p>
            <p
              className="text-3xl md:text-4xl text-white"
              style={{ fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.1 }}
            >
              Work with me →
            </p>
          </Link>

          <Link
            to="/blooming-in-pain"
            className="group flex flex-col justify-between rounded-2xl p-7 border transition-opacity hover:opacity-90"
            style={{ border: "1.5px solid var(--sage)" }}
            onClick={() => track("cta_clicked", { label: "Join the community", location: "split_section" })}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: "var(--sage)", letterSpacing: "0.14em" }}
            >
              Community
            </p>
            <p
              className="text-3xl md:text-4xl"
              style={{ fontFamily: "'Fraunces', Georgia, serif", color: "var(--ink)", lineHeight: 1.1 }}
            >
              Join Blooming in Pain →
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
