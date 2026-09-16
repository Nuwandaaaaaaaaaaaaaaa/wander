"use client";

import { useEffect, useRef, useState } from "react";
import type { Museum, Artwork } from "@/types/museum";
import { useHorizontalLenis } from "@/lib/useLenis";
import { ScrollerContext } from "@/lib/scroll-context";
import { ParallaxWrapper } from "./ParallaxWrapper";
import { RoomSection } from "./RoomSection";
import { Minimap } from "./Minimap";
import { AmbientAudio } from "./AmbientAudio";
import { InfoOverlay } from "./InfoOverlay";

export function TourExperience({ museum }: { museum: Museum }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useHorizontalLenis(containerRef, contentRef, true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    const sections = Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>("[data-room-index]") ?? []
    );
    if (!root || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the section with the greatest intersection ratio currently
        // in the viewport, so the minimap and room label track whichever
        // gallery dominates the screen rather than flickering between
        // adjacent ones near a doorway.
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
      { root, threshold: [0.25, 0.5, 0.75], rootMargin: "0px -10% 0px -10%" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [museum]);

  const currentRoom = museum.rooms[currentIndex];

  return (
    <ScrollerContext.Provider value={containerRef}>
      <div
        ref={containerRef}
        className="no-scrollbar relative h-screen w-screen overflow-x-auto overflow-y-hidden"
      >
        <ParallaxWrapper>
          <div ref={contentRef} className="flex h-screen w-max">
            {museum.rooms.map((room, index) => (
              <RoomSection
                key={room.id}
                room={room}
                index={index}
                isLast={index === museum.rooms.length - 1}
                onSelectArtwork={setSelectedArtwork}
              />
            ))}
          </div>
        </ParallaxWrapper>

        {/* Current room label — replaces a per-room sticky label, since
            position:sticky breaks under the parallax wrapper's transform */}
        {currentRoom && (
          <div className="pointer-events-none fixed inset-x-0 top-8 z-20 flex flex-col items-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#c9b998]/70">
              Room {currentIndex + 1} of {museum.rooms.length}
            </p>
            <p className="font-serif text-sm text-[#e8e2d8]/90">{currentRoom.name}</p>
          </div>
        )}
      </div>

      <Minimap rooms={museum.rooms} currentIndex={currentIndex} museumName={museum.name} />
      <AmbientAudio />
      <InfoOverlay artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
    </ScrollerContext.Provider>
  );
}
