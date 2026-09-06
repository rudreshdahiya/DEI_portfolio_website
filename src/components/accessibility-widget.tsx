import { useState, useEffect, useRef } from "react";

// ── Mode definitions ────────────────────────────────────────────────────────

interface Mode {
  id: string;
  icon: string;
  name: string;
  userType: string;
  attr: string;      // data attribute name on <html>
  value: string;     // data attribute value when active
}

interface ModeGroup {
  label: string;
  modes: Mode[];
}

const modeGroups: ModeGroup[] = [
  {
    label: "Visual & Sensory",
    modes: [
      {
        id: "stimulation",
        icon: "🌿",
        name: "Low Stimulation",
        userType: "Sensory overload · migraines · flares",
        attr: "data-a11y-stimulation",
        value: "low",
      },
      {
        id: "contrast",
        icon: "🔲",
        name: "High Contrast",
        userType: "Low vision · bright screens · aging eyes",
        attr: "data-a11y-contrast",
        value: "high",
      },
      {
        id: "colorblind",
        icon: "🎨",
        name: "Color Blind Safe",
        userType: "Deuteranopia · protanopia · tritanopia",
        attr: "data-a11y-colorblind",
        value: "safe",
      },
    ],
  },
  {
    label: "Cognitive & Reading",
    modes: [
      {
        id: "keyinfo",
        icon: "📰",
        name: "Key Info Highlights",
        userType: "Scanning quickly · ADHD · cognitive fatigue",
        attr: "data-a11y-keyinfo",
        value: "highlight",
      },
      {
        id: "easyread",
        icon: "📖",
        name: "Easy Read",
        userType: "Brain fog · learning differences · fatigue",
        attr: "data-a11y-easyread",
        value: "on",
      },
      {
        id: "focus",
        icon: "🎯",
        name: "Focus Reading",
        userType: "Losing your place · dyslexia · ADHD",
        attr: "data-a11y-focus",
        value: "ruler",
      },
    ],
  },
  {
    label: "Motor & Energy",
    modes: [
      {
        id: "energy",
        icon: "⚡",
        name: "Low Energy",
        userType: "Chronic fatigue · ME/CFS · post-exertional malaise",
        attr: "data-a11y-energy",
        value: "low",
      },
      {
        id: "keyboard",
        icon: "⌨️",
        name: "Keyboard Navigator",
        userType: "Motor disabilities · RSI · switch devices",
        attr: "data-a11y-keyboard",
        value: "enhanced",
      },
    ],
  },
];

const allModes = modeGroups.flatMap((g) => g.modes);

// ── Component ───────────────────────────────────────────────────────────────

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);

  // Load saved preferences
  useEffect(() => {
    const saved = new Set<string>();
    for (const mode of allModes) {
      if (localStorage.getItem(`a11y_${mode.id}`) === "true") {
        saved.add(mode.id);
        document.documentElement.setAttribute(mode.attr, mode.value);
      }
    }
    if (saved.size > 0) setActiveIds(saved);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  // Toggle a mode
  const toggleMode = (mode: Mode) => {
    setActiveIds((prev) => {
      const next = new Set(prev);
      if (next.has(mode.id)) {
        next.delete(mode.id);
        document.documentElement.removeAttribute(mode.attr);
        localStorage.setItem(`a11y_${mode.id}`, "false");
      } else {
        next.add(mode.id);
        document.documentElement.setAttribute(mode.attr, mode.value);
        localStorage.setItem(`a11y_${mode.id}`, "true");
      }
      return next;
    });
  };

  // Reset all
  const resetAll = () => {
    for (const mode of allModes) {
      document.documentElement.removeAttribute(mode.attr);
      localStorage.setItem(`a11y_${mode.id}`, "false");
    }
    setActiveIds(new Set());
  };

  const activeCount = activeIds.size;

  return (
    <div className="relative inline-block text-left">
      {/* ── Trigger button ────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-full border transition-all"
        style={{
          borderColor: activeCount > 0 ? "var(--bloom)" : "var(--line)",
          backgroundColor: activeCount > 0 ? "var(--ground)" : "transparent",
          color: activeCount > 0 ? "var(--plum)" : "var(--ink)",
        }}
        aria-expanded={isOpen}
        aria-label={`Inclusivity modes${activeCount > 0 ? `, ${activeCount} active` : ""}`}
      >
        <span className="text-sm" aria-hidden="true">♿</span>
        <span className="hidden sm:inline">Inclusivity</span>
        {activeCount > 0 && (
          <span
            className="ml-0.5 px-1.5 rounded-full text-[10px] font-bold leading-tight"
            style={{ backgroundColor: "var(--bloom)", color: "#FFFFFF" }}
          >
            {activeCount}
          </span>
        )}
      </button>

      {/* ── Panel ─────────────────────────────────────────────────── */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            ref={panelRef}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-xl z-50"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--ink)",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            role="dialog"
            aria-label="Inclusivity & Reading Modes"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border" style={{ backgroundColor: "var(--surface)" }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Accessibility · Vision · Cognition
                </p>
                <h2 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                  Inclusivity Modes
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAll}
                    className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2"
                  >
                    Reset all
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-1"
                  aria-label="Close inclusivity panel"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mode groups */}
            <div className="p-3 space-y-4">
              {modeGroups.map((group) => (
                <div key={group.label}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                    {group.label}
                  </p>
                  <div className="space-y-1">
                    {group.modes.map((mode) => {
                      const isActive = activeIds.has(mode.id);
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => toggleMode(mode)}
                          className="w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors"
                          style={{
                            backgroundColor: isActive
                              ? "rgba(184, 68, 114, 0.08)"
                              : "transparent",
                            border: isActive
                              ? "1px solid rgba(184, 68, 114, 0.2)"
                              : "1px solid transparent",
                          }}
                          role="switch"
                          aria-checked={isActive}
                          aria-label={`${mode.name}: ${mode.userType}`}
                        >
                          <span className="text-lg flex-shrink-0 w-7 text-center" aria-hidden="true">
                            {mode.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold block text-foreground leading-tight">
                              {mode.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground block leading-snug mt-0.5">
                              {mode.userType}
                            </span>
                          </div>
                          {/* Toggle indicator */}
                          <div
                            className="flex-shrink-0 w-8 h-[18px] rounded-full relative transition-colors"
                            style={{
                              backgroundColor: isActive
                                ? "var(--bloom)"
                                : "var(--line)",
                            }}
                          >
                            <div
                              className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform"
                              style={{
                                transform: isActive
                                  ? "translateX(16px)"
                                  : "translateX(2px)",
                              }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span>WCAG 2.1 AA · Built-in Accessible</span>
              <a
                href="/accessibility"
                className="underline hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                Statement →
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
