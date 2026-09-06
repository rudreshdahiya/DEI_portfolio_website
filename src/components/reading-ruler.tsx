import { useEffect, useRef, useCallback } from "react";

/**
 * ReadingRuler — a translucent overlay that follows the cursor/touch,
 * creating a "spotlight band" to help users track their reading position.
 *
 * Only visible when html[data-a11y-focus="ruler"] is set (via CSS).
 * Uses pointer-events: none so it never blocks interaction.
 */
export function ReadingRuler() {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const BAND_HEIGHT = 90; // px — height of the clear reading band

  const updatePosition = useCallback((clientY: number) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const bandTop = Math.max(0, clientY - BAND_HEIGHT / 2);
      if (topRef.current) {
        topRef.current.style.height = `${bandTop}px`;
      }
      if (bandRef.current) {
        bandRef.current.style.top = `${bandTop}px`;
      }
      if (bottomRef.current) {
        bottomRef.current.style.top = `${bandTop + BAND_HEIGHT}px`;
        bottomRef.current.style.height = `${window.innerHeight - bandTop - BAND_HEIGHT}px`;
      }
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => updatePosition(e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updatePosition(e.touches[0].clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Initialize position at center
    updatePosition(window.innerHeight / 2);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updatePosition]);

  return (
    <div className="reading-ruler" aria-hidden="true">
      <div ref={topRef} className="reading-ruler__top" />
      <div ref={bandRef} className="reading-ruler__band" />
      <div ref={bottomRef} className="reading-ruler__bottom" />
    </div>
  );
}
