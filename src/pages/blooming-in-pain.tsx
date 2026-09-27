import { useState } from "react";
import { Link } from "react-router";
import { ChevronDown, Palette, Users, Sparkles, Video, MessageCircle, Heart } from "lucide-react";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";
import { track } from "@vercel/analytics";
import { StoryCarousel } from "@/components/story-carousel";
import { ClickableImage } from "@/components/image-lightbox";
import { useBipSettings } from "@/hooks/use-bip-settings";

// ── Fallback Activities List ───────────────────────────────────────────────────
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
  const { settings } = useBipSettings();
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
            {settings.hero_title}
          </h1>

          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">
            {settings.hero_subtitle}
          </p>

          <div className="space-y-4 text-base md:text-lg text-foreground leading-relaxed">
            <p>{settings.intro_body}</p>
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

              {/* Real Exhibition & Community Photo Grid (4 Distinct Photos) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-xs group bg-muted/40">
                  <ClickableImage
                    src="/images/Pratik%20Pictures/BloomingInPain/IMG_9605.jpeg"
                    alt="Blooming in Pain Art Exhibition Pavilion at Purple Fest Goa"
                    title="Exhibition Pavilion"
                    caption="Blooming in Pain Exhibition at Purple Fest Goa"
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end pointer-events-none">
                    <span className="text-[10px] text-white font-medium">Exhibition Pavilion</span>
                  </div>
                </div>

                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-xs group bg-muted/40">
                  <ClickableImage
                    src="/images/Pratik%20Pictures/BloomingInPain/IMG_9606.jpeg"
                    alt="Curated visual artworks by 27 artists with invisible chronic illness"
                    title="27 Pain Artists"
                    caption="Visual artworks by 27 artists living with chronic pain"
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end pointer-events-none">
                    <span className="text-[10px] text-white font-medium">27 Pain Artists</span>
                  </div>
                </div>

                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-xs group bg-muted/40">
                  <ClickableImage
                    src="/images/Pratik%20Pictures/BloomingInPain/IMG_0090.jpg"
                    alt="Community listening circle and dialogue session on invisible pain"
                    title="Listening Circles"
                    caption="Community dialogue and listening circle"
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end pointer-events-none">
                    <span className="text-[10px] text-white font-medium">Listening Circles</span>
                  </div>
                </div>

                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-xs group bg-muted/40">
                  <ClickableImage
                    src="/images/Pratik%20Pictures/BloomingInPain/IMG_0124.jpg"
                    alt="Interactive storytelling workspace and artwork creation"
                    title="Storytelling Workspace"
                    caption="Interactive photobook storytelling workshop"
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end pointer-events-none">
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

          <StoryCarousel stories={settings.stories} />
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
