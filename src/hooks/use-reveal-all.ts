import { useEffect } from "react";

export function useRevealAll(deps: React.DependencyList = [], threshold = 0.05) {
  useEffect(() => {
    // Select all reveal elements and immediately ensure they are marked visible on render or dep change
    const els = document.querySelectorAll<Element>(".reveal, .reveal-stagger");
    els.forEach((el) => {
      el.classList.add("is-visible");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [threshold, ...deps]);
}
