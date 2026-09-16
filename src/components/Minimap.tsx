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
    <div className="fixed inset-x-0 bottom-6 z-50 hidden flex-col items-center gap-2 sm:flex">
      <p className="text-[10px] uppercase tracking-[0.15em] text-[#6d6558]">{museumName}</p>
      <div className="flex items-center gap-4 rounded-full border border-white/10 bg-black/30 px-5 py-2.5 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#a89e8f] transition hover:text-[#e8e2d8]"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18 9 12l6-6" />
          </svg>
          Switch museum
        </Link>
        <div className="flex items-center gap-3 border-l border-white/10 pl-4">
          {rooms.map((room, i) => (
            <div key={room.id} className="group relative flex flex-col items-center gap-1.5">
              <span
                className={`pointer-events-none whitespace-nowrap text-[10px] tracking-wide transition-opacity duration-300 ${
                  i === currentIndex ? "opacity-90 text-[#e8e2d8]" : "opacity-0 group-hover:opacity-60 text-[#a89e8f]"
                }`}
              >
                {room.name}
              </span>
              <span
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "scale-150 bg-[#e8c98a]" : "bg-white/25"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
