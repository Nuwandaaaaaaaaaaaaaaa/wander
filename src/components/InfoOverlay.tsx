"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Artwork } from "@/types/museum";
import { commonsFileUrl } from "@/lib/wikimedia";

export function InfoOverlay({
  artwork,
  onClose,
}: {
  artwork: Artwork | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {artwork && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 grid max-h-[88vh] w-full max-w-4xl grid-cols-1 overflow-y-auto rounded-lg bg-[#100e0d] shadow-2xl md:grid-cols-2 md:overflow-hidden"
          >
            <div className="relative flex items-center justify-center bg-black p-6 md:p-10">
              <Image
                src={commonsFileUrl(artwork.commonsFile, 1000)}
                alt={`${artwork.title} by ${artwork.artist}`}
                width={1000}
                height={1200}
                className="max-h-[50vh] w-auto object-contain md:max-h-[80vh]"
                unoptimized
              />
            </div>
            <div className="flex flex-col justify-center gap-4 p-6 sm:p-10">
              <div>
                <h2 className="font-serif text-2xl text-[#f2ede4] sm:text-3xl">{artwork.title}</h2>
                <p className="mt-1 text-[#c9b998]">{artwork.artist} &middot; {artwork.year}</p>
              </div>
              <p className="text-sm leading-relaxed text-[#a89e8f]">{artwork.description}</p>
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-[#8b8276]">
                <dt className="uppercase tracking-wide">Medium</dt>
                <dd>{artwork.medium}</dd>
                {artwork.dimensions && (
                  <>
                    <dt className="uppercase tracking-wide">Dimensions</dt>
                    <dd>{artwork.dimensions}</dd>
                  </>
                )}
                <dt className="uppercase tracking-wide">Collection</dt>
                <dd>{artwork.source.collection}</dd>
              </dl>
              <a
                href={artwork.source.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex w-fit items-center gap-1.5 border-b border-[#c9b998]/40 pb-0.5 text-xs text-[#c9b998] transition hover:border-[#c9b998]"
              >
                View source record
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17 17 7M7 7h10v10" />
                </svg>
              </a>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[#e8e2d8] transition hover:bg-white/10 md:right-6 md:top-6"
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
