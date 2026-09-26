import { useState } from "react";
import { Link } from "react-router";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";
import { useRevealAll } from "@/hooks/use-reveal-all";
import { Camera, Sparkles, X, MapPin, Calendar, ExternalLink } from "lucide-react";

// ── Types & data ──────────────────────────────────────────────────────────────

type Role =
  | "Keynote"
  | "Speaker"
  | "Panelist"
  | "Trainer"
  | "Lecturer"
  | "Moderator"
  | "Advisory";

interface Engagement {
  event: string;
  org?: string;
  year: string;
  role: Role;
  description: string;
  featured?: boolean;
  photoUrl?: string;
  photoAlt?: string;
  url?: string;
}

interface Group {
  id: string;
  category: string;
  title: string;
  entries: Engagement[];
}

interface GalleryPhoto {
  id: string;
  src: string;
  title: string;
  category: "sensory" | "purplefest" | "international" | "training" | "awards" | "bip";
  categoryLabel: string;
  location: string;
  year: string;
  description: string;
}

const galleryPhotos: GalleryPhoto[] = [
  {
    id: "sp-1",
    src: "/images/Pratik%20Pictures/Sensory%20Park%20Safdarjung/DSCF6747%20(1).JPG",
    title: "Umang Vatika Sensory Garden — Safdarjung Hospital",
    category: "sensory",
    categoryLabel: "Sensory Infrastructure",
    location: "Safdarjung Hospital, New Delhi",
    year: "2024",
    description: "North India's 1st government sensory garden for neurodivergent children, co-created with ASTHA and Safdarjung Hospital.",
  },
  {
    id: "sp-2",
    src: "/images/Pratik%20Pictures/Sensory%20Park%20Safdarjung/DSCF6637%20(1)%20(1).jpg",
    title: "Sensory Pathway & Interactive Play Space",
    category: "sensory",
    categoryLabel: "Sensory Infrastructure",
    location: "New Delhi",
    year: "2024",
    description: "Interactive visual art installations, mud pits, and accessible sensory pathways designed for children with disabilities.",
  },
  {
    id: "pf-1",
    src: "/images/Pratik%20Pictures/Delhi%20Purple%20Fest/IMG_1457.jpg",
    title: "Purple Fest — Keynote & Advocacy Session",
    category: "purplefest",
    categoryLabel: "Purple Fest",
    location: "Amrit Udyan / Goa",
    year: "2024",
    description: "Delivering keynote address on invisible disability, rights, and accessible public space design.",
  },
  {
    id: "pf-2",
    src: "/images/Pratik%20Pictures/Purple%20Fest%20-%20Census%20and%20Disability%20/IMG_9574.jpeg",
    title: "National Census & Disability Policy Panel",
    category: "purplefest",
    categoryLabel: "Purple Fest",
    location: "Purple Fest Goa",
    year: "2024",
    description: "Co-created session on national census data, NFHS survey inclusion, and invisible disability representation.",
  },
  {
    id: "ar-1",
    src: "/images/Pratik%20Pictures/Pratik%20Sir%20-%20ARNEC%20ASIA%20PACIFIC%20-%20MANILA%20-.jpg",
    title: "ARNEC Asia-Pacific Regional Conference — Manila",
    category: "international",
    categoryLabel: "International Policy",
    location: "Manila, Philippines",
    year: "2019",
    description: "Presenting community-based early childhood development frameworks for children with disabilities in urban informal settlements.",
  },
  {
    id: "ar-2",
    src: "/images/Pratik%20Pictures/ARNEC%20Manila/image%20(8).png",
    title: "ARNEC Early Childhood Development Panel",
    category: "international",
    categoryLabel: "International Policy",
    location: "Manila, Philippines",
    year: "2019",
    description: "International expert dialogue on early intervention and child rights advocacy across Asia-Pacific.",
  },
  {
    id: "tot-1",
    src: "/images/Pratik%20Pictures/ToT%20on%20Neuro%20developmentak%20disabilities%20for%20TMF/TMF.jpg",
    title: "Tech Mahindra Foundation — Training of Trainers (ToT)",
    category: "training",
    categoryLabel: "Capacity Building",
    location: "New Delhi",
    year: "2023",
    description: "Facilitating intensive Training of Trainers module on neurodevelopmental disabilities and workplace inclusion.",
  },
  {
    id: "rpwd-1",
    src: "/images/Pratik%20Pictures/RPWD%20Workshop%20for%20People%20with%20Disabilities/WhatsApp%20Image%202026-08-24%20at%202.03.24%20PM%20(1).jpeg",
    title: "RPwD Act 2016 Workshop for Persons with Disabilities",
    category: "training",
    categoryLabel: "Capacity Building",
    location: "Community Center, Delhi",
    year: "2023",
    description: "Rights-based workshop empowering self-advocates and families on government welfare schemes and legal entitlements.",
  },
  {
    id: "award-1",
    src: "/images/Pratik%20Pictures/Award%20by%20Jai%20vakeel%20foundation%20to%20ASTHA/8K7A4285%20(1).JPG",
    title: "Jai Vakeel Foundation Award to ASTHA",
    category: "awards",
    categoryLabel: "Awards & Recognition",
    location: "Mumbai",
    year: "2023",
    description: "Accepting organizational excellence award on behalf of ASTHA for frontline community rehabilitation work.",
  },
  {
    id: "award-2",
    src: "/images/Pratik%20Pictures/Award%20by%20Jai%20vakeel%20foundation%20to%20ASTHA/IMG-20251212-WA0085.jpg",
    title: "ASTHA Leadership & Partner Recognition",
    category: "awards",
    categoryLabel: "Awards & Recognition",
    location: "Mumbai",
    year: "2023",
    description: "Recognising ASTHA's community leadership in connecting thousands of children with disabilities to education and health rights.",
  },
  {
    id: "bip-1",
    src: "/images/Pratik%20Pictures/BloomingInPain/IMG_9605.jpeg",
    title: "Blooming in Pain — Art & Healing Session",
    category: "bip",
    categoryLabel: "Blooming in Pain",
    location: "New Delhi",
    year: "2023",
    description: "Community art and storytelling gathering centered around invisible chronic illness, fibromyalgia, and creative expression.",
  },
  {
    id: "kmc-1",
    src: "/images/Pratik%20Pictures/Kirori%20Mal%20College,%20DU,%20Panelist/KMC%20DU%20event%202.jpg",
    title: "Kirori Mal College, Delhi University — Guest Speaker",
    category: "training",
    categoryLabel: "Academic Lectures",
    location: "Delhi University",
    year: "2023",
    description: "Interactive lecture on the social model of disability, language, and invisible conditions for DU students.",
  },
];

// Role pill appearance — AA-contrast text on tinted backgrounds
const roleMeta: Record<Role, { label: string; bg: string; color: string }> = {
  Keynote:   { label: "Keynote",   bg: "#E2EDE7", color: "#1F3D2A" },
  Speaker:   { label: "Speaker",   bg: "#E2EDE7", color: "#1F3D2A" },
  Trainer:   { label: "Trainer",   bg: "#E2EDE7", color: "#1F3D2A" },
  Lecturer:  { label: "Lecturer",  bg: "#E2EDE7", color: "#1F3D2A" },
  Panelist:  { label: "Panelist",  bg: "#EDE4EF", color: "#3D1E3C" },
  Moderator: { label: "Moderator", bg: "#EDE4EF", color: "#3D1E3C" },
  Advisory:  { label: "Advisory",  bg: "#EDE9EF", color: "#595260" },
};

const groups: Group[] = [
  {
    id: "sensitization",
    category: "Training & Sensitization",
    title: "Disability Sensitization & Capacity Building",
    entries: [
      {
        event: "Delhi University — Kirori Mal College",
        org: "University of Delhi",
        year: "2023",
        role: "Lecturer",
        description:
          "Guest lecture series for students on invisible disability, chronic illness, and the burden of proof in medical and workplace contexts.",
        featured: true,
        photoUrl: "/images/Pratik%20Pictures/Kirori%20Mal%20College,%20DU,%20Panelist/KMC%20DU%20event%202.jpg",
        photoAlt: "Pratik Aggarwal speaking at Kirori Mal College, Delhi University",
      },
      {
        event: "Tech Mahindra Foundation — Training of Trainers (ToT)",
        org: "Tech Mahindra Foundation",
        year: "2023",
        role: "Trainer",
        description:
          "Designed and facilitated an intensive Training of Trainers programme on neurodevelopmental disabilities to embed inclusion internally.",
        featured: true,
        photoUrl: "/images/Pratik%20Pictures/ToT%20on%20Neuro%20developmentak%20disabilities%20for%20TMF/TMF.jpg",
        photoAlt: "Pratik Aggarwal facilitating ToT session for Tech Mahindra Foundation",
      },
      {
        event: "HCL Foundation Workplace Sensitization",
        org: "HCL Foundation",
        year: "2022",
        role: "Trainer",
        description:
          "Full-day corporate sensitization workshop on disability language, inclusive communication, and accessible programme design for foundation staff.",
        featured: true,
        photoUrl: "/images/work-engagements_4.jpeg",
        photoAlt: "Pratik Aggarwal facilitating training session for HCL Foundation",
      },
      {
        event: "RPwD Act 2016 Community Workshops",
        org: "ASTHA NGO",
        year: "2023",
        role: "Trainer",
        description:
          "Rights-based training workshops for persons with disabilities and families on government welfare entitlement systems.",
      },
    ],
  },
  {
    id: "policy",
    category: "Conferences, Legal & Policy Advisory",
    title: "Conferences, Policy & Infrastructure Advisory",
    entries: [
      {
        event: "Umang Vatika Sensory Garden — Safdarjung Hospital",
        org: "VMMC & Safdarjung Hospital",
        year: "2024",
        role: "Advisory",
        description:
          "Co-created North India's 1st government sensory garden for neurodivergent children in partnership with ASTHA.",
        featured: true,
        photoUrl: "/images/Pratik%20Pictures/Sensory%20Park%20Safdarjung/DSCF6747%20(1).JPG",
        photoAlt: "Pratik Aggarwal at Safdarjung Hospital Sensory Garden",
      },
      {
        event: "Purple Fest Goa 2024 — Keynote & Art Exhibition",
        org: "Disability Rights Coalition, Goa",
        year: "2024",
        role: "Keynote",
        description:
          "Keynote address & opening landmark national art exhibition featuring 27 artists living with invisible conditions at India's largest disability arts festival.",
        featured: true,
        photoUrl: "/images/Pratik%20Pictures/Delhi%20Purple%20Fest/IMG_1457.jpg",
        photoAlt: "Pratik Aggarwal delivering keynote at Purple Fest Goa",
      },
      {
        event: "Disaster Risk Reduction Framework Advisory",
        org: "NDMA & UN India",
        year: "2022",
        role: "Advisory",
        description:
          "Advisory input on national disability-inclusive disaster risk reduction framework, with emphasis on invisible disabilities and emergency access.",
        featured: true,
        photoUrl: "/images/Pratik%20Pictures/Disasters%20and%20Disability/IMGL3083.JPG",
        photoAlt: "Pratik Aggarwal presenting at NDMA UN India Disaster Reduction workshop",
      },
    ],
  },
  {
    id: "academic",
    category: "Academic & International Interventions",
    title: "Academic & International Interventions",
    entries: [
      {
        event: "ARNEC Regional Conference, Manila",
        org: "Asia-Pacific Regional Network for Early Childhood",
        year: "2019",
        role: "Speaker",
        description:
          "Presentation on disability-inclusive early childhood development within India's urban informal settlements — evidence, gaps, and community-led approaches.",
        featured: true,
        photoUrl: "/images/Pratik%20Pictures/Pratik%20Sir%20-%20ARNEC%20ASIA%20PACIFIC%20-%20MANILA%20-.jpg",
        photoAlt: "Pratik Aggarwal presenting at ARNEC Manila",
      },
      {
        event: "UNICEF Bihar Child Rights Capacity Building",
        org: "UNICEF India",
        year: "2023",
        role: "Trainer",
        description:
          "Capacity-building workshop for district-level child rights officers in Bihar on disability-inclusive programming.",
        featured: true,
        photoUrl: "/images/work-engagements_3.jpeg",
        photoAlt: "Pratik Aggarwal leading workshop with UNICEF Bihar officers",
      },
      {
        event: "Jai Vakeel Foundation Organizational Excellence Award",
        org: "Jai Vakeel Foundation",
        year: "2023",
        role: "Advisory",
        description:
          "Accepting award on behalf of ASTHA for frontline community rehabilitation work with disabled children.",
        featured: true,
        photoUrl: "/images/Pratik%20Pictures/Award%20by%20Jai%20vakeel%20foundation%20to%20ASTHA/8K7A4285%20(1).JPG",
        photoAlt: "Jai Vakeel Foundation Award presented to ASTHA",
      },
    ],
  },
];

// ── Role pill ─────────────────────────────────────────────────────────────────

function RolePill({ role }: { role: Role }) {
  const { label, bg, color } = roleMeta[role];
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  );
}

// ── Event Photo component ──────────────────────────────────────────────────────

function EventPhoto({ src, alt }: { src?: string; alt?: string }) {
  return (
    <figure className="mb-0">
      <div
        className="relative w-full rounded-t-xl overflow-hidden bg-muted shadow-xs"
        style={{ aspectRatio: "16 / 9" }}
      >
        {src ? (
          <img
            src={src}
            alt={alt || "Event photograph"}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-sm italic"
            style={{
              background:
                "linear-gradient(140deg, #EDE9EF 0%, #D8D0DC 50%, #C8BDD2 100%)",
              color: "rgba(30,26,36,0.2)",
            }}
            aria-hidden="true"
          >
            [Photo placeholder]
          </div>
        )}
      </div>
    </figure>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────────

export default function Work() {
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>("all");
  const [activePhotoModal, setActivePhotoModal] = useState<GalleryPhoto | null>(null);

  useRevealAll([selectedGalleryCategory]);

  const filteredGallery =
    selectedGalleryCategory === "all"
      ? galleryPhotos
      : galleryPhotos.filter((p) => p.category === selectedGalleryCategory);

  return (
    <div>
      <PageMeta
        title="Work, Engagements & Impact Archive — Pratik Aggarwal"
        description="Explore Pratik Aggarwal's live engagements, workshops, keynotes, and field photography archive across ASTHA, Purple Fest Goa, ARNEC Manila, and Safdarjung Hospital."
        path="/work"
        keywords="Pratik Aggarwal speaker, disability keynote India, invisible disability talks, UNICEF disability workshop, Purple Fest Goa keynote, Umang Vatika photo"
      />
      <JsonLd schema={[
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://pratik-aggarwal-website.vercel.app" },
            { "@type": "ListItem", position: 2, name: "Work & Engagements", item: "https://pratik-aggarwal-website.vercel.app/work" }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Speaking, Workshops & Advisory Engagements — Pratik Aggarwal",
          description: "Curated selection of live engagements, trainings, keynotes, and policy advisory by Pratik Aggarwal."
        }
      ]} />

      {/* ── Page Header ───────────────────────────────────────────────── */}
      <header className="px-6 pt-16 pb-12 border-b border-border bg-card/30">
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-plum">
            Work &amp; Impact Archive
          </p>
          <h1
            className="text-4xl md:text-6xl text-foreground font-serif tracking-tight leading-tight"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Live Engagements &amp; Field Practice
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-[60ch] leading-relaxed">
            A curated record of corporate workshops, frontline capacity building, university lectures, international summits, and government policy advisory.
          </p>
        </div>
      </header>

      {/* ── Visual Impact Archive (Interactive Photo Gallery) ───────────────── */}
      <section aria-label="Visual Impact Archive" className="px-6 py-14 border-b border-border bg-ground/40">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-plum mb-1">
                <Camera className="w-4 h-4 text-plum" />
                <span>Field &amp; Engagement Photography</span>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Pratik in Action — Visual Impact Gallery
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
              Authentic photography capturing workshops, sensory garden co-creation, keynotes, awards, and community art sessions.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter photo archive">
            {[
              { id: "all", label: "All Photos" },
              { id: "sensory", label: "Sensory Garden Safdarjung" },
              { id: "purplefest", label: "Purple Fest Goa" },
              { id: "international", label: "ARNEC Manila & Global" },
              { id: "training", label: "Capacity Building & ToT" },
              { id: "awards", label: "ASTHA Awards & Recognition" },
              { id: "bip", label: "Blooming in Pain Art" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selectedGalleryCategory === cat.id}
                onClick={() => setSelectedGalleryCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  selectedGalleryCategory === cat.id
                    ? "bg-plum text-white border-plum shadow-xs scale-[1.02]"
                    : "bg-card text-foreground border-border hover:border-plum/40 hover:bg-muted"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Photo Masonry / Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActivePhotoModal(photo)}
                className="group p-3 rounded-2xl border border-border bg-card shadow-2xs hover:shadow-md hover:border-plum/40 transition-all cursor-pointer space-y-3"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border/60">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/70 text-white backdrop-blur-xs">
                    {photo.categoryLabel}
                  </span>
                </div>
                <div className="space-y-1 px-1">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-plum shrink-0" /> {photo.location}</span>
                    <span className="font-mono">{photo.year}</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground font-serif leading-snug group-hover:text-plum transition-colors" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                    {photo.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {photo.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox Photo Modal ────────────────────────────────────────────── */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActivePhotoModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-3xl bg-card rounded-2xl border border-border p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-plum flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {activePhotoModal.categoryLabel}
              </span>
              <button
                type="button"
                onClick={() => setActivePhotoModal(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black border border-border">
              <img
                src={activePhotoModal.src}
                alt={activePhotoModal.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-plum" /> {activePhotoModal.location}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-plum" /> {activePhotoModal.year}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                {activePhotoModal.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activePhotoModal.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Key Engagement Groups List ──────────────────────────────────────── */}
      <div className="divide-y divide-border">
        {groups.map((group) => (
          <section
            key={group.id}
            id={group.id}
            aria-labelledby={`${group.id}-heading`}
            className="px-6 py-14 md:py-16 max-w-6xl mx-auto"
          >
            <div className="space-y-8">
              {/* Section heading */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-plum mb-2">
                  {group.category}
                </p>
                <h2
                  id={`${group.id}-heading`}
                  className="text-3xl md:text-4xl text-foreground font-serif"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  {group.title}
                </h2>
              </div>

              {/* Entry list */}
              <ul className="reveal-stagger list-none m-0 p-0 space-y-6" role="list">
                {group.entries.map((entry, i) => (
                  <li
                    key={entry.event}
                    className="p-5 md:p-6 rounded-2xl border border-border bg-card shadow-2xs space-y-4 hover:border-plum/40 transition-all"
                  >
                    {entry.featured && entry.photoUrl && (
                      <EventPhoto src={entry.photoUrl} alt={entry.photoAlt} />
                    )}

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                        <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug font-serif" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                          {entry.event}
                        </h3>
                        <div className="flex items-center gap-2 shrink-0">
                          <RolePill role={entry.role} />
                          <span className="text-xs text-muted-foreground font-mono font-bold">
                            {entry.year}
                          </span>
                        </div>
                      </div>

                      {entry.org && (
                        <p className="text-xs font-semibold text-plum">
                          {entry.org}
                        </p>
                      )}

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-[70ch]">
                        {entry.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      {/* ── CTA Section ─────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="speak-cta-heading"
        className="px-6 py-16 border-t border-border bg-ground"
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2
              id="speak-cta-heading"
              className="text-2xl md:text-3xl text-foreground font-serif"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Looking for a speaker, trainer, or policy consultant?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-[56ch] leading-relaxed">
              Pratik speaks and consults from lived experience and nine years of professional leadership — on invisible disability, rights-based frameworks, and accessible infrastructure.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white transition-opacity shadow-md hover:opacity-90 whitespace-nowrap shrink-0"
            style={{ backgroundColor: "var(--plum)" }}
          >
            Invite Pratik to Speak →
          </Link>
        </div>
      </section>
    </div>
  );
}
