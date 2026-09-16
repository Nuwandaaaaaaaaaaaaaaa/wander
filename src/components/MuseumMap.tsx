"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { museums, artworkCount } from "@/data/museums";
import type { Museum } from "@/types/museum";
import { commonsFileUrl } from "@/lib/wikimedia";

const FALLBACK_POSITION = { x: 50, y: 50 };
const MIN_ZOOM = 0.85;
const MAX_ZOOM = 1.8;

export function MuseumMap() {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = museums.find((m) => m.id === selectedId) ?? null;
  const previewed = museums.find((m) => m.id === (hoverId ?? selectedId)) ?? null;

  const matchedIds = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.trim().toLowerCase();
    return new Set(
      museums
        .filter((m) => m.name.toLowerCase().includes(q) || m.city.toLowerCase().includes(q))
        .map((m) => m.id)
    );
  }, [query]);

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

        <div className="relative aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-sm border border-white/10 bg-[#0e0c0b] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.8)]">
          <div
            className="absolute inset-0 origin-center transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoom})` }}
          >
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

            {museums.map((museum) => {
              const pos = museum.mapPosition ?? FALLBACK_POSITION;
              const isActive = hoverId === museum.id || selectedId === museum.id;
              const dimmed = matchedIds !== null && !matchedIds.has(museum.id);
              return (
                <button
                  key={museum.id}
                  type="button"
                  onMouseEnter={() => setHoverId(museum.id)}
                  onMouseLeave={() => setHoverId((cur) => (cur === museum.id ? null : cur))}
                  onFocus={() => setHoverId(museum.id)}
                  onClick={() => setSelectedId(museum.id)}
                  className={`group absolute -translate-x-1/2 -translate-y-full focus:outline-none transition-opacity duration-200 ${
                    dimmed ? "opacity-25" : "opacity-100"
                  }`}
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
                </button>
              );
            })}
          </div>

          {/* Toolbar */}
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-md border border-white/10 bg-[#141110]/90 p-1.5 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search museums"
              className={`flex h-7 w-7 items-center justify-center rounded transition ${
                searchOpen ? "bg-white/10 text-[#e8c98a]" : "text-[#a89e8f] hover:bg-white/5 hover:text-[#e8e2d8]"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            {searchOpen && (
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search museums or cities…"
                className="h-7 w-40 rounded bg-transparent px-1.5 text-xs text-[#e8e2d8] outline-none placeholder:text-[#6d6558] sm:w-52"
              />
            )}
          </div>

          {/* Zoom controls */}
          <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-md border border-white/10 bg-[#141110]/90 backdrop-blur-sm">
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => setZoom((z) => Math.min(MAX_ZOOM, +(z + 0.2).toFixed(2)))}
              className="flex h-7 w-7 items-center justify-center text-[#a89e8f] transition hover:bg-white/5 hover:text-[#e8e2d8]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <div className="h-px w-full bg-white/10" />
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => setZoom((z) => Math.max(MIN_ZOOM, +(z - 0.2).toFixed(2)))}
              className="flex h-7 w-7 items-center justify-center text-[#a89e8f] transition hover:bg-white/5 hover:text-[#e8e2d8]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
              </svg>
            </button>
          </div>

          {/* Legend */}
          <div className="absolute right-4 top-[5.5rem] rounded-md border border-white/10 bg-[#141110]/90 px-3 py-2.5 text-[10px] uppercase tracking-[0.1em] text-[#a89e8f] backdrop-blur-sm">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#e8c98a]" />
              Open to visit
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#8b8276]" />
              In progress
            </div>
          </div>

          {/* Compass mark */}
          <div className="absolute right-4 bottom-4 flex flex-col items-center text-[#6d6558]">
            <span className="text-[10px] tracking-[0.2em]">N</span>
            <span className="mt-0.5 h-4 w-px bg-[#6d6558]" />
          </div>

          {/* Selected-museum info card */}
          {selected && (
            <div className="absolute bottom-4 left-4 flex w-[calc(100%-2rem)] max-w-xs gap-3 rounded-md border border-white/10 bg-[#141110]/95 p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-sm sm:w-auto">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close"
                className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-[#6d6558] transition hover:bg-white/10 hover:text-[#e8e2d8]"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-black">
                {selected.heroCommonsFile ? (
                  <Image
                    src={commonsFileUrl(selected.heroCommonsFile, 200)}
                    alt={selected.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#1c1815] to-[#0a0908] text-[9px] uppercase tracking-widest text-[#6d6558]">
                    Soon
                  </div>
                )}
              </div>
              <div className="flex min-w-0 flex-col gap-1 pr-4">
                <p className="truncate font-serif text-base text-[#f2ede4]">{selected.name}</p>
                <p className="truncate text-[10px] uppercase tracking-[0.15em] text-[#a89e8f]">
                  {selected.city}, {selected.country}
                </p>
                <div className="mt-0.5 flex flex-wrap gap-1">
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] uppercase tracking-wide text-[#c9b998]">
                    {artworkCount(selected)} {artworkCount(selected) === 1 ? "work" : "works"}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wide ${
                      selected.fullyBuilt ? "bg-[#e8c98a]/15 text-[#e8c98a]" : "bg-white/5 text-[#8b8276]"
                    }`}
                  >
                    {selected.fullyBuilt ? "Open" : "In progress"}
                  </span>
                </div>
                <Link
                  href={`/tour/${selected.id}`}
                  className="mt-1.5 flex w-fit items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-[#c9b998] transition hover:text-[#e8c98a]"
                >
                  Visit
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-[#8b8276]">
          {previewed && !selected ? (
            <p className="max-w-md text-center text-[#c9b998]">
              {previewed.name} — {previewed.city}, {previewed.country}.{" "}
              {artworkCount(previewed)} {artworkCount(previewed) === 1 ? "work" : "works"} on view.
            </p>
          ) : !selected ? (
            <p>Hover a pin to preview, click to step inside.</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
