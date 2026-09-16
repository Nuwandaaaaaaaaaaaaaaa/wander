"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { Room, Artwork } from "@/types/museum";
import { ArtworkFrame } from "./ArtworkFrame";

const WALL_TONES: Record<Room["wallTone"], { wall: string; floor: string; glow: string }> = {
  warm: {
    wall: "linear-gradient(180deg, #2b2119 0%, #201812 55%, #14100c 100%)",
    floor: "linear-gradient(180deg, #1c140f 0%, #0c0908 100%)",
    glow: "rgba(255, 205, 140, 0.10)",
  },
  dark: {
    wall: "linear-gradient(180deg, #17151a 0%, #100e12 55%, #0a0909 100%)",
    floor: "linear-gradient(180deg, #121014 0%, #08070a 100%)",
    glow: "rgba(190, 170, 255, 0.06)",
  },
  stone: {
    wall: "linear-gradient(180deg, #26282b 0%, #1b1c1e 55%, #101112 100%)",
    floor: "linear-gradient(180deg, #17181a 0%, #0a0a0b 100%)",
    glow: "rgba(210, 220, 230, 0.07)",
  },
  neutral: {
    wall: "linear-gradient(180deg, #221f1b 0%, #191712 55%, #0e0c0a 100%)",
    floor: "linear-gradient(180deg, #191611 0%, #0a0907 100%)",
    glow: "rgba(230, 220, 200, 0.08)",
  },
};

export function RoomSection({
  room,
  index,
  total,
  onSelectArtwork,
}: {
  room: Room;
  index: number;
  total: number;
  onSelectArtwork: (artwork: Artwork) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const thresholdRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const tone = WALL_TONES[room.wallTone];

  useEffect(() => {
    if (!sectionRef.current || !thresholdRef.current) return;
    const ctx = gsap.context(() => {
      // Doorway darkening as the room scrolls past — a brief threshold
      // moment rather than a hard cut between galleries.
      gsap.fromTo(
        thresholdRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "bottom 55%",
            end: "bottom 5%",
            scrub: true,
          },
        }
      );

      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "top 30%",
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-room-id={room.id}
      data-room-index={index}
      className="relative"
      style={{ background: tone.wall }}
    >
      {/* Ambient spotlight glow, fixed relative to the room */}
      <div
        className="pointer-events-none sticky top-0 h-0 w-full"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${tone.glow}, transparent 70%)`,
          height: "60vh",
          marginBottom: "-60vh",
        }}
      />

      <div ref={labelRef} className="sticky top-8 z-20 mx-auto w-fit px-5 py-2">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#c9b998]/70">
          Room {index + 1} of {total}
        </p>
        <p className="font-serif text-sm text-[#e8e2d8]/90">{room.name}</p>
      </div>

      <div className="relative z-10 pt-[8vh]">
        {room.artworks.map((artwork) => (
          <ArtworkFrame key={artwork.id} artwork={artwork} onSelect={onSelectArtwork} />
        ))}
      </div>

      {/* Floor gradient strip suggesting parquet, purely decorative */}
      <div
        aria-hidden
        className="pointer-events-none h-[8vh] w-full opacity-70"
        style={{
          background: tone.floor,
          backgroundImage: `${tone.floor}, repeating-linear-gradient(100deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 2px, transparent 2px, transparent 40px)`,
        }}
      />

      {/* Threshold darkening into the next room */}
      <div
        ref={thresholdRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[30vh] bg-black opacity-0"
      />
    </section>
  );
}
