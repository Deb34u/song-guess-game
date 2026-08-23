"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/storage";

type Tab = "all" | "daily" | "freeplay";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("all");

  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  const filtered = leaderboard.filter((entry) => {
    if (activeTab === "daily") return entry.mode === "daily";
    if (activeTab === "freeplay") return entry.mode === "freeplay";
    return true;
  });

  const topScores = filtered.sort((a, b) => b.score - a.score).slice(0, 20);

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
          <h1 className="text-xl font-bold text-white">🏆 Leaderboard</h1>
          <div className="w-16" />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex rounded-xl bg-slate-800/50 border border-slate-700/50 p-1">
          {(["all", "daily", "freeplay"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab === "all" ? "All" : tab === "daily" ? "📅 Daily" : "🎲 Free Play"}
            </button>
          ))}
        </div>

        {/* Leaderboard list */}
        {topScores.length === 0 ? (
          <div className="rounded-xl bg-slate-800/30 border border-slate-700/30 p-12 text-center">
            <div className="mb-4 text-4xl">🏆</div>
            <p className="text-lg font-medium text-white">No Scores Yet</p>
            <p className="mt-2 text-sm text-slate-400">
              Play some games to see your scores here!
            </p>
            <Link
              href="/play?mode=freeplay"
              className="mt-6 inline-flex rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-400 transition-colors"
            >
              Play Now
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {topScores.map((entry, index) => {
              const medal =
                index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 rounded-xl px-5 py-4 border transition-colors ${
                    index < 3
                      ? "bg-slate-800/80 border-slate-700/80"
                      : "bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60"
                  }`}
                >
                  {/* Rank */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                    {medal ? (
                      <span className="text-xl">{medal}</span>
                    ) : (
                      <span className="text-sm font-medium text-slate-500">{index + 1}</span>
                    )}
                  </div>

                  {/* Song info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-white">{entry.songTitle}</p>
                    <p className="truncate text-sm text-slate-400">{entry.songArtist}</p>
                  </div>

                  {/* Mode badge */}
                  <span className="shrink-0 rounded-full bg-slate-700/50 px-2 py-0.5 text-xs text-slate-400">
                    {entry.mode === "daily" ? "📅" : "🎲"}
                  </span>

                  {/* Result */}
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                      entry.won
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {entry.won ? `${entry.attempts}T` : "✗"}
                  </span>

                  {/* Score */}
                  <div className="shrink-0 text-right">
                    <p className="text-lg font-bold text-white">{entry.score}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick stats */}
        {topScores.length > 0 && (
          <div className="mt-8 rounded-xl bg-slate-800/30 border border-slate-700/30 p-6">
            <h3 className="mb-4 text-center text-sm font-medium text-slate-400 uppercase tracking-wider">
              Summary
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-white">{topScores.length}</p>
                <p className="text-xs text-slate-500">Games</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">
                  {topScores.filter((e) => e.won).length}
                </p>
                <p className="text-xs text-slate-500">Won</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">
                  {Math.max(...topScores.map((e) => e.score))}
                </p>
                <p className="text-xs text-slate-500">Best Score</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
