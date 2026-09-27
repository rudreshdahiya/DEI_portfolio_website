import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, Outlet, useLocation } from "react-router";
import { AccessibilityWidget } from "@/components/accessibility-widget";
import { LightboxProvider } from "@/components/image-lightbox";
import { Home, User, Briefcase, HeartHandshake, Mail, ArrowRight, X, Menu, Instagram, Linkedin, Youtube } from "lucide-react";
import { useGlobalSettings } from "@/hooks/use-global-settings";
import type { SocialLink } from "@/lib/supabase";

// ── Icon map for social links ──────────────────────────────────────────────────

function MediumIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

function SocialIcon({ icon, className }: { icon: string; className?: string }) {
  const cls = className || "w-4 h-4";
  switch (icon) {
    case "instagram": return <Instagram className={cls} />;
    case "linkedin":  return <Linkedin className={cls} />;
    case "youtube":   return <Youtube className={cls} />;
    case "medium":    return <MediumIcon className={cls} />;
    default:          return <Instagram className={cls} />;
  }
}

function DynamicSocialLinks({ links, iconSize = "w-4 h-4" }: { links: SocialLink[]; iconSize?: string }) {
  return (
    <div className="flex items-center gap-2">
      {links.map((link) => (
        <a
          key={link.key}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${link.label} (opens in new tab)`}
          title={link.label}
          className="p-2 rounded-full border border-border bg-card hover:bg-muted text-foreground hover:text-primary transition-all hover:scale-105 flex items-center justify-center"
        >
          <SocialIcon icon={link.icon} className={iconSize} />
          <span className="sr-only">{link.label} (opens in new tab)</span>
        </a>
      ))}
    </div>
  );
}

// ── Mobile icon map ────────────────────────────────────────────────────────────
// Maps common nav hrefs to icons for the mobile drawer
const MOBILE_ICONS: Record<string, typeof Home> = {
  "/":                Home,
  "/about":           User,
  "/services":        Briefcase,
  "/blooming-in-pain": HeartHandshake,
  "/contact":         Mail,
};

export function Layout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const { settings } = useGlobalSettings();

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

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileNavOpen]);

  // Sort nav links by order field
  const sortedNavLinks = [...settings.nav_links].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

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
              <span className="font-semibold tracking-tight text-sm sm:text-base whitespace-nowrap">
                {settings.site_name}
              </span>
            </Link>

            {/* Desktop navigation & accessibility control */}
            <div className="hidden md:flex items-center gap-8">
              <ul
                className="flex items-center justify-between gap-8 list-none m-0 p-0"
                role="list"
              >
                {sortedNavLinks.map((link) => (
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

          {/* ── Mobile Navigation Bottom Sheet Drawer ── */}
          {mobileNavOpen &&
            createPortal(
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
                  onClick={() => setMobileNavOpen(false)}
                  aria-hidden="true"
                />

                {/* Bottom Sheet */}
                <div
                  id="mobile-nav"
                  className="fixed inset-x-0 bottom-0 z-[9999] md:hidden rounded-t-3xl border-t-2 border-plum/40 bg-card shadow-2xl overflow-hidden max-h-[88vh] flex flex-col animate-in slide-in-from-bottom duration-300"
                  style={{ backgroundColor: "var(--surface)", color: "var(--ink)" }}
                  role="dialog"
                  aria-label="Navigation Menu"
                >
                  {/* Drag Handle */}
                  <div className="w-12 h-1.5 rounded-full bg-border/80 mx-auto my-3 shrink-0" aria-hidden="true" />

                  {/* Header Row */}
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

                  {/* Nav Items */}
                  <div className="p-4 space-y-1.5 overflow-y-auto max-h-[55vh]">
                    {/* Home link always first */}
                    {(() => {
                      const isActive = location.pathname === "/";
                      return (
                        <Link
                          to="/"
                          onClick={() => setMobileNavOpen(false)}
                          className={`flex items-center gap-3.5 p-3 rounded-2xl transition-all border ${
                            isActive
                              ? "bg-plum/10 border-plum/40 text-plum font-bold shadow-2xs"
                              : "bg-card/50 border-border text-foreground hover:bg-muted"
                          }`}
                        >
                          <div className={`p-2.5 rounded-xl shrink-0 ${isActive ? "bg-plum text-white" : "bg-muted text-plum"}`}>
                            <Home className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-bold block leading-tight">Home</span>
                            <span className="text-[11px] text-muted-foreground block truncate mt-0.5">Overview & key impact metrics</span>
                          </div>
                          <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "text-plum translate-x-0.5" : "text-muted-foreground/40"}`} />
                        </Link>
                      );
                    })()}
                    {sortedNavLinks.map((item) => {
                      const isActive = location.pathname === item.href;
                      const IconComp = MOBILE_ICONS[item.href] || Briefcase;
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
                          <div className={`p-2.5 rounded-xl shrink-0 ${isActive ? "bg-plum text-white" : "bg-muted text-plum"}`}>
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-bold block leading-tight">{item.label}</span>
                            {item.mobileDesc && (
                              <span className="text-[11px] text-muted-foreground block truncate mt-0.5">{item.mobileDesc}</span>
                            )}
                          </div>
                          <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "text-plum translate-x-0.5" : "text-muted-foreground/40"}`} />
                        </Link>
                      );
                    })}
                  </div>

                  {/* Primary CTA */}
                  <div className="p-4 border-t border-border bg-muted/40 shrink-0 space-y-2">
                    <Link
                      to={settings.cta_href}
                      className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-2xl text-sm font-bold text-white shadow-md transition-all active:scale-[0.99] cursor-pointer"
                      style={{ backgroundColor: "var(--plum)" }}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <span>{settings.cta_label}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <div className="text-center">
                      <span className="text-[11px] text-muted-foreground">
                        {settings.site_tagline}
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
                {settings.site_name}
              </span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span className="text-xs sm:text-sm">{settings.footer_tagline}</span>
            </div>

            <div className="flex items-center gap-5 flex-wrap justify-center">
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-xs sm:text-sm hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  {settings.contact_email}
                </a>
              )}
              <DynamicSocialLinks links={settings.social_links} iconSize="w-4 h-4" />
              <Link
                to="/accessibility"
                className="text-xs hover:text-foreground underline underline-offset-4 transition-colors"
              >
                Accessibility
              </Link>
              <span className="text-xs text-muted-foreground/80">
                {settings.footer_copyright || `© ${new Date().getFullYear()}`}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </LightboxProvider>
  );
}
