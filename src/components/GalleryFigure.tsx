/**
 * A flat, softly-lit silhouette suggesting another visitor in the room —
 * decorative only (no data, no interaction). Kept simple and dim so it
 * reads as ambient presence, the way a gallery painting renders people
 * as quiet shapes rather than the subject.
 */
type Pose = "standing" | "looking-close" | "cane" | "seated";

export function GalleryFigure({
  pose,
  tone = "#0c0a08",
  className = "",
}: {
  pose: Pose;
  tone?: string;
  className?: string;
}) {
  if (pose === "seated") {
    return (
      <svg viewBox="0 0 60 90" className={className} fill="none">
        <ellipse cx="20" cy="16" rx="7" ry="7.5" fill={tone} />
        <path
          d="M11 22 Q9 40 12 56 L14 56 Q13 42 16 26 Q22 21 28 26 Q30 40 29 56 L31 56 Q33 40 30 22 Q20 15 11 22Z"
          fill={tone}
        />
        <path d="M12 56 L11 66 L16 66 L17 57Z" fill={tone} />
        <path d="M27 56 L26 66 L31 66 L30 57Z" fill={tone} />
      </svg>
    );
  }

  if (pose === "cane") {
    return (
      <svg viewBox="0 0 40 100" className={className} fill="none">
        <ellipse cx="20" cy="10" rx="6.5" ry="7" fill={tone} />
        <path
          d="M13 17 Q10 30 14 45 Q11 60 9 78 L13 78 Q16 60 19 46 Q22 60 24 78 L28 78 Q26 58 23 44 Q27 30 24 17 Q19 12 13 17Z"
          fill={tone}
        />
        <path d="M9 78 L7 92 L12 92 L13 79Z" fill={tone} />
        <path d="M24 78 L23 79 L26 92 L31 92Z" fill={tone} />
        <line x1="10" y1="48" x2="6" y2="90" stroke={tone} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (pose === "looking-close") {
    return (
      <svg viewBox="0 0 40 100" className={className} fill="none">
        <ellipse cx="17" cy="9" rx="6.5" ry="7" transform="rotate(-8 17 9)" fill={tone} />
        <path
          d="M11 16 Q8 30 12 46 Q9 62 8 80 L12 80 Q14 62 17 47 Q21 62 23 80 L27 80 Q25 61 22 45 Q26 30 22 16 Q17 11 11 16Z"
          fill={tone}
        />
        <path d="M8 80 L6 92 L11 92 L12 81Z" fill={tone} />
        <path d="M22 80 L21 81 L23 92 L28 92Z" fill={tone} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 40 100" className={className} fill="none">
      <ellipse cx="20" cy="9" rx="6.5" ry="7" fill={tone} />
      <path
        d="M13 16 Q10 30 14 46 Q11 62 10 80 L14 80 Q16 62 19 47 Q21 62 23 80 L27 80 Q26 61 23 45 Q27 30 24 16 Q19 12 13 16Z"
        fill={tone}
      />
      <path d="M10 80 L8 92 L13 92 L14 81Z" fill={tone} />
      <path d="M23 80 L22 81 L24 92 L29 92Z" fill={tone} />
    </svg>
  );
}
