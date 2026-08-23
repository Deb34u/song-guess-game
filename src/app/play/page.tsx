"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getRandomSong, getDailySong, type Song, type SongCategory } from "@/lib/songs";
import {
  createGameState,
  makeGuess,
  skipSong,
  advanceTier,
  TIER_SCORES,
  type GameState,
  getCurrentClipDuration,
} from "@/lib/game-engine";
import { addToLeaderboard, updateStats, setDailyCompleted, isDailyCompletedToday } from "@/lib/storage";
import AudioPlayer from "@/components/AudioPlayer";
import GuessInput from "@/components/GuessInput";
import AttemptHistory from "@/components/AttemptHistory";
import ScoreDisplay from "@/components/ScoreDisplay";
import Confetti from "@/components/Confetti";
import Link from "next/link";

function PlayGame() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") === "daily" ? "daily" : "freeplay";
  const category = (searchParams.get("category") as SongCategory) || "all";
  const gameKey = searchParams.get("gameKey");

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [revealAlbum, setRevealAlbum] = useState(false);
  const lastGameKeyRef = useRef<string | undefined>(undefined);

  // Initialize game — reinitialize when gameKey changes (Play Again / Next Song)
  useEffect(() => {
    if (lastGameKeyRef.current === gameKey && lastGameKeyRef.current !== undefined) return;
    lastGameKeyRef.current = gameKey ?? null;

    if (mode === "daily" && isDailyCompletedToday()) {
      router.push("/results");
      return;
    }

    const song: Song = mode === "daily" ? getDailySong() : getRandomSong(category === "all" ? undefined : category);
    setGameState(createGameState(song, mode, category));
    setShowAnswer(false);
    setRevealAlbum(false);
  }, [gameKey, mode, category, router]);

  const handleGuess = useCallback(
    (guessText: string) => {
      if (!gameState || gameState.completed) return;

      const newState = makeGuess(gameState, guessText);
      setGameState(newState);

      // Trigger shake on wrong guess
      if (!newState.won && newState.attempts > gameState.attempts) {
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
      }

      // Handle completion
      if (newState.completed) {
        setShowAnswer(true);
        setRevealAlbum(true);
        addToLeaderboard(newState);
        updateStats(newState);
        if (mode === "daily") {
          setDailyCompleted();
        }
      }
    },
    [gameState, mode],
  );

  const handleSkip = useCallback(() => {
    if (!gameState || gameState.completed) return;
    const newState = skipSong(gameState);
    setGameState(newState);
    setShowAnswer(true);
    setRevealAlbum(true);
    addToLeaderboard(newState);
    updateStats(newState);
  }, [gameState]);

  const handleHearMore = useCallback(() => {
    if (!gameState || gameState.completed) return;
    const newState = advanceTier(gameState);
    setGameState(newState);
  }, [gameState]);

  if (!gameState) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl animate-pulse">🎶</div>
          <p className="text-zinc-400">Loading song...</p>
        </div>
      </div>
    );
  }

  const clipDuration = getCurrentClipDuration(gameState);

  // Build a random key so Play Again actually remounts with a new song
  const playAgainUrl = category && category !== "all"
    ? `/play?mode=freeplay&category=${category}&gameKey=${Date.now()}`
    : `/play?mode=freeplay&gameKey=${Date.now()}`;

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-6 sm:px-6">
      <Confetti trigger={gameState.won} />

      {/* Header */}
      <div className="mb-6 flex w-full max-w-xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-white transition-colors"
        >
          ← Back
        </Link>
        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400">
          {mode === "daily" ? "📅 Daily" : category !== "all" ? `🎵 ${category.toUpperCase()}` : "🎲 Free Play"}
        </span>
        <Link
          href="/leaderboard"
          className="text-xs font-medium text-zinc-500 hover:text-white transition-colors"
        >
          🏆
        </Link>
      </div>

      {/* Main game area */}
      <div className={`w-full max-w-xl space-y-5 ${shaking ? "animate-shake" : ""}`}>
        <ScoreDisplay gameState={gameState} />

        {/* Album art placeholder (blurred until revealed) */}
        <div className="flex justify-center">
          <div
            className={`relative h-40 w-40 overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-800 transition-all duration-500 ${
              revealAlbum ? "animate-reveal" : "blur-xl grayscale"
            }`}
          >
            {revealAlbum ? (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/20 to-rose-500/20">
                <span className="text-5xl">🎶</span>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-700/50">
                <span className="text-4xl opacity-30">🔒</span>
              </div>
            )}
          </div>
        </div>

        {/* Song reveal */}
        {showAnswer && (
          <div className="animate-slide-up rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5 text-center">
            <p className="text-xs font-medium text-indigo-400 mb-1">
              {gameState.won ? "🎉 You got it!" : gameState.skipped ? "⏭ Skipped" : "The song was..."}
            </p>
            <p className="text-xl font-bold text-white">{gameState.song.title}</p>
            <p className="text-base text-zinc-400">{gameState.song.artist}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {gameState.song.genre} • {gameState.song.decade}
            </p>
            {gameState.won && (
              <p className="mt-2 text-2xl font-bold text-emerald-400">
                +{gameState.score} pts
              </p>
            )}
            {gameState.skipped && (
              <p className="mt-2 text-sm text-zinc-400">
                No points earned
              </p>
            )}
          </div>
        )}

        {/* Audio player */}
        {!gameState.completed && (
          <div className="animate-fade-in">
            <AudioPlayer gameState={gameState} />
          </div>
        )}

        {/* Guess input */}
        {!gameState.completed && (
          <div className="animate-slide-up">
            <GuessInput
              onGuess={handleGuess}
              disabled={gameState.completed}
              placeholder={`Guess the song or artist... (${clipDuration}s clip)`}
            />
          </div>
        )}

        {/* Hear More button */}
        {!gameState.completed && gameState.tier < 6 && (() => {
          const currentScore = TIER_SCORES[gameState.tier] ?? 10;
          const nextScore = TIER_SCORES[gameState.tier + 1] ?? 10;
          const cost = currentScore - nextScore;
          return (
            <button
              onClick={handleHearMore}
              className="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 py-3 text-sm font-medium text-amber-400 transition-all hover:bg-amber-500/20 hover:text-amber-300 active:scale-[0.98]"
            >
              🔊 Hear More (−{cost} pts)
            </button>
          );
        })()}

        {/* Skip button */}
        {!gameState.completed && (
          <button
            onClick={handleSkip}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 py-3 text-sm font-medium text-zinc-400 transition-all hover:bg-zinc-700/50 hover:text-zinc-300 active:scale-[0.98]"
          >
            ⏭ Skip This Song
          </button>
        )}

        {/* Attempt history */}
        <div className="animate-fade-in">
          <AttemptHistory
            guesses={gameState.guesses}
            completed={gameState.completed}
            won={gameState.won}
          />
        </div>

        {/* Play again / Next */}
        {gameState.completed && (
          <div className="flex gap-3 animate-slide-up">
            <Link
              href={playAgainUrl}
              className="flex-1 rounded-xl bg-indigo-600 px-6 py-3 text-center font-bold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
            >
              Next Song
            </Link>
            <Link
              href="/results"
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800/50 px-6 py-3 text-center font-bold text-zinc-300 hover:bg-zinc-700/50 transition-colors"
            >
              View Results
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-4xl animate-pulse">🎶</div>
            <p className="text-zinc-400">Loading...</p>
          </div>
        </div>
      }
    >
      <PlayGame />
    </Suspense>
  );
}
