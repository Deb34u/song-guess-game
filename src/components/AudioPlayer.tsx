"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getCurrentClipDuration, type GameState } from "@/lib/game-engine";
import { fetchItunesPreview } from "@/lib/songs";

interface AudioPlayerProps {
  gameState: GameState;
}

export default function AudioPlayer({ gameState }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const clipDuration = getCurrentClipDuration(gameState);

  // Fetch the iTunes MP3 preview URL when the song changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPreviewUrl(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setTotalDuration(0);
    clearTimer();

    fetchItunesPreview(gameState.song.title, gameState.song.artist).then(
      (url) => {
        if (!cancelled) {
          setPreviewUrl(url);
          setLoading(false);
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [gameState.song.title, gameState.song.artist]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Stop playback when tier changes (user made a guess)
  useEffect(() => {
    clearTimer();
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [gameState.tier, gameState.song.id, clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const handlePlay = () => {
    if (!audioRef.current || !previewUrl) return;

    // Reset and play from the start
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
    setCurrentTime(0);

    // Auto-stop after clip duration
    timerRef.current = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentTime(clipDuration);
      }
    }, clipDuration * 1000);
  };

  const handleStop = () => {
    clearTimer();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const time = audioRef.current.currentTime;
    setCurrentTime(Math.min(time, clipDuration));
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setTotalDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    clearTimer();
    setIsPlaying(false);
  };

  const progress = totalDuration > 0 ? (currentTime / clipDuration) * 100 : 0;

  return (
    <div className="w-full">
      {/* Hidden audio element — src is the direct iTunes MP3 */}
      {previewUrl && (
        <audio
          ref={audioRef}
          src={previewUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="auto"
        />
      )}

      {/* Play / Stop button + progress bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={isPlaying ? handleStop : handlePlay}
          disabled={loading || !previewUrl}
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-lg transition-all active:scale-90 disabled:opacity-40 disabled:hover:scale-100 ${
            isPlaying
              ? "bg-rose-500 shadow-rose-500/30 hover:bg-rose-400"
              : "bg-indigo-600 shadow-indigo-600/30 hover:bg-indigo-500"
          }`}
          aria-label={isPlaying ? "Stop playback" : "Play clip"}
        >
          {loading ? (
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : isPlaying ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="ml-0.5 h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          {/* Progress bar */}
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-zinc-700/50">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-100"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
            {/* Tier markers */}
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 h-full w-px bg-zinc-600/30"
                style={{ left: `${(i / 6) * 100}%` }}
              />
            ))}
          </div>

          {/* Time labels */}
          <div className="mt-1.5 flex justify-between text-[10px] text-zinc-500">
            <span>{clipDuration}s clip</span>
            <span className="font-mono">
              {currentTime.toFixed(1)}s / {totalDuration > 0 ? `${totalDuration.toFixed(0)}s` : "..."}
            </span>
          </div>
        </div>
      </div>

      {loading && (
        <p className="mt-2 text-center text-[10px] text-zinc-500">Loading audio…</p>
      )}

      {!loading && !previewUrl && (
        <p className="mt-2 text-center text-[10px] text-red-400">
          Could not load preview — try another song
        </p>
      )}

      {/* Tier indicator */}
      <div className="mt-3 flex items-center gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < gameState.tier
                ? "bg-rose-500/60"
                : i === gameState.tier
                  ? "bg-indigo-500"
                  : "bg-zinc-700/50"
            }`}
          />
        ))}
      </div>
      <p className="mt-1 text-center text-[10px] text-zinc-500">
        Tier {gameState.tier + 1} of 7 — {clipDuration}s of audio
      </p>
    </div>
  );
}
