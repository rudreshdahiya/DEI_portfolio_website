import { Instagram, Linkedin, Youtube } from "lucide-react";
import { track } from "@vercel/analytics";
import { trackEvent } from "@/lib/analytics";

export function MediumIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

interface SocialLinksProps {
  className?: string;
  iconSize?: string;
  showLabels?: boolean;
}

export function SocialLinks({ className = "flex items-center gap-2", iconSize = "w-4 h-4" }: SocialLinksProps) {
  const handleClick = (destination: string) => {
    track("outbound_click", { destination, location: "social_bar" });
    trackEvent("outbound_click", { destination, location: "social_bar" });
  };

  return (
    <div className={className}>
      {/* Blooming in Pain — Instagram */}
      <a
        href="https://instagram.com/blooming.in.pain"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Blooming in Pain Instagram (opens in new tab)"
        className="p-2 rounded-full border border-border bg-card hover:bg-muted text-foreground hover:text-primary transition-all hover:scale-105 flex items-center justify-center"
        onClick={() => handleClick("instagram_bip")}
        title="Blooming in Pain Instagram (@blooming.in.pain)"
      >
        <Instagram className={iconSize} />
        <span className="sr-only">Blooming in Pain Instagram (opens in new tab)</span>
      </a>

      {/* Blooming in Pain — Medium */}
      <a
        href="https://medium.com/@BloomingInPain"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Blooming in Pain Medium (opens in new tab)"
        className="p-2 rounded-full border border-border bg-card hover:bg-muted text-foreground hover:text-primary transition-all hover:scale-105 flex items-center justify-center"
        onClick={() => handleClick("medium_bip")}
        title="Blooming in Pain Medium (@BloomingInPain)"
      >
        <MediumIcon className={iconSize} />
        <span className="sr-only">Blooming in Pain Medium (opens in new tab)</span>
      </a>

      {/* Blooming in Pain — LinkedIn Company */}
      <a
        href="https://www.linkedin.com/company/bloominginpain"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Blooming in Pain LinkedIn Page (opens in new tab)"
        className="p-2 rounded-full border border-border bg-card hover:bg-muted text-foreground hover:text-primary transition-all hover:scale-105 flex items-center justify-center"
        onClick={() => handleClick("linkedin_bip")}
        title="Blooming in Pain LinkedIn Page"
      >
        <Linkedin className={iconSize} />
        <span className="sr-only">Blooming in Pain LinkedIn (opens in new tab)</span>
      </a>

      {/* Pratik — Personal Instagram */}
      <a
        href="https://instagram.com/pratik.aggarwal"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pratik Aggarwal Instagram Profile (opens in new tab)"
        className="p-2 rounded-full border border-border bg-card hover:bg-muted text-foreground hover:text-primary transition-all hover:scale-105 flex items-center justify-center"
        onClick={() => handleClick("instagram_pratik")}
        title="Pratik Aggarwal Instagram (@pratik.aggarwal)"
      >
        <Instagram className={iconSize} />
        <span className="sr-only">Pratik Aggarwal Instagram (opens in new tab)</span>
      </a>

      {/* Pratik — Personal LinkedIn */}
      <a
        href="https://linkedin.com/in/pratik-aggarwal"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pratik Aggarwal LinkedIn Profile (opens in new tab)"
        className="p-2 rounded-full border border-border bg-card hover:bg-muted text-foreground hover:text-primary transition-all hover:scale-105 flex items-center justify-center"
        onClick={() => handleClick("linkedin_pratik")}
        title="Pratik Aggarwal LinkedIn"
      >
        <Linkedin className={iconSize} />
        <span className="sr-only">Pratik Aggarwal LinkedIn (opens in new tab)</span>
      </a>

      {/* Pratik — YouTube */}
      <a
        href="https://www.youtube.com/@pratikaggarwal"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pratik Aggarwal YouTube Channel (opens in new tab)"
        className="p-2 rounded-full border border-border bg-card hover:bg-muted text-foreground hover:text-primary transition-all hover:scale-105 flex items-center justify-center"
        onClick={() => handleClick("youtube_pratik")}
        title="Pratik Aggarwal YouTube Channel"
      >
        <Youtube className={iconSize} />
        <span className="sr-only">Pratik Aggarwal YouTube (opens in new tab)</span>
      </a>
    </div>
  );
}
