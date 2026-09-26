import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, Outlet, useLocation } from "react-router";
import { AccessibilityWidget } from "@/components/accessibility-widget";
import { SocialLinks } from "@/components/social-links";
import { LightboxProvider } from "@/components/image-lightbox";
import { Home, User, Briefcase, HeartHandshake, Mail, ArrowRight, X, Menu } from "lucide-react";

const desktopNavLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blooming-in-pain", label: "Blooming in Pain" },
  { href: "/contact", label: "Contact" },
];

const mobileNavItems = [
  { href: "/", label: "Home", icon: Home, desc: "Overview & key impact metrics" },
  { href: "/about", label: "About Pratik", icon: User, desc: "Advocacy & lived authority" },
  { href: "/services", label: "Services & Pillars", icon: Briefcase, desc: "Training, Advisory, Keynotes & Research" },
  { href: "/blooming-in-pain", label: "Blooming in Pain", icon: HeartHandshake, desc: "Storytelling & community work" },
  { href: "/contact", label: "Contact & Booking", icon: Mail, desc: "Partnerships & inquiries" },
];

export function Layout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

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

  // Lock body scroll when mobile drawer is open for a native app feel
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  return (
    <LightboxProvider>
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
            className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between"
          >
            <Link
              to="/"
              className="flex items-center gap-2 text-base sm:text-lg font-semibold text-foreground hover:text-primary transition-colors group shrink-0"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-plum text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs tracking-wider">
                PA
              </div>
              <span className="font-semibold tracking-tight text-sm sm:text-base whitespace-nowrap">Pratik Aggarwal</span>
            </Link>

            {/* Desktop navigation & accessibility control */}
            <div className="hidden md:flex items-center gap-8">
              <ul
                className="flex items-center justify-between gap-8 list-none m-0 p-0"
                role="list"
              >
                {desktopNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className={`text-sm font-medium transition-colors underline-offset-4 hover:underline whitespace-nowrap ${
                        location.pathname === link.href ? "text-plum font-bold" : "text-foreground hover:text-primary"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Accessibility Widget */}
              <AccessibilityWidget />
            </div>

            {/* Mobile accessibility widget & hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <AccessibilityWidget />
              <button
                ref={hamburgerRef}
                aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileNavOpen}
                aria-controls="mobile-nav"
                className="p-2 -mr-2 text-foreground hover:text-plum transition-colors cursor-pointer"
                onClick={() => setMobileNavOpen((prev) => !prev)}
              >
                {mobileNavOpen ? (
                  <X className="w-5 h-5 text-plum" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground" />
                )}
              </button>
            </div>
          </nav>

          {/* ── App-Like Mobile Navigation Bottom Sheet Drawer (Thumb Zone UX) ── */}
          {mobileNavOpen &&
            createPortal(
              <>
                {/* Backdrop Overlay */}
                <div
                  className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
                  onClick={() => setMobileNavOpen(false)}
                  aria-hidden="true"
                />

                {/* Bottom Sheet Modal */}
                <div
                  id="mobile-nav"
                  className="fixed inset-x-0 bottom-0 z-[9999] md:hidden rounded-t-3xl border-t-2 border-plum/40 bg-card shadow-2xl overflow-hidden max-h-[88vh] flex flex-col animate-in slide-in-from-bottom duration-300"
                  style={{
                    backgroundColor: "var(--surface)",
                    color: "var(--ink)",
                  }}
                  role="dialog"
                  aria-label="Navigation Menu"
                >
                  {/* Drag Handle Indicator */}
                  <div className="w-12 h-1.5 rounded-full bg-border/80 mx-auto my-3 shrink-0" aria-hidden="true" />

                  {/* Header Row inside sheet */}
                  <div className="flex items-center justify-between px-6 pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-plum text-white text-[10px] font-bold flex items-center justify-center">
                        PA
                      </div>
                      <span className="text-sm font-bold font-serif text-foreground" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                        Navigation Menu
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMobileNavOpen(false)}
                      className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                      aria-label="Close menu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Scrollable Navigation List */}
                  <div className="p-4 space-y-1.5 overflow-y-auto max-h-[55vh]">
                    {mobileNavItems.map((item) => {
                      const IconComp = item.icon;
                      const isActive = location.pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setMobileNavOpen(false)}
                          className={`flex items-center gap-3.5 p-3 rounded-2xl transition-all border ${
                            isActive
                              ? "bg-plum/10 border-plum/40 text-plum font-bold shadow-2xs"
                              : "bg-card/50 border-border text-foreground hover:bg-muted"
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-xl shrink-0 ${
                              isActive ? "bg-plum text-white" : "bg-muted text-plum"
                            }`}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-bold block leading-tight">
                              {item.label}
                            </span>
                            <span className="text-[11px] text-muted-foreground block truncate mt-0.5">
                              {item.desc}
                            </span>
                          </div>
                          <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "text-plum translate-x-0.5" : "text-muted-foreground/40"}`} />
                        </Link>
                      );
                    })}
                  </div>

                  {/* Primary CTA in Thumb Zone */}
                  <div className="p-4 border-t border-border bg-muted/40 shrink-0 space-y-2">
                    <Link
                      to="/contact"
                      className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white shadow-md transition-all active:scale-[0.99] cursor-pointer"
                      style={{ backgroundColor: "var(--plum)" }}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <span>Start a Partnership</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <div className="text-center">
                      <span className="text-[11px] text-muted-foreground">
                        Disability Inclusion & DEI Consultancy
                      </span>
                    </div>
                  </div>
                </div>
              </>,
              document.body
            )}
        </header>

        {/* ── Main content ────────────────────────────────────────────────── */}
        <main id="main-content" className="flex-1 pb-8 md:pb-0" tabIndex={-1}>
          <Outlet />
        </main>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer className="border-t border-border bg-background py-8">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex flex-wrap items-center gap-2 text-center md:text-left">
              <span className="font-semibold text-foreground" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                Pratik Aggarwal
              </span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span className="text-xs sm:text-sm">Disability Inclusion & Storytelling</span>
            </div>

            <div className="flex items-center gap-5 flex-wrap justify-center">
              <a
                href="mailto:hello@bloominginpain.com"
                className="text-xs sm:text-sm hover:text-foreground underline underline-offset-4 transition-colors"
              >
                hello@bloominginpain.com
              </a>
              <SocialLinks iconSize="w-4 h-4" />
              <Link
                to="/accessibility"
                className="text-xs hover:text-foreground underline underline-offset-4 transition-colors"
              >
                Accessibility
              </Link>
              <span className="text-xs text-muted-foreground/80">© {new Date().getFullYear()}</span>
            </div>
          </div>
        </footer>
      </div>
    </LightboxProvider>
  );
}
