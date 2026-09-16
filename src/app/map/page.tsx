import type { Metadata } from "next";
import { MuseumMap } from "@/components/MuseumMap";

export const metadata: Metadata = {
  title: "Map — Wander",
  description: "Pick a museum by pin instead of by list.",
};

export default function MapPage() {
  return <MuseumMap />;
}
