"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A soft, looping museum-hall ambience synthesized on the fly with the
 * Web Audio API (filtered noise + a slow amplitude drift to suggest a
 * distant, echoing room) rather than a downloaded audio file — this
 * avoids bundling third-party audio of uncertain licensing while still
 * giving the tour the "distant murmur" the brief calls for.
 *
 * Autoplay policies mean the AudioContext can only start after a user
 * gesture, so we lazily create it on the first scroll/click when the
 * toggle is in its default (on) state.
 */
export function AmbientAudio() {
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (started || muted) return;

    const start = () => {
      if (ctxRef.current) return;
      const AudioContextCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioContextCtor();
      ctxRef.current = ctx;

      // Brown-noise buffer, looped, as the base "room tone".
      const bufferSize = 2 * ctx.sampleRate;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.2;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 480;

      const gain = ctx.createGain();
      gain.gain.value = muted ? 0 : 0.045;
      gainRef.current = gain;

      // A slow, barely-perceptible swell so the room doesn't feel static.
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.015;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      setStarted(true);
    };

    window.addEventListener("scroll", start, { once: true, passive: true });
    window.addEventListener("click", start, { once: true });
    return () => {
      window.removeEventListener("scroll", start);
      window.removeEventListener("click", start);
    };
  }, [started, muted]);

  useEffect(() => {
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.setTargetAtTime(
        muted ? 0 : 0.045,
        ctxRef.current.currentTime,
        0.4
      );
    }
  }, [muted]);

  return (
    <button
      onClick={() => setMuted((m) => !m)}
      aria-label={muted ? "Unmute gallery ambience" : "Mute gallery ambience"}
      className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
    >
      {muted ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 6a9 9 0 0 1 0 12" />
        </svg>
      )}
    </button>
  );
}
