import { useState, useRef, useEffect } from "react";
import { Link, Outlet } from "react-router";
import { track } from "@vercel/analytics";
import { AccessibilityWidget } from "@/components/accessibility-widget";
import { ReadingRuler } from "@/components/reading-ruler";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blooming-in-pain", label: "Blooming in Pain" },
  { href: "/contact", label: "Contact" },
];

export function Layout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileNavOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileNavOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* Skip to main content — visible on keyboard focus */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:font-semibold focus:text-base"
      >
        Skip to main content
      </a>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <nav
          aria-label="Main navigation"
          className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between"
        >
          <Link
            to="/"
            className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            Pratik Aggarwal
          </Link>

          {/* Desktop navigation & accessibility control */}
          <div className="hidden md:flex items-center gap-8">
            <ul
              className="flex items-center gap-8 list-none m-0 p-0"
              role="list"
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Inclusivity / Reading Modes Widget */}
            <AccessibilityWidget />
          </div>

          {/* Mobile accessibility widget & hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <AccessibilityWidget />
            <button
              ref={hamburgerRef}
              aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav"
              className="p-2 -mr-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileNavOpen((prev) => !prev)}
            >
              <svg
                aria-hidden="true"
                focusable="false"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {mobileNavOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="8" x2="21" y2="8" />
                    <line x1="3" y1="16" x2="21" y2="16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileNavOpen && (
          <div
            id="mobile-nav"
            className="md:hidden border-t border-border bg-background"
          >
            <ul
              className="max-w-5xl mx-auto px-6 py-4 list-none m-0 p-0"
              role="list"
            >
              {navLinks.map((link) => (
                <li key={link.href} className="border-b border-border last:border-0">
                  <Link
                    to={link.href}
                    className="block py-4 text-base text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* ── Reading Ruler overlay (visible only when Focus Reading mode is active) */}
      <ReadingRuler />

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main id="main-content" className="flex-1 pb-20 md:pb-0" tabIndex={-1}>
        <Outlet />
      </main>

      {/* ── Sticky mobile CTA — single primary action (hidden on md+) ─── */}
      <div
        className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-border backdrop-blur-sm"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          backgroundColor: "rgba(246,244,247,0.97)",
        }}
      >
        <div className="px-4 py-3">
          <Link
            to="/contact"
            className="flex items-center justify-center w-full rounded-md font-semibold text-sm transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--plum)",
              color: "#FFFFFF",
              minHeight: "44px",
              padding: "0.75rem 1.5rem",
            }}
            onClick={() => track("cta_clicked", { label: "Start a partnership", location: "sticky_mobile" })}
          >
            Start a partnership
          </Link>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">

          {/* Brand + role */}
          <div>
            <p
              className="text-lg font-semibold text-foreground mb-1"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Pratik Aggarwal
            </p>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Disability inclusion expert and storyteller. Founder of{" "}
              <Link
                to="/blooming-in-pain"
                className="underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Blooming in Pain
              </Link>
              .
            </p>
            <a
              href="https://asthaindia.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground underline underline-offset-4 hover:text-primary transition-colors"
            >
              Director, ASTHA
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Explore
            </p>
            <ul className="space-y-2.5 list-none m-0 p-0" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/work"
                  className="text-sm text-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
                >
                  All work
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact + socials + legal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Connect
            </p>
            <ul className="space-y-2.5 list-none m-0 p-0 mb-8" role="list">
              <li>
                <a
                  href="mailto:hello@bloominginpain.com"
                  className="text-sm text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                >
                  hello@bloominginpain.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/bloominginpain"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                  onClick={() => track("outbound_click", { destination: "instagram", location: "footer" })}
                >
                  Instagram
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/pratikaggarwal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                  onClick={() => track("outbound_click", { destination: "linkedin", location: "footer" })}
                >
                  LinkedIn
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </li>
            </ul>

            <Link
              to="/accessibility"
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Accessibility statement
            </Link>

            <p className="text-xs text-muted-foreground mt-3">
              © {new Date().getFullYear()} Pratik Aggarwal.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
