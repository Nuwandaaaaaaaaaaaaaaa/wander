"use client";

import { useEffect, useRef, useState } from "react";
import type { Museum, Artwork } from "@/types/museum";
import { useLenis } from "@/lib/useLenis";
import { ParallaxWrapper } from "./ParallaxWrapper";
import { RoomSection } from "./RoomSection";
import { Minimap } from "./Minimap";
import { AmbientAudio } from "./AmbientAudio";
import { InfoOverlay } from "./InfoOverlay";

export function TourExperience({ museum }: { museum: Museum }) {
  useLenis(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sections = Array.from(
      containerRef.current?.querySelectorAll<HTMLElement>("[data-room-index]") ?? []
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the section with the greatest intersection ratio currently
        // on screen, so the minimap tracks whichever room dominates the
        // viewport rather than flickering between adjacent ones.
        let best: { index: number; ratio: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = Number(
            (entry.target as HTMLElement).dataset.roomIndex ?? "0"
          );
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { index: idx, ratio: entry.intersectionRatio };
          }
        }
        if (best) setCurrentIndex(best.index);
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-10% 0px -10% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [museum]);

  return (
    <div ref={containerRef} className="relative">
      <ParallaxWrapper>
        {museum.rooms.map((room, index) => (
          <RoomSection
            key={room.id}
            room={room}
            index={index}
            total={museum.rooms.length}
            onSelectArtwork={setSelectedArtwork}
          />
        ))}
      </ParallaxWrapper>

      <Minimap rooms={museum.rooms} currentIndex={currentIndex} museumName={museum.name} />
      <AmbientAudio />
      <InfoOverlay artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
    </div>
  );
}
