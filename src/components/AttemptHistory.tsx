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
        <h3 className="text-xs font-semibold text-zinc-400">Attempts</h3>
        <span className="text-[10px] text-zinc-500">
          {remaining} left
        </span>
      </div>

      <div className="space-y-1.5">
        {guesses.map((guess, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-xl bg-zinc-800/50 px-4 py-2 border border-zinc-700/40"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-700 text-[10px] font-medium text-zinc-400">
              {index + 1}
            </span>
            <span className="flex-1 truncate text-sm text-zinc-300">
              {guess.text}
            </span>
            <span className="text-rose-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: remaining }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex items-center gap-3 rounded-xl border border-dashed border-zinc-700/25 px-4 py-2"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800/50 text-[10px] text-zinc-700">
              {guesses.length + i + 1}
            </span>
            <span className="flex-1 text-sm text-zinc-700 italic">Waiting for guess...</span>
          </div>
        ))}

        {/* Final result */}
        {completed && (
          <div
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 border ${
              won
                ? "border-emerald-500/20 bg-emerald-500/10"
                : "border-rose-500/20 bg-rose-500/10"
            }`}
          >
            <span className="text-lg">{won ? "🎉" : "😔"}</span>
            <span className={`text-sm font-semibold ${won ? "text-emerald-400" : "text-rose-400"}`}>
              {won ? "Correct!" : "Out of attempts!"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
