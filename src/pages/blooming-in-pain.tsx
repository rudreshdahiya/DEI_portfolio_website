import { Link } from "react-router";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";
import { track } from "@vercel/analytics";
import { StoryCarousel, Story } from "@/components/story-carousel";

// ── Data ───────────────────────────────────────────────────────────
const stories: Story[] = [
  {
    id: 1,
    tag: "Endometriosis",
    title: "Living with Endometriosis: Srinikhita Pole’s Story of Chronic Pain, Surgery, and Resilience",
    excerpt:
      "Srinikhita Pole reflects on living with severe endometriosis, navigating major surgeries, and discovering resilience amidst chronic pelvic pain.",
    readTime: "6 min",
    author: "Srinikhita Pole",
    mediumUrl:
      "https://medium.com/@BloomingInPain/living-with-endometriosis-srinikhita-poles-story-of-chronic-pain-surgery-and-resilience-e22486eeb5f7",
    imgUrl:
      "/medium/Living%20with%20Endometriosis-%20Srinikhita%20Pole%E2%80%99s%20Story%20of%20Chronic%20Pain,%20Surgery,%20and%20Resilience_image.webp",
  },
  {
    id: 2,
    tag: "Founder Note",
    title: "Understanding the Unseen: A Neuropsychologist’s Personal Journey with Chronic Pain",
    excerpt:
      "A neuropsychologist shares his lived experience of chronic pain and invisible illness, and why he founded Blooming in Pain to build community.",
    readTime: "5 min",
    author: "Pratik Aggarwal",
    mediumUrl:
      "https://medium.com/@BloomingInPain/understanding-the-unseen-a-neuropsychologists-personal-journey-with-chronic-pain-262dbee5357f",
    imgUrl:
      "/medium/Understanding%20the%20Unseen-%20A%20Neuropsychologist%E2%80%99s%20Personal%20Journey%20with%20Chronic%20Pain_image.webp",
  },
  {
    id: 3,
    tag: "Chronic Illness",
    title: "Living with Pain: Varshal’s Story of Strength and Stillness",
    excerpt:
      "Varshal shares her journey after her body suddenly turned against her at a young age, finding inner quiet, strength, and acceptance.",
    readTime: "5 min",
    author: "Varshal",
    mediumUrl:
      "https://medium.com/@BloomingInPain/living-with-pain-varshals-story-of-strength-and-stillness-de0f29706db9",
    imgUrl:
      "/medium/She%20Was%20Active,%20Healthy,%20and%20Young-%20Then%20Her%20Body%20Turned%20Against%20Her_image.webp",
  },
  {
    id: 4,
    tag: "Pelvic Pain & Stigma",
    title: "She Thought It Was Just Another Yeast Infection: Years of Misdiagnosis & Pelvic Pain",
    excerpt:
      "Breaking silence around taboo pelvic pain and chronic infections that disrupt bodily autonomy, peace, and daily living.",
    readTime: "6 min",
    author: "Pratik Aggarwal",
    mediumUrl:
      "https://medium.com/@BloomingInPain/she-thought-it-was-just-another-yeast-infection-what-followed-was-years-of-misdiagnosis-pain-21ca8e569330",
    imgUrl:
      "/medium/She%20Thought%20It%20Was%20Just%20Another%20Yeast%20Infection,%20But%20It%20Stole%20Her%20Peace%20and%20Power_image.webp",
  },
  {
    id: 5,
    tag: "Patient Advocacy",
    title: "Kevin James’ Unyielding Fight: Surviving Iatrogenic Injuries & Misdiagnoses",
    excerpt:
      "Navigating complex medical trauma, iatrogenic harm, and the emotional journey from systemic medical disbelief to fierce self-advocacy.",
    readTime: "7 min",
    author: "Kevin James",
    mediumUrl:
      "https://medium.com/@BloomingInPain/kevin-james-unyielding-fight-surviving-iatrogenic-injuries-misdiagnoses-and-the-emotional-bb4d0579d29f",
    imgUrl:
      "/medium/Kevin%20James%E2%80%99%20Unyielding%20Fight-%20Surviving%20Iatrogenic%20Injuries,%20Misdiagnoses,%20and%20the%20Emotional%20Journey%20to%20Self-Advocacy_image.webp",
  },
  {
    id: 6,
    tag: "Caregiving & Allyship",
    title: "Shabnam Rakhiba’s Guide to Love and Care: Standing by Someone with Chronic Pain",
    excerpt:
      "An insightful guide for partners, family, and allies on providing meaningful care, emotional grounding, and active support for loved ones with chronic pain.",
    readTime: "5 min",
    author: "Shabnam Rakhiba",
    mediumUrl:
      "https://medium.com/@BloomingInPain/shabnam-rakhibas-guide-to-love-and-care-standing-by-someone-with-chronic-pain-b687cd63fc28",
    imgUrl:
      "/medium/Shabnam%20Rakhiba%E2%80%99s%20Guide%20to%20Love%20and%20Care-%20Standing%20by%20Someone%20with%20Chronic%20Pain_image.webp",
  },
  {
    id: 7,
    tag: "Global Advocacy",
    title: "Rising from the Abyss: Virginia McIntyre’s Journey to International Advocacy",
    excerpt:
      "From chronic pain patient to global patient advocate, Virginia McIntyre shares how processing deep illness transformed her into a champion for disability rights.",
    readTime: "6 min",
    author: "Virginia McIntyre",
    mediumUrl:
      "https://medium.com/@BloomingInPain/rising-from-the-abyss-virginia-mcintyres-journey-from-chronic-pain-patient-to-international-1fefa2664bf1",
    imgUrl:
      "/medium/Rising%20from%20the%20Abyss-%20Virginia%20McIntyre%E2%80%99s%20Journey%20from%20Chronic%20Pain%20Patient%20to%20International%20Advocate_image.webp",
  },
  {
    id: 8,
    tag: "Resilience & Art",
    title: "The Last Dance: Abitha P Sunil Rises Through Pain",
    excerpt:
      "Abitha P Sunil reflects on dance, movement, and bodily expression while navigating the unyielding onset of chronic pain.",
    readTime: "5 min",
    author: "Abitha P Sunil",
    mediumUrl:
      "https://medium.com/@BloomingInPain/the-last-dance-abitha-p-sunil-rises-through-pain-27ca52c584a2",
    imgUrl:
      "/medium/The%20Last%20Dance-%20Abitha%20P%20Sunil%20Rises%20Through%20Pain_image.webp",
  },
  {
    id: 9,
    tag: "Lived Experience",
    title: "I Am Changed: Navigating Life, Loss, and Identity with Chronic Illness",
    excerpt:
      "A reflective personal essay on grief, body identity, and letting go of who you were to embrace who you are today.",
    readTime: "4 min",
    author: "Community Contributor",
    mediumUrl:
      "https://medium.com/@BloomingInPain/i-am-changed-ffe9ecd433be",
    imgUrl:
      "/medium/I%20am%20changed_image.webp",
  },
];

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
              Blooming in Pain is a <span data-key-info>storytelling platform for people who live with disabilities the world can't see</span> — fibromyalgia, chronic fatigue, lupus, anxiety disorders, endometriosis, and the hundreds of other conditions that exist in the space between what bodies hold and what medicine is prepared to name.
            </p>
            <p>
              This isn't a resource hub. It isn't a support group. It's a place where <span data-key-info>people write about their lives honestly</span> — the hard parts and the full parts — and where they don't have to explain themselves before they begin.
            </p>
            <p>
              We started this because we couldn't find it. You're welcome to stay.
            </p>
          </div>
        </div>
      </header>

      {/* ── Pull-quote ────────────────────────────────────────────────── */}
      <div className="px-6 py-16 border-b border-border">
        <div className="max-w-[65ch] mx-auto">
          <blockquote className="relative">
            <p
              className="text-2xl md:text-3xl text-foreground italic leading-relaxed"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              "<span data-key-info>A space to be believed</span> — not explained, not inspired, not
              compared to someone who has it worse. <span data-key-info>Just heard.</span>"
            </p>
            <footer className="mt-5 text-sm text-muted-foreground not-italic">
              — Pratik Aggarwal, founder
            </footer>
          </blockquote>
        </div>
      </div>

      {/* ── Story Carousel ────────────────────────────────────────────────── */}
      <section aria-labelledby="stories-heading" className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">

          <div className="flex items-end justify-between gap-6 mb-6 flex-wrap">
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
                Featured from the platform
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

          <StoryCarousel stories={stories} />

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
            looking for <span data-key-info>honest accounts of what your life actually looks like</span> —
            how you manage, how you don't, what helps, and what doesn't.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            <span data-key-info>You don't need a diagnosis to contribute.</span> You need to have lived it.
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
