"use client";

import { useRef, useState } from "react";

interface LandingScreenProps {
  onEnter: () => void;
}

export default function LandingScreen({ onEnter }: LandingScreenProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      await audioRef.current.play();
      setPlaying(true);
    }
  };

  const enterSite = async () => {
    if (audioRef.current && !playing) {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {}
    }

    onEnter();
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6">
      <audio ref={audioRef} src="/audio/hit-em-up.mp3" loop />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_70%)]" />
      </div>

      <div className="relative text-center animate-fade-up">
        <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.5em] text-zinc-500">
          Exclusive Inventory
        </p>

        <h1 className="text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl">
          DaPlugTay
        </h1>

        <p className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-zinc-400 sm:max-w-sm sm:text-base">
          Browse. Screenshot. DM to order.
        </p>

        <div className="mt-8 text-center">
  <a
    href="https://www.instagram.com/hottboii.cri/"
    target="_blank"
    rel="noopener noreferrer"
    className="block text-lg font-semibold text-white transition hover:text-zinc-300"
  >
    ♪ Hit Em Up
  </a>

  <a
    href="https://www.instagram.com/hottboii.cri/"
    target="_blank"
    rel="noopener noreferrer"
    className="mt-1 block text-sm text-zinc-500 transition hover:text-zinc-300"
  >
    by @hottboii.cri
  </a>

  <button
    type="button"
    onClick={toggleMusic}
    className="mt-5 rounded-full border border-zinc-700 px-6 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-white hover:text-black"
  >
    {playing ? "⏸ Pause Music" : "▶ Play Music"}
  </button>
</div>

        <button
          type="button"
          onClick={enterSite}
          className="group relative mt-5 block mx-auto overflow-hidden rounded-full bg-white px-12 py-4 text-sm font-bold text-black transition-all duration-300 hover:bg-zinc-100 active:scale-95 sm:px-14 sm:py-5 sm:text-base"
        >
          <span className="relative z-10">Enter</span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>

        <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-zinc-700">
          Curated · Exclusive · Direct
        </p>
      </div>
    </main>
  );
}