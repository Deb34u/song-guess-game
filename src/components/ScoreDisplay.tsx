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
    <div className="flex items-center justify-between rounded-xl bg-slate-800/50 border border-slate-700/50 px-5 py-3">
      <div className="flex items-center gap-6">
        {/* Potential score */}
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">Potential Score</p>
          <p className="text-2xl font-bold text-white">
            {gameState.completed ? (
              gameState.won ? (
                <span className="text-green-400">{gameState.score}</span>
              ) : (
                <span className="text-red-400">0</span>
              )
            ) : (
              potentialScore
            )}
          </p>
        </div>

        {/* Clip duration */}
        <div className="border-l border-slate-700 pl-6">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Clip Length</p>
          <p className="text-2xl font-bold text-blue-400">
            {clipDuration}s
          </p>
        </div>
      </div>

      {/* Attempts remaining */}
      <div className="text-right">
        <p className="text-xs text-slate-500 uppercase tracking-wider">Guesses Left</p>
        <div className="flex gap-1.5 mt-1">
          {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full transition-all ${
                i < gameState.attempts
                  ? "bg-red-500"
                  : "bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
