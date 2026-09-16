"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { Room, Artwork } from "@/types/museum";
import { ArtworkFrame } from "./ArtworkFrame";
import { GalleryFigure } from "./GalleryFigure";
import { useScroller } from "@/lib/scroll-context";

const WALL_TONES: Record<
  Room["wallTone"],
  { wall: string; floor: string; glow: string; rail: string; figure: string }
> = {
  warm: {
    wall: "linear-gradient(90deg, #14100c 0%, #201812 45%, #201812 55%, #14100c 100%)",
    floor: "linear-gradient(180deg, #1c140f 0%, #0c0908 100%)",
    glow: "rgba(255, 205, 140, 0.10)",
    rail: "rgba(255, 235, 210, 0.07)",
    figure: "#0f0b08",
  },
  dark: {
    wall: "linear-gradient(90deg, #0a0909 0%, #17151a 45%, #17151a 55%, #0a0909 100%)",
    floor: "linear-gradient(180deg, #121014 0%, #08070a 100%)",
    glow: "rgba(190, 170, 255, 0.06)",
    rail: "rgba(220, 210, 255, 0.06)",
    figure: "#08070a",
  },
  stone: {
    wall: "linear-gradient(90deg, #101112 0%, #26282b 45%, #26282b 55%, #101112 100%)",
    floor: "linear-gradient(180deg, #17181a 0%, #0a0a0b 100%)",
    glow: "rgba(210, 220, 230, 0.07)",
    rail: "rgba(220, 228, 232, 0.07)",
    figure: "#0a0b0c",
  },
  neutral: {
    wall: "linear-gradient(90deg, #0e0c0a 0%, #221f1b 45%, #221f1b 55%, #0e0c0a 100%)",
    floor: "linear-gradient(180deg, #191611 0%, #0a0907 100%)",
    glow: "rgba(230, 220, 200, 0.08)",
    rail: "rgba(235, 225, 205, 0.07)",
    figure: "#0c0a08",
  },
};

function Bench({ tone }: { tone: string }) {
  return (
    <svg viewBox="0 0 120 36" className="h-[6vh] w-auto opacity-80" fill="none">
      <rect x="4" y="14" width="112" height="7" rx="1.5" fill={tone} />
      <rect x="10" y="21" width="4" height="12" fill={tone} />
      <rect x="106" y="21" width="4" height="12" fill={tone} />
      <rect x="2" y="9" width="116" height="4" rx="2" fill={tone} opacity="0.7" />
    </svg>
  );
}

function Doorway({ glowTone, glowId }: { glowTone: string; glowId: string }) {
  return (
    <svg viewBox="0 0 100 200" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id={glowId} cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor={glowTone} stopOpacity="0.55" />
          <stop offset="100%" stopColor={glowTone} stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M18,200 L18,58 Q18,6 50,6 Q82,6 82,58 L82,200"
        fill={`url(#${glowId})`}
      />
      <path
        d="M18,200 L18,58 Q18,6 50,6 Q82,6 82,58 L82,200"
        fill="none"
        stroke="rgba(255,245,230,0.18)"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function RoomSection({
  room,
  index,
  isLast,
  onSelectArtwork,
}: {
  room: Room;
  index: number;
  isLast: boolean;
  onSelectArtwork: (artwork: Artwork) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const thresholdRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useScroller();
  const tone = WALL_TONES[room.wallTone];

  useEffect(() => {
    if (!sectionRef.current || !thresholdRef.current || !scrollerRef?.current) return;
    const ctx = gsap.context(() => {
      // Doorway darkening as the room scrolls past — a brief threshold
      // moment rather than a hard cut into the next gallery.
      gsap.fromTo(
        thresholdRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            scroller: scrollerRef.current,
            horizontal: true,
            start: "right 55%",
            end: "right 5%",
            scrub: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [scrollerRef]);

  const midIndex = Math.floor((room.artworks.length - 1) / 2);

  return (
    <section
      ref={sectionRef}
      data-room-id={room.id}
      data-room-index={index}
      className="relative flex h-full flex-shrink-0 items-stretch overflow-hidden"
      style={{ background: tone.wall }}
    >
      {/* Ambient spotlight glow, centered on the room */}
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 w-[60vw] -translate-x-1/2"
        style={{
          background: `radial-gradient(ellipse 60% 55% at 50% 40%, ${tone.glow}, transparent 70%)`,
        }}
      />

      {/* Picture rail + baseboard mouldings, for an actual room feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[14vh] h-px"
        style={{ background: tone.rail }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[9vh] h-px"
        style={{ background: tone.rail }}
      />

      <div className="relative z-10 flex h-full items-center" style={{ paddingInline: "6vw", gap: "5vw" }}>
        {/* A visitor standing just inside the room, taking it in */}
        <div className="flex h-full flex-shrink-0 items-end pb-[11vh]">
          <GalleryFigure pose="standing" tone={tone.figure} className="h-[22vh] w-auto opacity-60" />
        </div>

        {room.artworks.map((artwork, i) => (
          <div key={artwork.id} className="flex h-full flex-shrink-0 items-center">
            <ArtworkFrame artwork={artwork} onSelect={onSelectArtwork} />
            {i === midIndex && (
              <div className="ml-[3vw] flex h-full flex-shrink-0 items-end gap-[2vw] pb-[9.5vh]">
                <Bench tone={tone.figure} />
                <GalleryFigure pose="seated" tone={tone.figure} className="h-[13vh] w-auto -translate-x-3 opacity-65" />
              </div>
            )}
          </div>
        ))}

        {/* A second visitor lingering near the doorway out */}
        <div className="flex h-full flex-shrink-0 items-end pb-[11vh]">
          <GalleryFigure
            pose={index % 2 === 0 ? "cane" : "looking-close"}
            tone={tone.figure}
            className="h-[21vh] w-auto opacity-55"
          />
        </div>
      </div>

      {/* Floor strip suggesting parquet running the direction of travel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[9vh] w-full opacity-70"
        style={{
          background: tone.floor,
          backgroundImage: `${tone.floor}, repeating-linear-gradient(10deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 40px)`,
        }}
      />

      {/* An arched doorway ahead, glowing faintly with the next room's light */}
      {!isLast && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[16vw]">
          <Doorway glowTone={tone.glow} glowId={`doorway-glow-${room.id}`} />
        </div>
      )}

      {/* Threshold darkening as you actually pass through */}
      {!isLast && (
        <div
          ref={thresholdRef}
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-[16vw] bg-gradient-to-r from-transparent to-black opacity-0"
        />
      )}
    </section>
  );
}
