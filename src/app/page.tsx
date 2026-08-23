"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStats, isDailyCompletedToday } from "@/lib/storage";

export default function Home() {
  const [stats, setStats] = useState({ gamesPlayed: 0, gamesWon: 0, bestScore: 0, currentStreak: 0 });
  const [dailyPlayed, setDailyPlayed] = useState(false);

  useEffect(() => {
    setStats(getStats());
    setDailyPlayed(isDailyCompletedToday());
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mt-12 text-center animate-fade-in">
        <div className="mb-6 text-6xl">🎵</div>
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Guess That <span className="text-blue-400">Song</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400">
          How well do you know your music? Listen to progressively longer clips and guess
          the song before you run out of attempts.
        </p>
      </div>

      {/* Action buttons */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row animate-slide-up">
        <Link
          href="/play?mode=freeplay"
          className="group relative overflow-hidden rounded-xl bg-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-400 hover:shadow-blue-500/40 hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-3">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play Now
          </span>
        </Link>

        <Link
          href="/play?mode=daily"
          className={`group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-semibold transition-all active:scale-95 ${
            dailyPlayed
              ? "border border-slate-700 bg-slate-800/50 text-slate-400"
              : "border border-purple-500/50 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:scale-105"
          }`}
        >
          <span className="relative z-10 flex items-center gap-3">
            <span className="text-xl">{dailyPlayed ? "✅" : "📅"}</span>
            {dailyPlayed ? "Daily Done!" : "Daily Challenge"}
          </span>
        </Link>
      </div>

      {/* Stats */}
      {stats.gamesPlayed > 0 && (
        <div className="mt-12 w-full max-w-md animate-slide-up">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 text-center">
              <p className="text-2xl font-bold text-white">{stats.gamesPlayed}</p>
              <p className="text-xs text-slate-500 mt-1">Played</p>
            </div>
            <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 text-center">
              <p className="text-2xl font-bold text-green-400">
                {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
              </p>
              <p className="text-xs text-slate-500 mt-1">Win Rate</p>
            </div>
            <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 text-center">
              <p className="text-2xl font-bold text-yellow-400">{stats.bestScore}</p>
              <p className="text-xs text-slate-500 mt-1">Best Score</p>
            </div>
            <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 text-center">
              <p className="text-2xl font-bold text-orange-400">🔥 {stats.currentStreak}</p>
              <p className="text-xs text-slate-500 mt-1">Streak</p>
            </div>
          </div>
        </div>
      )}

      {/* How to Play */}
      <div className="mt-16 w-full max-w-2xl animate-slide-up">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">How to Play</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-800/30 border border-slate-700/30 p-6 text-center">
            <div className="mb-3 text-3xl">🎧</div>
            <h3 className="mb-2 font-semibold text-white">Listen</h3>
            <p className="text-sm text-slate-400">
              Hear a tiny 0.1 second clip of a song. Barely a blip!
            </p>
          </div>
          <div className="rounded-xl bg-slate-800/30 border border-slate-700/30 p-6 text-center">
            <div className="mb-3 text-3xl">✍️</div>
            <h3 className="mb-2 font-semibold text-white">Guess</h3>
            <p className="text-sm text-slate-400">
              Type the song name or artist. Wrong? The clip gets longer.
            </p>
          </div>
          <div className="rounded-xl bg-slate-800/30 border border-slate-700/30 p-6 text-center">
            <div className="mb-3 text-3xl">🏆</div>
            <h3 className="mb-2 font-semibold text-white">Score</h3>
            <p className="text-sm text-slate-400">
              Guess early for maximum points. 0.1s = 1000 pts!
            </p>
          </div>
        </div>

        {/* Tier breakdown */}
        <div className="mt-8 rounded-xl bg-slate-800/30 border border-slate-700/30 p-6">
          <h3 className="mb-4 text-center text-sm font-medium text-slate-400 uppercase tracking-wider">
            Score Tiers
          </h3>
          <div className="flex justify-between text-center text-xs">
            {["0.1s", "0.5s", "1s", "2s", "4s", "8s", "30s"].map((time, i) => {
              const scores = [1000, 750, 500, 250, 100, 25, 10];
              const colors = [
                "text-yellow-400",
                "text-yellow-300",
                "text-green-400",
                "text-green-300",
                "text-blue-400",
                "text-blue-300",
                "text-slate-400",
              ];
              return (
                <div key={time} className="flex flex-col items-center gap-1">
                  <span className={`font-bold ${colors[i]}`}>{scores[i]}</span>
                  <div className="h-1 w-8 rounded-full bg-slate-700">
                    <div
                      className={`h-full rounded-full ${i < 3 ? "bg-yellow-500" : i < 5 ? "bg-green-500" : "bg-blue-500"}`}
                      style={{ width: `${((7 - i) / 7) * 100}%` }}
                    />
                  </div>
                  <span className="text-slate-500">{time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboard link */}
      <Link
        href="/leaderboard"
        className="mt-12 text-sm text-slate-500 hover:text-blue-400 transition-colors"
      >
        View Leaderboard →
      </Link>
    </div>
  );
}
