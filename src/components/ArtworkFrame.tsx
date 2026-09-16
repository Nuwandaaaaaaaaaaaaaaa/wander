"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { Artwork } from "@/types/museum";
import { commonsFileUrl } from "@/lib/wikimedia";

export function ArtworkFrame({
  artwork,
  onSelect,
}: {
  artwork: Artwork;
  onSelect: (artwork: Artwork) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "start 0.4"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);
  const blur = useTransform(scrollYProgress, [0, 1], [6, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  const widthScale = artwork.scale ?? 1;
  const isFeatured = artwork.spotlight === "featured";

  return (
    <div
      ref={ref}
      className="flex justify-center py-[14vh] px-6"
      style={{ maxWidth: `${Math.min(90, 42 * widthScale)}vw`, margin: "0 auto" }}
    >
      <motion.button
        type="button"
        onClick={() => onSelect(artwork)}
        style={
          reduceMotion
            ? undefined
            : { scale, opacity, filter }
        }
        className="group relative block text-left focus:outline-none"
        aria-label={`View details for ${artwork.title} by ${artwork.artist}`}
      >
        <div
          className={`relative overflow-hidden rounded-sm shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] ring-8 ring-[#141110] transition-shadow duration-500 ${
            isFeatured ? "group-hover:shadow-[0_0_90px_-10px_rgba(255,220,160,0.35)]" : ""
          }`}
        >
          {isFeatured && (
            <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-[140%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,225,170,0.35),transparent_70%)]" />
          )}
          <Image
            src={commonsFileUrl(artwork.commonsFile, 900)}
            alt={`${artwork.title} by ${artwork.artist}`}
            width={900}
            height={Math.round(900 * 1.2)}
            className="h-auto w-full object-contain bg-[#0e0c0b] transition-transform duration-700 group-hover:scale-[1.015]"
            sizes="(max-width: 768px) 90vw, 42vw"
            unoptimized
          />
        </div>
        <div className="mt-4 text-center opacity-70 transition-opacity duration-300 group-hover:opacity-100">
          <p className="font-serif text-sm tracking-wide text-[#e8e2d8]">{artwork.title}</p>
          <p className="text-xs text-[#a89e8f]">{artwork.artist}, {artwork.year}</p>
        </div>
      </motion.button>
    </div>
  );
}
