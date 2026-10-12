import { useState, useRef, useEffect } from "react";
import { Share2, Check, Copy, Linkedin, MessageCircle, Send, Mail, X } from "lucide-react";
import { track } from "@vercel/analytics";
import { trackEvent } from "@/lib/analytics";

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  variant?: "pill" | "outline" | "solid";
  className?: string;
  align?: "left" | "right" | "center";
}

export function ShareButton({
  title = "Blooming in Pain — Centering Stories of Fibromyalgia & Chronic Pain",
  text = "Blooming in Pain: Centering un-sanitised stories about living with fibromyalgia, chronic pain, and invisible conditions. Founded by Pratik Aggarwal.",
  url = "https://pratik-aggarwal-website.vercel.app/blooming-in-pain",
  variant = "pill",
  className = "",
  align = "right",
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click or escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleShareClick = async () => {
    // If Web Share API is available on mobile/touch devices, attempt it first
    if (typeof navigator !== "undefined" && navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        track("page_shared", { page: "blooming-in-pain", method: "native_share" });
        trackEvent("page_shared", { page: "blooming-in-pain", method: "native_share" });
        return;
      } catch (err: any) {
        // If aborted by user, don't open modal; otherwise fall through to menu
        if (err?.name === "AbortError") return;
      }
    }
    setIsOpen(prev => !prev);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      track("page_shared", { page: "blooming-in-pain", method: "copy_link" });
      trackEvent("page_shared", { page: "blooming-in-pain", method: "copy_link" });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text}\n\n${url}`)}`,
      color: "text-emerald-700 hover:bg-emerald-50",
      tracking: "whatsapp",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: "text-[#0077B5] hover:bg-sky-50",
      tracking: "linkedin",
    },
    {
      name: "X (Twitter)",
      icon: Send,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      color: "text-slate-800 hover:bg-slate-100",
      tracking: "twitter",
    },
    {
      name: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
      color: "text-purple-800 hover:bg-purple-50",
      tracking: "email",
    },
  ];

  const buttonStyles =
    variant === "solid"
      ? "bg-[var(--plum)] text-white hover:opacity-90 shadow-sm"
      : variant === "outline"
      ? "border border-border text-foreground hover:bg-muted/60"
      : "border border-border/80 bg-background/90 text-foreground hover:bg-muted/50 hover:border-primary/40 shadow-xs";

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={handleShareClick}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-[0.98] ${buttonStyles}`}
      >
        <Share2 className="w-3.5 h-3.5 text-primary" />
        <span>Share Blooming in Pain</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Share options"
          className={`absolute z-50 mt-2 w-72 sm:w-80 rounded-2xl bg-card border border-border shadow-xl p-4 animate-in fade-in zoom-in-95 duration-150 ${
            align === "right" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0"
          }`}
          style={{ backgroundColor: "var(--card, #ffffff)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Share this page</p>
              <p className="text-sm font-semibold text-foreground">Blooming in Pain</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close share menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Copy link bar */}
          <div className="mt-3.5 mb-3">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Direct Link
            </label>
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl border border-border bg-muted/30">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 bg-transparent text-xs text-foreground px-2 font-mono truncate focus:outline-none"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  copied
                    ? "bg-green-700 text-white"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Share destinations */}
          <div className="pt-2 border-t border-border">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Share to
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {shareLinks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      track("page_shared", { page: "blooming-in-pain", method: item.tracking });
                      trackEvent("page_shared", { page: "blooming-in-pain", method: item.tracking });
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium border border-border/60 transition-colors ${item.color}`}
                  >
                    <IconComponent className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
