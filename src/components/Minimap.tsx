"use client";

import Link from "next/link";
import type { Room } from "@/types/museum";

export function Minimap({
  rooms,
  currentIndex,
  museumName,
}: {
  rooms: Room[];
  currentIndex: number;
  museumName: string;
}) {
  return (
    <div className="fixed left-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-start gap-3 sm:flex">
      <Link
        href="/"
        className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#a89e8f] transition hover:text-[#e8e2d8]"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18 9 12l6-6" />
        </svg>
        Switch museum
      </Link>
      <div className="flex flex-col gap-3 border-l border-white/10 pl-3">
        {rooms.map((room, i) => (
          <div key={room.id} className="group relative flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? "scale-150 bg-[#e8c98a]" : "bg-white/25"
              }`}
            />
            <span
              className={`pointer-events-none text-[10px] tracking-wide transition-opacity duration-300 ${
                i === currentIndex ? "opacity-90 text-[#e8e2d8]" : "opacity-0 group-hover:opacity-60 text-[#a89e8f]"
              }`}
            >
              {room.name}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2 max-w-[9rem] text-[10px] uppercase tracking-[0.15em] text-[#6d6558]">{museumName}</p>
    </div>
  );
}
