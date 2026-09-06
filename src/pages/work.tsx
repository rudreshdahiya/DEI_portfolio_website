import { Link } from "react-router";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";
import { useRevealAll } from "@/hooks/use-reveal-all";

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
  featured?: boolean; // shows a photo above the entry
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

// Role pill appearance — AA-contrast text on tinted backgrounds (Made Visible palette)
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
    title: "Disability Sensitization & Awareness",
    entries: [
      {
        event: "Delhi University",
        org: "University of Delhi",
        year: "2023",
        role: "Lecturer",
        description:
          "Guest lecture series for postgraduate psychology students on invisible disability, chronic illness, and the burden of proof in medical and workplace contexts.",
        featured: true,
        photoUrl: "/images/work-engagements_1.jpeg",
        photoAlt: "Pratik Aggarwal speaking at Delhi University",
      },
      {
        event: "TISS Mumbai",
        org: "Tata Institute of Social Sciences",
        year: "2022",
        role: "Speaker",
        description:
          "Seminar on disability-inclusive social work practice — specifically the gap between policy frameworks and the lived experience of people with invisible conditions.",
      },
      {
        event: "HCL Foundation",
        year: "2022",
        role: "Trainer",
        description:
          "Full-day corporate sensitization workshop on disability language, inclusive communication, and accessible programme design for foundation staff.",
        featured: true,
        photoUrl: "/images/work-engagements_4.jpeg",
        photoAlt: "Pratik Aggarwal facilitating training session for HCL Foundation",
      },
      {
        event: "Tech Mahindra Foundation — Training of Trainers",
        org: "Tech Mahindra Foundation",
        year: "2023",
        role: "Trainer",
        description:
          "Designed and facilitated a Training of Trainers programme on disability inclusion so the knowledge could be embedded, sustained, and scaled internally.",
      },
    ],
  },
  {
    id: "policy",
    category: "Conferences, Legal & Policy",
    title: "Conferences, Legal & Policy",
    entries: [
      {
        event: "Purple Fest Goa 2024",
        org: "Disability Rights Coalition, Goa",
        year: "2024",
        role: "Keynote",
        description:
          "Keynote address and curated art exhibition by people living with pain at India's largest disability arts and culture festival — highlighting invisible disability, lived authority, and accessible creative expression.",
        featured: true,
        photoUrl: "/images/work-engagements_2.jpeg",
        photoAlt: "Pratik Aggarwal delivering keynote at Purple Fest Goa",
      },
      {
        event: "Delhi Master Plan 2041",
        org: "Delhi Development Authority",
        year: "2023",
        role: "Panelist",
        description:
          "Panel on disability-inclusive urban planning, with specific focus on the gap between built-environment standards and the reality of invisible and chronic conditions.",
      },
      {
        event: "SLIC — Supported Living & Inclusion Conclave",
        year: "2023",
        role: "Speaker",
        description:
          "Talk on community-based support systems for people with psychosocial and invisible disabilities in urban India — moving beyond residential care models.",
      },
      {
        event: "HRLN — Human Rights Law Network",
        org: "Human Rights Law Network",
        year: "2022",
        role: "Speaker",
        description:
          "Speaker on the legal status of invisible and psychosocial disabilities under the Rights of Persons with Disabilities Act, 2016 — implementation gaps and advocacy pathways.",
      },
      {
        event: "Keystone Institute",
        year: "2022",
        role: "Trainer",
        description:
          "Residential training programme for development sector practitioners on disability-inclusive programme design and rights-based approaches.",
      },
      {
        event: "NDMA + UN India",
        org: "National Disaster Management Authority & UN India",
        year: "2022",
        role: "Advisory",
        description:
          "Advisory input on the national disability-inclusive disaster risk reduction framework, with emphasis on invisible disabilities and psychosocial support in emergencies.",
      },
    ],
  },
  {
    id: "academic",
    category: "Academic & International",
    title: "Academic & International",
    entries: [
      {
        event: "UNICEF Bihar",
        org: "UNICEF India",
        year: "2023",
        role: "Trainer",
        description:
          "Capacity-building workshop for district-level child rights officers in Bihar on disability-inclusive programming — from policy to frontline practice.",
        featured: true,
        photoUrl: "/images/work-engagements_3.jpeg",
        photoAlt: "Pratik Aggarwal leading workshop with UNICEF Bihar officers",
      },
      {
        event: "Kirori Mal College",
        org: "University of Delhi",
        year: "2023",
        role: "Lecturer",
        description:
          "Lecture and open discussion for undergraduate students on the social model of disability, stigma, and invisible conditions — and why the language we use matters.",
      },
      {
        event: "Embassy of Spain, New Delhi",
        org: "Spanish Embassy",
        year: "2022",
        role: "Speaker",
        description:
          "Cultural-diplomatic event on disability arts, representation, and inclusive policy exchange between India and Spain.",
      },
      {
        event: "Embassy of Finland, New Delhi",
        org: "Finnish Embassy",
        year: "2022",
        role: "Panelist",
        description:
          "Panel comparing Finland–India models of disability inclusion, with focus on early intervention, school inclusion, and the rights-based approach.",
      },
      {
        event: "ARNEC Regional Conference, Manila",
        org: "Asia-Pacific Regional Network for Early Childhood",
        year: "2019",
        role: "Speaker",
        description:
          "Presentation on disability-inclusive early childhood development within India's urban informal settlements — evidence, gaps, and community-led approaches.",
      },
    ],
  },
  {
    id: "media-podcasts",
    category: "Media Features & Podcasts",
    title: "Podcasts, Ground Reports & Publications",
    entries: [
      {
        event: "Disability, Poverty & Inclusive Education (Podcast Ep. 32)",
        org: "YouTube Podcast",
        year: "2024",
        role: "Speaker",
        description:
          "In-depth podcast interview discussing frontline community work, disability rights, poverty, and inclusive education in India.",
        url: "https://www.youtube.com/watch?v=eUSRzBr0FFc&t=1345s",
      },
      {
        event: "Nothing About Us, Without Us: Disability Rights in the Classroom",
        org: "Postcards Series #6",
        year: "2024",
        role: "Speaker",
        description:
          "Podcast episode on rights-based education, lived authority, and classroom inclusion.",
        url: "https://youtu.be/onm9zJjB_PI?si=EcPvzmQ1VJkHIxrn",
      },
      {
        event: "Safdarjung Hospital Sensory Garden ('Umang Vatika')",
        org: "The Better India, Indian Express & DD News",
        year: "2024",
        role: "Advisory",
        description:
          "National media coverage on North India's first government sensory garden for neurodivergent children, created in collaboration with ASTHA.",
        url: "https://thebetterindia.com/innovation/umang-vatika-safdarjung-hospital-delhi-sensory-park-children-disabilities-astha-11168102",
      },
      {
        event: "Delhi 'Viklang Basti' Fire & Wheelchair Advocacy",
        org: "The Print Ground Report",
        year: "2024",
        role: "Advisory",
        description:
          "Field reporting on emergency crisis response, disability rights advocacy, and wheelchair access in informal settlements.",
        url: "https://theprint.in/ground-reports/delhis-viklang-basti-lost-fire-fought-new-wheelchairs/2971119/",
      },
      {
        event: "India's Persons With Disabilities Left Out As NFHS-6 Omits Data",
        org: "Outlook India",
        year: "2024",
        role: "Advisory",
        description:
          "Critical commentary on systemic data omission of persons with disabilities in national health surveys.",
        url: "https://www.outlookindia.com/national/indias-persons-with-disabilities-left-out-as-nfhs-6-fact-sheets-omit-disability-data",
      },
      {
        event: "Disability Care Lags in Delhi Slums & School Violations",
        org: "Times of India & Citizen Matters",
        year: "2023",
        role: "Advisory",
        description:
          "Expert insights on informal settlement care deficits and urban school non-compliance with the Rights of Persons with Disabilities Act.",
        url: "https://timesofindia.indiatimes.com/city/delhi/out-of-sight-out-of-support-disability-care-lags-in-delhis-slums-in-most-trying-of-times/articleshow/122526141.cms",
      },
      {
        event: "Thirty Years of Working with Communities",
        org: "Samuhik Pahal",
        year: "2023",
        role: "Lecturer",
        description:
          "Published reflections on 30 years of rights-based community engagement and organizational development.",
        url: "https://samuhikpahal.org/reflections-and-opinions/thirty-years-of-working-with-communities/",
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

// ── Photo component ────────────────────────────────────────────────────────────

function EventPhoto({ src, alt }: { src?: string; alt?: string }) {
  return (
    <figure className="mb-0">
      <div
        className="relative w-full rounded-t-xl overflow-hidden bg-muted"
        style={{ aspectRatio: "16 / 7" }}
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

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Work() {
  useRevealAll();
  return (
    <div>
      <PageMeta
        title="Work & Engagements"
        description="Selected talks, workshops, panels, and advisory engagements by Pratik Aggarwal — from UNICEF Bihar to Purple Fest Goa. Disability inclusion across corporates, NGOs, and government."
        path="/work"
        keywords="Pratik Aggarwal speaker, disability keynote India, invisible disability talks, UNICEF disability workshop, Purple Fest Goa keynote"
      />
      <JsonLd schema={[
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pratik-aggarwal-website.vercel.app" },
            { "@type": "ListItem", "position": 2, "name": "Work & Engagements", "item": "https://pratik-aggarwal-website.vercel.app/work" }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Speaking & Advisory Engagements — Pratik Aggarwal",
          "description": "Selected talks, workshops, panels, and advisory roles by Pratik Aggarwal on disability inclusion, invisible disabilities, and accessible development.",
          "itemListElement": [
            {
              "@type": "ListItem", "position": 1,
              "item": {
                "@type": "Event",
                "name": "Purple Fest Goa 2024 — Keynote",
                "description": "Keynote address at India's largest disability arts and culture festival on invisible disability, identity, and what genuine inclusion requires from arts and public spaces.",
                "startDate": "2024",
                "organizer": { "@type": "Organization", "name": "Disability Rights Coalition, Goa" },
                "location": { "@type": "Place", "name": "Goa, India" },
                "speaker": { "@id": "https://pratik-aggarwal-website.vercel.app/#pratik-aggarwal" }
              }
            },
            {
              "@type": "ListItem", "position": 2,
              "item": {
                "@type": "Event",
                "name": "UNICEF Bihar — Disability-Inclusive Capacity Building",
                "description": "Capacity-building workshop for district-level child rights officers in Bihar on disability-inclusive programming — from policy to frontline practice.",
                "startDate": "2023",
                "organizer": { "@type": "Organization", "name": "UNICEF India" },
                "location": { "@type": "Place", "name": "Bihar, India" },
                "speaker": { "@id": "https://pratik-aggarwal-website.vercel.app/#pratik-aggarwal" }
              }
            },
            {
              "@type": "ListItem", "position": 3,
              "item": {
                "@type": "Event",
                "name": "NDMA + UN India — Disability-Inclusive Disaster Risk Reduction",
                "description": "Advisory input on the national disability-inclusive disaster risk reduction framework, with emphasis on invisible disabilities and psychosocial support in emergencies.",
                "startDate": "2022",
                "organizer": { "@type": "Organization", "name": "National Disaster Management Authority & UN India" },
                "location": { "@type": "Place", "name": "New Delhi, India" },
                "speaker": { "@id": "https://pratik-aggarwal-website.vercel.app/#pratik-aggarwal" }
              }
            },
            {
              "@type": "ListItem", "position": 4,
              "item": {
                "@type": "Event",
                "name": "ARNEC Regional Conference, Manila",
                "description": "Presentation on disability-inclusive early childhood development within India's urban informal settlements — evidence, gaps, and community-led approaches.",
                "startDate": "2019",
                "organizer": { "@type": "Organization", "name": "Asia-Pacific Regional Network for Early Childhood" },
                "location": { "@type": "Place", "name": "Manila, Philippines" },
                "speaker": { "@id": "https://pratik-aggarwal-website.vercel.app/#pratik-aggarwal" }
              }
            }
          ]
        }
      ]} />

      {/* ── Page header ───────────────────────────────────────────────── */}
      <header className="px-6 pt-20 pb-14 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
            Work
          </p>
          <h1
            className="text-5xl md:text-6xl text-foreground mb-5 tracking-tight"
            style={{ fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.07 }}
          >
            Engagements
          </h1>
          <p className="text-lg text-muted-foreground max-w-[54ch] leading-relaxed">
            A curated selection of talks, panels, training sessions, and advisory
            engagements. Not an exhaustive list — a representative one.
          </p>
        </div>
      </header>

      {/* ── Groups ────────────────────────────────────────────────────── */}
      <div className="divide-y divide-border">
        {groups.map((group) => (
          <section
            key={group.id}
            id={group.id}
            aria-labelledby={`${group.id}-heading`}
            className="px-6 py-16 md:py-20"
          >
            <div className="max-w-5xl mx-auto">

              {/* Section heading */}
              <div className="mb-10 md:mb-12">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  {group.category}
                </p>
                <h2
                  id={`${group.id}-heading`}
                  className="text-3xl md:text-4xl text-foreground"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  {group.title}
                </h2>
              </div>

              {/* Entry list */}
              <ul className="reveal-stagger list-none m-0 p-0" role="list">
                {group.entries.map((entry, i) => (
                  <li
                    key={entry.event}
                    className={
                      i > 0 ? "border-t border-border mt-0" : ""
                    }
                  >
                    {/* Featured photo — sits flush above the entry row */}
                    {entry.featured && (
                      <div className={i > 0 ? "mt-8" : ""}>
                        <EventPhoto src={entry.photoUrl} alt={entry.photoAlt} />
                      </div>
                    )}

                    {/* Entry body */}
                    <div
                      className={`py-6 md:py-7 ${
                        entry.featured ? "border border-t-0 border-border rounded-b-xl px-6 mb-2" : ""
                      }`}
                    >
                      {/* Top row: event name left, role + year right */}
                      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 mb-2">
                        <h3
                          className="text-base font-semibold text-foreground leading-snug"
                          style={{
                            fontFamily: "'Public Sans', system-ui, sans-serif",
                          }}
                        >
                          {entry.event}
                        </h3>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <RolePill role={entry.role} />
                          <span className="text-sm text-muted-foreground tabular-nums">
                            {entry.year}
                          </span>
                        </div>
                      </div>

                      {/* Org line */}
                      {entry.org && (
                        <p className="text-sm text-muted-foreground mb-2.5">
                          {entry.org}
                        </p>
                      )}

                      {/* Description */}
                      <p className="text-base text-muted-foreground leading-relaxed max-w-[65ch]">
                        {entry.description}
                      </p>

                      {/* Optional Link */}
                      {entry.url && (
                        <div className="mt-3">
                          <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-semibold underline underline-offset-4"
                            style={{ color: "var(--plum)" }}
                          >
                            View feature / watch video →
                          </a>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="speak-cta-heading"
        className="px-6 py-16 border-t border-border"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2
              id="speak-cta-heading"
              className="text-2xl md:text-3xl text-foreground mb-2"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Looking for a speaker or panelist?
            </h2>
            <p className="text-base text-muted-foreground max-w-[52ch] leading-relaxed">
              I speak from lived experience and nine years of professional
              practice — on invisible disability, chronic illness, intersectional
              access, and what inclusion actually requires.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-flex items-center px-7 py-3.5 rounded-md bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0"
          >
            Invite me to speak
          </Link>
        </div>
      </section>

    </div>
  );
}
