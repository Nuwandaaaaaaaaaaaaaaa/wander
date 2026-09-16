"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { Room, Artwork } from "@/types/museum";
import { ArtworkFrame } from "./ArtworkFrame";
import { useScroller } from "@/lib/scroll-context";

const WALL_TONES: Record<Room["wallTone"], { wall: string; floor: string; glow: string }> = {
  warm: {
    wall: "linear-gradient(90deg, #14100c 0%, #201812 45%, #201812 55%, #14100c 100%)",
    floor: "linear-gradient(180deg, #1c140f 0%, #0c0908 100%)",
    glow: "rgba(255, 205, 140, 0.10)",
  },
  dark: {
    wall: "linear-gradient(90deg, #0a0909 0%, #17151a 45%, #17151a 55%, #0a0909 100%)",
    floor: "linear-gradient(180deg, #121014 0%, #08070a 100%)",
    glow: "rgba(190, 170, 255, 0.06)",
  },
  stone: {
    wall: "linear-gradient(90deg, #101112 0%, #26282b 45%, #26282b 55%, #101112 100%)",
    floor: "linear-gradient(180deg, #17181a 0%, #0a0a0b 100%)",
    glow: "rgba(210, 220, 230, 0.07)",
  },
  neutral: {
    wall: "linear-gradient(90deg, #0e0c0a 0%, #221f1b 45%, #221f1b 55%, #0e0c0a 100%)",
    floor: "linear-gradient(180deg, #191611 0%, #0a0907 100%)",
    glow: "rgba(230, 220, 200, 0.08)",
  },
};

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

  return (
    <section
      ref={sectionRef}
      data-room-id={room.id}
      data-room-index={index}
      className="relative flex h-full flex-shrink-0 items-stretch"
      style={{ background: tone.wall }}
    >
      {/* Ambient spotlight glow, centered on the room */}
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 w-[60vw] -translate-x-1/2"
        style={{
          background: `radial-gradient(ellipse 60% 55% at 50% 40%, ${tone.glow}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex h-full items-center" style={{ paddingInline: "6vw" }}>
        {room.artworks.map((artwork) => (
          <ArtworkFrame key={artwork.id} artwork={artwork} onSelect={onSelectArtwork} />
        ))}
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

      {/* Threshold darkening into the next room */}
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
