import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Building2,
  Users,
  GraduationCap,
  Landmark,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Calendar,
} from "lucide-react";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";
import { useRevealAll } from "@/hooks/use-reveal-all";

// ── Types & Data ──────────────────────────────────────────────────────────────

type AudienceType = "all" | "corporate" | "ngo" | "talks" | "advisory";

interface OrgLogoItem {
  name: string;
  logoUrl?: string;
  initials: string;
  bg: string;
  color: string;
}

const orgLogos: OrgLogoItem[] = [
  { name: "UNICEF", logoUrl: "/logos/unicef.png", initials: "UN", bg: "#E8F4FA", color: "#00689D" },
  { name: "HCL Foundation", logoUrl: "https://www.csrbox.org/India_organization_Uttar-Pradesh-HCL-Foundation_2219", initials: "HCL", bg: "#FEF0E6", color: "#C44B00" },
  { name: "Tech Mahindra", logoUrl: "/logos/tech-mahindra.svg", initials: "TM", bg: "#F2EAF7", color: "#5C1F7A" },
  { name: "ASTHA", logoUrl: "/logos/astha.png", initials: "AS", bg: "#E2EDE7", color: "#1F3D2A" },
  { name: "Delhi University", logoUrl: "/logos/delhi-university.png", initials: "DU", bg: "#E6EBF1", color: "#1B3A5B" },
  { name: "IIT Delhi", logoUrl: "/logos/iit-delhi.png", initials: "IIT", bg: "#F7E8E8", color: "#8B1A1A" },
  { name: "Safdarjung Hospital", logoUrl: "/logos/safdarjung-hospital.png", initials: "SH", bg: "#EDE4EF", color: "#3D1E3C" },
  { name: "NDMA", logoUrl: "/logos/ndma.png", initials: "ND", bg: "#E6EFF6", color: "#3D6B8F" },
  { name: "UN India", logoUrl: "/logos/un-india.svg", initials: "UNI", bg: "#009EDC", color: "#FFFFFF" },
  { name: "Samuhik Pahal", logoUrl: "/logos/samuhik-pahal.svg", initials: "SP", bg: "#EBF2EA", color: "#2B5329" },
  { name: "ThePrint", logoUrl: "/logos/the-print.png", initials: "TP", bg: "#F5F0E6", color: "#6B4B00" },
  { name: "Times of India", logoUrl: "/logos/times-of-india.png", initials: "TOI", bg: "#F9E8E8", color: "#AA151B" },
  { name: "Outlook India", logoUrl: "/logos/outlook-india.png", initials: "OI", bg: "#E6EBF5", color: "#003580" },
];

function OrgChip({ name, logoUrl, initials, bg, color }: OrgLogoItem) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-border/80 bg-card shrink-0 select-none shadow-xs hover:border-plum/40 transition-colors"
      aria-label={name}
    >
      {logoUrl && !imgError ? (
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="w-5 h-5 object-contain shrink-0"
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold shrink-0"
          style={{ backgroundColor: bg, color }}
          aria-hidden="true"
        >
          {initials}
        </span>
      )}
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

interface EngagementHighlight {
  title: string;
  org: string;
  year: string;
  description: string;
}

interface ServicePillar {
  id: AudienceType;
  number: string;
  title: string;
  icon: typeof Building2;
  audienceLabel: string;
  tagline: string;
  featuredImage: string;
  imageAlt: string;
  imageCaption: string;
  outcome: React.ReactNode;
  engagements: EngagementHighlight[];
  includes: string[];
  suitedFor: string[];
  ctaLabel: string;
}

const pillars: ServicePillar[] = [
  {
    id: "corporate",
    number: "01",
    title: "Corporate Sensitization & Workplace Inclusion",
    icon: Building2,
    audienceLabel: "Corporates & CSR Foundations",
    tagline: "Shift corporate culture from slide-deck compliance to deep workplace empathy & non-visual accessibility.",
    featuredImage: "/images/work-engagements_4.jpeg",
    imageAlt: "Pratik Aggarwal facilitating training session for HCL Foundation",
    imageCaption: "Facilitating corporate sensitization training for HCL Foundation staff.",
    outcome: (
      <>
        Your <span className="text-plum font-bold">teams understand invisible disabilities</span>, leadership communicates accessibly, and HR policies move beyond basic compliance.
      </>
    ),
    engagements: [
      {
        title: "HCL Foundation Workplace Sensitization",
        org: "HCL Foundation",
        year: "2022",
        description: "Full-day workshop on disability language, non-visual access, and inclusive programme design.",
      },
      {
        title: "Tech Mahindra Foundation — Training of Trainers",
        org: "Tech Mahindra Foundation",
        year: "2023",
        description: "Designed a sustainable Training of Trainers (ToT) system to embed inclusion internally across teams.",
      },
    ],
    includes: [
      "Executive leadership & team sensitization workshops",
      "Understanding non-visual & invisible disabilities in workplace settings",
      "Inclusive communication & disability language guidelines",
      "Training of Trainers (ToT) for long-term internal sustainability",
    ],
    suitedFor: ["Corporate HR & DEI Leaders", "CSR Foundations", "Executive Management Teams"],
    ctaLabel: "Book Corporate Sensitization →",
  },
  {
    id: "ngo",
    number: "02",
    title: "NGO Capacity Building & Frontline Systems",
    icon: Users,
    audienceLabel: "NGOs & Civil Society Organisations",
    tagline: "Equip frontline social workers and community teams with rights-based disability delivery tools.",
    featuredImage: "/images/work-engagements_3.jpeg",
    imageAlt: "Pratik Aggarwal leading capacity building workshop with UNICEF Bihar officers",
    imageCaption: "Leading disability-inclusive capacity building workshop for UNICEF Bihar child rights officers.",
    outcome: (
      <>
        Your <span className="text-plum font-bold">frontline teams seamlessly connect disabled communities</span> to welfare schemes, inclusive schools, and accessible services.
      </>
    ),
    engagements: [
      {
        title: "UNICEF Bihar District Officer Training",
        org: "UNICEF India",
        year: "2023",
        description: "Capacity-building workshop for district-level child rights officers on disability-inclusive programming.",
      },
      {
        title: "ASTHA Community Support Systems",
        org: "ASTHA NGO",
        year: "2015 – Present",
        description: "Frontline social work systems connecting thousands of families with disabled children to state entitlements.",
      },
    ],
    includes: [
      "Frontline staff capacity building & rights-based training modules",
      "Connecting disabled communities to government welfare and pension schemes",
      "Inclusive early childhood education & child rights advocacy",
      "Institutional policy reviews & field mentorship",
    ],
    suitedFor: ["Grassroots Non-Profits", "National NGOs", "Community Health Collectives"],
    ctaLabel: "Explore NGO Capacity Building →",
  },
  {
    id: "talks",
    number: "03",
    title: "Keynotes, University Lectures & Public Summits",
    icon: GraduationCap,
    audienceLabel: "Universities, Summits & Cultural Festivals",
    tagline: "Challenging conventional disability narratives with lived authority, research, and public dialogue.",
    featuredImage: "/images/work-engagements_2.jpeg",
    imageAlt: "Pratik Aggarwal delivering keynote address at Purple Fest Goa",
    imageCaption: "Delivering keynote address & opening pain art exhibition at Purple Fest Goa.",
    outcome: (
      <>
        Your <span className="text-plum font-bold">audience leaves with a profound, lived understanding</span> of invisible disability, chronic pain, and social justice.
      </>
    ),
    engagements: [
      {
        title: "Purple Fest Goa 2024 — Keynote Address",
        org: "Disability Rights Coalition",
        year: "2024",
        description: "Keynote speech & curated exhibition by people living with pain at India's largest disability arts festival.",
      },
      {
        title: "Delhi University Postgraduate Guest Lectures",
        org: "University of Delhi",
        year: "2023",
        description: "Lectures for MA Psychology students on invisible disability, chronic illness, and burden of proof.",
      },
      {
        title: "Diplomatic Interventions — Spanish & Finnish Embassies",
        org: "Spanish & Finnish Embassies",
        year: "2022",
        description: "Panels on disability arts, early intervention, and India–Europe inclusive policy exchange.",
      },
    ],
    includes: [
      "Keynote addresses on invisible disability & lived authority",
      "University guest lectures & interactive postgraduate seminars",
      "National & international conference panels (e.g., Purple Fest Goa, ARNEC Manila)",
      "Public health, media, and podcast dialogue facilitation",
    ],
    suitedFor: ["Universities & Research Centers", "National & Global Conferences", "Public Health Platforms"],
    ctaLabel: "Invite Pratik to Speak →",
  },
  {
    id: "advisory",
    number: "04",
    title: "Government Policy & Accessible Infrastructure Advisory",
    icon: Landmark,
    audienceLabel: "Government Bodies & Multilateral Agencies",
    tagline: "Embedding disability realities into sensory public infrastructure, disaster planning, and national health data.",
    featuredImage: "/images/umang-vatika-pratik.webp",
    imageAlt: "Pratik Aggarwal at Safdarjung Hospital Umang Vatika Sensory Garden",
    imageCaption: "North India's 1st government sensory garden 'Umang Vatika' at Safdarjung Hospital, New Delhi.",
    outcome: (
      <>
        <span className="text-plum font-bold">Public infrastructure and emergency crisis policies</span> designed with sensory access and lived disability reality at their core.
      </>
    ),
    engagements: [
      {
        title: "Umang Vatika Sensory Garden — Safdarjung Hospital",
        org: "VMMC & Safdarjung Hospital",
        year: "2024",
        description: "Co-created North India's 1st government sensory garden for neurodivergent children in partnership with ASTHA.",
      },
      {
        title: "Disaster Risk Reduction Framework Advisory",
        org: "NDMA + UN India",
        year: "2022",
        description: "Advisory input on national disability-inclusive disaster risk reduction & emergency response planning.",
      },
      {
        title: "NFHS-6 Disability Data Omission Advocacy",
        org: "National Policy Commentary",
        year: "2024",
        description: "Published critical research & media commentary on national health survey data omissions.",
      },
    ],
    includes: [
      "Sensory garden & accessible public space co-design",
      "Disability-inclusive disaster risk reduction framework (NDMA + UN)",
      "National survey & health policy critiques (NFHS-6 disability data advocacy)",
      "Crisis response advocacy & emergency access advisory",
    ],
    suitedFor: ["State & Central Ministries", "Hospital Planning Authorities", "Multilateral Policy Agencies"],
    ctaLabel: "Request Advisory Input →",
  },
];

const audienceFilters: { id: AudienceType; label: string; icon: typeof Building2 }[] = [
  { id: "all", label: "Show All Pillars", icon: Sparkles },
  { id: "corporate", label: "Corporate & Foundation", icon: Building2 },
  { id: "ngo", label: "NGOs & Community", icon: Users },
  { id: "talks", label: "Speaking & Keynotes", icon: GraduationCap },
  { id: "advisory", label: "Government Advisory", icon: Landmark },
];

const faqItems = [
  {
    q: "What is disability sensitization and why does it matter?",
    a: (
      <>
        Disability sensitization helps teams <span className="font-semibold text-foreground">understand disability — particularly invisible disabilities</span> — from a rights-based perspective rather than charity or pity. Pratik combines his lived experience of chronic illness with nine years of professional practice, making sessions <span className="font-semibold text-foreground">grounded in real workplace realities</span>.
      </>
    ),
  },
  {
    q: "Who typically engages Pratik for consulting or talks?",
    a: (
      <>
        <span className="font-semibold text-foreground">Corporates and CSR foundations</span> seeking DEI training, <span className="font-semibold text-foreground">NGOs</span> building disability-inclusive programs, <span className="font-semibold text-foreground">universities and conferences</span> looking for keynotes on invisible disability, and <span className="font-semibold text-foreground">government bodies</span> needing policy input on sensory infrastructure and crisis access.
      </>
    ),
  },
  {
    q: "Does Pratik take international speaking and consulting requests?",
    a: (
      <>
        Yes. In addition to work across India, he has presented at international platforms including the <span className="font-semibold text-foreground">ARNEC Regional Conference in Manila</span> and diplomatic events at the Spanish and Finnish embassies in New Delhi. He accepts both virtual and international engagements.
      </>
    ),
  },
  {
    q: "What's the difference between corporate sensitization and NGO capacity building?",
    a: (
      <>
        Corporate sensitization <span className="font-semibold text-foreground">shifts organizational culture</span> and workplace empathy. NGO capacity building <span className="font-semibold text-foreground">equips frontline teams with delivery systems</span> — connecting communities to disability welfare schemes, designing accessible services, and training local trainers for long-term impact.
      </>
    ),
  },
  {
    q: "How long does a typical engagement take?",
    a: (
      <>
        Keynote addresses range from 45 to 90 minutes. Corporate sensitization workshops are usually half-day or full-day. <span className="font-semibold text-foreground">NGO capacity building and policy advisory projects typically span multiple weeks or months</span> depending on scope.
      </>
    ),
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Services() {
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>("all");
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  useRevealAll([selectedAudience]);

  // Sync filter with URL hash (e.g. #corporate, #ngo, #talks, #advisory)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as AudienceType;
      if (hash && ["corporate", "ngo", "talks", "advisory"].includes(hash)) {
        setSelectedAudience(hash);
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const filteredPillars =
    selectedAudience === "all"
      ? pillars
      : pillars.filter((p) => p.id === selectedAudience);

  return (
    <div>
      <PageMeta
        title="Services & Live Engagements — Pratik Aggarwal"
        description="Work with Pratik Aggarwal on corporate disability sensitization, NGO capacity building, keynotes, or government policy advisory. Grounded in 9+ years of practice."
        path="/services"
        keywords="disability inclusion services India, corporate disability training, book disability keynote speaker, NGO capacity building disability, sensory garden consultant"
      />
      <JsonLd
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://pratik-aggarwal-website.vercel.app",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Services",
                item: "https://pratik-aggarwal-website.vercel.app/services",
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Disability Inclusion Engagement Pillars — Pratik Aggarwal",
            description:
              "Disability inclusion consulting, keynotes, workshops, and advisory by Pratik Aggarwal.",
            itemListElement: pillars.map((pillar, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              item: {
                "@type": "Service",
                name: pillar.title,
                description: pillar.tagline,
                provider: {
                  "@id":
                    "https://pratik-aggarwal-website.vercel.app/#pratik-aggarwal",
                },
                areaServed: "IN",
                audience: {
                  "@type": "Audience",
                  audienceType: pillar.audienceLabel,
                },
              },
            })),
          },
        ]}
      />

      {/* ── Page Header & Interactive Pillar Selector ───────────────────────── */}
      <section className="px-6 pt-12 pb-10 border-b border-border bg-card/40">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src="/images/pratik logo.png"
                  alt="Pratik Aggarwal logo mark"
                  className="w-9 h-9 object-contain shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <p className="text-xs font-bold uppercase tracking-widest text-plum">
                  Services &amp; Live Engagements
                </p>
              </div>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl text-foreground font-serif tracking-tight leading-tight"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Building Disability Inclusion in Practice
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Explore Pratik's 4 core engagement pillars — backed by real-world keynotes, corporate training sessions, community programs, and government policy advisory.
              </p>
            </div>

            {/* Featured Pratik Portrait Card */}
            <div className="relative w-full max-w-[240px] aspect-[4/3] rounded-xl overflow-hidden border-2 border-border shadow-md shrink-0 bg-card hidden lg:block">
              <img
                src="/images/pratik-about-page.jpeg"
                alt="Pratik Aggarwal profile"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-white">
                Pratik Aggarwal
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            {audienceFilters.map((filter) => {
              const Icon = filter.icon;
              const isSelected = selectedAudience === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setSelectedAudience(filter.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? "bg-plum text-white border-plum shadow-md scale-[1.02]"
                      : "bg-card text-foreground border-border hover:border-plum/40 hover:bg-muted"
                  }`}
                  style={{
                    backgroundColor: isSelected ? "var(--plum)" : undefined,
                    color: isSelected ? "#FFFFFF" : undefined,
                  }}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Dynamic Filter Reset */}
          {selectedAudience !== "all" && (
            <div className="p-4 rounded-xl bg-muted/60 border border-border flex items-center justify-between gap-4">
              <p className="text-xs text-foreground leading-relaxed">
                Showing tailored engagement pillar for{" "}
                <strong className="font-semibold text-plum">
                  {pillars.find((p) => p.id === selectedAudience)?.audienceLabel}
                </strong>
                .
              </p>
              <button
                onClick={() => setSelectedAudience("all")}
                className="text-xs text-plum underline underline-offset-4 hover:opacity-80 transition-opacity font-semibold shrink-0"
              >
                Reset filter (View all 4 pillars)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── REVOLVING ORGANISATIONS MARQUEE BANNER ──────────────────────────── */}
      <div className="py-3 border-b border-border/60 bg-card/50 w-full overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-plum" /> Organisations &amp; Institutions Pratik Has Worked With
          </p>
        </div>
        <OrgMarquee />
      </div>

      {/* ── 4 Rich Engagement Offerings Cards with Photos & Real Engagements ── */}
      <div className="divide-y divide-border">
        {filteredPillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <section
              key={pillar.id}
              id={pillar.id}
              aria-labelledby={`${pillar.id}-heading`}
              className="px-6 py-16 md:py-20"
            >
              <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Header Row */}
                <div className="flex flex-wrap items-start justify-between gap-6 border-b border-border/60 pb-6">
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold tabular-nums px-2.5 py-1 rounded bg-plum/10 text-plum uppercase tracking-wider">
                        Pillar {pillar.number}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {pillar.audienceLabel}
                      </span>
                    </div>
                    <h2
                      id={`${pillar.id}-heading`}
                      className="text-3xl md:text-4xl text-foreground font-serif leading-snug"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      {pillar.title}
                    </h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {pillar.tagline}
                    </p>
                  </div>

                  <Link
                    to={`/contact?service=${pillar.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-opacity shadow-md hover:opacity-90 shrink-0 self-start mt-2"
                    style={{ backgroundColor: "var(--plum)" }}
                  >
                    {pillar.ctaLabel}
                  </Link>
                </div>

                {/* Main Content Grid: Featured Event Photo (Left/Right) & Details (Right/Left) */}
                <div className="grid lg:grid-cols-12 gap-10 items-start">
                  
                  {/* Left/Photo Column: Rich Real Event Photo with Caption */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-border shadow-md bg-card">
                      <img
                        src={pillar.featuredImage}
                        alt={pillar.imageAlt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/images/seo_sharing.jpeg";
                        }}
                      />
                    </div>
                    <div className="p-3.5 rounded-xl bg-card border border-border/80 text-xs text-muted-foreground leading-relaxed flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-plum shrink-0 mt-0.5" />
                      <span>{pillar.imageCaption}</span>
                    </div>

                    {/* Best suited for tags */}
                    <div className="pt-2">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">
                        Best suited for
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pillar.suitedFor.map((target) => (
                          <span key={target} className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-foreground">
                            {target}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Outcomes, Live Engagements Showcase, Deliverables */}
                  <div className="lg:col-span-7 space-y-8">
                    
                    {/* Outcome Statement */}
                    <div className="p-6 rounded-2xl bg-card border border-border shadow-2xs">
                      <p className="text-xs font-bold uppercase tracking-widest text-plum mb-2">
                        What your organization gains
                      </p>
                      <div className="text-lg md:text-xl font-serif text-foreground leading-relaxed">
                        {pillar.outcome}
                      </div>
                    </div>

                    {/* Featured Live Engagements Showcase */}
                    <div className="space-y-4">
                      <h3 className="text-base font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-plum" /> Highlighted Live Engagements
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3.5">
                        {pillar.engagements.map((item) => (
                          <div key={item.title} className="p-4 rounded-xl border border-border bg-card/60 flex flex-col justify-between space-y-2">
                            <div>
                              <div className="flex items-center justify-between text-[11px] font-bold text-plum uppercase tracking-wider mb-1">
                                <span>{item.org}</span>
                                <span className="tabular-nums text-muted-foreground">{item.year}</span>
                              </div>
                              <h4 className="text-sm font-semibold text-foreground leading-snug">
                                {item.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Deliverables List */}
                    <div className="space-y-3 pt-2">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        What's included in this pillar
                      </h3>
                      <ul className="grid sm:grid-cols-2 gap-3 list-none m-0 p-0" role="list">
                        {pillar.includes.map((deliverable) => (
                          <li key={deliverable} className="flex items-start gap-2.5 p-3 rounded-lg bg-card border border-border/60">
                            <CheckCircle2 className="w-4 h-4 text-plum shrink-0 mt-0.5" />
                            <span className="text-xs sm:text-sm font-medium text-foreground leading-snug">
                              {deliverable}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Secondary Link to Full Engagements */}
                    <div className="pt-2 flex items-center justify-between">
                      <Link
                        to="/work"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-plum underline underline-offset-4 hover:opacity-80"
                      >
                        View all related engagements in Work &amp; Engagements →
                      </Link>
                    </div>

                  </div>

                </div>

              </div>
            </section>
          );
        })}
      </div>

      {/* ── Comprehensive Visual Media & Field Impact Showcase Gallery ───────── */}
      <section aria-label="Field Impact & Media Gallery" className="px-6 py-16 border-t border-border bg-card/30">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-plum">
              Lived Practice &amp; Advocacy in Action
            </p>
            <h2 className="text-3xl md:text-4xl font-serif" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              From Grassroots Advocacy to Keynote Panels
            </h2>
            <p className="text-sm text-muted-foreground">
              A rich visual gallery into Pratik's frontline community work, corporate training sessions, sensory garden design, and public keynotes.
            </p>
          </div>

          {/* 8-Grid Comprehensive Photo Gallery using ALL images in public/images/ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-2xs group bg-card">
              <img
                src="/images/work-engagements_1.jpeg"
                alt="Pratik Aggarwal speaking at Delhi University"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-2.5 left-2.5 text-[10px] font-semibold text-white">
                Delhi University Guest Lecture
              </span>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-2xs group bg-card">
              <img
                src="/images/umang-vatika-pratik.webp"
                alt="Umang Vatika Sensory Garden at Safdarjung Hospital"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-2.5 left-2.5 text-[10px] font-semibold text-white">
                Safdarjung Hospital Sensory Garden
              </span>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-2xs group bg-card">
              <img
                src="/images/work-engagements_4.jpeg"
                alt="HCL Foundation Corporate Sensitization"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-2.5 left-2.5 text-[10px] font-semibold text-white">
                HCL Foundation Training
              </span>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-2xs group bg-card">
              <img
                src="/images/work-engagements_2.jpeg"
                alt="Purple Fest Goa Keynote Address"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-2.5 left-2.5 text-[10px] font-semibold text-white">
                Purple Fest Goa Keynote
              </span>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-2xs group bg-card">
              <img
                src="/images/WhatsApp%20Image%202026-06-27%20at%2012.56.03%20PM.jpeg"
                alt="Pratik Aggarwal facilitating panel workshop"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = "/images/seo_sharing.jpeg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-2.5 left-2.5 text-[10px] font-semibold text-white">
                Disability Panel Facilitation
              </span>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-2xs group bg-card">
              <img
                src="/images/WhatsApp%20Image%202026-06-27%20at%2012.55.58%20PM.jpeg"
                alt="Pratik Aggarwal frontline community interaction"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.src = "/images/pratik-about-page.jpeg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-2.5 left-2.5 text-[10px] font-semibold text-white">
                Frontline Community Advocacy
              </span>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-2xs group bg-card">
              <img
                src="/images/Blooming%20in%20Pain.jpeg"
                alt="Blooming in Pain Community Platform"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-2.5 left-2.5 text-[10px] font-semibold text-white">
                Blooming in Pain Stories
              </span>
            </div>

            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-2xs group bg-card">
              <img
                src="/images/pratik-homepage-hero.jpeg"
                alt="Pratik Aggarwal Portrait"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-2.5 left-2.5 text-[10px] font-semibold text-white">
                Pratik Aggarwal (Director @ ASTHA)
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ (Hover-expandable Accordion) ─────────────────────────────── */}
      <section
        aria-labelledby="faq-heading"
        className="px-6 py-20 border-t border-border bg-ground"
      >
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-plum mb-1">
              Clear Expectations
            </p>
            <h2
              id="faq-heading"
              className="text-3xl md:text-4xl text-foreground mb-2"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Common Questions &amp; Process
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Frequently asked questions before starting a consulting, speaking, or training partnership.
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
                      className="text-lg font-semibold text-foreground group-hover:text-plum transition-colors leading-snug"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      {item.q}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-plum" : "group-hover:translate-y-0.5"
                      }`}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 text-sm md:text-base text-muted-foreground leading-relaxed max-w-[70ch] ${
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

      {/* ── High-Impact Bottom CTA ────────────────────────────────────────── */}
      <section
        aria-labelledby="cta-heading"
        className="px-6 py-20 border-t border-border bg-card/50"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-card p-8 sm:p-10 rounded-2xl border border-border shadow-md">
          <div className="space-y-3 max-w-xl">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-plum/10 text-plum">
              Start a Conversation
            </span>
            <h2
              id="cta-heading"
              className="text-3xl md:text-4xl text-foreground font-serif leading-tight"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Ready to build disability inclusion in your organization?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Every partnership starts with an open dialogue. Share your project goals — let's discuss how we can build meaningful impact together.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-base hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 shadow-md self-start md:self-center"
            style={{ backgroundColor: "var(--plum)" }}
          >
            Partner with Pratik
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
