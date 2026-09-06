import { Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";
import { track } from "@vercel/analytics";

// ── Data ───────────────────────────────────────────────────────────
const stories = [
  {
    id: 1,
    tag: "Holistic Wellness",
    title: "Sujatha Rao’s Journey with Fibromyalgia: Finding Hope",
    excerpt:
      "Sujatha Rao shares her inspiring journey living with fibromyalgia, processing loss, and reclaiming agency through holistic well-being.",
    readTime: "6 min",
    author: "Sujatha Rao",
    href: "/medium/Sujatha%20Rao%20shares%20her%20inspiring%20journey%20with%20Fibromyalgia,%20finding%20hope%20amidst%20pain%20and%20loss,%20discovering%20the%20power%20of%20holistic%20wellness%20_%20Medium.pdf",
    imgTint: "plum",
  },
  {
    id: 2,
    tag: "Empowerment",
    title: "Zanna Barrett’s Journey: Chronic Pain to Empowerment",
    excerpt:
      "Zanna Barrett reflects on transforming chronic pain into community advocacy, self-definition, and collective strength.",
    readTime: "5 min",
    author: "Zanna Barrett",
    href: "/medium/Zanna%20Barrett%E2%80%99s%20Journey_%20Chronic%20Pain%20to%20Empowerment%20_%20Medium.pdf",
    imgTint: "sand",
  },
  {
    id: 3,
    tag: "ME / CFS",
    title: "Beyond Diagnosis: ME/CFS & Invisible Challenges",
    excerpt:
      "Navigating Myalgic Encephalomyelitis / Chronic Fatigue Syndrome — post-exertional malaise and the daily reality of un-legible symptoms.",
    readTime: "7 min",
    author: "Community Member",
    href: "/medium/_Beyond%20Diagnosis_%20ME_CFS%20%26%20Invisible%20Challenges_%20_%20Medium.pdf",
    imgTint: "plum",
  },
  {
    id: 4,
    tag: "Tracheostomy Care",
    title: "Living With a Tracheostomy and Chronic Illness",
    excerpt:
      "A rare personal narrative on managing complex airway care alongside chronic systemic illness while navigating public spaces.",
    readTime: "5 min",
    author: "Community Member",
    href: "/medium/Living%20With%20a%20Tracheostomy%20and%20Chronic%20Illness%20_%20Medium.pdf",
    imgTint: "sand",
  },
  {
    id: 5,
    tag: "Endometriosis",
    title: "Endometriosis and Chronic Pain: Navigating Life & Diagnosis",
    excerpt:
      "Exploring severe chronic pelvic pain, surgical delays, and finding validation when symptoms are dismissed by medical systems.",
    readTime: "6 min",
    author: "Community Member",
    href: "/medium/Endometriosis%20and%20Chronic%20Pain%20Story%20_%20Medium.pdf",
    imgTint: "plum",
  },
  {
    id: 6,
    tag: "Long COVID & Fibro",
    title: "Overcoming Fibromyalgia & Long-COVID: A Journey of Persistence",
    excerpt:
      "Exploring the compounding realities of post-viral Long COVID and chronic fibromyalgia, and finding community solidarity in collective healing.",
    readTime: "6 min",
    author: "Community Member",
    href: "/medium/Overcoming%20Fibromyalgia%20%26%20Long-COVID_%20Journey%20_%20Medium.pdf",
    imgTint: "sand",
  },
  {
    id: 7,
    tag: "Pelvic Pain & Stigma",
    title: "She Thought It Was Just Another Infection: Reclaiming Peace & Power",
    excerpt:
      "Breaking silence around taboo pelvic pain and chronic infections that disrupt bodily autonomy, peace, and daily living.",
    readTime: "5 min",
    author: "Community Contributor",
    href: "/medium/She%20Thought%20It%20Was%20Just%20Another%20Yeast%20Infection,%20But%20It%20Stole%20Her%20Peace%20and%20Power%20_%20by%20Pratik%20Aggarwal%20_%20Medium.html",
    imgTint: "plum",
  },
  {
    id: 8,
    tag: "Neuroplastic Pain",
    title: "Why Pain Persists Even When Tests Are Normal",
    excerpt:
      "Understanding nervous system sensitization, medical normalcy, and validating chronic symptoms that don't show up on conventional scans.",
    readTime: "5 min",
    author: "Community Contributor",
    href: "/medium/Why%20Pain%20Persists%20Even%20When%20Tests%20Are%20Normal%20_%20Medium.pdf",
    imgTint: "sand",
  },
  {
    id: 9,
    tag: "Founder Note",
    title: "Understanding the Unseen: A Neuropsychologist’s Journey",
    excerpt:
      "A neuropsychologist shares his lived experience of chronic pain and invisible illness, and why he founded Blooming in Pain to build community.",
    readTime: "4 min",
    author: "Pratik Aggarwal",
    href: "/medium/Living%20with%20Chronic%20Pain_%20A%20Psychologist%E2%80%99s%20Story%20_%20Medium.html",
    imgTint: "plum",
  },
];

const cardGradient = {
  sand: "linear-gradient(145deg, #EDE9EF 0%, #D8D0DC 100%)",
  plum: "linear-gradient(145deg, #EAE2F0 0%, #D4C6E4 100%)",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function BloomingInPain() {
  return (
    <div>
      <PageMeta
        title="Blooming in Pain — Stories of Invisible Disability"
        description="Blooming in Pain is a storytelling platform for people living with invisible disabilities — fibromyalgia, chronic fatigue, lupus, anxiety, and more. Real stories. Honest voices. Founded by Pratik Aggarwal."
        path="/blooming-in-pain"
        keywords="invisible disability stories, fibromyalgia community, chronic illness platform, Blooming in Pain, invisible illness blog India"
      />
      <JsonLd schema={[
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://pratik-aggarwal-website.vercel.app" },
            { "@type": "ListItem", "position": 2, "name": "Blooming in Pain", "item": "https://pratik-aggarwal-website.vercel.app/blooming-in-pain" }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://pratik-aggarwal-website.vercel.app/#blooming-in-pain",
          "name": "Blooming in Pain",
          "url": "https://pratik-aggarwal-website.vercel.app/blooming-in-pain",
          "sameAs": [
            "https://medium.com/@BloomingInPain",
            "https://instagram.com/blooming.in.pain"
          ],
          "founder": { "@id": "https://pratik-aggarwal-website.vercel.app/#pratik-aggarwal" },
          "description": "Blooming in Pain is a storytelling platform founded by Pratik Aggarwal for people living with invisible disabilities — including fibromyalgia, chronic fatigue syndrome, lupus, anxiety disorders, endometriosis, and other conditions that exist between what bodies hold and what medicine is prepared to name. It publishes honest, first-person accounts of life with invisible illness — without inspiration framing, tragedy arcs, or the requirement to be believed first.",
          "knowsAbout": [
            "Invisible disabilities", "Fibromyalgia", "Chronic fatigue syndrome",
            "Lupus", "Anxiety disorders", "Endometriosis", "Chronic pain",
            "Community storytelling", "Lived experience of disability"
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is an invisible disability?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "An invisible disability is a physical, mental, or neurological condition that is not immediately apparent to others. Examples include fibromyalgia, chronic fatigue syndrome (ME/CFS), lupus, anxiety disorders, depression, endometriosis, Crohn's disease, multiple sclerosis, and many others. People with invisible disabilities often face disbelief, dismissal, and the burden of having to prove their condition — because they 'don't look sick.' Blooming in Pain exists specifically to tell the truth about what these conditions feel like from the inside."
              }
            },
            {
              "@type": "Question",
              "name": "What is Blooming in Pain?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Blooming in Pain is a storytelling platform founded by Pratik Aggarwal for people living with invisible disabilities. It publishes honest, first-person accounts of life with invisible illness — without inspiration framing, without tragedy arcs, and without the requirement that contributors be believed before they begin. Stories are published on Medium and shared through Instagram. Contributors do not need a formal diagnosis — they need to have lived it."
              }
            },
            {
              "@type": "Question",
              "name": "Can I contribute a story to Blooming in Pain without a formal diagnosis?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Blooming in Pain does not require a formal diagnosis to contribute. The platform recognises that getting a diagnosis for an invisible condition is itself often a long, difficult, and gatekept process. If you have lived experience of an invisible or chronic condition — whether named or not — your story belongs here. Stories are reviewed before publication and contributors are contacted within two weeks."
              }
            },
            {
              "@type": "Question",
              "name": "What kinds of invisible disabilities are covered on Blooming in Pain?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Blooming in Pain covers the full range of invisible and chronic conditions, including but not limited to: fibromyalgia, chronic fatigue syndrome (ME/CFS), lupus, endometriosis, anxiety disorders, depression, PTSD, Crohn's disease, IBS, multiple sclerosis, POTS, PCOS, chronic migraine, and other conditions that are not immediately visible to others. The platform also welcomes stories about the experience of navigating healthcare, employment, and relationships with an invisible condition."
              }
            },
            {
              "@type": "Question",
              "name": "How is Blooming in Pain different from a support group?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Blooming in Pain is not a support group — it is a storytelling platform. The distinction matters: a support group is structured around helping members cope. Blooming in Pain is structured around bearing witness — creating a public record of what life with invisible disability actually looks like, for people who need to see their experience reflected and for people who need to understand it. It's closer to literary non-fiction than peer support."
              }
            }
          ]
        }
      ]} />

      {/* ── Hero / What it is ─────────────────────────────────────────── */}
      <header
        className="px-6 pt-20 pb-20 border-b border-border"
        style={{ backgroundColor: "var(--ground)" }}
      >
        <div className="max-w-[70ch] mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: "var(--bloom)" }}
          >
            Initiative by Pratik Aggarwal
          </p>

          <h1
            className="text-5xl md:text-7xl text-foreground mb-8 tracking-tight"
            style={{ fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.07 }}
          >
            Blooming<br />
            <em
              style={{
                fontStyle: "italic",
                color: "var(--plum)",
              }}
            >
              in Pain
            </em>
          </h1>

          <div className="space-y-5 text-lg text-foreground leading-relaxed">
            <p>
              Blooming in Pain is a storytelling platform for people who live
              with disabilities the world can't see — fibromyalgia, chronic
              fatigue, lupus, anxiety disorders, endometriosis, and the hundreds
              of other conditions that exist in the space between what bodies
              hold and what medicine is prepared to name.
            </p>
            <p>
              This isn't a resource hub. It isn't a support group. It's a place
              where people write about their lives honestly — the hard parts and
              the full parts — and where they don't have to explain themselves
              before they begin.
            </p>
            <p>
              We started this because we couldn't find it. You're welcome to
              stay.
            </p>
          </div>
        </div>
      </header>

      {/* ── Pull-quote ────────────────────────────────────────────────── */}
      <div className="px-6 py-16 border-b border-border">
        <div className="max-w-[65ch] mx-auto">
          <blockquote>
            <p
              className="text-2xl md:text-3xl text-foreground italic leading-relaxed"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              "A space to be believed — not explained, not inspired, not
              compared to someone who has it worse. Just heard."
            </p>
            <footer className="mt-5 text-sm text-muted-foreground not-italic">
              — Pratik Aggarwal, founder
            </footer>
          </blockquote>
        </div>
      </div>

      {/* ── Story grid ────────────────────────────────────────────────── */}
      <section aria-labelledby="stories-heading" className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">

          <div className="flex items-end justify-between gap-6 mb-10 flex-wrap">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--bloom)" }}
              >
                Stories
              </p>
              <h2
                id="stories-heading"
                className="text-3xl md:text-4xl text-foreground"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Recent from the platform
              </h2>
            </div>
            <a
              href="https://medium.com/@BloomingInPain"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-foreground underline underline-offset-4 hover:text-primary transition-colors shrink-0"
              onClick={() => track("outbound_click", { destination: "medium", location: "stories_section" })}
            >
              All stories on Medium
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </div>

          <ul
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none m-0 p-0"
            role="list"
          >
            {stories.map((story) => (
              <li key={story.id} className="flex">
                <Card className="flex flex-col w-full bg-card border-border shadow-none hover:shadow-sm transition-shadow">

                  {/* Card image */}
                  <div
                    className="relative w-full rounded-t-lg overflow-hidden flex-none"
                    style={{ aspectRatio: "16/9" }}
                    role="img"
                    aria-label={`Illustration for: ${story.title}`}
                  >
                    <div
                      className="absolute inset-0"
                      style={{ background: cardGradient[story.imgTint as keyof typeof cardGradient] }}
                      aria-hidden="true"
                    />
                    {/* Tag overlaid on image */}
                    <span
                      className="absolute bottom-3 left-4 text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: "rgba(255,255,255,0.85)", color: "var(--plum)" }}
                    >
                      {story.tag}
                    </span>
                  </div>

                  <CardContent className="flex flex-col flex-1 p-5">
                    <h3
                      className="text-lg text-foreground leading-snug mb-2.5"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      {story.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                      {story.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {story.author} · {story.readTime}
                      </span>
                      <a
                        href={story.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity"
                        style={{ color: "var(--plum)" }}
                        aria-label={`Read "${story.title}" on Medium (opens in new tab)`}
                      >
                        Read →
                        <span className="sr-only">(opens in new tab)</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>

        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="bip-faq-heading"
        className="px-6 py-20 border-t border-border"
      >
        <div className="max-w-5xl mx-auto">
          <h2
            id="bip-faq-heading"
            className="text-3xl md:text-4xl text-foreground mb-12"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Questions about the platform
          </h2>
          <dl className="divide-y divide-border">
            {[
              {
                q: "What is an invisible disability?",
                a: "An invisible disability is a physical, mental, or neurological condition that is not immediately apparent to others — fibromyalgia, chronic fatigue, lupus, anxiety disorders, endometriosis, and hundreds more. People with invisible disabilities often face disbelief and the burden of having to prove their condition, because they 'don't look sick.' Blooming in Pain exists to tell the truth about what these conditions feel like from the inside.",
              },
              {
                q: "Can I contribute without a formal diagnosis?",
                a: "Yes. Getting a diagnosis for an invisible condition is itself often a long, difficult, gatekept process. You don't need a name for what you have. If you have lived experience of an invisible or chronic condition — whether named or not — your story belongs here. We'll work with you from there.",
              },
              {
                q: "What kinds of conditions are covered here?",
                a: "The full range: fibromyalgia, chronic fatigue syndrome (ME/CFS), lupus, endometriosis, anxiety, depression, PTSD, Crohn's, IBS, multiple sclerosis, POTS, PCOS, chronic migraine, and more. We also welcome stories about navigating healthcare, employment, and relationships with an invisible condition — not just the condition itself.",
              },
              {
                q: "How is this different from a support group?",
                a: "Blooming in Pain is a storytelling platform, not a support group. A support group is structured around helping members cope. This platform is structured around bearing witness — creating a public record of what life with invisible disability actually looks like. It's closer to literary non-fiction than peer support.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="py-8">
                <dt
                  className="text-lg font-semibold text-foreground mb-3 leading-snug"
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                >
                  {q}
                </dt>
                <dd className="text-base text-muted-foreground leading-relaxed max-w-[70ch]">
                  {a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Share your story ──────────────────────────────────────────── */}
      <section
        aria-labelledby="share-heading"
        className="px-6 py-20 border-t border-border"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="max-w-[65ch] mx-auto text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: "var(--bloom)" }}
          >
            Contribute
          </p>
          <h2
            id="share-heading"
            className="text-3xl md:text-4xl text-foreground mb-6"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Your story belongs here
          </h2>
          <p className="text-lg text-foreground leading-relaxed mb-4">
            We're not looking for polished essays or resolved conclusions. We're
            looking for honest accounts of what your life actually looks like —
            how you manage, how you don't, what helps, and what doesn't.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            You don't need a diagnosis to contribute. You need to have lived it.
            We'll work with you from there.
          </p>
          <Link
            to="/blooming-in-pain/submit"
            className="inline-flex items-center px-8 py-3.5 rounded-md font-semibold text-base text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--plum)" }}
          >
            Share your story
          </Link>
          <p className="mt-5 text-sm text-muted-foreground">
            Stories are reviewed before publication. We'll be in touch within
            two weeks.
          </p>
        </div>
      </section>

      {/* ── Follow ────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="follow-heading"
        className="px-6 py-16 md:py-20 border-t border-border"
      >
        <div className="max-w-5xl mx-auto">
          <h2
            id="follow-heading"
            className="text-3xl md:text-4xl text-foreground mb-10"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Stay connected
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">

            {/* Instagram */}
            <a
              href="https://instagram.com/blooming.in.pain"
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-8 md:p-10 rounded-2xl border border-border bg-card hover:border-secondary/50 transition-colors"
              aria-label="Follow @blooming.in.pain on Instagram (opens in new tab)"
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: "var(--bloom)" }}
              >
                Instagram
              </p>
              <p
                className="text-3xl text-foreground mb-3 group-hover:text-primary transition-colors"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                @blooming.in.pain
              </p>
              <p className="text-base text-muted-foreground mb-7 leading-relaxed">
                Short posts, community moments, and the kind of things that
                don't make it into an essay — but still need to be said.
              </p>
              <span
                className="inline-flex items-center text-sm font-semibold underline underline-offset-4"
                style={{ color: "var(--plum)" }}
              >
                Follow on Instagram →
                <span className="sr-only">(opens in new tab)</span>
              </span>
            </a>

            {/* Medium */}
            <a
              href="https://medium.com/@BloomingInPain"
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-8 md:p-10 rounded-2xl border border-border bg-card hover:border-secondary/50 transition-colors"
              aria-label="Read Blooming in Pain on Medium (opens in new tab)"
              onClick={() => track("outbound_click", { destination: "medium", location: "follow_section" })}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: "var(--bloom)" }}
              >
                Medium
              </p>
              <p
                className="text-3xl text-foreground mb-3 group-hover:text-primary transition-colors"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                @BloomingInPain
              </p>
              <p className="text-base text-muted-foreground mb-7 leading-relaxed">
                Long-form personal essays and guest pieces — stories told in
                full, without the word count running out.
              </p>
              <span
                className="inline-flex items-center text-sm font-semibold underline underline-offset-4"
                style={{ color: "var(--plum)" }}
              >
                Read on Medium →
                <span className="sr-only">(opens in new tab)</span>
              </span>
            </a>

          </div>

          {/* Newsletter note */}
          <div className="mt-10 pt-10 border-t border-border max-w-[60ch]">
            <p className="text-base text-muted-foreground leading-relaxed">
              We send a short newsletter a couple of times a month — new
              stories, occasional resources, nothing more. No pitch, no
              algorithm.{" "}
              <Link
                to="/contact"
                className="font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity"
                style={{ color: "var(--plum)" }}
              >
                Subscribe here.
              </Link>
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
