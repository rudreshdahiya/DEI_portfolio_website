import { Card, CardContent } from "@/components/ui/card";
import { track } from "@vercel/analytics";

export interface Story {
  id: number;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  author: string;
  mediumUrl: string;
  imgUrl: string;
}

interface StoryCarouselProps {
  stories: Story[];
}

export function StoryCarousel({ stories }: StoryCarouselProps) {
  // Duplicate stories array for a 100% seamless infinite horizontal scroll marquee
  const marqueeStories = [...stories, ...stories];

  return (
    <div
      className="relative w-full overflow-hidden py-4"
      aria-roledescription="carousel"
      aria-label="Blooming in Pain stories infinite scroll"
    >
      {/* Side Fade Masks for smooth visually polished edges */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-20 bg-gradient-to-r from-background to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-12 sm:w-20 bg-gradient-to-l from-background to-transparent"
        aria-hidden="true"
      />

      {/* Continuous Slow Infinite Scroll Track */}
      <div className="overflow-hidden rounded-xl">
        <div className="animate-marquee-slow py-2">
          {marqueeStories.map((story, idx) => (
            <div
              key={`${story.id}-${idx}`}
              className="w-[300px] sm:w-[350px] md:w-[380px] flex-none px-3"
              role="group"
              aria-roledescription="slide"
              aria-label={`${story.title} by ${story.author}`}
            >
              <Card className="flex flex-col h-full bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
                {/* Image & Tag */}
                <div
                  className="relative w-full overflow-hidden flex-none bg-muted"
                  style={{ aspectRatio: "16/9" }}
                >
                  <img
                    src={story.imgUrl}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-75"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute bottom-3 left-3 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white backdrop-blur-md shadow-sm"
                    style={{ backgroundColor: "rgba(107, 70, 193, 0.88)" }}
                  >
                    {story.tag}
                  </span>
                </div>

                {/* Content */}
                <CardContent className="flex flex-col flex-1 p-5">
                  <h3
                    className="text-lg text-foreground font-semibold leading-snug mb-2.5 group-hover:text-primary transition-colors line-clamp-2"
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  >
                    {story.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5 line-clamp-3">
                    {story.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <span className="text-xs text-muted-foreground font-medium">
                      {story.author} · {story.readTime}
                    </span>
                    <a
                      href={story.mediumUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity shrink-0 ml-2"
                      style={{ color: "var(--plum)" }}
                      onClick={() =>
                        track("outbound_click", {
                          destination: "medium",
                          story: story.title,
                        })
                      }
                      aria-label={`Read "${story.title}" on Medium (opens in new tab)`}
                    >
                      Read on Medium →
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
