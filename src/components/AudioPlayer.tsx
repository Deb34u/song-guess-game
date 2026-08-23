"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getCurrentClipDuration, type GameState } from "@/lib/game-engine";

interface AudioPlayerProps {
  gameState: GameState;
  onReady?: () => void;
}

export default function AudioPlayer({ gameState, onReady }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clipDuration = getCurrentClipDuration(gameState);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopPlayback = useCallback(() => {
    clearTimer();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  }, [clearTimer]);

  useEffect(() => {
    stopPlayback();
  }, [gameState.tier, gameState.song.id, stopPlayback]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const handlePlay = () => {
    if (!audioRef.current) return;
    stopPlayback();
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);

    // Stop at clip duration
    const ms = clipDuration * 1000;
    timerRef.current = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentTime(clipDuration);
      }
    }, ms);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const time = audioRef.current.currentTime;
    setCurrentTime(Math.min(time, clipDuration));
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      onReady?.();
    }
  };

  const handleEnded = () => {
    clearTimer();
    setIsPlaying(false);
  };

  const progress = duration > 0 ? (currentTime / clipDuration) * 100 : 0;

  return (
    <div className="w-full">
      <audio
        ref={audioRef}
        src={gameState.song.previewUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="auto"
      />

      {/* Play button + waveform visual */}
      <div className="flex items-center gap-4">
        <button
          onClick={isPlaying ? stopPlayback : handlePlay}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-400 hover:scale-105 active:scale-95"
          aria-label={isPlaying ? "Stop playback" : "Play clip"}
        >
          {isPlaying ? (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="ml-1 h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          {/* Progress bar */}
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-700/50">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            {/* Tier markers */}
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 h-full w-px bg-slate-500/30"
                style={{ left: `${(i / 6) * 100}%` }}
              />
            ))}
          </div>

          {/* Time labels */}
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>{clipDuration}s clip</span>
            <span className="font-mono">
              {currentTime.toFixed(1)}s / {duration > 0 ? `${duration.toFixed(0)}s` : "..."}
            </span>
          </div>
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
