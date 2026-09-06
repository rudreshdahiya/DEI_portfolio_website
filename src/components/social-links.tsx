import { Instagram, Linkedin } from "lucide-react";
import { track } from "@vercel/analytics";

export function MediumIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

interface SocialLinksProps {
  className?: string;
  iconSize?: string;
}

export function SocialLinks({ className = "flex items-center gap-2.5", iconSize = "w-4 h-4" }: SocialLinksProps) {
  return (
    <div className={className}>
      <a
        href="https://instagram.com/blooming.in.pain"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram @blooming.in.pain (opens in new tab)"
        className="p-2 rounded-full border border-border bg-card hover:bg-muted text-foreground hover:text-primary transition-all hover:scale-105 flex items-center justify-center"
        onClick={() => track("outbound_click", { destination: "instagram", location: "social_bar" })}
        title="Instagram @blooming.in.pain"
      >
        <Instagram className={iconSize} />
        <span className="sr-only">Instagram (opens in new tab)</span>
      </a>
      <a
        href="https://medium.com/@BloomingInPain"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Medium @BloomingInPain (opens in new tab)"
        className="p-2 rounded-full border border-border bg-card hover:bg-muted text-foreground hover:text-primary transition-all hover:scale-105 flex items-center justify-center"
        onClick={() => track("outbound_click", { destination: "medium", location: "social_bar" })}
        title="Medium @BloomingInPain"
      >
        <MediumIcon className={iconSize} />
        <span className="sr-only">Medium (opens in new tab)</span>
      </a>
      <a
        href="https://linkedin.com/in/pratik-aggarwal"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn Pratik Aggarwal (opens in new tab)"
        className="p-2 rounded-full border border-border bg-card hover:bg-muted text-foreground hover:text-primary transition-all hover:scale-105 flex items-center justify-center"
        onClick={() => track("outbound_click", { destination: "linkedin", location: "social_bar" })}
        title="LinkedIn Pratik Aggarwal"
      >
        <Linkedin className={iconSize} />
        <span className="sr-only">LinkedIn (opens in new tab)</span>
      </a>
    </div>
  );
}
