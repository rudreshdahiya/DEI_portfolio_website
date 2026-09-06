import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const count = stories.length;
  // Duplicate stories array 3 times for seamless infinite looping
  const extendedStories = [...stories, ...stories, ...stories];

  // Start at the beginning of the middle set (index = count)
  const [currentIndex, setCurrentIndex] = useState(count);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(3);
  const touchStartX = useRef<number | null>(null);

  // Responsive card column layout
  useEffect(() => {
    function updateCardsToShow() {
      if (window.innerWidth < 640) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    }
    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);
    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // Handle seamless wrap-around when transition finishes
  const handleTransitionEnd = () => {
    if (currentIndex >= count * 2) {
      // Reached the end set, seamlessly jump to equivalent index in middle set
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - count);
    } else if (currentIndex < count) {
      // Reached the start set, seamlessly jump to equivalent index in middle set
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + count);
    }
  };

  // Autoplay ticker
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  // Active story index in original 0-8 range for indicator
  const activeDisplayIndex = ((currentIndex % count) + count) % count;

  return (
    <div
      className="relative w-full overflow-hidden py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Blooming in Pain stories"
    >
      {/* Navigation & Status Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Story {activeDisplayIndex + 1} of {count}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPaused ? "bg-amber-500" : "bg-emerald-500 animate-pulse"
              }`}
            />
            {isPaused ? "Paused" : "Looping"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            aria-label="Previous story"
            className="w-9 h-9 rounded-full border-border hover:bg-muted transition-transform active:scale-95"
          >
            ←
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            aria-label="Next story"
            className="w-9 h-9 rounded-full border-border hover:bg-muted transition-transform active:scale-95"
          >
            →
          </Button>
        </div>
      </div>

      {/* Infinite Track Container */}
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
            transition: isTransitioning ? "transform 500ms cubic-bezier(0.165, 0.84, 0.44, 1)" : "none",
          }}
        >
          {extendedStories.map((story, idx) => (
            <div
              key={`${story.id}-${idx}`}
              className="flex-none px-2.5"
              style={{ width: `${100 / cardsToShow}%` }}
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

      {/* Pagination Indicator Dots */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {stories.map((story, idx) => (
          <button
            key={story.id}
            onClick={() => {
              setIsTransitioning(true);
              setCurrentIndex(count + idx);
            }}
            aria-label={`Go to story ${idx + 1}: ${story.title}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === activeDisplayIndex
                ? "w-8"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            style={{
              backgroundColor: idx === activeDisplayIndex ? "var(--plum)" : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}
