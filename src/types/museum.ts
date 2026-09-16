export interface ArtworkSource {
  /** Human-readable name of the collection holding the real work */
  collection: string;
  /** Link to the real museum/Wikipedia record for this piece */
  url: string;
}

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  medium: string;
  dimensions?: string;
  description: string;
  /** Wikimedia Commons filename (no path) — resolved via Special:FilePath */
  commonsFile: string;
  source: ArtworkSource;
  /** Roughly how wide the piece should render relative to others in the room, 1 = baseline */
  scale?: number;
  /** "featured" pieces get spotlighting; "standard" pieces sit in ambient light */
  spotlight?: "featured" | "standard";
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  /** Wall tone driving the CSS environment for this room */
  wallTone: "warm" | "neutral" | "dark" | "stone";
  artworks: Artwork[];
}

export interface Museum {
  id: string;
  name: string;
  city: string;
  country: string;
  tagline: string;
  heroCommonsFile?: string;
  rooms: Room[];
  /** false = scaffolded only, not a fully built tour yet */
  fullyBuilt: boolean;
  /**
   * Stylized (not strictly geographic) position on the map picker, as a
   * percentage of the map's width/height from its top-left corner.
   * Loosely follows real-world relative position but is spaced out for
   * legibility rather than plotted to exact longitude/latitude.
   */
  mapPosition?: { x: number; y: number };
}
