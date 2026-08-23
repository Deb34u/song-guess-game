"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getCurrentClipDuration, type GameState } from "@/lib/game-engine";

interface AudioPlayerProps {
  gameState: GameState;
}

export default function AudioPlayer({ gameState }: AudioPlayerProps) {
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clipDuration = getCurrentClipDuration(gameState);
  const trackId = gameState.song.previewUrl.match(/track\/([A-Za-z0-9]+)/)?.[1] ?? "";

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTimer();
    setElapsed(0);
  }, [gameState.tier, gameState.song.id, clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return (
    <div className="w-full space-y-3">
      {/* Spotify embed player */}
      <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50">
        <iframe
          src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify player"
        />
      </div>

      {/* Clip timer */}
      <div>
        {/* Progress bar */}
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-700/50">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-100"
            style={{ width: `${Math.min((elapsed / clipDuration) * 100, 100)}%` }}
          />
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 h-full w-px bg-slate-500/30"
              style={{ left: `${(i / 6) * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-400">
          <span>{clipDuration}s clip</span>
          <span className="font-mono">{elapsed.toFixed(1)}s / {clipDuration}s</span>
        </div>
      </div>

      {/* Tier indicator */}
      <div className="mt-4 flex items-center gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              i < gameState.tier
                ? "bg-red-500/60"
                : i === gameState.tier
                  ? "bg-blue-500"
                  : "bg-slate-700/50"
            }`}
          />
        ))}
      </div>
      <p className="mt-1 text-center text-xs text-slate-500">
        Tier {gameState.tier + 1} of 7 — hearing {clipDuration}s of audio
      </p>
    </div>
  );
}
