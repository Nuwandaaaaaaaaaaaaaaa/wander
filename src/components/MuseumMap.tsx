"use client";

import { useState } from "react";
import Link from "next/link";
import { museums, artworkCount } from "@/data/museums";
import type { Museum } from "@/types/museum";

const FALLBACK_POSITION = { x: 50, y: 50 };

export function MuseumMap() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = museums.find((m) => m.id === activeId) ?? null;

  const points = museums
    .filter((m): m is Museum & { mapPosition: { x: number; y: number } } => Boolean(m.mapPosition))
    .map((m) => `${m.mapPosition.x},${m.mapPosition.y}`)
    .join(" ");

  return (
    <main className="relative flex min-h-screen flex-col bg-[#0b0a09] text-[#e8e2d8]">
      <header className="flex items-center justify-between px-6 pt-8 sm:px-10">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#a89e8f] transition hover:text-[#e8e2d8]"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18 9 12l6-6" />
          </svg>
          All museums
        </Link>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#6d6558]">Wander — Atlas</p>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl">Pick a pin</h1>
          <p className="mt-2 text-sm text-[#a89e8f]">Every gallery on the tour, laid out as a route.</p>
        </div>

        <div className="relative aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-sm border border-white/10 bg-[#0e0c0b]">
          {/* Decorative graticule + dot grid — a stylized atlas, not a literal map */}
          <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none">
            <defs>
              <pattern id="dot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#3a352d" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-grid)" />
            {[20, 40, 60, 80].map((pct) => (
              <line
                key={`v-${pct}`}
                x1={`${pct}%`}
                y1="0"
                x2={`${pct}%`}
                y2="100%"
                stroke="#3a352d"
                strokeWidth="1"
                strokeDasharray="1 6"
              />
            ))}
            {[25, 50, 75].map((pct) => (
              <line
                key={`h-${pct}`}
                x1="0"
                y1={`${pct}%`}
                x2="100%"
                y2={`${pct}%`}
                stroke="#3a352d"
                strokeWidth="1"
                strokeDasharray="1 6"
              />
            ))}
          </svg>

          {/* Route connecting the museums in tour order */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polyline
              points={points}
              fill="none"
              stroke="#c9b998"
              strokeOpacity="0.25"
              strokeWidth="0.3"
              strokeDasharray="1.2 1.4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Compass mark */}
          <div className="absolute right-5 top-5 flex flex-col items-center text-[#6d6558]">
            <span className="text-[10px] tracking-[0.2em]">N</span>
            <span className="mt-0.5 h-4 w-px bg-[#6d6558]" />
          </div>

          {museums.map((museum) => {
            const pos = museum.mapPosition ?? FALLBACK_POSITION;
            const isActive = activeId === museum.id;
            return (
              <Link
                key={museum.id}
                href={`/tour/${museum.id}`}
                onMouseEnter={() => setActiveId(museum.id)}
                onMouseLeave={() => setActiveId((cur) => (cur === museum.id ? null : cur))}
                onFocus={() => setActiveId(museum.id)}
                className="group absolute -translate-x-1/2 -translate-y-full focus:outline-none"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`pointer-events-none mb-1.5 whitespace-nowrap rounded-sm border border-white/10 bg-[#141110] px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] transition-all duration-200 ${
                      isActive ? "opacity-100 translate-y-0" : "translate-y-1 opacity-0"
                    }`}
                  >
                    {museum.name}
                    {!museum.fullyBuilt && <span className="ml-1.5 text-[#e8c98a]">· in progress</span>}
                  </div>
                  <svg
                    width="20"
                    height="26"
                    viewBox="0 0 20 26"
                    className={`drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] transition-transform duration-200 ${
                      isActive ? "scale-125" : "scale-100"
                    }`}
                  >
                    <path
                      d="M10 25C10 25 19 15.5 19 9.5C19 4.5 14.97 1 10 1C5.03 1 1 4.5 1 9.5C1 15.5 10 25 10 25Z"
                      fill={museum.fullyBuilt ? "#e8c98a" : "#8b8276"}
                      stroke="#141110"
                      strokeWidth="1"
                    />
                    <circle cx="10" cy="9.5" r="3.5" fill="#141110" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-[#8b8276]">
          {active ? (
            <p className="max-w-md text-center text-[#c9b998]">
              {active.name} — {active.city}, {active.country}.{" "}
              {artworkCount(active)} {artworkCount(active) === 1 ? "work" : "works"} on view.
            </p>
          ) : (
            <p>Hover a pin to preview, click to step inside.</p>
          )}
        </div>
      </div>
    </main>
  );
}
