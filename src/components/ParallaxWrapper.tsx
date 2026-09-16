"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Subtle "look around" parallax: mouse position a few degrees off-center
 * nudges the whole room a few pixels, like a head turn rather than a
 * free camera. Disabled entirely under prefers-reduced-motion.
 */
export function ParallaxWrapper({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 40, damping: 20, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 40, damping: 20, mass: 0.5 });

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      rawX.set(nx * -18);
      rawY.set(ny * -10);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion, rawX, rawY]);

  if (reduceMotion) return <>{children}</>;

  return (
    <motion.div style={{ x, y }} className="will-change-transform">
      {children}
    </motion.div>
  );
}
