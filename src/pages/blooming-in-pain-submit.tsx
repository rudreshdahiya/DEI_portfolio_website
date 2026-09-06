import { Link } from "react-router";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";
import { track } from "@vercel/analytics";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfWiQxhRrOoBlYs8cs_eUN4o6wBCFjKTnly6_YP7coaxky7_Q/viewform";
const GOOGLE_FORM_EMBED_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfWiQxhRrOoBlYs8cs_eUN4o6wBCFjKTnly6_YP7coaxky7_Q/viewform?embedded=true";

export default function BloomingInPainSubmit() {
  return (
    <div>
      <PageMeta
        title="Share Your Story — Blooming in Pain"
        description="Submit your story to Blooming in Pain via Google Form — a storytelling platform for people living with invisible disabilities. No diagnosis required."
        path="/blooming-in-pain/submit"
        keywords="submit invisible disability story, Google Form Blooming in Pain, share chronic illness experience"
      />
      <JsonLd
        schema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Share Your Story — Blooming in Pain",
          url: "https://pratik-aggarwal-website.vercel.app/blooming-in-pain/submit",
          description:
            "Google Form submission page for Blooming in Pain. People living with invisible disabilities can share their honest accounts for publication on the platform.",
          isPartOf: {
            "@id":
              "https://pratik-aggarwal-website.vercel.app/#blooming-in-pain",
          },
        }}
      />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        className="px-6 pt-20 pb-14 border-b border-border"
        style={{ backgroundColor: "var(--ground)" }}
      >
        <div className="max-w-[70ch] mx-auto text-center md:text-left">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: "var(--bloom)" }}
          >
            Blooming in Pain
          </p>
          <h1
            className="text-4xl md:text-5xl text-foreground mb-5 tracking-tight"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              lineHeight: 1.07,
            }}
          >
            Share your story.
          </h1>
          <div className="space-y-3 text-lg text-muted-foreground leading-relaxed max-w-[52ch]">
            <p>
              We're not looking for polished essays. We're looking for{" "}
              <span data-key-info>
                honest accounts of what your life actually looks like
              </span>{" "}
              — how you manage, how you don't, what helps, and what doesn't.
            </p>
            <p>
              <span data-key-info>
                You don't need a diagnosis to contribute.
              </span>{" "}
              You need to have lived it.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-7 py-3 rounded-md font-semibold text-base text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--plum)" }}
              onClick={() =>
                track("outbound_click", {
                  destination: "google_form",
                  location: "submit_header",
                })
              }
            >
              Share your story →
              <span className="sr-only">(opens in new tab)</span>
            </a>
            <Link
              to="/blooming-in-pain"
              className="inline-flex items-center px-6 py-3 rounded-md font-semibold text-base border border-border text-foreground hover:bg-muted transition-colors"
            >
              ← Back to Blooming in Pain
            </Link>
          </div>
        </div>
      </header>

      {/* ── Form Section ───────────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[280px_1fr] gap-12">
          {/* ── Guidelines Sidebar ────────────────────────────────────────── */}
          <aside aria-label="Submission guidelines">
            <div className="space-y-10 sticky top-24">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--bloom)" }}
                >
                  What we publish
                </p>
                <ul className="space-y-2.5 text-sm text-muted-foreground leading-relaxed list-none m-0 p-0">
                  {[
                    "First-person accounts of living with invisible or chronic conditions",
                    "Stories about navigating healthcare, work, or relationships",
                    "Experiences of being doubted, misdiagnosed, or dismissed",
                    "What good days and bad days actually feel like",
                    "Anything honest about a life that doesn't fit the standard script",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 items-start">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "var(--plum)" }}
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--bloom)" }}
                >
                  What we don't publish
                </p>
                <ul className="space-y-2.5 text-sm text-muted-foreground leading-relaxed list-none m-0 p-0">
                  {[
                    "Inspiration-porn or 'overcoming' narratives",
                    "Medical advice or treatment recommendations",
                    "Content that identifies or shames specific individuals",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 items-start">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-muted-foreground/40"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--bloom)" }}
                >
                  Timeline
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We'll be in touch within two weeks — whether we want to publish
                  as-is, or work on it together.
                </p>
              </div>

              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--bloom)" }}
                >
                  Questions?
                </p>
                <a
                  href="mailto:hello@bloominginpain.com"
                  className="text-sm text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                >
                  hello@bloominginpain.com
                </a>
              </div>
            </div>
          </aside>

          {/* ── Embedded Google Form ────────────────────────────────────────── */}
          <div className="w-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden p-2 md:p-4">
            <iframe
              src={GOOGLE_FORM_EMBED_URL}
              width="100%"
              height="1000"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="Blooming in Pain — Share Your Story Google Form"
              className="w-full rounded-xl border-0"
            >
              Loading form…
            </iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
