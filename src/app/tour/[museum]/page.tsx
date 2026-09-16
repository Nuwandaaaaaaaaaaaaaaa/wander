import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMuseum, museums } from "@/data/museums";
import { TourExperience } from "@/components/TourExperience";

export function generateStaticParams() {
  return museums.map((m) => ({ museum: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ museum: string }>;
}): Promise<Metadata> {
  const { museum: museumId } = await params;
  const museum = getMuseum(museumId);
  if (!museum) return { title: "Wander" };
  return {
    title: `${museum.name} — Wander`,
    description: museum.tagline,
  };
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ museum: string }>;
}) {
  const { museum: museumId } = await params;
  const museum = getMuseum(museumId);

  if (!museum) notFound();

  if (!museum.fullyBuilt) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#0e0c0b] px-6 text-center text-[#e8e2d8]">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#a89e8f]">
          {museum.city}, {museum.country}
        </p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">{museum.name}</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-[#a89e8f]">
          This gallery is still being installed — a full walkthrough is on
          its way. In the meantime, step into the Louvre, which is open now.
        </p>
        <div className="mt-8 flex items-center gap-6 text-xs uppercase tracking-[0.2em]">
          <Link
            href="/tour/louvre"
            className="border-b border-[#c9b998]/40 pb-1 text-[#c9b998] transition hover:border-[#c9b998]"
          >
            Visit the Louvre
          </Link>
          <Link
            href="/"
            className="border-b border-transparent pb-1 text-[#a89e8f] transition hover:border-[#a89e8f]"
          >
            All museums
          </Link>
        </div>
      </main>
    );
  }

  return <TourExperience museum={museum} />;
}
