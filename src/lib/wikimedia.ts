/**
 * Builds a stable, self-resolving Wikimedia Commons image URL from a bare
 * filename. Special:FilePath redirects to the current canonical file on
 * Commons without us needing to know its hash-bucket path, and accepts a
 * `width` param for a server-resized JPEG/PNG — which is what we hand to
 * next/image as the remote source it then optimizes further.
 */
export function commonsFileUrl(filename: string, width?: number): string {
  const encoded = encodeURIComponent(filename).replace(/%2F/g, "/");
  const base = `https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}`;
  return width ? `${base}?width=${width}` : base;
}
