"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStats, isDailyCompletedToday } from "@/lib/storage";
import type { SongCategory } from "@/lib/songs";

interface GameMode {
  id: SongCategory;
  label: string;
  emoji: string;
  color: string;
  bg: string;
}

const GAME_MODES: GameMode[] = [
  { id: "all", label: "All Songs", emoji: "🎶", color: "text-white", bg: "bg-indigo-600 hover:bg-indigo-500" },
  { id: "hiphop", label: "Hip-Hop", emoji: "🎤", color: "text-white", bg: "bg-orange-600 hover:bg-orange-500" },
  { id: "pop", label: "Pop", emoji: "🎵", color: "text-white", bg: "bg-pink-600 hover:bg-pink-500" },
  { id: "rock", label: "Rock", emoji: "🎸", color: "text-white", bg: "bg-red-600 hover:bg-red-500" },
  { id: "90s", label: "90s Only", emoji: "📼", color: "text-white", bg: "bg-emerald-600 hover:bg-emerald-500" },
  { id: "2000s", label: "2000s Only", emoji: "💿", color: "text-white", bg: "bg-cyan-600 hover:bg-cyan-500" },
  { id: "hindi", label: "Hindi / Bollywood", emoji: "🎬", color: "text-white", bg: "bg-amber-600 hover:bg-amber-500" },
  { id: "country", label: "Country", emoji: "🤠", color: "text-white", bg: "bg-yellow-700 hover:bg-yellow-600" },
  { id: "rnb", label: "R&B", emoji: "💜", color: "text-white", bg: "bg-purple-600 hover:bg-purple-500" },
  { id: "latin", label: "Latin", emoji: "💃", color: "text-white", bg: "bg-rose-600 hover:bg-rose-500" },
  { id: "kpop", label: "K-Pop", emoji: "🇰🇷", color: "text-white", bg: "bg-sky-600 hover:bg-sky-500" },
  { id: "classics", label: "Classics", emoji: "📻", color: "text-white", bg: "bg-stone-600 hover:bg-stone-500" },
];

export default function Home() {
  const [stats, setStats] = useState({ gamesPlayed: 0, gamesWon: 0, bestScore: 0, currentStreak: 0 });
  const [dailyPlayed, setDailyPlayed] = useState(false);

  useEffect(() => {
    setStats(getStats());
    setDailyPlayed(isDailyCompletedToday());
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-10 sm:px-6">
      {/* Hero */}
      <div className="mt-8 text-center animate-fade-in">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">
            Guess That Song
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-zinc-400">
          Listen to short clips and guess the track. The shorter the clip you guess from, the more points you earn.
        </p>
      </div>

      {/* Play Now + Daily */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row animate-slide-up">
        <Link
          href="/play?mode=freeplay"
          className="group relative overflow-hidden rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:shadow-indigo-500/40 hover:scale-[1.03] active:scale-95"
        >
          <span className="flex items-center gap-3">
            ▶ Play Now
          </span>
        </Link>
        <Link
          href="/play?mode=daily"
          className={`group relative overflow-hidden rounded-2xl px-8 py-4 text-lg font-bold transition-all active:scale-95 ${
            dailyPlayed
              ? "bg-zinc-800 text-zinc-500"
              : "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 hover:scale-[1.03] border border-amber-500/30"
          }`}
        >
          <span className="flex items-center gap-3">
            {dailyPlayed ? "✅ Done Today" : "📅 Daily Challenge"}
          </span>
        </Link>
      </div>

      {/* Game Modes */}
      <div className="mt-12 w-full max-w-xl animate-slide-up">
        <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-widest text-zinc-500">
          Pick a Mode
        </h2>
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {GAME_MODES.map((mode) => (
            <Link
              key={mode.id}
              href={`/play?mode=freeplay&category=${mode.id}`}
              className={`flex flex-col items-center gap-1.5 rounded-xl px-3 py-4 font-semibold text-sm text-white transition-all hover:scale-[1.04] active:scale-95 shadow-md ${mode.bg}`}
            >
              <span className="text-2xl">{mode.emoji}</span>
              <span>{mode.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      {stats.gamesPlayed > 0 && (
        <div className="mt-12 w-full max-w-md animate-slide-up">
          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-xl bg-zinc-800/60 p-3 text-center">
              <p className="text-xl font-bold text-white">{stats.gamesPlayed}</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Played</p>
            </div>
            <div className="rounded-xl bg-zinc-800/60 p-3 text-center">
              <p className="text-xl font-bold text-emerald-400">
                {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
              </p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Win Rate</p>
            </div>
            <div className="rounded-xl bg-zinc-800/60 p-3 text-center">
              <p className="text-xl font-bold text-amber-400">{stats.bestScore}</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Best</p>
            </div>
            <div className="rounded-xl bg-zinc-800/60 p-3 text-center">
              <p className="text-xl font-bold text-orange-400">🔥{stats.currentStreak}</p>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Streak</p>
            </div>
          </div>
        </div>
      )}

      {/* How to Play */}
      <div className="mt-14 w-full max-w-xl animate-slide-up">
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-zinc-500">How It Works</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-zinc-800/40 border border-zinc-700/40 p-5 text-center">
            <div className="mb-2 text-2xl">🎧</div>
            <h3 className="font-bold text-white text-sm">Listen</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Hear a tiny 0.1s clip. Barely a blip!
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-800/40 border border-zinc-700/40 p-5 text-center">
            <div className="mb-2 text-2xl">✍️</div>
            <h3 className="font-bold text-white text-sm">Guess</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Type song or artist name. Wrong guess? Clip gets longer.
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-800/40 border border-zinc-700/40 p-5 text-center">
            <div className="mb-2 text-2xl">🏆</div>
            <h3 className="font-bold text-white text-sm">Score</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Guess early for max points. 0.1s = 1000 pts!
            </p>
          </div>
        </div>

        {/* Tier breakdown */}
        <div className="mt-6 rounded-2xl bg-zinc-800/40 border border-zinc-700/40 p-5">
          <h3 className="mb-3 text-center text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            Score Tiers
          </h3>
          <div className="flex justify-between text-center text-xs">
            {["0.1s", "0.5s", "1s", "2s", "4s", "8s", "30s"].map((time, i) => {
              const scores = [1000, 750, 500, 250, 100, 25, 10];
              const colors = [
                "text-amber-400", "text-amber-300", "text-emerald-400",
                "text-emerald-300", "text-sky-400", "text-sky-300", "text-zinc-500",
              ];
              return (
                <div key={time} className="flex flex-col items-center gap-1">
                  <span className={`font-bold ${colors[i]}`}>{scores[i]}</span>
                  <div className="h-1 w-8 rounded-full bg-zinc-700">
                    <div
                      className={`h-full rounded-full ${i < 3 ? "bg-amber-500" : i < 5 ? "bg-emerald-500" : "bg-sky-500"}`}
                      style={{ width: `${((7 - i) / 7) * 100}%` }}
                    />
                  </div>
                  <span className="text-zinc-600">{time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboard link */}
      <Link
        href="/leaderboard"
        className="mt-10 text-xs text-zinc-600 hover:text-indigo-400 transition-colors"
      >
        View Leaderboard →
      </Link>
    </div>
  );
}
