"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getRandomSong, getDailySong, type Song } from "@/lib/songs";
import {
  createGameState,
  makeGuess,
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

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [revealAlbum, setRevealAlbum] = useState(false);

  // Initialize game
  useEffect(() => {
    if (mode === "daily" && isDailyCompletedToday()) {
      router.push("/results");
      return;
    }

    const song: Song = mode === "daily" ? getDailySong() : getRandomSong();
    setGameState(createGameState(song, mode));
    setShowAnswer(false);
    setRevealAlbum(false);
  }, [mode, router]);

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

  if (!gameState) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl animate-pulse">🎵</div>
          <p className="text-slate-400">Loading song...</p>
        </div>
      </div>
    );
  }

  const clipDuration = getCurrentClipDuration(gameState);

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
      <Confetti trigger={gameState.won} />

      {/* Header */}
      <div className="mb-8 flex w-full max-w-2xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Home
        </Link>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
          {mode === "daily" ? "📅 Daily Challenge" : "🎲 Free Play"}
        </span>
        <Link
          href="/leaderboard"
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          🏆
        </Link>
      </div>

      {/* Main game area */}
      <div className={`w-full max-w-2xl space-y-6 ${shaking ? "animate-shake" : ""}`}>
        <ScoreDisplay gameState={gameState} />

        {/* Album art (blurred until revealed) */}
        <div className="flex justify-center">
          <div
            className={`relative h-48 w-48 overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800 transition-all duration-500 ${
              revealAlbum ? "animate-reveal" : "blur-xl grayscale"
            }`}
          >
            {revealAlbum ? (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <span className="text-6xl">🎵</span>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-700/50">
                <span className="text-5xl opacity-30">🔒</span>
              </div>
            )}
          </div>
        </div>

        {/* Song reveal */}
        {showAnswer && (
          <div className="animate-slide-up rounded-xl border border-blue-500/30 bg-blue-500/10 p-6 text-center">
            <p className="text-sm text-blue-400 mb-1">
              {gameState.won ? "🎉 You got it!" : "The song was..."}
            </p>
            <p className="text-2xl font-bold text-white">{gameState.song.title}</p>
            <p className="text-lg text-slate-400">{gameState.song.artist}</p>
            <p className="mt-2 text-sm text-slate-500">
              {gameState.song.genre} • {gameState.song.decade}
            </p>
            {gameState.won && (
              <p className="mt-3 text-3xl font-bold text-green-400">
                +{gameState.score} pts
              </p>
            )}
            <a
              href={`https://open.spotify.com/search/${encodeURIComponent(gameState.song.title + " " + gameState.song.artist)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400 hover:bg-green-500/30 transition-colors"
            >
              🎧 Listen on Spotify
            </a>
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
              placeholder={`Guess the song or artist... (hearing ${clipDuration}s)`}
            />
          </div>
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
              href="/play?mode=freeplay"
              className="flex-1 rounded-xl bg-blue-500 px-6 py-3 text-center font-semibold text-white hover:bg-blue-400 transition-colors"
            >
              Play Again
            </Link>
            <Link
              href="/results"
              className="flex-1 rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 text-center font-semibold text-slate-300 hover:bg-slate-700/50 transition-colors"
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
            <div className="mb-4 text-4xl animate-pulse">🎵</div>
            <p className="text-slate-400">Loading...</p>
          </div>
        </div>
      }
    >
      <PlayGame />
    </Suspense>
  );
}
