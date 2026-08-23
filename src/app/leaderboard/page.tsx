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
    <div className="flex min-h-screen flex-col items-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-white transition-colors"
          >
            ← Back
          </Link>
          <h1 className="text-lg font-extrabold text-white">🏆 Leaderboard</h1>
          <div className="w-16" />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex rounded-xl bg-zinc-800/60 border border-zinc-700/40 p-1">
          {(["all", "daily", "freeplay"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab === "all" ? "All" : tab === "daily" ? "📅 Daily" : "🎲 Free Play"}
            </button>
          ))}
        </div>

        {/* Leaderboard list */}
        {topScores.length === 0 ? (
          <div className="rounded-2xl bg-zinc-800/40 border border-zinc-700/40 p-12 text-center">
            <div className="mb-3 text-4xl">🏆</div>
            <p className="text-lg font-bold text-white">No Scores Yet</p>
            <p className="mt-2 text-sm text-zinc-400">
              Play some games to see your scores here!
            </p>
            <Link
              href="/play?mode=freeplay"
              className="mt-5 inline-flex rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-500 transition-colors"
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
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-colors ${
                    index < 3
                      ? "bg-zinc-800/70 border-zinc-700/60"
                      : "bg-zinc-800/30 border-zinc-700/30 hover:bg-zinc-800/50"
                  }`}
                >
                  {/* Rank */}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                    {medal ? (
                      <span className="text-lg">{medal}</span>
                    ) : (
                      <span className="text-xs font-medium text-zinc-600">{index + 1}</span>
                    )}
                  </div>

                  {/* Song info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{entry.songTitle}</p>
                    <p className="truncate text-xs text-zinc-500">{entry.songArtist}</p>
                  </div>

                  {/* Mode badge */}
                  <span className="shrink-0 rounded-full bg-zinc-700/50 px-2 py-0.5 text-xs text-zinc-400">
                    {entry.mode === "daily" ? "📅" : "🎲"}
                  </span>

                  {/* Result */}
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      entry.won
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {entry.won ? `${entry.attempts}T` : "✗"}
                  </span>

                  {/* Score */}
                  <div className="shrink-0 text-right">
                    <p className="text-base font-bold text-white">{entry.score}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {topScores.length > 0 && (
          <div className="mt-8 rounded-2xl bg-zinc-800/40 border border-zinc-700/40 p-5">
            <h3 className="mb-4 text-center text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Summary
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-white">{topScores.length}</p>
                <p className="text-[10px] text-zinc-500">Games</p>
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-400">
                  {topScores.filter((e) => e.won).length}
                </p>
                <p className="text-[10px] text-zinc-500">Won</p>
              </div>
              <div>
                <p className="text-xl font-bold text-amber-400">
                  {Math.max(...topScores.map((e) => e.score))}
                </p>
                <p className="text-[10px] text-zinc-500">Best</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
