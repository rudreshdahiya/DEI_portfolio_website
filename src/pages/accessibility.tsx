import { Link } from "react-router";
import { PageMeta } from "@/components/page-meta";
import { JsonLd } from "@/components/json-ld";
import { useGlobalSettings } from "@/hooks/use-global-settings";

export default function Accessibility() {
  const { settings: globalSettings } = useGlobalSettings();
  const contactEmail = globalSettings.contact_email || "hello@bloominginpain.com";

  return (
    <>
      <PageMeta
        title="Accessibility Statement"
        description="Pratik Aggarwal's website is committed to WCAG 2.1 AA accessibility. Learn what we've done, our known limitations, and how to report an accessibility issue."
        path="/accessibility"
      />
      <JsonLd schema={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Accessibility Statement — Pratik Aggarwal",
        "url": "https://pratik-aggarwal-website.vercel.app/accessibility",
        "description": "Accessibility statement for pratik-aggarwal-website.vercel.app. The site targets WCAG 2.1 AA compliance. Includes information on what has been implemented, known limitations, and how to report accessibility issues.",
        "isPartOf": { "@type": "WebSite", "url": "https://pratik-aggarwal-website.vercel.app" }
      }} />
      {/* ── Page header ────────────────────────────────────────────────────── */}
      <section aria-labelledby="a11y-heading" className="px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--bloom)" }}
          >
            Accessibility
          </p>
          <h1
            id="a11y-heading"
            className="text-4xl md:text-5xl text-foreground mb-5"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Accessibility statement.
          </h1>
          <p className="text-lg text-muted-foreground max-w-[52ch] leading-relaxed">
            This website is committed to being accessible to everyone — including
            people with disabilities.
          </p>
        </div>
      </section>

      <div className="border-t border-border" aria-hidden="true" />

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-[70ch] mx-auto space-y-12">

          {/* Commitment */}
          <div>
            <h2
              className="text-2xl text-foreground mb-4"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Our commitment
            </h2>
            <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
              <p>
                Accessibility is not an afterthought on this website — it is a
                core requirement. Pratik's work is rooted in the belief that
                inclusion must be real and practical, not symbolic. That
                commitment extends to how this website is built and maintained.
              </p>
              <p>
                We aim to meet the{" "}
                <strong className="text-foreground font-semibold">
                  Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
                </strong>{" "}
                across all pages. This includes support for screen readers,
                keyboard navigation, sufficient colour contrast, and reduced
                motion.
              </p>
            </div>
          </div>

          {/* What we've done */}
          <div>
            <h2
              className="text-2xl text-foreground mb-4"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              What we've done
            </h2>
            <ul className="space-y-3 text-base text-muted-foreground leading-relaxed list-none m-0 p-0">
              {[
                "Semantic HTML throughout — headings, landmarks, lists, and labels used correctly",
                "Keyboard navigable — all interactive elements reachable and operable by keyboard",
                "Visible focus indicators on all interactive elements",
                "ARIA attributes used where native HTML is insufficient",
                "Sufficient colour contrast across text and interactive elements",
                "Reduced motion — animations and transitions are suppressed for users who prefer it",
                "Skip to main content link available on keyboard focus",
                "All form fields have visible, associated labels",
                "Error messages are programmatically associated with their fields",
                "External links are labelled to indicate they open in a new tab",
              ].map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: "var(--bloom)" }}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Known limitations */}
          <div>
            <h2
              className="text-2xl text-foreground mb-4"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Known limitations
            </h2>
            <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
              <p>
                This website is under active development. Some pages or
                components may not yet meet full WCAG 2.1 AA conformance. We are
                working to address all known gaps.
              </p>
              <p>
                If you encounter a specific barrier, please tell us — your
                report is the most direct way to prioritise a fix.
              </p>
            </div>
          </div>

          {/* How to report */}
          <div>
            <h2
              className="text-2xl text-foreground mb-4"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Report an issue
            </h2>
            <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
              <p>
                If you experience difficulty accessing any part of this website,
                we want to hear about it. Please describe the issue and the page
                where you encountered it.
              </p>
              <p>
                You can reach us at:{" "}
                <a
                  href={`mailto:${contactEmail}?subject=Accessibility%20issue`}
                  className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                >
                  {contactEmail}
                </a>
              </p>
              <p>
                We aim to acknowledge accessibility reports within{" "}
                <strong className="text-foreground font-semibold">3 working days</strong> and
                resolve confirmed issues within a reasonable timeframe depending
                on complexity.
              </p>
            </div>
          </div>

          {/* Standard used */}
          <div>
            <h2
              className="text-2xl text-foreground mb-4"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Standard and date
            </h2>
            <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
              <p>
                This statement refers to the WCAG 2.1 standard published by the
                W3C Web Accessibility Initiative (WAI).
              </p>
              <p>
                This statement was last reviewed in{" "}
                <strong className="text-foreground font-semibold">June 2026</strong>.
              </p>
            </div>
          </div>

          {/* Back link */}
          <div className="border-t border-border pt-10">
            <Link
              to="/"
              className="text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
            >
              ← Back to home
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
