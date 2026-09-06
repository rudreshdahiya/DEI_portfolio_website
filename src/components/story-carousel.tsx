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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(3);
  const touchStartX = useRef<number | null>(null);

  // Responsive cards to show
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

  const totalStories = stories.length;
  const maxIndex = totalStories - 1;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch handlers for swipe on mobile/tablet
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
      {/* Top Carousel Navigation Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Story {currentIndex + 1} of {totalStories}
          </span>
          {isPaused && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
              Paused
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            aria-label="Previous story"
            className="w-9 h-9 rounded-full border-border hover:bg-muted"
          >
            ←
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            aria-label="Next story"
            className="w-9 h-9 rounded-full border-border hover:bg-muted"
          >
            →
          </Button>
        </div>
      </div>

      {/* Track */}
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
          }}
        >
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex-none px-2.5"
              style={{ width: `${100 / cardsToShow}%` }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${story.title} by ${story.author}`}
            >
              <Card className="flex flex-col h-full bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden">
                {/* Card Image */}
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
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"
                    aria-hidden="true"
                  />
                  {/* Tag Overlay */}
                  <span
                    className="absolute bottom-3 left-3 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white backdrop-blur-md"
                    style={{ backgroundColor: "rgba(107, 70, 193, 0.85)" }}
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
                      className="inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity"
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

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {stories.map((story, idx) => (
          <button
            key={story.id}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}: ${story.title}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-8"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            style={{
              backgroundColor: idx === currentIndex ? "var(--plum)" : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}
