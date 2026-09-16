"use client";

import { useEffect, type RefObject } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Wires Lenis's smooth-scroll RAF loop into GSAP's ticker so
 * ScrollTrigger stays in sync with the eased, weighted scroll
 * position rather than the browser's raw (instant) scrollLeft.
 *
 * The tour is a horizontal hallway: `containerRef` is a fixed,
 * full-viewport element that scrolls natively (overflow-x), and
 * `contentRef` is the wide flex row of rooms inside it. Lenis takes
 * over that container's scroll physics directly (rather than the
 * window's) and remaps normal vertical wheel input to horizontal
 * movement, since almost nobody has a horizontal-only mouse wheel.
 * Respects prefers-reduced-motion by skipping the easing entirely.
 */
export function useHorizontalLenis(
  containerRef: RefObject<HTMLDivElement | null>,
  contentRef: RefObject<HTMLDivElement | null>,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;
    const wrapper = containerRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const lenis = new Lenis({
      wrapper,
      content,
      orientation: "horizontal",
      // A normal mouse wheel only ever reports vertical delta — this
      // lets that same vertical scroll gesture drive movement down
      // the hallway, the way most horizontal-scroll sites work.
      gestureOrientation: "both",
      duration: prefersReducedMotion ? 0.1 : 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: !prefersReducedMotion,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [enabled, containerRef, contentRef]);
}
