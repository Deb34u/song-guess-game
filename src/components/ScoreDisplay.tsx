"use client";

import { TIER_SCORES, getCurrentClipDuration, MAX_ATTEMPTS, type GameState } from "@/lib/game-engine";

interface ScoreDisplayProps {
  gameState: GameState;
}

export default function ScoreDisplay({ gameState }: ScoreDisplayProps) {
  const potentialScore = TIER_SCORES[gameState.tier] ?? 10;
  const clipDuration = getCurrentClipDuration(gameState);
  const remaining = MAX_ATTEMPTS - gameState.attempts;

  return (
    <div className="flex items-center justify-between rounded-2xl bg-zinc-800/50 border border-zinc-700/40 px-5 py-3">
      <div className="flex items-center gap-5">
        {/* Potential score */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500">Score</p>
          <p className="text-xl font-extrabold text-white">
            {gameState.completed ? (
              gameState.won ? (
                <span className="text-emerald-400">{gameState.score}</span>
              ) : (
                <span className="text-red-400">0</span>
              )
            ) : (
              potentialScore
            )}
          </p>
        </div>

        {/* Clip duration */}
        <div className="border-l border-zinc-700/50 pl-5">
          <p className="text-[10px] uppercase tracking-widest text-zinc-500">Clip</p>
          <p className="text-xl font-extrabold text-indigo-400">
            {clipDuration}s
          </p>
        </div>
      </div>

      {/* Attempts remaining */}
      <div className="text-right">
        <p className="text-[10px] uppercase tracking-widest text-zinc-500">Guesses</p>
        <div className="flex gap-1.5 mt-1.5">
          {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
            <div
              key={i}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                i < gameState.attempts
                  ? "bg-rose-500"
                  : "bg-zinc-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
