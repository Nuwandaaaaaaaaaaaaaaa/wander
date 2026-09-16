# Wander

A scroll-driven virtual museum tour. Scrolling walks you left to right
down a real gallery hallway, room by room, the way you'd actually move
through a building; the mouse gives a subtle "look around" parallax
rather than a free camera; every painting is a real, verified,
public-domain work pulled from Wikimedia Commons, with a title, artist,
year, medium and a link back to its source record. No fabricated data.

Pick a museum from the homepage grid, or from `/map` — a stylized pin
picker, reached via the map icon — for a more spatial "choose your trip"
way in.

Built with Next.js (App Router, TypeScript), Tailwind CSS, Framer Motion,
GSAP ScrollTrigger and Lenis (in horizontal mode) for the smooth scroll,
and the Web Audio API for a synthesized (not downloaded) ambient room
tone.

## Status

The Louvre (`/tour/louvre`) is a complete, five-room tour: Egyptian
Antiquities, the Grande Galerie, the Salle des États (home to the *Mona
Lisa*), Objets d'art, and the Sully Wing.

The National Gallery, Pinacoteca di Brera, Uffizi Gallery and the Met are
scaffolded: each has one real room with real artworks so the data shape is
proven out, but `fullyBuilt` is `false` and visiting them shows a "still
being installed" screen with a link back to the Louvre. Flip a museum's
`fullyBuilt` to `true` once it has enough rooms to feel like a real visit.

## Running it

```bash
npm install
npm run dev
```

## Adding a museum, room, or artwork

The whole site is data-driven — no component code changes when you add
content. Everything lives under `src/data/museums/`, typed by
`src/types/museum.ts`.

### Add an artwork to an existing room

Open that museum's JSON file and add an object to the room's `artworks`
array:

```json
{
  "id": "unique-slug",
  "title": "The Painting's Title",
  "artist": "Artist Name",
  "year": "1503",
  "medium": "Oil on poplar panel",
  "dimensions": "77 cm × 53 cm",
  "description": "A sentence or two of real context — what it shows, why it matters.",
  "commonsFile": "Exact_Wikimedia_Commons_filename.jpg",
  "source": {
    "collection": "The holding museum's name",
    "url": "https://en.wikipedia.org/wiki/..."
  },
  "scale": 1,
  "spotlight": "standard"
}
```

Notes on the fields:

- **`commonsFile`** must be the exact filename of a real file on
  [Wikimedia Commons](https://commons.wikimedia.org) (the part after
  `File:`, e.g. `Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg`).
  `src/lib/wikimedia.ts` turns that bare filename into a working image URL
  via Commons' `Special:FilePath` redirect — no hash-bucket path needed.
- **`dimensions`** is optional — omit it if unknown.
- **`scale`** controls how wide the piece renders relative to a baseline
  of `1`. Use something like `1.4` for a large canvas, `0.6` for a small
  panel or miniature.
- **`spotlight: "featured"`** gives a piece a soft glow and slightly more
  presence when it scrolls into view — reserve it for the one or two
  works a room is really about (e.g. the *Mona Lisa* in the Salle des
  États). Everything else should be `"standard"` (or omit the field).

Always use real data. Pull it from the museum's own collection page, the
Met's Open Access API, the Art Institute of Chicago's API, the
Rijksmuseum API, or the artwork's Wikipedia article — and always fill in
`source.url` with a link back to wherever you sourced it from.

### Add a new room

Add an object to the museum's `rooms` array:

```json
{
  "id": "room-slug",
  "name": "Room Display Name",
  "wallTone": "warm",
  "artworks": []
}
```

`wallTone` picks the room's CSS lighting/color treatment and is one of
`"warm"`, `"neutral"`, `"dark"`, `"stone"` (see the palette definitions in
`src/components/RoomSection.tsx`). Rooms render in array order as the
visitor scrolls, each one flowing into the next through a soft threshold
darkening rather than a hard cut.

### Add a new museum

1. Create `src/data/museums/your-museum-id.json` matching the `Museum`
   shape in `src/types/museum.ts`:

   ```json
   {
     "id": "your-museum-id",
     "name": "Museum Display Name",
     "city": "City",
     "country": "Country",
     "tagline": "One sentence describing the collection.",
     "heroCommonsFile": "Exterior_or_hero_shot.jpg",
     "fullyBuilt": false,
     "mapPosition": { "x": 50, "y": 50 },
     "rooms": []
   }
   ```

   `mapPosition` places the museum's pin on `/map` — `x`/`y` are
   percentages of the map's width/height from its top-left corner. It's
   a stylized atlas, not a literal GPS map, so these are hand-picked for
   legibility and rough relative position (west is left, north is up),
   not plotted to exact coordinates. Omit it and the pin falls back to
   dead center.

2. Register it in `src/data/museums/index.ts`:

   ```ts
   import yourMuseum from "./your-museum-id.json";
   // ...
   export const museums: Museum[] = [
     louvre as Museum,
     // ...
     yourMuseum as Museum,
   ];
   ```

3. It now automatically appears as a card on the homepage and is reachable
   at `/tour/your-museum-id`. Leave `fullyBuilt: false` while you're still
   populating rooms — visitors get the "coming soon" treatment instead of
   a half-empty tour. Flip it to `true` once you're happy with it.

## Project structure

```
src/
  app/
    page.tsx              museum picker (homepage grid)
    map/page.tsx            museum picker (pin map)
    tour/[museum]/page.tsx  the tour route — renders TourExperience,
                             or a "coming soon" screen if !fullyBuilt
    layout.tsx             fonts + metadata
  components/
    TourExperience.tsx     orchestrates a single museum visit — owns the
                            horizontal scroll container + current-room state
    RoomSection.tsx        one gallery room: wall/floor CSS, threshold fade
    ArtworkFrame.tsx       one framed piece, scroll-linked reveal
    ParallaxWrapper.tsx    mouse "look around" effect
    Minimap.tsx            fixed room-progress bar
    MuseumMap.tsx           the /map pin picker
    AmbientAudio.tsx       synthesized room tone + mute toggle
    InfoOverlay.tsx        click-to-zoom artwork detail modal
  data/museums/            one JSON file per museum + the registry
  lib/
    gsap.ts                registers the ScrollTrigger plugin once
    useLenis.ts             horizontal smooth-scroll setup, reduced-motion aware
    scroll-context.tsx      shares the scroll container ref down to
                             RoomSection/ArtworkFrame (GSAP + Framer Motion
                             both need it explicitly since the hallway
                             scrolls inside its own container, not the page)
    wikimedia.ts            Commons filename → image URL
  types/museum.ts           the shared data shapes
```

The tour scrolls horizontally: `TourExperience` renders a fixed,
full-viewport container and hands its ref down through `ScrollerContext`
so `RoomSection`'s GSAP ScrollTriggers and `ArtworkFrame`'s Framer Motion
`useScroll` both track that container's `scrollLeft` instead of the
window. `useLenis`'s `useHorizontalLenis` remaps ordinary vertical wheel
input onto that horizontal motion, since almost nobody has a
horizontal-only mouse wheel.

## Accessibility

Every scroll/parallax effect checks `prefers-reduced-motion` and either
disables itself (`ParallaxWrapper`) or swaps to instant, unscrubbed
transitions (`useLenis`, `ArtworkFrame`). Ambient audio defaults on but is
always mutable from a persistent, clearly-labelled button in the corner.
