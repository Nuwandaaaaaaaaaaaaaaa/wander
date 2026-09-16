"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * "Look around" parallax: cursor position drives a gentle pan plus a
 * faint 3D turn, like glancing around the hallway rather than scrolling
 * a flat image — closer to panning a street-view than a fixed photo.
 * Disabled entirely under prefers-reduced-motion.
 */
export function ParallaxWrapper({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawRotateX = useMotionValue(0);
  const spring = { stiffness: 34, damping: 18, mass: 0.6 };
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);
  const rotateY = useSpring(rawRotateY, spring);
  const rotateX = useSpring(rawRotateX, spring);

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      rawX.set(nx * -70);
      rawY.set(ny * -26);
      rawRotateY.set(nx * -3.2);
      rawRotateX.set(ny * 1.6);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion, rawX, rawY, rawRotateY, rawRotateX]);

  if (reduceMotion) return <>{children}</>;

  return (
    <div className="h-full w-max" style={{ perspective: "1600px" }}>
      <motion.div
        style={{ x, y, rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="h-full w-max will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
