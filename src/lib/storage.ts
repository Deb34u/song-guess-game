import { GameState } from "./game-engine";

const LEADERBOARD_KEY = "song-game-leaderboard";
const DAILY_KEY = "song-game-daily";
const STATS_KEY = "song-game-stats";

export interface LeaderboardEntry {
  songTitle: string;
  songArtist: string;
  score: number;
  attempts: number;
  won: boolean;
  mode: "freeplay" | "daily";
  date: string;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  bestScore: number;
  currentStreak: number;
  bestStreak: number;
}

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setToStorage(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

// Leaderboard
export function getLeaderboard(): LeaderboardEntry[] {
  return getFromStorage<LeaderboardEntry[]>(LEADERBOARD_KEY, []);
}

export function addToLeaderboard(state: GameState): void {
  const board = getLeaderboard();
  const entry: LeaderboardEntry = {
    songTitle: state.song.title,
    songArtist: state.song.artist,
    score: state.score,
    attempts: state.attempts,
    won: state.won,
    mode: state.mode,
    date: new Date().toISOString(),
  };
  board.push(entry);
  board.sort((a, b) => b.score - a.score);
  setToStorage(LEADERBOARD_KEY, board.slice(0, 100));
}

// Daily challenge
export function getDailyCompletedDate(): string | null {
  return getFromStorage<string | null>(DAILY_KEY, null);
}

export function setDailyCompleted(): void {
  const today = new Date().toISOString().split("T")[0];
  setToStorage(DAILY_KEY, today);
}

export function isDailyCompletedToday(): boolean {
  const completed = getDailyCompletedDate();
  const today = new Date().toISOString().split("T")[0];
  return completed === today;
}

// Stats
export function getStats(): GameStats {
  return getFromStorage<GameStats>(STATS_KEY, {
    gamesPlayed: 0,
    gamesWon: 0,
    totalScore: 0,
    bestScore: 0,
    currentStreak: 0,
    bestStreak: 0,
  });
}

export function updateStats(state: GameState): void {
  const stats = getStats();
  stats.gamesPlayed++;
  stats.totalScore += state.score;
  if (state.score > stats.bestScore) stats.bestScore = state.score;
  if (state.won) {
    stats.gamesWon++;
    stats.currentStreak++;
    if (stats.currentStreak > stats.bestStreak) {
      stats.bestStreak = stats.currentStreak;
    }
  } else {
    stats.currentStreak = 0;
  }
  setToStorage(STATS_KEY, stats);
}
