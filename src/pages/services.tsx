import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Users,
  GraduationCap,
  Landmark,
  FileText,
  CheckCircle2,
  Sparkles,
  Building2,
  HeartHandshake,
  BookOpen,
} from "lucide-react";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";
import { useRevealAll } from "@/hooks/use-reveal-all";

// ── Types & Data ──────────────────────────────────────────────────────────────

export type PillarId = "all" | "training" | "consulting" | "talks" | "research";

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

interface StructuredSection {
  title: string;
  items: string[];
}

interface ServicePillar {
  id: PillarId;
  number: string;
  title: string;
  icon: typeof Users;
  audienceLabel: string;
  tagline: string;
  featuredImage?: string;
  imageAlt?: string;
  imageCaption?: string;
  galleryImages?: { url: string; alt: string; caption: string }[];
  leadDescription: string;
  sections?: StructuredSection[];
  includes?: string[];
  engagements: EngagementHighlight[];
  suitedFor: string[];
  ctaLabel: string;
}

const pillars: ServicePillar[] = [
  {
    id: "training",
    number: "01",
    title: "Training & Capacity Building",
    icon: Users,
    audienceLabel: "Corporates, NGOs, Governments & Development Sector",
    tagline: "Interactive training and capacity building delivered across organizational hierarchies — from senior leadership and HR teams to programme staff and frontline workers.",
    featuredImage: "/images/Pratik%20Pictures/ToT%20on%20Neuro%20developmentak%20disabilities%20for%20TMF/TMF.jpg",
    imageAlt: "Pratik Aggarwal facilitating Training of Trainers capacity-building session for Tech Mahindra Foundation",
    imageCaption: "Facilitating Training of Trainers (ToT) workplace sensitization and capacity-building workshop.",
    galleryImages: [
      {
        url: "/images/Pratik%20Pictures/ToT%20on%20Neuro%20developmentak%20disabilities%20for%20TMF/TMF.jpg",
        alt: "Tech Mahindra Foundation Training of Trainers workshop",
        caption: "Tech Mahindra ToT Workshop",
      },
      {
        url: "/images/Pratik%20Pictures/RPWD%20Workshop%20for%20People%20with%20Disabilities/WhatsApp%20Image%202026-08-24%20at%202.03.24%20PM%20(1).jpeg",
        alt: "RPwD Act Rights & Capacity Building Session",
        caption: "RPwD Act Rights Workshop",
      },
      {
        url: "/images/Pratik%20Pictures/Kirori%20Mal%20College,%20DU,%20Panelist/KMC%20DU%20event%202.jpg",
        alt: "Disability Inclusion Seminar at Kirori Mal College DU",
        caption: "University Disability Sensitization",
      },
    ],
    leadDescription: "Training is a major pillar of Pratik's practice. Grounded in rights-based frameworks and 9+ years of lived and professional experience, these interactive sessions equip teams to understand disability beyond basic compliance.",
    sections: [
      {
        title: "Corporate & Workplace Inclusion",
        items: [
          "Disability Inclusion and DEI Strategy & Culture",
          "Disability Awareness & Lived Authority",
          "Disability Etiquette & Inclusive Workplace Behaviors",
          "Inclusive Communication & Accessible Language",
        ],
      },
      {
        title: "Development Sector & Rights Frameworks",
        items: [
          "RPwD Act 2016 and Rights-Based Frameworks",
          "Inclusive Education & Accessible Classrooms",
          "Early Intervention & Child Rights Advocacy",
          "Community-Based Rehabilitation (CBR)",
          "Caregiver and Parent Support Systems",
          "Child Protection and Disability Inclusion",
          "Social Protection & Government Welfare Schemes",
        ],
      },
      {
        title: "Frontline & Community Worker Training",
        items: [
          "Capacity building of ASHAs, Anganwadi Workers, and community health teams",
          "Training teachers, special educators, and rehabilitation professionals",
          "Training of Trainers (ToT) for internal sustainability across organisations",
        ],
      },
    ],
    engagements: [
      {
        title: "HCL Foundation Workplace Sensitization",
        org: "HCL Foundation",
        year: "2022",
        description: "Full-day workshop on disability language, non-visual access, and inclusive programme design.",
      },
      {
        title: "UNICEF Bihar District Officer Training",
        org: "UNICEF India",
        year: "2023",
        description: "Capacity-building workshop for district-level child rights officers on disability-inclusive programming.",
      },
      {
        title: "Tech Mahindra Foundation — Training of Trainers",
        org: "Tech Mahindra Foundation",
        year: "2023",
        description: "Designed a sustainable Training of Trainers (ToT) system to embed inclusion internally.",
      },
    ],
    suitedFor: ["Corporate HR & DEI Leaders", "NGOs & Civil Society Organisations", "Government Agencies & Frontline Health Networks", "Educational Institutions"],
    ctaLabel: "Book Training & Capacity Building →",
  },
  {
    id: "consulting",
    number: "02",
    title: "Consulting & Advisory",
    icon: Landmark,
    audienceLabel: "Organisations, CSR Foundations & Policy Agencies",
    tagline: "Supporting organisations to make their programmes, policies, workplaces, and systems genuinely inclusive of persons with disabilities.",
    featuredImage: "/images/Pratik%20Pictures/Sensory%20Park%20Safdarjung/DSCF6747%20(1).JPG",
    imageAlt: "Pratik Aggarwal co-creating Umang Vatika Sensory Garden at Safdarjung Hospital",
    imageCaption: "North India's 1st government sensory garden 'Umang Vatika' at Safdarjung Hospital, New Delhi.",
    galleryImages: [
      {
        url: "/images/Pratik%20Pictures/Sensory%20Park%20Safdarjung/DSCF6747%20(1).JPG",
        alt: "Umang Vatika Sensory Garden at Safdarjung Hospital",
        caption: "Umang Vatika Sensory Garden Advisory",
      },
      {
        url: "/images/Pratik%20Pictures/Sensory%20Park%20Safdarjung/DSCF6637%20(1)%20(1).jpg",
        alt: "Accessible sensory pathways at Safdarjung Hospital",
        caption: "Sensory Pathways & Universal Design",
      },
      {
        url: "/images/Pratik%20Pictures/Disasters%20and%20Disability/IMGL3083.JPG",
        alt: "Disaster Risk Reduction and Disability Advisory Consultation",
        caption: "Disaster Risk Reduction Advisory",
      },
    ],
    leadDescription: "Advising organisations on embedding disability reality into their core operations, public infrastructure, and policy systems — moving away from separate add-ons towards universal design.",
    sections: [
      {
        title: "Strategic Advisory & Systemic Inclusion",
        items: [
          "Disability Inclusion and DEI strategy development",
          "Embedding disability inclusion within organisational systems and programmes",
          "RPwD Act and disability-related legal & policy clarity",
          "Accessibility and Universal Design in physical & digital spaces",
          "Inclusive Education, Early Childhood Development & Early Intervention",
          "Community-Based Rehabilitation and community-based approaches",
          "Social Protection and government scheme integration",
          "Child Protection & Disability safeguards",
        ],
      },
      {
        title: "Organisational Policies & Systems Support",
        items: [
          "Reviewing & developing HR policies & recruitment procedures",
          "Accessibility & Disability Inclusion policies",
          "Safeguarding and Child Protection policies",
          "Internal processes, reasonable accommodation, and documentation",
        ],
      },
      {
        title: "Programme Review, Evaluation & Institutional Strengthening",
        items: [
          "Programme reviews & disability inclusion assessments",
          "Institutional capacity assessments & MEL (Monitoring, Evaluation, Learning)",
          "Programme quality reviews & accessibility audits",
          "Impact assessment and strategic programme strengthening",
        ],
      },
    ],
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
    suitedFor: ["NGOs & Non-Profits", "CSR Foundations", "State & Central Ministries", "Hospital & Urban Planning Authorities"],
    ctaLabel: "Consult on Advisory & Systems →",
  },
  {
    id: "talks",
    number: "03",
    title: "Speaking, Keynotes & Public Engagement",
    icon: GraduationCap,
    audienceLabel: "Universities, Global Summits & Cultural Platforms",
    tagline: "Delivering keynotes, university lectures, and public summit interventions that challenge conventional disability narratives with lived authority.",
    featuredImage: "/images/Pratik%20Pictures/Delhi%20Purple%20Fest/IMG_1457.jpg",
    imageAlt: "Pratik Aggarwal delivering keynote address at Purple Fest",
    imageCaption: "Delivering keynote address & opening national pain art exhibition at Purple Fest 2024.",
    galleryImages: [
      {
        url: "/images/Pratik%20Pictures/Delhi%20Purple%20Fest/IMG_1457.jpg",
        alt: "Delivering keynote address at Purple Fest",
        caption: "Delhi Purple Fest Keynote Address",
      },
      {
        url: "/images/Pratik%20Pictures/Pratik%20Sir%20-%20ARNEC%20ASIA%20PACIFIC%20-%20MANILA%20-.jpg",
        alt: "Speaking on global policy panel at ARNEC Asia Pacific Conference Manila",
        caption: "ARNEC Asia Pacific Summit Keynote",
      },
      {
        url: "/images/Pratik%20Pictures/Award%20by%20Jai%20vakeel%20foundation%20to%20ASTHA/8K7A4285%20(1).JPG",
        alt: "Acceptance speech for Jai Vakeel Foundation Award for ASTHA",
        caption: "Jai Vakeel Leadership Speech",
      },
    ],
    leadDescription: "Grounding policy, research, and human stories in lived authority. Pratik delivers compelling keynote addresses, guest lectures, and panel interventions that move audiences beyond passive awareness into active empathy.",
    includes: [
      "Keynote addresses on invisible disability, chronic pain, and lived authority",
      "University guest lectures & interactive postgraduate seminars",
      "National & international conference panels (e.g., Purple Fest Goa, ARNEC Manila)",
      "Diplomatic policy dialogues (e.g., Spanish & Finnish Embassies in New Delhi)",
      "Public health, podcast, and national media dialogue facilitation",
    ],
    engagements: [
      {
        title: "Purple Fest Goa 2024 — Keynote Address",
        org: "Disability Rights Coalition",
        year: "2024",
        description: "Keynote speech & curated national art exhibition featuring 27 artists living with invisible conditions.",
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
    suitedFor: ["Universities & Research Centers", "National & International Summits", "Public Health Platforms", "Cultural Festivals"],
    ctaLabel: "Invite Pratik to Speak →",
  },
  {
    id: "research",
    number: "04",
    title: "Research, Writing & Organisational Communication",
    icon: FileText,
    audienceLabel: "Non-Profits, Research Institutions & Advocacy Coalitions",
    tagline: "Supporting organisations with the writing, research, and communication work that sits behind strong programmes and effective fundraising.",
    featuredImage: "/images/Pratik%20Pictures/ARNEC%20Manila/image%20(8).png",
    imageAlt: "Pratik Aggarwal presenting research paper at ARNEC Asia Pacific Conference Manila",
    imageCaption: "Presenting research and policy advocacy at ARNEC Asia Pacific Conference, Manila.",
    galleryImages: [
      {
        url: "/images/Pratik%20Pictures/ARNEC%20Manila/image%20(8).png",
        alt: "ARNEC Manila Global Research Presentation",
        caption: "ARNEC Manila Global Policy Research",
      },
      {
        url: "/images/Pratik%20Pictures/Award%20by%20Jai%20vakeel%20foundation%20to%20ASTHA/IMG-20251212-WA0085.jpg",
        alt: "Research paper documentation and Samuhik Pahal Contributing Editor",
        caption: "Samuhik Pahal Journal Author",
      },
      {
        url: "/images/Pratik%20Pictures/IMG_9844.jpg",
        alt: "Panelist presentation on child protection and disability research",
        caption: "Child Protection Policy Research",
      },
    ],
    leadDescription: "Helping organisations not just with what they do, but how it is documented, evaluated, communicated, and rendered fully disability-inclusive across print, web, and digital channels.",
    includes: [
      "Grant & proposal writing for social impact & disability projects",
      "Fundraising outreach & donor communication strategies",
      "Programme reports, annual reports, & impact assessment reports",
      "Research reports, policy briefs, & technical documentation",
      "Thought leadership articles & advocacy campaign content",
      "Editing, technical review, & website publication content",
      "Making reports, publications, and organisational communication disability-inclusive",
      "Making social media and digital communication accessible and disability-inclusive",
    ],
    engagements: [
      {
        title: "Contributing Editor — Samuhik Pahal",
        org: "Samuhik Pahal Journal",
        year: "2024",
        description: "Author of 'Thirty years of working with communities: Reflections and Opinions' on community-led rights advocacy.",
      },
      {
        title: "Ground Reports & Policy Commentary",
        org: "The Print / Outlook India",
        year: "2024",
        description: "In-depth investigative writing on emergency crisis response and disability data omission.",
      },
    ],
    suitedFor: ["Non-Profits & Civil Society", "Research Think Tanks", "Donor Agencies & Foundations", "Advocacy Alliances"],
    ctaLabel: "Commission Research & Writing →",
  },
];

const audienceFilters: { id: PillarId; label: string; icon: typeof Users }[] = [
  { id: "all", label: "All 4 Service Pillars", icon: Sparkles },
  { id: "training", label: "01. Training & Capacity", icon: Users },
  { id: "consulting", label: "02. Consulting & Advisory", icon: Landmark },
  { id: "talks", label: "03. Keynotes & Speaking", icon: GraduationCap },
  { id: "research", label: "04. Research & Writing", icon: FileText },
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
    q: "Who typically engages Pratik for consulting or training?",
    a: (
      <>
        <span className="font-semibold text-foreground">Corporates and CSR foundations</span> seeking DEI training, <span className="font-semibold text-foreground">NGOs</span> building disability-inclusive programs and capacity, <span className="font-semibold text-foreground">universities and conferences</span> looking for keynotes on invisible disability, and <span className="font-semibold text-foreground">government bodies</span> needing policy input on sensory infrastructure and crisis access.
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
    q: "Can Pratik assist our organisation with grant writing and impact reports?",
    a: (
      <>
        Yes. Under Pillar 4 (Research, Writing & Organisational Communication), Pratik supports organisations with grant writing, donor proposals, annual reports, policy briefs, and making digital and publication communications fully accessible and disability-inclusive.
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
  const [selectedAudience, setSelectedAudience] = useState<PillarId>("all");
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  useRevealAll([selectedAudience]);

  // Sync filter with URL hash (e.g. #training, #consulting, #talks, #research)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as PillarId;
      if (hash && ["training", "consulting", "talks", "research"].includes(hash)) {
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
        title="Services & Core Pillars — Pratik Aggarwal"
        description="Explore Pratik Aggarwal's 4 service pillars: Training & Capacity Building, Consulting & Advisory, Speaking & Keynotes, and Research, Writing & Organisational Communication."
        path="/services"
        keywords="disability inclusion services India, corporate disability training, book disability keynote speaker, NGO capacity building disability, sensory garden consultant, research writing non profit"
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
            name: "4 Consolidated Service Pillars — Pratik Aggarwal",
            description:
              "Training & Capacity Building, Consulting & Advisory, Keynotes & Speaking, and Research, Writing & Communication by Pratik Aggarwal.",
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
                <p className="text-xs font-bold uppercase tracking-widest text-plum">
                  Service Pillars &amp; Work
                </p>
              </div>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl text-foreground font-serif tracking-tight leading-tight"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Building Disability Inclusion in Practice
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                4 coherent service pillars — bringing together interactive training, institutional advisory, keynote speaking, and rigorous research &amp; communication.
              </p>
            </div>

            {/* Featured Pratik Portrait Card */}
            <div className="relative w-full max-w-[240px] aspect-[4/3] rounded-xl overflow-hidden border-2 border-border shadow-md shrink-0 bg-card hidden lg:block">
              <img
                src="/images/Pratik%20Pictures/Award%20by%20Jai%20vakeel%20foundation%20to%20ASTHA/8K7A4285%20(1).JPG"
                alt="Pratik Aggarwal receiving Jai Vakeel Foundation Award for ASTHA"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Interactive Filter Pills */}
          <div className="pt-4 border-t border-border/80">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Filter by Service Pillar:
            </p>
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter service pillars">
              {audienceFilters.map((filter) => {
                const IconComp = filter.icon;
                const isSelected = selectedAudience === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => {
                      setSelectedAudience(filter.id);
                      if (filter.id !== "all") {
                        window.location.hash = filter.id;
                      } else {
                        window.history.replaceState(null, "", window.location.pathname);
                      }
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-plum text-white border-plum shadow-xs scale-[1.02]"
                        : "bg-card text-foreground border-border hover:border-plum/40 hover:bg-muted"
                    }`}
                  >
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span>{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Partner Organisations Marquee ──────────────────────────────────── */}
      <section aria-label="Organisations worked with" className="py-6 border-b border-border bg-ground/50">
        <div className="max-w-6xl mx-auto px-6 mb-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-center sm:text-left">
            Trusted by Partner Organisations &amp; Institutions Across Sectors
          </p>
        </div>
        <OrgMarquee />
      </section>

      {/* ── 4 Consolidated Service Pillars ─────────────────────────────────── */}
      <section aria-label="4 Core Service Pillars" className="px-6 py-14 space-y-16 max-w-6xl mx-auto">
        {filteredPillars.map((pillar) => {
          const IconComponent = pillar.icon;

          return (
            <article
              key={pillar.id}
              id={pillar.id}
              className="reveal p-6 md:p-10 rounded-2xl border border-border bg-card shadow-xs space-y-8 scroll-mt-24 transition-all"
            >
              {/* Pillar Header Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border/80 pb-6">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-2xl md:text-3xl font-serif font-extrabold text-plum" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                      Pillar {pillar.number}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-plum/10 text-plum">
                      <IconComponent className="w-3.5 h-3.5" />
                      {pillar.audienceLabel}
                    </span>
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground leading-tight"
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  >
                    {pillar.title}
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                    {pillar.tagline}
                  </p>
                </div>
              </div>

              {/* Main Pillar Details (Full Width) */}
              <div className="space-y-6">
                <p className="text-sm md:text-base text-foreground/90 leading-relaxed font-normal max-w-prose">
                  {pillar.leadDescription}
                </p>

                {/* Structured Sections (for Pillars 1 & 2) */}
                {pillar.sections && pillar.sections.length > 0 && (
                  <div className="space-y-4 pt-2">
                    {pillar.sections.map((section, idx) => (
                      <div key={idx} className="p-4 sm:p-5 rounded-xl border border-border/80 bg-ground/40 space-y-2.5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-plum flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-plum shrink-0" />
                          {section.title}
                        </h3>
                        <ul className="grid sm:grid-cols-2 gap-2.5 list-none m-0 p-0 text-xs sm:text-sm">
                          {section.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2 text-foreground/90 leading-snug">
                              <span className="text-plum font-bold shrink-0">·</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bullet Includes List (for Pillars 3 & 4) */}
                {pillar.includes && pillar.includes.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-xl border border-border/80 bg-ground/40 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-plum flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-plum shrink-0" />
                      Key Offerings &amp; Deliverables
                    </h3>
                    <ul className="grid sm:grid-cols-2 gap-2.5 list-none m-0 p-0 text-xs sm:text-sm">
                      {pillar.includes.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground/90 leading-snug">
                          <span className="text-plum font-bold shrink-0">✓</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Engagements Showcase */}
                {pillar.engagements.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-border/60">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Selected Live Engagements &amp; Reference Work:
                    </p>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {pillar.engagements.map((eng) => (
                        <div key={eng.title} className="p-3.5 rounded-xl border border-border bg-card space-y-1 shadow-2xs">
                          <div className="flex items-center justify-between text-[11px] font-bold text-plum">
                            <span>{eng.org}</span>
                            <span className="text-muted-foreground font-mono">{eng.year}</span>
                          </div>
                          <h4 className="text-xs font-semibold text-foreground">{eng.title}</h4>
                          <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">{eng.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Horizontal Photo Strip for each pillar */}
                {pillar.galleryImages && pillar.galleryImages.length > 0 && (
                  <div className="pt-5 border-t border-border/60 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-plum flex items-center gap-2">
                      <Camera className="w-3.5 h-3.5 text-plum" />
                      Fieldwork &amp; Engagements in Action
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {pillar.galleryImages.map((imgItem, imgIdx) => (
                        <div key={imgIdx} className="relative aspect-[16/10] rounded-xl overflow-hidden border border-border shadow-xs group bg-muted/40">
                          <img
                            src={imgItem.url}
                            alt={imgItem.alt}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2.5 text-white">
                            <p className="text-[11px] font-medium text-white/95 leading-tight">
                              {imgItem.caption}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action CTA & Suited For */}
                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border/80">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Suited For:</span>
                    {pillar.suitedFor.map((tag) => (
                      <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-md bg-muted text-foreground border border-border/60">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white transition-opacity shadow-sm hover:opacity-90 shrink-0"
                    style={{ backgroundColor: "var(--plum)" }}
                  >
                    {pillar.ctaLabel}
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* ── FAQ Section ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="services-faq-heading" className="px-6 py-16 border-t border-border bg-card/20">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-plum mb-1">
              Frequently Asked Questions
            </p>
            <h2
              id="services-faq-heading"
              className="text-3xl md:text-4xl text-foreground font-serif"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Working Together
            </h2>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {faqItems.map((item, index) => {
              const isOpen = activeFaqIndex === index;
              return (
                <div
                  key={index}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  className="py-5 transition-colors group cursor-pointer"
                  onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveFaqIndex(isOpen ? null : index);
                    }
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3
                      className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-snug"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      {item.q}
                    </h3>
                    <span className="text-xl font-bold text-plum shrink-0">{isOpen ? "−" : "+"}</span>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-[70ch] ${
                      isOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
                    }`}
                  >
                    <p>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-ground border-t border-border text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-serif text-foreground" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            Ready to build meaningful disability inclusion?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Whether you need interactive corporate training, frontline NGO capacity building, keynote speaking, or research &amp; policy writing.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white transition-opacity shadow-md hover:opacity-90"
              style={{ backgroundColor: "var(--plum)" }}
            >
              Start a Partnership →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
