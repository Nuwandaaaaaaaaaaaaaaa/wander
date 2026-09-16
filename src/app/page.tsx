import Link from "next/link";
import Image from "next/image";
import { museums, artworkCount } from "@/data/museums";
import { commonsFileUrl } from "@/lib/wikimedia";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0e0c0b] text-[#e8e2d8]">
      <section className="flex flex-col items-center px-6 pb-16 pt-24 text-center sm:pt-32">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#a89e8f]">
          A scroll-driven tour
        </p>
        <h1 className="mt-5 font-serif text-5xl leading-tight sm:text-6xl">
          Wander
        </h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-[#a89e8f]">
          Walk through real rooms, hung with real, verified public-domain
          paintings and sculpture. Scroll to move, look around, click any
          piece to learn its story.
        </p>
      </section>

      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-6 pb-28 sm:grid-cols-2 lg:grid-cols-3">
        {museums.map((museum) => {
          const count = artworkCount(museum);
          return (
            <Link
              key={museum.id}
              href={`/tour/${museum.id}`}
              className="group relative flex flex-col overflow-hidden rounded-sm border border-white/10 bg-[#141110] transition hover:border-white/25"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                {museum.heroCommonsFile ? (
                  <Image
                    src={commonsFileUrl(museum.heroCommonsFile, 700)}
                    alt={museum.name}
                    fill
                    className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                    sizes="(max-width: 640px) 100vw, 33vw"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#1c1815] to-[#0a0908]">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#6d6558]">
                      Coming soon
                    </span>
                  </div>
                )}
                {!museum.fullyBuilt && (
                  <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-[#e8c98a]">
                    In progress
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5 text-left">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#a89e8f]">
                  {museum.city}, {museum.country}
                </p>
                <h2 className="font-serif text-xl text-[#f2ede4]">{museum.name}</h2>
                <p className="text-xs leading-relaxed text-[#8b8276]">{museum.tagline}</p>
                <p className="mt-auto pt-3 text-[10px] uppercase tracking-[0.2em] text-[#6d6558]">
                  {count} {count === 1 ? "work" : "works"} on view
                </p>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
