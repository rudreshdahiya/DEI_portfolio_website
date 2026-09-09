import { useState, useEffect, useRef } from "react";
import { Check, RotateCcw, X, Sparkles } from "lucide-react";

// ── Crisp High-Visibility Accessibility Icon Component ──────────────────────

function AccessibilityBadgeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-colors duration-150 ${className}`}
      aria-hidden="true"
    >
      {/* Outer focus circle */}
      <circle
        cx="12"
        cy="12"
        r="9.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* Head */}
      <circle
        cx="12"
        cy="7.2"
        r="1.8"
        fill="currentColor"
      />
      {/* Arms & Legs */}
      <path
        d="M6.8 11.2C8.5 10.4 10.2 10 12 10C13.8 10 15.5 10.4 17.2 11.2M12 10V14.5M9.5 18L12 14.5L14.5 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Mode definitions ────────────────────────────────────────────────────────

interface Mode {
  id: string;
  icon: string;
  name: string;
  userType: string;
  description: string;
  attr: string;      // data attribute name on <html>
  value: string;     // data attribute value when active
}

const activeModesList: Mode[] = [
  {
    id: "keyinfo",
    icon: "💡",
    name: "Key Info Highlights",
    userType: "Quick scanning · ADHD · cognitive fatigue",
    description: "Highlights key statements and core data points across every page.",
    attr: "data-a11y-keyinfo",
    value: "highlight",
  },
  {
    id: "easyread",
    icon: "📖",
    name: "Easy Read",
    userType: "Brain fog · fatigue · comfortable reading",
    description: "Increases line height and text spacing for relaxed reading.",
    attr: "data-a11y-easyread",
    value: "on",
  },
  {
    id: "contrast",
    icon: "🔲",
    name: "High Contrast",
    userType: "Low vision · bright screens · glare",
    description: "Sharpens text contrast against light and dark backgrounds.",
    attr: "data-a11y-contrast",
    value: "high",
  },
  {
    id: "colorblind",
    icon: "🎨",
    name: "Color Blind Safe",
    userType: "Deuteranopia · protanopia · tritanopia",
    description: "Adds high-distinction indicators, borders, and link underlines.",
    attr: "data-a11y-colorblind",
    value: "safe",
  },
  {
    id: "dyslexic",
    icon: "🔤",
    name: "Dyslexia Friendly Font",
    userType: "Dyslexia · visual fatigue",
    description: "Switches to clean, highly legible font spacing to ease reading.",
    attr: "data-a11y-font",
    value: "dyslexic",
  },
];

// ── Component ───────────────────────────────────────────────────────────────

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);

  // Load saved preferences and clean up deprecated attributes
  useEffect(() => {
    const validAttrs = new Set(activeModesList.map((m) => m.attr));
    const legacyAttrs = [
      "data-a11y-stimulation",
      "data-a11y-focus",
      "data-a11y-energy",
      "data-a11y-keyboard",
    ];
    for (const attr of legacyAttrs) {
      if (!validAttrs.has(attr)) {
        document.documentElement.removeAttribute(attr);
      }
    }

    const saved = new Set<string>();
    for (const mode of activeModesList) {
      if (localStorage.getItem(`a11y_${mode.id}`) === "true") {
        saved.add(mode.id);
        document.documentElement.setAttribute(mode.attr, mode.value);
      } else {
        document.documentElement.removeAttribute(mode.attr);
      }
    }
    if (saved.size > 0) setActiveIds(saved);

    // Show spotlight highlight on first visit if not yet dismissed
    if (localStorage.getItem("a11y_spotlight_seen") !== "true") {
      setShowSpotlight(true);
    }
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

  const dismissSpotlight = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowSpotlight(false);
    localStorage.setItem("a11y_spotlight_seen", "true");
  };

  const handleOpenToggle = () => {
    if (!isOpen && showSpotlight) {
      dismissSpotlight();
    }
    setIsOpen(!isOpen);
  };

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

  // Preset Applicator
  const applyPreset = (presetIds: string[]) => {
    const next = new Set<string>();
    for (const mode of activeModesList) {
      if (presetIds.includes(mode.id)) {
        next.add(mode.id);
        document.documentElement.setAttribute(mode.attr, mode.value);
        localStorage.setItem(`a11y_${mode.id}`, "true");
      } else {
        document.documentElement.removeAttribute(mode.attr);
        localStorage.setItem(`a11y_${mode.id}`, "false");
      }
    }
    setActiveIds(next);
  };

  // Reset all
  const resetAll = () => {
    for (const mode of activeModesList) {
      document.documentElement.removeAttribute(mode.attr);
      localStorage.setItem(`a11y_${mode.id}`, "false");
    }
    setActiveIds(new Set());
  };

  const activeCount = activeIds.size;

  return (
    <div className="relative inline-block text-left">
      {/* ── Trigger Button: Accessibility ─────────────────── */}
      <button
        type="button"
        onClick={handleOpenToggle}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-full border-2 transition-all cursor-pointer shadow-xs group ${
          showSpotlight && !isOpen ? "ring-4 ring-plum/50 animate-pulse shadow-md" : ""
        }`}
        style={{
          borderColor: activeCount > 0 ? "var(--plum)" : "rgba(184, 68, 114, 0.5)",
          backgroundColor: activeCount > 0 ? "var(--plum)" : "var(--card)",
          color: activeCount > 0 ? "#FFFFFF" : "var(--foreground)",
        }}
        aria-expanded={isOpen}
        aria-label={`Accessibility options${activeCount > 0 ? `, ${activeCount} active` : ""}`}
      >
        <AccessibilityBadgeIcon
          className={`w-4 h-4 ${activeCount > 0 ? "text-white" : "text-plum"}`}
        />
        <span className="font-semibold tracking-tight whitespace-nowrap">Accessibility</span>
        {activeCount > 0 && (
          <span
            className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full text-[11px] font-extrabold leading-none bg-white text-plum shadow-2xs shrink-0 select-none ml-0.5"
          >
            {activeCount}
          </span>
        )}
      </button>

      {/* ── First-Time Spotlight Badge ──────────────────── */}
      {showSpotlight && !isOpen && (
        <div className="absolute right-0 top-full mt-2 z-30 w-56 p-2.5 rounded-xl bg-plum text-white shadow-xl text-xs font-sans border border-white/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>Accessibility Modes</span>
          </div>
          <button
            type="button"
            onClick={dismissSpotlight}
            className="text-white/70 hover:text-white p-0.5 rounded hover:bg-white/10 cursor-pointer shrink-0"
            aria-label="Dismiss spotlight"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Panel Popover ─────────────────────────────────────────── */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            ref={panelRef}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border-2 border-plum/40 bg-card shadow-2xl z-50 overflow-hidden"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--ink)",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
            role="dialog"
            aria-label="Accessibility & Display Modes"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-3.5 border-b border-border bg-card/95 backdrop-blur-md gap-3">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="p-2 rounded-xl bg-plum/10 text-plum flex items-center justify-center shrink-0">
                  <AccessibilityBadgeIcon className="w-5 h-5 text-plum" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-bold text-foreground font-serif leading-tight truncate" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                    Accessibility Modes
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-nowrap">
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAll}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-plum hover:underline cursor-pointer whitespace-nowrap shrink-0 px-1 py-0.5"
                  >
                    <RotateCcw className="w-3 h-3 shrink-0" />
                    <span>Reset</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted cursor-pointer shrink-0 flex items-center justify-center"
                  aria-label="Close accessibility modes panel"
                >
                  <X className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>

            {/* Quick One-Click Presets Bar */}
            <div className="p-3 bg-muted/40 border-b border-border">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Quick Presets
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPreset([])}
                  className={`py-1.5 px-2 text-[11px] font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                    activeCount === 0
                      ? "bg-plum text-white border-plum shadow-2xs"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(["easyread", "keyinfo"])}
                  className={`py-1.5 px-2 text-[11px] font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                    activeIds.has("easyread") && activeIds.has("keyinfo") && activeCount === 2
                      ? "bg-plum text-white border-plum shadow-2xs"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  }`}
                >
                  Reading Focus
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(["contrast", "dyslexic"])}
                  className={`py-1.5 px-2 text-[11px] font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                    activeIds.has("contrast") && activeIds.has("dyslexic") && activeCount === 2
                      ? "bg-plum text-white border-plum shadow-2xs"
                      : "bg-card text-foreground border-border hover:bg-muted"
                  }`}
                >
                  High Visibility
                </button>
              </div>
            </div>

            {/* Active Modes List */}
            <div className="p-3 space-y-2">
              {activeModesList.map((mode) => {
                const isActive = activeIds.has(mode.id);
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => toggleMode(mode)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer border"
                    style={{
                      backgroundColor: isActive
                        ? "rgba(184, 68, 114, 0.08)"
                        : "var(--card)",
                      borderColor: isActive
                        ? "var(--plum)"
                        : "var(--border)",
                    }}
                    role="switch"
                    aria-checked={isActive}
                    aria-label={`${mode.name}: ${mode.userType}`}
                  >
                    <span className="text-xl flex-shrink-0 w-7 text-center select-none" aria-hidden="true">
                      {mode.icon}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-foreground leading-tight">
                          {mode.name}
                        </span>
                        {isActive && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-plum">
                            <Check className="w-3 h-3" /> ON
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground block leading-snug mt-0.5">
                        {mode.description}
                      </span>
                    </div>

                    {/* Toggle Switch */}
                    <div
                      className="flex-shrink-0 w-9 h-[20px] rounded-full relative transition-colors"
                      style={{
                        backgroundColor: isActive
                          ? "var(--plum)"
                          : "var(--line)",
                      }}
                    >
                      <div
                        className="absolute top-[2px] w-[16px] h-[16px] rounded-full bg-white shadow-xs transition-transform"
                        style={{
                          transform: isActive
                            ? "translateX(18px)"
                            : "translateX(2px)",
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground bg-muted/30">
              <span>Personalized reading preferences</span>
              <a
                href="/accessibility"
                className="underline hover:text-foreground font-semibold"
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


