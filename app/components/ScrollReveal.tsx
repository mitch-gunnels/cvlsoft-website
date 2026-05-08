"use client";

import { useEffect } from "react";

/**
 * Mounts a single IntersectionObserver that adds `.in-view` to any element
 * with `.reveal-up`, `.scale-in`, `.cascade`, or `.row-fade` once it scrolls
 * into the user's reading area. A MutationObserver picks up nodes added
 * later (e.g., expanded sections, route transitions on the same layout).
 *
 * Mounted once in app/layout.tsx so every page inherits the behavior — pages
 * just need to add the reveal classes (and optional `[animation-delay:...]`
 * Tailwind arbitrary classes) to the elements they want to animate.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const SELECTOR =
      ".reveal-up:not(.in-view), .scale-in:not(.in-view), .cascade:not(.in-view), .row-fade:not(.in-view)";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );

    const observeAll = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => observer.observe(el));
    };
    observeAll();

    const mutationObserver = new MutationObserver(observeAll);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
