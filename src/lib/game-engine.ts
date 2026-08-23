import { Song, SongCategory, normalizeString } from "./songs";

export const AUDIO_TIERS = [0.1, 0.5, 1.0, 2.0, 4.0, 8.0, 30.0] as const;
export const TIER_SCORES = [1000, 750, 500, 250, 100, 25, 10] as const;
export const MAX_ATTEMPTS = 6;
export const SKIP_PENALTY = 200; // points lost when skipping

export interface Guess {
  text: string;
  timestamp: number;
}

export interface GameState {
  song: Song;
  tier: number;
  attempts: number;
  guesses: Guess[];
  score: number;
  completed: boolean;
  won: boolean;
  skipped: boolean;
  mode: "freeplay" | "daily";
  category: SongCategory;
}

export function createGameState(song: Song, mode: "freeplay" | "daily" = "freeplay", category: SongCategory = "all"): GameState {
  return {
    song,
    tier: 0,
    attempts: 0,
    guesses: [],
    score: 0,
    completed: false,
    won: false,
    skipped: false,
    mode,
    category,
  };
}

export function makeGuess(state: GameState, guessText: string): GameState {
  if (state.completed) return state;

  const normalizedGuess = normalizeString(guessText);
  const normalizedTitle = normalizeString(state.song.title);
  const normalizedArtist = normalizeString(state.song.artist);

  const correct =
    normalizedGuess === normalizedTitle || normalizedGuess === normalizedArtist || normalizedTitle.includes(normalizedGuess) || normalizedGuess.includes(normalizedTitle);

  const newGuess: Guess = {
    text: guessText,
    timestamp: Date.now(),
  };

  const newAttempts = state.attempts + 1;

  if (correct) {
    return {
      ...state,
      attempts: newAttempts,
      guesses: [...state.guesses, newGuess],
      score: TIER_SCORES[state.tier] ?? 10,
      completed: true,
      won: true,
    };
  }

  const newTier = state.tier + 1;
  const completed = newTier >= AUDIO_TIERS.length || newAttempts >= MAX_ATTEMPTS;

  return {
    ...state,
    tier: newTier,
    attempts: newAttempts,
    guesses: [...state.guesses, newGuess],
    score: completed ? 0 : 0,
    completed,
    won: false,
  };
}

export function skipSong(state: GameState): GameState {
  return {
    ...state,
    completed: true,
    won: false,
    skipped: true,
    score: Math.max(0, (TIER_SCORES[state.tier] ?? 10) - SKIP_PENALTY),
  };
}

/**
 * Advance to the next clip tier (hear more of the song) without using a guess attempt.
 * Deducts a smaller penalty than skipping or guessing wrong.
 */
export function advanceTier(state: GameState): GameState {
  if (state.completed) return state;

  const newTier = state.tier + 1;
  const tierCompleted = newTier >= AUDIO_TIERS.length;

  if (tierCompleted) {
    // Already at max tier — can't advance further
    return state;
  }

  return {
    ...state,
    tier: newTier,
  };
}

export function getCurrentClipDuration(state: GameState): number {
  return AUDIO_TIERS[state.tier] ?? 30;
}

export function getScoreForTier(tier: number): number {
  return TIER_SCORES[tier] ?? 10;
}
