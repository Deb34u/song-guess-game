"use client";

import { type Guess, MAX_ATTEMPTS } from "@/lib/game-engine";

interface AttemptHistoryProps {
  guesses: Guess[];
  completed: boolean;
  won: boolean;
}

export default function AttemptHistory({ guesses, completed, won }: AttemptHistoryProps) {
  const remaining = MAX_ATTEMPTS - guesses.length;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-400">Attempts</h3>
        <span className="text-sm text-slate-500">
          {remaining} left
        </span>
      </div>

      <div className="space-y-1.5">
        {guesses.map((guess, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-lg bg-slate-800/50 px-4 py-2.5 border border-slate-700/50"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-medium text-slate-400">
              {index + 1}
            </span>
            <span className="flex-1 truncate text-sm text-slate-300">
              {guess.text}
            </span>
            <span className="text-red-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: remaining }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex items-center gap-3 rounded-lg border border-dashed border-slate-700/30 px-4 py-2.5"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800/50 text-xs text-slate-600">
              {guesses.length + i + 1}
            </span>
            <span className="flex-1 text-sm text-slate-700 italic">Waiting for guess...</span>
          </div>
        ))}

        {/* Final result */}
        {completed && (
          <div
            className={`flex items-center gap-3 rounded-lg px-4 py-3 border ${
              won
                ? "border-green-500/30 bg-green-500/10"
                : "border-red-500/30 bg-red-500/10"
            }`}
          >
            <span className="text-xl">{won ? "🎉" : "😔"}</span>
            <span className={`text-sm font-medium ${won ? "text-green-400" : "text-red-400"}`}>
              {won ? "Correct!" : "Out of attempts!"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
