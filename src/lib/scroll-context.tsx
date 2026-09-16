"use client";

import { createContext, useContext, type RefObject } from "react";

/**
 * The tour's horizontal scroll viewport (the Lenis "wrapper" element).
 * GSAP ScrollTriggers and Framer Motion's useScroll both need an explicit
 * reference to this element instead of the window, since the hallway
 * scrolls inside a fixed, full-viewport container rather than the page.
 */
export const ScrollerContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

export function useScroller() {
  return useContext(ScrollerContext);
}
