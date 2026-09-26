import { useState } from "react";
import { Link } from "react-router";
import { ChevronDown, Palette, Users, Sparkles, Video, MessageCircle, Heart } from "lucide-react";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";
import { track } from "@vercel/analytics";
import { StoryCarousel, Story } from "@/components/story-carousel";

// ── Data ───────────────────────────────────────────────────────────
const stories: Story[] = [
  {
    id: 1,
    tag: "Endometriosis & Surgery",
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
    tag: "Neuropsychology & Pain",
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
    tag: "Youth & Chronic Illness",
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
    tag: "Vulvodynia & Misdiagnosis",
    title: "She Thought It Was Just Another Yeast Infection: Years of Misdiagnosis & Pelvic Pain",
    excerpt:
      "Phillipa Baines’ brutally honest journey through vulvodynia, medical gaslighting, and the radical courage it took to reclaim her life.",
    readTime: "6 min",
    author: "Pratik Aggarwal",
    mediumUrl:
      "https://medium.com/@BloomingInPain/she-thought-it-was-just-another-yeast-infection-what-followed-was-years-of-misdiagnosis-pain-21ca8e569330",
    imgUrl:
      "/medium/She%20Thought%20It%20Was%20Just%20Another%20Yeast%20Infection,%20But%20It%20Stole%20Her%20Peace%20and%20Power_image.webp",
  },
  {
    id: 5,
    tag: "Medical Trauma & Advocacy",
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
    tag: "Caregiving & Partner Support",
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
    tag: "Global Patient Advocacy",
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
    tag: "Dance, Movement & Pain",
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
    tag: "Identity & Loss",
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

const activitiesList = [
  {
    title: "Storytelling Platform",
    description: "Created a dedicated storytelling platform around fibromyalgia, chronic pain, and invisible disability.",
    icon: MessageCircle,
  },
  {
    title: "Listening Circles",
    description: "Organised online listening circles and community conversations for un-sanitised sharing.",
    icon: Users,
  },
  {
    title: "Art & Healing Sessions",
    description: "Organised online art and healing sessions for community members navigating invisible conditions.",
    icon: Heart,
  },
  {
    title: "International Webinars",
    description: "Hosted webinars featuring international medical experts, researchers, and people with lived experience.",
    icon: Video,
  },
  {
    title: "National Art Exhibition (Purple Fest Goa)",
    description: "Organised a landmark national art exhibition at Purple Fest Goa featuring 27 artists living with varying invisible conditions.",
    icon: Palette,
  },
];

const faqItems = [
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
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function BloomingInPain() {
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  return (
    <div>
      <PageMeta
        title="Blooming in Pain — Centering Stories of Fibromyalgia & Chronic Pain"
        description="Founded by Pratik Aggarwal in 2021 to create space for un-sanitised stories about living with fibromyalgia, chronic pain, and invisible conditions."
        path="/blooming-in-pain"
        keywords="invisible disability stories, fibromyalgia community, chronic illness platform, Blooming in Pain, Purple Fest Goa art exhibition"
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
            "https://instagram.com/blooming.in.pain",
            "https://www.linkedin.com/company/bloominginpain"
          ],
          "founder": { "@id": "https://pratik-aggarwal-website.vercel.app/#pratik-aggarwal" },
          "description": "Blooming in Pain is a storytelling platform founded by Pratik Aggarwal for people living with fibromyalgia, chronic pain, and invisible conditions."
        }
      ]} />

      {/* ── Hero / Centering Stories ─────────────────────────────────────────── */}
      <header
        className="px-6 pt-20 pb-16 border-b border-border"
        style={{ backgroundColor: "var(--ground)" }}
      >
        <div className="max-w-[70ch] mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: "var(--bloom)" }}
          >
            Initiative Founded by Pratik Aggarwal
          </p>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl text-foreground mb-6 tracking-tight font-serif"
            style={{ fontFamily: "'Fraunces', Georgia, serif", lineHeight: 1.07 }}
          >
            Centering Stories of<br />
            <em className="italic text-plum">
              Fibromyalgia &amp; Chronic Pain
            </em>
          </h1>

          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
            Founded by Pratik in 2021 to create space for un-sanitised stories about living with invisible conditions
          </p>

          <div className="space-y-4 text-base md:text-lg text-foreground leading-relaxed">
            <p>
              Blooming in Pain is a <span data-key-info>storytelling platform for people who live with disabilities the world can't see</span> — fibromyalgia, chronic pain, chronic fatigue, lupus, anxiety disorders, endometriosis, and hundreds of other conditions that exist between what bodies hold and what medicine is prepared to name.
            </p>
            <p>
              This isn't a resource hub or a support group. It's a space where <span data-key-info>people write about their lives honestly</span> — the hard parts and the full parts — without having to explain or justify themselves before they begin.
            </p>
          </div>
        </div>
      </header>

      {/* ── What Blooming in Pain Has Done ──────────────────────────────────── */}
      <section aria-labelledby="bip-activities-heading" className="px-6 py-16 border-b border-border bg-card/40">
        <div className="max-w-5xl mx-auto space-y-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-plum mb-2">
              Impact &amp; Initiatives
            </p>
            <h2
              id="bip-activities-heading"
              className="text-3xl md:text-4xl text-foreground font-serif"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              What Blooming in Pain Has Done
            </h2>
          </div>

          {/* Point-wise Activities List */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {activitiesList.map((act) => {
              const IconComponent = act.icon;
              return (
                <div
                  key={act.title}
                  className="p-5 rounded-2xl border border-border bg-card shadow-2xs space-y-3 hover:border-plum/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-plum/10 text-plum flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground font-serif" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                    {act.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {act.description}
                  </p>
                </div>
              );
            })}
          </div>

            {/* Dedicated Section / Card Block for Purple Fest Goa Art Exhibition */}
            <div className="p-6 md:p-8 rounded-2xl border-2 border-plum/30 bg-plum/5 shadow-sm space-y-6 relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-plum">
                <Palette className="w-4 h-4 text-plum" />
                <span>Landmark National Art Exhibition Feature</span>
              </div>

              <h3
                className="text-2xl md:text-3xl font-serif text-foreground leading-snug"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                National Art Exhibition at Purple Fest Goa — Featuring 27 Artists Living with Invisible Conditions
              </h3>

              <p className="text-sm md:text-base text-foreground/90 leading-relaxed max-w-3xl">
                Organised a landmark national art exhibition at <span className="font-semibold">Purple Fest Goa</span> — India’s largest inclusive disability festival — curating visual art, installations, and creative expressions created by <span className="font-bold text-plum">27 artists living with varying invisible conditions</span> and chronic pain. The exhibition brought invisible illness into public visual prominence, challenging traditional notions of disability art.
              </p>

              {/* Real Exhibition Photo Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-xs group">
                  <img
                    src="/images/Pratik%20Pictures/BloomingInPain/IMG_9605.jpeg"
                    alt="Blooming in Pain Art Exhibition at Purple Fest Goa"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                    <span className="text-[10px] text-white font-medium">Exhibition Pavilion</span>
                  </div>
                </div>

                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-xs group">
                  <img
                    src="/images/Pratik%20Pictures/BloomingInPain/IMG_9606.jpeg"
                    alt="Curated artworks by artists with invisible chronic illness"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                    <span className="text-[10px] text-white font-medium">27 Invisible Pain Artists</span>
                  </div>
                </div>

                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-xs group">
                  <img
                    src="/images/Pratik%20Pictures/BloomingInPain/IMG_0090.jpg"
                    alt="Community listening circle and dialogue session on invisible pain"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                    <span className="text-[10px] text-white font-medium">Listening Circles</span>
                  </div>
                </div>

                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-xs group">
                  <img
                    src="/images/Pratik%20Pictures/BloomingInPain/IMG_0124.jpg"
                    alt="Interactive storytelling workspace and artwork creation"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                    <span className="text-[10px] text-white font-medium">Storytelling Workspace</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <a
                  href="https://medium.com/@BloomingInPain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white transition-opacity shadow-xs hover:opacity-90"
                  style={{ backgroundColor: "var(--plum)" }}
                >
                  Explore Exhibition Stories on Medium →
                </a>
              </div>
            </div>

        </div>
      </section>

      {/* ── Story Carousel ────────────────────────────────────────────────── */}
      <section aria-labelledby="stories-heading" className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between gap-6 mb-6 flex-wrap">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "var(--bloom)" }}
              >
                Community Stories
              </p>
              <h2
                id="stories-heading"
                className="text-3xl md:text-4xl text-foreground"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Featured Articles &amp; Essays
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

      {/* ── FAQ (Hover-expandable) ───────────────────────────────────────── */}
      <section
        aria-labelledby="bip-faq-heading"
        className="px-6 py-16 border-t border-border bg-ground/30"
      >
        <div className="max-w-5xl mx-auto">
          <h2
            id="bip-faq-heading"
            className="text-3xl md:text-4xl text-foreground mb-10"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Questions about the platform
          </h2>
          <div className="divide-y divide-border border-y border-border">
            {faqItems.map((item, index) => {
              const isOpen = activeFaqIndex === index;
              return (
                <div
                  key={index}
                  className="py-5 transition-colors group cursor-pointer"
                  onMouseEnter={() => setActiveFaqIndex(index)}
                  onMouseLeave={() => setActiveFaqIndex(null)}
                  onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3
                      className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-snug"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      {item.q}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-primary" : "group-hover:translate-y-0.5"
                      }`}
                    />
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

      {/* ── Share your story ──────────────────────────────────────────── */}
      <section
        aria-labelledby="share-heading"
        className="px-6 py-16 border-t border-border bg-card"
      >
        <div className="max-w-[65ch] mx-auto text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--bloom)" }}
          >
            Contribute
          </p>
          <h2
            id="share-heading"
            className="text-3xl md:text-4xl text-foreground mb-5"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Your story belongs here
          </h2>
          <p className="text-base md:text-lg text-foreground leading-relaxed mb-4">
            We're not looking for polished essays or resolved conclusions. We're
            looking for <span data-key-info>honest accounts of what your life actually looks like</span> —
            how you manage, how you don't, what helps, and what doesn't.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-8">
            <span data-key-info>You don't need a diagnosis to contribute.</span> You need to have lived it.
            We'll work with you from there.
          </p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfWiQxhRrOoBlYs8cs_eUN4o6wBCFjKTnly6_YP7coaxky7_Q/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-7 py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition-opacity shadow-sm"
            style={{ backgroundColor: "var(--plum)" }}
            onClick={() => track("outbound_click", { destination: "google_form", location: "bip_share_section" })}
          >
            Share your story →
            <span className="sr-only">(opens in new tab)</span>
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            Stories are reviewed before publication. We'll be in touch within
            two weeks.
          </p>
        </div>
      </section>

    </div>
  );
}
