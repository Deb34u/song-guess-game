"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLeaderboard, getStats, type LeaderboardEntry, type GameStats } from "@/lib/storage";
import Confetti from "@/components/Confetti";

export default function ResultsPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [lastGame, setLastGame] = useState<LeaderboardEntry | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const board = getLeaderboard();
    setLeaderboard(board);
    setStats(getStats());
    if (board.length > 0) {
      setLastGame(board[board.length - 1]);
    }
  }, []);

  const handleShare = () => {
    if (!lastGame) return;

    const resultEmoji = lastGame.won
      ? "🟩".repeat(lastGame.attempts) + "⬜".repeat(6 - lastGame.attempts)
      : "🟥".repeat(lastGame.attempts);

    const text = `🎵 Guess That Song\n${resultEmoji}\nScore: ${lastGame.score}\n${lastGame.won ? `Guessed in ${lastGame.attempts} attempt${lastGame.attempts > 1 ? "s" : ""}!` : "Didn't get it 😔"}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-12 sm:px-6 lg:px-8">
      <Confetti trigger={lastGame?.won ?? false} />

      <div className="w-full max-w-lg space-y-8">
        {/* Last game result */}
        {lastGame ? (
          <div className="animate-fade-in text-center">
            <div className="mb-4 text-5xl">
              {lastGame.won ? "🎉" : "😔"}
            </div>
            <h1 className="text-3xl font-bold text-white">
              {lastGame.won ? "Nice One!" : "Better Luck Next Time!"}
            </h1>

            {/* Score */}
            <div className="mt-6 inline-flex flex-col items-center rounded-2xl bg-slate-800/50 border border-slate-700/50 p-8">
              <p className="text-sm text-slate-500 uppercase tracking-wider">Your Score</p>
              <p className={`text-5xl font-bold ${lastGame.won ? "text-green-400" : "text-slate-400"}`}>
                {lastGame.score}
              </p>
              {lastGame.won && (
                <p className="mt-1 text-sm text-slate-400">
                  {lastGame.attempts} attempt{lastGame.attempts > 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Song details */}
            <div className="mt-6 rounded-xl bg-slate-800/30 border border-slate-700/30 p-6">
              <p className="text-sm text-slate-500 mb-1">The song was</p>
              <p className="text-xl font-bold text-white">{lastGame.songTitle}</p>
              <p className="text-slate-400">{lastGame.songArtist}</p>
              <a
                href={`https://open.spotify.com/search/${encodeURIComponent(lastGame.songTitle + " " + lastGame.songArtist)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-400 hover:bg-green-500/30 transition-colors"
              >
                🎧 Listen on Spotify
              </a>
            </div>

            {/* Share */}
            <button
              onClick={handleShare}
              className="mt-6 rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700/50 transition-colors"
            >
              {copied ? "✅ Copied!" : "📋 Copy Result"}
            </button>
          </div>
        ) : (
          <div className="animate-fade-in text-center">
            <div className="mb-4 text-5xl">🎵</div>
            <h1 className="text-3xl font-bold text-white">No Games Yet</h1>
            <p className="mt-4 text-slate-400">Play a game to see your results here!</p>
          </div>
        )}

        {/* Quick stats */}
        {stats && stats.gamesPlayed > 0 && (
          <div className="animate-slide-up rounded-xl bg-slate-800/30 border border-slate-700/30 p-6">
            <h3 className="mb-4 text-center text-sm font-medium text-slate-400 uppercase tracking-wider">
              Your Stats
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{stats.gamesPlayed}</p>
                <p className="text-xs text-slate-500">Played</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {Math.round((stats.gamesWon / stats.gamesPlayed) * 100)}%
                </p>
                <p className="text-xs text-slate-500">Win Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">{stats.bestScore}</p>
                <p className="text-xs text-slate-500">Best</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-400">🔥 {stats.bestStreak}</p>
                <p className="text-xs text-slate-500">Best Streak</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent games */}
        {leaderboard.length > 0 && (
          <div className="animate-slide-up rounded-xl bg-slate-800/30 border border-slate-700/30 p-6">
            <h3 className="mb-4 text-center text-sm font-medium text-slate-400 uppercase tracking-wider">
              Recent Games
            </h3>
            <div className="space-y-2">
              {leaderboard
                .slice(-5)
                .reverse()
                .map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-slate-800/50 px-4 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{entry.songTitle}</p>
                      <p className="truncate text-xs text-slate-500">{entry.songArtist}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          entry.won
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {entry.won ? `${entry.attempts} tries` : "missed"}
                      </span>
                      <span className="text-sm font-bold text-white">{entry.score}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 animate-slide-up">
          <Link
            href="/play?mode=freeplay"
            className="flex-1 rounded-xl bg-blue-500 px-6 py-3 text-center font-semibold text-white hover:bg-blue-400 transition-colors"
          >
            Play Again
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 text-center font-semibold text-slate-300 hover:bg-slate-700/50 transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
