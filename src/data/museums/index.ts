import type { Museum } from "@/types/museum";
import louvre from "./louvre.json";
import nationalGallery from "./national-gallery.json";
import brera from "./brera.json";
import uffizi from "./uffizi.json";
import met from "./met.json";

// Adding a museum is just: drop a new JSON file matching the Museum shape
// in this folder, then list it here. No component code needs to change.
export const museums: Museum[] = [
  louvre as Museum,
  nationalGallery as Museum,
  brera as Museum,
  uffizi as Museum,
  met as Museum,
];

export function getMuseum(id: string): Museum | undefined {
  return museums.find((m) => m.id === id);
}

export function artworkCount(museum: Museum): number {
  return museum.rooms.reduce((sum, room) => sum + room.artworks.length, 0);
}
