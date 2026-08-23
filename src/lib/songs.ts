import Fuse from "fuse.js";

export type SongCategory =
  | "all"
  | "english"
  | "hiphop"
  | "pop"
  | "rock"
  | "90s"
  | "2000s"
  | "20s"
  | "hindi"
  | "country"
  | "rnb"
  | "latin"
  | "kpop"
  | "classics";

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  decade: string;
  categories: SongCategory[];
  albumArt: string;
  previewUrl: string;
}

// ── iTunes preview cache (localStorage) ──────────────────────────
const PREVIEW_CACHE_KEY = "song-guess-itunes-preview-cache";

function getPreviewCache(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PREVIEW_CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function setPreviewCache(cache: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PREVIEW_CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* quota exceeded – ignore */
  }
}

/**
 * Fetch a 30-second MP3 preview URL from the iTunes Search API.
 * Results are cached in localStorage so subsequent plays are instant.
 * Returns null if no match is found.
 */
export async function fetchItunesPreview(
  title: string,
  artist: string,
): Promise<string | null> {
  const cacheKey = `${title}::${artist}`.toLowerCase();
  const cache = getPreviewCache();
  if (cache[cacheKey]) return cache[cacheKey];

  try {
    const term = encodeURIComponent(`${title} ${artist}`);
    const res = await fetch(
      `https://itunes.apple.com/search?term=${term}&limit=1&media=music`,
    );
    const data = await res.json();
    const result = data.results?.[0];
    if (result?.previewUrl) {
      cache[cacheKey] = result.previewUrl;
      setPreviewCache(cache);
      return result.previewUrl;
    }
  } catch {
    /* network error – ignore */
  }
  return null;
}

function spotifyPreview(id: string): string {
  return `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
}

function albumArt(id: string): string {
  return `https://i.scdn.co/image/ab67616d0000b273${id}`;
}

// Helper to auto-tag categories from genre + decade
function autoCategories(genre: string, decade: string, extra: SongCategory[] = []): SongCategory[] {
  const cats: SongCategory[] = ["all", "english", ...extra];
  const g = genre.toLowerCase();
  if (g.includes("hip") || g.includes("rap")) cats.push("hiphop");
  if (g.includes("pop")) cats.push("pop");
  if (g.includes("rock") || g.includes("alternative") || g.includes("metal")) cats.push("rock");
  if (g.includes("r&b") || g.includes("rnb") || g.includes("soul")) cats.push("rnb");
  if (g.includes("country")) cats.push("country");
  if (g.includes("latin")) cats.push("latin");
  if (g.includes("k-pop") || g.includes("kpop")) cats.push("kpop");
  if (decade === "90s") cats.push("90s");
  if (decade === "00s") cats.push("2000s");
  if (decade === "60s" || decade === "70s") cats.push("classics");
  return [...new Set(cats)];
}

export const songs: Song[] = [
  // ===== 1980s =====
  { id: "s1", title: "Billie Jean", artist: "Michael Jackson", genre: "Pop", decade: "80s", categories: autoCategories("Pop", "80s", ["classics"]), albumArt: "2e70a41b5a2c733e1f26a2a3e16a9e3f2a07e8b0", previewUrl: spotifyPreview("5ChkMS8OtdzJeqYbK6b9ct") },
  { id: "s2", title: "Take On Me", artist: "a-ha", genre: "Pop", decade: "80s", categories: autoCategories("Pop", "80s"), albumArt: "7c1e5f6a3b2d4e8f9a0c1d2e3f4a5b6c7d8e9f0a", previewUrl: spotifyPreview("2WfaOiMkCvy7F5fcp2zZ8L") },
  { id: "s3", title: "Sweet Child O' Mine", artist: "Guns N' Roses", genre: "Rock", decade: "80s", categories: autoCategories("Rock", "80s"), albumArt: "01f5cd858d5bb06f731e3c4a1b4a1e2f3a4b5c6d", previewUrl: spotifyPreview("7o2CTHg8Jy9MvqZ8FQVrBY") },
  { id: "s4", title: "Don't Stop Believin'", artist: "Journey", genre: "Rock", decade: "80s", categories: autoCategories("Rock", "80s", ["classics"]), albumArt: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b", previewUrl: spotifyPreview("4bEkozVaHnBmALfa2MPAwl") },
  { id: "s5", title: "Every Breath You Take", artist: "The Police", genre: "Rock", decade: "80s", categories: autoCategories("Rock", "80s"), albumArt: "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c", previewUrl: spotifyPreview("1Jg2xXBkRGboqJDSau6Vag") },
  { id: "s6", title: "Never Gonna Give You Up", artist: "Rick Astley", genre: "Pop", decade: "80s", categories: autoCategories("Pop", "80s"), albumArt: "3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d", previewUrl: spotifyPreview("4c3lZ9EyI6s8MWjVzBHHHp") },
  { id: "s7", title: "Livin' on a Prayer", artist: "Bon Jovi", genre: "Rock", decade: "80s", categories: autoCategories("Rock", "80s"), albumArt: "4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e", previewUrl: spotifyPreview("38zRfkSWAODwVbST1B3HT0") },
  { id: "s8", title: "Girls Just Want to Have Fun", artist: "Cyndi Lauper", genre: "Pop", decade: "80s", categories: autoCategories("Pop", "80s"), albumArt: "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f", previewUrl: spotifyPreview("5DdBLM0PT3dS6MwN0LTQ0S") },
  { id: "s9", title: "Jump", artist: "Van Halen", genre: "Rock", decade: "80s", categories: autoCategories("Rock", "80s"), albumArt: "6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a", previewUrl: spotifyPreview("6Fz8J14Gbni5pFPNIF1j6h") },
  { id: "s10", title: "Stand By Me", artist: "Ben E. King", genre: "R&B", decade: "60s", categories: autoCategories("R&B", "60s"), albumArt: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b", previewUrl: spotifyPreview("3fusbH6pKxOOFOiK1FF7sB") },

  // ===== 1990s =====
  { id: "s11", title: "Smells Like Teen Spirit", artist: "Nirvana", genre: "Rock", decade: "90s", categories: autoCategories("Rock", "90s"), albumArt: "8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c", previewUrl: spotifyPreview("2guirTSMqnVBI37zN055bi") },
  { id: "s12", title: "Wonderwall", artist: "Oasis", genre: "Rock", decade: "90s", categories: autoCategories("Rock", "90s"), albumArt: "9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d", previewUrl: spotifyPreview("7j2jwOBZT29X5U0e0M4mSa") },
  { id: "s13", title: "No Scrubs", artist: "TLC", genre: "R&B", decade: "90s", categories: autoCategories("R&B", "90s"), albumArt: "0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e", previewUrl: spotifyPreview("1GhPHrqg7zE3KHZ7eXWm4z") },
  { id: "s14", title: "Waterfalls", artist: "TLC", genre: "R&B", decade: "90s", categories: autoCategories("R&B", "90s"), albumArt: "1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f", previewUrl: spotifyPreview("3uZazrM6GxahcR8XBsMqzB") },
  { id: "s15", title: "Killing Me Softly", artist: "Fugees", genre: "Hip-Hop", decade: "90s", categories: autoCategories("Hip-Hop", "90s", ["rnb"]), albumArt: "2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a", previewUrl: spotifyPreview("2BZPZVz7GqF0gKPnNySb2P") },
  { id: "s16", title: "Losing My Religion", artist: "R.E.M.", genre: "Alternative", decade: "90s", categories: autoCategories("Rock", "90s"), albumArt: "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b", previewUrl: spotifyPreview("4T3Mfo0IIskU5d7lf5B0h7") },
  { id: "s17", title: "Creep", artist: "Radiohead", genre: "Alternative", decade: "90s", categories: autoCategories("Rock", "90s"), albumArt: "4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c", previewUrl: spotifyPreview("2RJ9b2jHZRkAZ27LoF2H3c") },
  { id: "s18", title: "Under the Bridge", artist: "Red Hot Chili Peppers", genre: "Rock", decade: "90s", categories: autoCategories("Rock", "90s"), albumArt: "5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d", previewUrl: spotifyPreview("1o85Mi33xSNKIh5uUtpB3v") },
  { id: "s19", title: "I Will Always Love You", artist: "Whitney Houston", genre: "Pop", decade: "90s", categories: autoCategories("Pop", "90s", ["classics"]), albumArt: "6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e", previewUrl: spotifyPreview("4wTWnSnd2bVIUbFgq6iFGt") },
  { id: "s21", title: "Black Hole Sun", artist: "Soundgarden", genre: "Rock", decade: "90s", categories: autoCategories("Rock", "90s"), albumArt: "8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a", previewUrl: spotifyPreview("08hY9eZfJfW67bJQrVdQ0Y") },
  { id: "s23", title: "Bitter Sweet Symphony", artist: "The Verve", genre: "Alternative", decade: "90s", categories: autoCategories("Rock", "90s"), albumArt: "0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c", previewUrl: spotifyPreview("6x4aaKH7eKkY25wKm4zG8h") },
  { id: "s24", title: "MMMBop", artist: "Hanson", genre: "Pop", decade: "90s", categories: autoCategories("Pop", "90s"), albumArt: "1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d", previewUrl: spotifyPreview("2CXsIMEE3Km7u3n8c2dRjP") },
  { id: "s25", title: "Smooth", artist: "Santana ft. Rob Thomas", genre: "Rock", decade: "90s", categories: autoCategories("Rock", "90s", ["latin"]), albumArt: "2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e", previewUrl: spotifyPreview("08yKROBjgjCzKQIa2BdM0F") },
  // 90s hip-hop additions
  { id: "s90_1", title: "Juicy", artist: "Notorious B.I.G.", genre: "Hip-Hop", decade: "90s", categories: autoCategories("Hip-Hop", "90s"), albumArt: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0", previewUrl: spotifyPreview("5MSXOyvZnHkldzC7dNNKzY") },
  { id: "s90_2", title: "California Love", artist: "2Pac ft. Dr. Dre", genre: "Hip-Hop", decade: "90s", categories: autoCategories("Hip-Hop", "90s"), albumArt: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1", previewUrl: spotifyPreview("1dNIEtz7IE37Brr0EH5Kms") },
  { id: "s90_3", title: "C.R.E.A.M.", artist: "Wu-Tang Clan", genre: "Hip-Hop", decade: "90s", categories: autoCategories("Hip-Hop", "90s"), albumArt: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2", previewUrl: spotifyPreview("7dKqBydvNTF7HBz2zF0e6N") },
  { id: "s90_4", title: "Gettin' Jiggy Wit It", artist: "Will Smith", genre: "Hip-Hop", decade: "90s", categories: autoCategories("Hip-Hop", "90s"), albumArt: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3", previewUrl: spotifyPreview("1djzVcuVmc2D0g3aQf6aDT") },
  { id: "s90_5", title: "Return of the Mack", artist: "Mark Morrison", genre: "R&B", decade: "90s", categories: autoCategories("R&B", "90s"), albumArt: "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4", previewUrl: spotifyPreview("1tWfN0Uj0VnJvDI0GjOJ0q") },
  { id: "s90_6", title: "I'll Be Missing You", artist: "Puff Daddy ft. Faith Evans", genre: "Hip-Hop", decade: "90s", categories: autoCategories("Hip-Hop", "90s", ["rnb"]), albumArt: "f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5", previewUrl: spotifyPreview("3FPbOvqM9e6gYf0p5c2XBr") },
  { id: "s90_7", title: "Mo Money Mo Problems", artist: "Notorious B.I.G.", genre: "Hip-Hop", decade: "90s", categories: autoCategories("Hip-Hop", "90s"), albumArt: "a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6", previewUrl: spotifyPreview("6nC4zL4gEEgOBXi9FJehAp") },
  { id: "s90_8", title: "Tennessee", artist: "Arrested Development", genre: "Hip-Hop", decade: "90s", categories: autoCategories("Hip-Hop", "90s"), albumArt: "b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7", previewUrl: spotifyPreview("0iLhL1eqVjqXpZ3gX3MuKE") },
  { id: "s90_9", title: "Gangsta's Paradise", artist: "Coolio ft. L.V.", genre: "Hip-Hop", decade: "90s", categories: autoCategories("Hip-Hop", "90s"), albumArt: "c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8", previewUrl: spotifyPreview("1dfeR4HaWDbWqFHLkxsg1d") },

  // ===== 2000s =====
  { id: "s26", title: "Hey Ya!", artist: "OutKast", genre: "Hip-Hop", decade: "00s", categories: autoCategories("Hip-Hop", "00s", ["2000s"]), albumArt: "3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f", previewUrl: spotifyPreview("2pANdq4vdJ5wqFaS1zfzmP") },
  { id: "s27", title: "Mr. Brightside", artist: "The Killers", genre: "Alternative", decade: "00s", categories: autoCategories("Rock", "00s", ["2000s"]), albumArt: "4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a", previewUrl: spotifyPreview("003vvx7Nk0V4ogrxJJGBbi") },
  { id: "s28", title: "Crazy in Love", artist: "Beyoncé ft. Jay-Z", genre: "Pop", decade: "00s", categories: autoCategories("Pop", "00s", ["2000s", "rnb"]), albumArt: "5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b", previewUrl: spotifyPreview("0Tx0v6EdS1BRLdF2b8K1SP") },
  { id: "s29", title: "Lose Yourself", artist: "Eminem", genre: "Hip-Hop", decade: "00s", categories: autoCategories("Hip-Hop", "00s", ["2000s"]), albumArt: "6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c", previewUrl: spotifyPreview("1xPmRvJDq7B8T6e1d7Wf5f") },
  { id: "s30", title: "In Da Club", artist: "50 Cent", genre: "Hip-Hop", decade: "00s", categories: autoCategories("Hip-Hop", "00s", ["2000s"]), albumArt: "7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d", previewUrl: spotifyPreview("6H9m4MAfiEIDbMo2PZJx0A") },
  { id: "s31", title: "Seven Nation Army", artist: "The White Stripes", genre: "Rock", decade: "00s", categories: autoCategories("Rock", "00s", ["2000s"]), albumArt: "8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e", previewUrl: spotifyPreview("0Puny27gW73fZfb3vrGPlC") },
  { id: "s32", title: "Toxic", artist: "Britney Spears", genre: "Pop", decade: "00s", categories: autoCategories("Pop", "00s", ["2000s"]), albumArt: "9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f", previewUrl: spotifyPreview("6naxdtIo43H5iLM87s3xMc") },
  { id: "s33", title: "Boulevard of Broken Dreams", artist: "Green Day", genre: "Rock", decade: "00s", categories: autoCategories("Rock", "00s", ["2000s"]), albumArt: "0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a", previewUrl: spotifyPreview("1w5KfoOjKMPqv55RVAG7dz") },
  { id: "s35", title: "Stan", artist: "Eminem ft. Dido", genre: "Hip-Hop", decade: "00s", categories: autoCategories("Hip-Hop", "00s", ["2000s"]), albumArt: "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c", previewUrl: spotifyPreview("03Pyp1Wb7R9GN2fe2UwNkx") },
  { id: "s37", title: "Numb", artist: "Linkin Park", genre: "Rock", decade: "00s", categories: autoCategories("Rock", "00s", ["2000s"]), albumArt: "4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e", previewUrl: spotifyPreview("3N2x0MRqEHMA7F31ROaS7z") },
  { id: "s38", title: "Drop It Like It's Hot", artist: "Snoop Dogg ft. Pharrell", genre: "Hip-Hop", decade: "00s", categories: autoCategories("Hip-Hop", "00s", ["2000s"]), albumArt: "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f", previewUrl: spotifyPreview("5Z9iGlOPZU5U3gcfan2Z2i") },
  { id: "s39", title: "Sugar, We're Goin Down", artist: "Fall Out Boy", genre: "Rock", decade: "00s", categories: autoCategories("Rock", "00s", ["2000s"]), albumArt: "6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a", previewUrl: spotifyPreview("5FhBGadT950BPlC0JlNCWB") },
  { id: "s40", title: "Crazy", artist: "Gnarls Barkley", genre: "Pop", decade: "00s", categories: autoCategories("Pop", "00s", ["2000s", "rnb"]), albumArt: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b", previewUrl: spotifyPreview("75k1GTq2DPvG6OBFnhjNlA") },
  { id: "s41", title: "Hips Don't Lie", artist: "Shakira ft. Wyclef Jean", genre: "Pop", decade: "00s", categories: autoCategories("Pop", "00s", ["2000s", "latin"]), albumArt: "8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c", previewUrl: spotifyPreview("6PQFkLm4FNsE6FpPBdI5L2") },
  { id: "s42", title: "Since U Been Gone", artist: "Kelly Clarkson", genre: "Pop", decade: "00s", categories: autoCategories("Pop", "00s", ["2000s"]), albumArt: "9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d", previewUrl: spotifyPreview("2yKxngZGK0kYaMBqEOjOYv") },
  { id: "s44", title: "Chop Suey!", artist: "System of a Down", genre: "Rock", decade: "00s", categories: autoCategories("Rock", "00s", ["2000s"]), albumArt: "1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f", previewUrl: spotifyPreview("2S8sFnAHMfbzuZFqTmR4sR") },
  { id: "s45", title: "Yellow", artist: "Coldplay", genre: "Rock", decade: "00s", categories: autoCategories("Rock", "00s", ["2000s"]), albumArt: "2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a", previewUrl: spotifyPreview("3AJwUDP919HHQ2LtI0E5kz") },
  { id: "s46", title: "The Real Slim Shady", artist: "Eminem", genre: "Hip-Hop", decade: "00s", categories: autoCategories("Hip-Hop", "00s", ["2000s"]), albumArt: "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b", previewUrl: spotifyPreview("3N0EPPH2i8E7qNQjHajt8H") },
  { id: "s47", title: "Feel Good Inc.", artist: "Gorillaz", genre: "Alternative", decade: "00s", categories: autoCategories("Rock", "00s", ["2000s"]), albumArt: "4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c", previewUrl: spotifyPreview("0d28khmj6a4S9vJgqzfmP8") },
  { id: "s48", title: "All Star", artist: "Smash Mouth", genre: "Pop", decade: "00s", categories: autoCategories("Pop", "00s", ["2000s"]), albumArt: "5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d", previewUrl: spotifyPreview("0Fn9C4TtJMcEPMX1bQbIAj") },
  // 2000s extras
  { id: "s00_1", title: "Yeah!", artist: "Usher ft. Lil Jon & Ludacris", genre: "Hip-Hop", decade: "00s", categories: autoCategories("Hip-Hop", "00s", ["2000s", "rnb"]), albumArt: "a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9", previewUrl: spotifyPreview("5rb5BwX1S0e1jLmhPMUfMp") },
  { id: "s00_2", title: "Get Low", artist: "Lil Jon & The East Side Boyz", genre: "Hip-Hop", decade: "00s", categories: autoCategories("Hip-Hop", "00s", ["2000s"]), albumArt: "b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0", previewUrl: spotifyPreview("0b0RlH5xWHd3T6B34RtH0A") },
  { id: "s00_3", title: "Ignition (Remix)", artist: "R. Kelly", genre: "R&B", decade: "00s", categories: autoCategories("R&B", "00s", ["2000s"]), albumArt: "c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1", previewUrl: spotifyPreview("2C3oBrzHMThxWs6U3ZLLOx") },
  { id: "s00_4", title: "Gold Digger", artist: "Kanye West ft. Jamie Foxx", genre: "Hip-Hop", decade: "00s", categories: autoCategories("Hip-Hop", "00s", ["2000s"]), albumArt: "d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2", previewUrl: spotifyPreview("1PS1LgXuYJwtRNt0lFEoBl") },
  { id: "s00_5", title: "Stronger", artist: "Kanye West", genre: "Hip-Hop", decade: "00s", categories: autoCategories("Hip-Hop", "00s", ["2000s"]), albumArt: "e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3", previewUrl: spotifyPreview("63V0wQIZvfiSkFIDBrFXCG") },
  { id: "s00_6", title: "Love The Way You Lie", artist: "Eminem ft. Rihanna", genre: "Hip-Hop", decade: "00s", categories: autoCategories("Hip-Hop", "00s", ["2000s"]), albumArt: "f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "s00_7", title: "Low", artist: "Flo Rida ft. T-Pain", genre: "Hip-Hop", decade: "00s", categories: autoCategories("Hip-Hop", "00s", ["2000s"]), albumArt: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b", previewUrl: spotifyPreview("5Z9bcI94Y8g3fB59hIY95A") },
  { id: "s00_8", title: "Apologize", artist: "Timbaland ft. OneRepublic", genre: "Pop", decade: "00s", categories: autoCategories("Pop", "00s", ["2000s"]), albumArt: "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f", previewUrl: spotifyPreview("1Uff91EOsvd99rt9sYc46r") },
  { id: "s00_9", title: "Crank That", artist: "Soulja Boy", genre: "Hip-Hop", decade: "00s", categories: autoCategories("Hip-Hop", "00s", ["2000s"]), albumArt: "6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a", previewUrl: spotifyPreview("00sAOw8UUNfb5JP6aF6PgA") },
  { id: "s00_10", title: "Wrecking Ball", artist: "Miley Cyrus", genre: "Pop", decade: "10s", categories: autoCategories("Pop", "10s"), albumArt: "a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7", previewUrl: spotifyPreview("2hxalVVwZ3Z72qCkikmJqC") },
  { id: "s00_11", title: "I Gotta Feeling", artist: "The Black Eyed Peas", genre: "Pop", decade: "00s", categories: autoCategories("Pop", "00s", ["2000s"]), albumArt: "b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8", previewUrl: spotifyPreview("4v8Uw6Cp3mAU2TjKn0UfMT") },
  { id: "s00_12", title: "Empire State of Mind", artist: "Jay-Z ft. Alicia Keys", genre: "Hip-Hop", decade: "00s", categories: autoCategories("Hip-Hop", "00s", ["2000s", "rnb"]), albumArt: "c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9", previewUrl: spotifyPreview("4sv8MwbsrJXV5JBmXBHnXO") },

  // ===== 2010s =====
  { id: "s51", title: "Party Rock Anthem", artist: "LMFAO", genre: "Pop", decade: "10s", categories: autoCategories("Pop", "10s"), albumArt: "8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a", previewUrl: spotifyPreview("2hlE48rz8f0WkzL9ClbE6x") },
  { id: "s52", title: "Rolling in the Deep", artist: "Adele", genre: "Pop", decade: "10s", categories: autoCategories("Pop", "10s"), albumArt: "9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b", previewUrl: spotifyPreview("1Cv11Pbe0aN2WMkpxPQz0z") },
  { id: "s53", title: "Thrift Shop", artist: "Macklemore & Ryan Lewis", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s"), albumArt: "0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c", previewUrl: spotifyPreview("62wqa8u4A08PBlbL3o0AQ8") },
  { id: "s54", title: "Old Town Road", artist: "Lil Nas X", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s", ["country"]), albumArt: "1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d", previewUrl: spotifyPreview("0f3QxAGg4l1cEqHDBM0tHu") },
  { id: "s55", title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", genre: "Pop", decade: "10s", categories: autoCategories("Pop", "10s", ["rnb"]), albumArt: "2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e", previewUrl: spotifyPreview("32OlwWuMpZ6b0aN2RZOeMS") },
  { id: "s57", title: "Shake It Off", artist: "Taylor Swift", genre: "Pop", decade: "10s", categories: autoCategories("Pop", "10s"), albumArt: "4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a", previewUrl: spotifyPreview("4qsCYjQkENeFKpHLH7F4AS") },
  { id: "s58", title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", genre: "Pop", decade: "10s", categories: autoCategories("Pop", "10s", ["latin"]), albumArt: "5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b", previewUrl: spotifyPreview("6habFhsOp2NvshLv26DqMb") },
  { id: "s65", title: "Happy", artist: "Pharrell Williams", genre: "Pop", decade: "10s", categories: autoCategories("Pop", "10s"), albumArt: "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c", previewUrl: spotifyPreview("60nZcImufyA1DDUcZPVILL") },
  { id: "s66", title: "Radioactive", artist: "Imagine Dragons", genre: "Rock", decade: "10s", categories: autoCategories("Rock", "10s"), albumArt: "3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d", previewUrl: spotifyPreview("69QHa40eBngr6gkMbPNOwO") },
  { id: "s68", title: "Stressed Out", artist: "Twenty One Pilots", genre: "Alternative", decade: "10s", categories: autoCategories("Rock", "10s"), albumArt: "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f", previewUrl: spotifyPreview("2zE6LyEiDmhP2U0ZwE6mNc") },
  { id: "s69", title: "Closer", artist: "The Chainsmokers ft. Halsey", genre: "Pop", decade: "10s", categories: autoCategories("Pop", "10s"), albumArt: "6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a", previewUrl: spotifyPreview("7BKLCY1gZRV0TDhNPD5yzc") },
  { id: "s71", title: "Hotline Bling", artist: "Drake", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s", ["rnb"]), albumArt: "8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c", previewUrl: spotifyPreview("0b2ejnZqOh14f1w6s4RdWh") },
  { id: "s73", title: "Sorry", artist: "Justin Bieber", genre: "Pop", decade: "10s", categories: autoCategories("Pop", "10s"), albumArt: "0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e", previewUrl: spotifyPreview("09CtPGUJPdIfjr8MiLMO8X") },
  { id: "s74", title: "Rockstar", artist: "Post Malone ft. 21 Savage", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s"), albumArt: "1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f", previewUrl: spotifyPreview("0lHMdveWRWfWEYAw1VbBcO") },
  { id: "s75", title: "Dance Monkey", artist: "Tones and I", genre: "Pop", decade: "10s", categories: autoCategories("Pop", "10s"), albumArt: "2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a", previewUrl: spotifyPreview("2XU0oxnq2qxCp2AAVJgChE") },
  { id: "s97", title: "Replay", artist: "Iyaz", genre: "Pop", decade: "10s", categories: autoCategories("Pop", "10s"), albumArt: "4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e", previewUrl: spotifyPreview("4I93b9x1tBJFE6dIPePi8F") },
  { id: "s98", title: "Apologize", artist: "Timbaland ft. OneRepublic", genre: "Pop", decade: "10s", categories: autoCategories("Pop", "10s"), albumArt: "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f", previewUrl: spotifyPreview("1Uff91EOsvd99rt9sYc46r") },
  { id: "s101", title: "DJ Got Us Fallin' in Love", artist: "Usher ft. Pitbull", genre: "Pop", decade: "10s", categories: autoCategories("Pop", "10s"), albumArt: "8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c", previewUrl: spotifyPreview("1MpXq7Pab5Hgzs1v6eBc6C") },
  { id: "s102", title: "TiK ToK", artist: "Ke$ha", genre: "Pop", decade: "10s", categories: autoCategories("Pop", "10s"), albumArt: "9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d", previewUrl: spotifyPreview("2HDY1YBWr1FBOHR2kGzuc3") },
  // 2010s extras
  { id: "s10_1", title: "Havana", artist: "Camila Cabello", genre: "Pop", decade: "10s", categories: autoCategories("Pop", "10s", ["latin"]), albumArt: "a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9", previewUrl: spotifyPreview("1rfofaqEpACxVEHIZBJe6W") },
  { id: "s10_2", title: "Bodak Yellow", artist: "Cardi B", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s"), albumArt: "b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0", previewUrl: spotifyPreview("6XHVuM4v03MBCBWsPsfkhc") },
  { id: "s10_3", title: "Mask Off", artist: "Future", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s"), albumArt: "c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1", previewUrl: spotifyPreview("1SAR4LrP3qMzsKcE4Imn9O") },
  { id: "s10_4", title: "God's Plan", artist: "Drake", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s"), albumArt: "d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2", previewUrl: spotifyPreview("0wwM2zJwQRpCzCunyMR2OT") },
  { id: "s10_5", title: "Lucid Dreams", artist: "Juice WRLD", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s"), albumArt: "e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3", previewUrl: spotifyPreview("285pBmqGUoB67t6JjbfZen") },
  { id: "s10_6", title: "That's What I Like", artist: "Bruno Mars", genre: "Pop", decade: "10s", categories: autoCategories("Pop", "10s", ["rnb"]), albumArt: "f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4", previewUrl: spotifyPreview("0kYUrLQn3RjXyFS9UfjCOr") },
  { id: "s10_7", title: "Redbone", artist: "Childish Gambino", genre: "R&B", decade: "10s", categories: autoCategories("R&B", "10s"), albumArt: "a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5", previewUrl: spotifyPreview("0wobJMWm0AhTdQkvzBmOQD") },
  { id: "s10_8", title: "Taste", artist: "Tyga ft. Offset", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s"), albumArt: "b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6", previewUrl: spotifyPreview("11dFghVXANMlKmJXsNCbNl") },
  { id: "s10_9", title: "Unforgettable", artist: "French Montana ft. Swae Lee", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s", ["rnb"]), albumArt: "c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7", previewUrl: spotifyPreview("274oLXQZMFqKWaa8tx3xJS") },
  { id: "s10_10", title: "Love Yourself", artist: "Justin Bieber", genre: "Pop", decade: "10s", categories: autoCategories("Pop", "10s"), albumArt: "d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8", previewUrl: spotifyPreview("15Hhmn1v2bzfpDDniJoCn2") },

  // ===== 2020s =====
  { id: "s76", title: "Blinding Lights", artist: "The Weeknd", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s"), albumArt: "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b", previewUrl: spotifyPreview("0VjIjW4GlUZAMYd2vXMi3b") },
  { id: "s77", title: "Shape of You", artist: "Ed Sheeran", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s"), albumArt: "4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c", previewUrl: spotifyPreview("7qiZfU4dY1lWllzX7mPBI3") },
  { id: "s78", title: "Bad Guy", artist: "Billie Eilish", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s"), albumArt: "5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d", previewUrl: spotifyPreview("2Fxmhks0bxGSBdJ92vM42m") },
  { id: "s79", title: "As It Was", artist: "Harry Styles", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s"), albumArt: "6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e", previewUrl: spotifyPreview("0HE8rvNU0LOe6MCpb0HvFr") },
  { id: "s80", title: "Anti-Hero", artist: "Taylor Swift", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s"), albumArt: "7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f", previewUrl: spotifyPreview("0V3wPSX9ygBnCm8psDIegu") },
  { id: "s81", title: "Flowers", artist: "Miley Cyrus", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s"), albumArt: "8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a", previewUrl: spotifyPreview("0yLdNVWF3Srea0uzk55zFo") },
  { id: "s82", title: "Levitating", artist: "Dua Lipa", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s"), albumArt: "9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b", previewUrl: spotifyPreview("39LLxExYz6ewLAo9BKLRW8") },
  { id: "s83", title: "Stay", artist: "The Kid LAROI & Justin Bieber", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s"), albumArt: "0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c", previewUrl: spotifyPreview("5PjdY0CKGZdEuoNab3yDmX") },
  { id: "s85", title: "drivers license", artist: "Olivia Rodrigo", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s"), albumArt: "2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e", previewUrl: spotifyPreview("5wJ1HnToE6T2fgAI1WUgTz") },
  { id: "s87", title: "Watermelon Sugar", artist: "Harry Styles", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s"), albumArt: "4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a", previewUrl: spotifyPreview("6UelLqGlWMcVn1aC5nZanM") },
  { id: "s103", title: "Dynamite", artist: "BTS", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s", ["kpop"]), albumArt: "0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e", previewUrl: spotifyPreview("0pqnkoJy4QUhY8F5Nq1dpE") },
  { id: "s104", title: "Bad Habits", artist: "Ed Sheeran", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s"), albumArt: "1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f", previewUrl: spotifyPreview("4GfE1J7U0qcHBT4bRQRGVY") },
  { id: "s106", title: "About Damn Time", artist: "Lizzo", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s", ["rnb"]), albumArt: "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },
  { id: "s108", title: "Unholy", artist: "Sam Smith & Kim Petras", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s"), albumArt: "5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d", previewUrl: spotifyPreview("28dtBwGkRmAPmP4dCoBPHy") },
  { id: "s111", title: "Cruel Summer", artist: "Taylor Swift", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s"), albumArt: "8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a", previewUrl: spotifyPreview("0mHYEoSd8eZ9F2V1c8u0fF") },
  { id: "s112", title: "Kill Bill", artist: "SZA", genre: "R&B", decade: "20s", categories: autoCategories("R&B", "20s"), albumArt: "9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },
  // 2020s extras
  { id: "s20_1", title: "Espresso", artist: "Sabrina Carpenter", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s"), albumArt: "a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9", previewUrl: spotifyPreview("2qSkIjg1o9h3YT9RAgYN75") },
  { id: "s20_2", title: "Paint The Town Red", artist: "Doja Cat", genre: "Hip-Hop", decade: "20s", categories: autoCategories("Hip-Hop", "20s"), albumArt: "b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },
  { id: "s20_3", title: "Lovin On Me", artist: "Jack Harlow", genre: "Hip-Hop", decade: "20s", categories: autoCategories("Hip-Hop", "20s"), albumArt: "c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },
  { id: "s20_4", title: "Flowers", artist: "Miley Cyrus", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s"), albumArt: "d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2", previewUrl: spotifyPreview("0yLdNVWF3Srea0uzk55zFo") },
  { id: "s20_5", title: "Vampire", artist: "Olivia Rodrigo", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s"), albumArt: "e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },
  { id: "s20_6", title: "Boy's a Liar Pt. 2", artist: "PinkPantheress & Ice Spice", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s", ["hiphop"]), albumArt: "f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },
  { id: "s20_7", title: "All My Life", artist: "Lil Durk ft. J. Cole", genre: "Hip-Hop", decade: "20s", categories: autoCategories("Hip-Hop", "20s"), albumArt: "a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },
  { id: "s20_8", title: "Snooze", artist: "SZA", genre: "R&B", decade: "20s", categories: autoCategories("R&B", "20s"), albumArt: "b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },
  { id: "s20_9", title: "TFU", artist: "Latto", genre: "Hip-Hop", decade: "20s", categories: autoCategories("Hip-Hop", "20s"), albumArt: "c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },
  { id: "s20_10", title: "Cruel Summer", artist: "Taylor Swift", genre: "Pop", decade: "20s", categories: autoCategories("Pop", "20s"), albumArt: "d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8", previewUrl: spotifyPreview("0mHYEoSd8eZ9F2V1c8u0fF") },

  // ===== COUNTRY =====
  { id: "c1", title: "Jolene", artist: "Dolly Parton", genre: "Country", decade: "70s", categories: autoCategories("Country", "70s", ["classics"]), albumArt: "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c", previewUrl: spotifyPreview("3HaDpPCBpP0fbHl04F2h6P") },
  { id: "c2", title: "Take Me Home, Country Roads", artist: "John Denver", genre: "Country", decade: "70s", categories: autoCategories("Country", "70s", ["classics"]), albumArt: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0", previewUrl: spotifyPreview("1DjQz2YZdIZRIMmz8RJNoN") },
  { id: "c3", title: "Ring of Fire", artist: "Johnny Cash", genre: "Country", decade: "60s", categories: autoCategories("Country", "60s", ["classics"]), albumArt: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1", previewUrl: spotifyPreview("2nLtzopw4rPReszdYBJU6h") },
  { id: "c4", title: "Wagon Wheel", artist: "Darius Rucker", genre: "Country", decade: "10s", categories: autoCategories("Country", "10s"), albumArt: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2", previewUrl: spotifyPreview("0Vj39LtjYJfb3Pi2s7e4h0") },
  { id: "c5", title: "Cruise", artist: "Florida Georgia Line", genre: "Country", decade: "10s", categories: autoCategories("Country", "10s"), albumArt: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3", previewUrl: spotifyPreview("4cOdK2w8Ji5BK1e35VvV3D") },
  { id: "c6", title: "Meant to Be", artist: "Bebe Rexha ft. Florida Georgia Line", genre: "Country", decade: "10s", categories: autoCategories("Country", "10s", ["pop"]), albumArt: "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4", previewUrl: spotifyPreview("1XLyIjKWHsWip6TK2VvSCz") },
  { id: "c7", title: "Body Like a Back Road", artist: "Sam Hunt", genre: "Country", decade: "10s", categories: autoCategories("Country", "10s"), albumArt: "f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5", previewUrl: spotifyPreview("0nLQrPfoMwGjMXo9gjgJ3R") },
  { id: "c8", title: "Need You Now", artist: "Lady A", genre: "Country", decade: "10s", categories: autoCategories("Country", "10s"), albumArt: "a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6", previewUrl: spotifyPreview("1d7MWOVH0rHR17boUcnIn4") },
  { id: "c9", title: "Before He Cheats", artist: "Carrie Underwood", genre: "Country", decade: "00s", categories: autoCategories("Country", "00s", ["2000s"]), albumArt: "b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7", previewUrl: spotifyPreview("1J1qyk2dwSnHBuBNh59JxT") },
  { id: "c10", title: "Bottle Blonde", artist: "Lainey Wilson", genre: "Country", decade: "20s", categories: autoCategories("Country", "20s"), albumArt: "c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },
  { id: "c11", title: "Fast Car", artist: "Luke Combs", genre: "Country", decade: "20s", categories: autoCategories("Country", "20s"), albumArt: "d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },
  { id: "c12", title: "Something in the Orange", artist: "Zach Bryan", genre: "Country", decade: "20s", categories: autoCategories("Country", "20s"), albumArt: "e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },
  { id: "c13", title: "You Proof", artist: "Morgan Wallen", genre: "Country", decade: "20s", categories: autoCategories("Country", "20s"), albumArt: "f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },
  { id: "c14", title: "Last Night", artist: "Morgan Wallen", genre: "Country", decade: "20s", categories: autoCategories("Country", "20s"), albumArt: "a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },
  { id: "c15", title: "A Bar Song (Tipsy)", artist: "Shaboozey", genre: "Country", decade: "20s", categories: autoCategories("Country", "20s"), albumArt: "b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },
  { id: "c16", title: "Tequila", artist: "Dan + Shay", genre: "Country", decade: "10s", categories: autoCategories("Country", "10s"), albumArt: "c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },

  // ===== HINDI / BOLLYWOOD =====
  { id: "h1", title: "Chaiyya Chaiyya", artist: "Sukhwinder Singh & Sapna Awasthi", genre: "Hindi", decade: "90s", categories: ["all", "hindi", "90s", "rock"], albumArt: "a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h2", title: "Kal Ho Naa Ho", artist: "Sonu Nigam", genre: "Hindi", decade: "00s", categories: ["all", "hindi", "2000s"], albumArt: "b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h3", title: "Tum Hi Ho", artist: "Arijit Singh", genre: "Hindi", decade: "10s", categories: ["all", "hindi"], albumArt: "c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h4", title: "Senorita", artist: "Shankar-Ehsaan-Loy ft. Farhan Akhtar", genre: "Hindi", decade: "00s", categories: ["all", "hindi", "2000s"], albumArt: "d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h5", title: "Malhari", artist: "Vishal Dadlani", genre: "Hindi", decade: "10s", categories: ["all", "hindi"], albumArt: "e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h6", title: "Nagada Sang Dhol", artist: "Shreya Ghoshal", genre: "Hindi", decade: "10s", categories: ["all", "hindi"], albumArt: "f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h7", title: "Chammak Challo", artist: "Akon & Hamsika Iyer", genre: "Hindi", decade: "10s", categories: ["all", "hindi"], albumArt: "a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h8", title: "Apna Time Aayega", artist: "Ranveer Singh", genre: "Hindi", decade: "20s", categories: ["all", "hindi", "20s"], albumArt: "b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h9", title: "Kala Chashma", artist: "Badshah & Neha Bhasin", genre: "Hindi", decade: "10s", categories: ["all", "hindi"], albumArt: "c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h10", title: "Lungi Dance", artist: "Honey Singh & Neha Kakkar", genre: "Hindi", decade: "10s", categories: ["all", "hindi"], albumArt: "d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h11", title: "Man Dole Mera Tan Dole", artist: "Lata Mangeshkar & Mohammed Rafi", genre: "Hindi", decade: "60s", categories: ["all", "hindi", "classics"], albumArt: "e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h12", title: "Gallan Goodiyaan", artist: "Farhan Akhtar, Shankar Mahadevan", genre: "Hindi", decade: "10s", categories: ["all", "hindi"], albumArt: "f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h13", title: "Tera Ban Jaunga", artist: "Tulsi Kumar & Kabir Singh", genre: "Hindi", decade: "20s", categories: ["all", "hindi", "20s"], albumArt: "a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h14", title: "Bekhayali", artist: "Sachet Tandon", genre: "Hindi", decade: "20s", categories: ["all", "hindi", "20s"], albumArt: "b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h15", title: "Burj Khalifa", artist: "Neha Kakkar & Mika Singh", genre: "Hindi", decade: "20s", categories: ["all", "hindi", "20s"], albumArt: "c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h16", title: "Sharabi", artist: "Tanishk Bagchi & Neha Bhasin", genre: "Hindi", decade: "10s", categories: ["all", "hindi"], albumArt: "d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h17", title: "Jai Ho", artist: "A.R. Rahman", genre: "Hindi", decade: "00s", categories: ["all", "hindi", "2000s"], albumArt: "e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h18", title: "Kun Faya Kun", artist: "A.R. Rahman, Mohit Chauhan", genre: "Hindi", decade: "10s", categories: ["all", "hindi"], albumArt: "f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h19", title: "Tujh Mein Rab Dikhta Hai", artist: "Roop Kumar Rathod", genre: "Hindi", decade: "00s", categories: ["all", "hindi", "2000s"], albumArt: "a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h20", title: "Chura Ke Dil Mera", artist: "Kumar Sanu & Alka Yagnik", genre: "Hindi", decade: "90s", categories: ["all", "hindi", "90s"], albumArt: "b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h21", title: "Aankh Marey", artist: "Mika Singh & Neha Kakkar", genre: "Hindi", decade: "20s", categories: ["all", "hindi", "20s"], albumArt: "c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h22", title: "Simmba Simmba", artist: "Mika Singh", genre: "Hindi", decade: "20s", categories: ["all", "hindi", "20s"], albumArt: "d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h23", title: "Deva Deva", artist: "Arijit Singh & Jonita Gandhi", genre: "Hindi", decade: "20s", categories: ["all", "hindi", "20s"], albumArt: "e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h24", title: "Param Sundari", artist: "Shreya Ghoshal", genre: "Hindi", decade: "20s", categories: ["all", "hindi", "20s"], albumArt: "f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h25", title: "Saiyaara", artist: "Tanishk Bagchi & Arijit Singh", genre: "Hindi", decade: "20s", categories: ["all", "hindi", "20s"], albumArt: "a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h26", title: "Zingaat", artist: "Ajay-Atul", genre: "Hindi", decade: "20s", categories: ["all", "hindi", "20s"], albumArt: "b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h27", title: "Raataan Lambiyan", artist: "Jubin Nautiyal & Asees Kaur", genre: "Hindi", decade: "20s", categories: ["all", "hindi", "20s"], albumArt: "c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "h28", title: "Lut Gaye", artist: "Jubin Nautiyal", genre: "Hindi", decade: "20s", categories: ["all", "hindi", "20s"], albumArt: "d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },

  // ===== LATIN =====
  { id: "l1", title: "Gasolina", artist: "Daddy Yankee", genre: "Latin", decade: "00s", categories: ["all", "latin", "2000s"], albumArt: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "l2", title: "Bailando", artist: "Enrique Iglesias ft. Descemer Bueno", genre: "Latin", decade: "10s", categories: ["all", "latin"], albumArt: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "l3", title: "Dákiti", artist: "Bad Bunny & Jhay Cortez", genre: "Latin", decade: "20s", categories: ["all", "latin", "20s"], albumArt: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "l4", title: "Mi Gente", artist: "J Balvin & Willy William", genre: "Latin", decade: "10s", categories: ["all", "latin"], albumArt: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "l5", title: "Tití Me Preguntó", artist: "Bad Bunny", genre: "Latin", decade: "20s", categories: ["all", "latin", "20s"], albumArt: "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "l6", title: "Reggaetón Lento", artist: "CNCO", genre: "Latin", decade: "10s", categories: ["all", "latin"], albumArt: "f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },

  // ===== K-POP =====
  { id: "k1", title: "Boy With Luv", artist: "BTS ft. Halsey", genre: "K-Pop", decade: "10s", categories: ["all", "kpop"], albumArt: "a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "k2", title: "How You Like That", artist: "BLACKPINK", genre: "K-Pop", decade: "20s", categories: ["all", "kpop", "20s"], albumArt: "b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "k3", title: "Butter", artist: "BTS", genre: "K-Pop", decade: "20s", categories: ["all", "kpop", "20s", "pop"], albumArt: "c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "k4", title: "Gangnam Style", artist: "PSY", genre: "K-Pop", decade: "10s", categories: ["all", "kpop"], albumArt: "d0e1f2a3b4c5d6e7f8a9c0d1e2f3a4b5c6d7e8f9", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "k5", title: "Dynamite", artist: "BTS", genre: "K-Pop", decade: "20s", categories: ["all", "kpop", "20s", "pop"], albumArt: "e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0", previewUrl: spotifyPreview("0pqnkoJy4QUhY8F5Nq1dpE") },
  { id: "k6", title: "Pink Venom", artist: "BLACKPINK", genre: "K-Pop", decade: "20s", categories: ["all", "kpop", "20s"], albumArt: "f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },

  // ===== 90s Country =====
  { id: "cr1", title: "Friends in Low Places", artist: "Garth Brooks", genre: "Country", decade: "90s", categories: autoCategories("Country", "90s"), albumArt: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0", previewUrl: spotifyPreview("1dMIEvsYFxVnRnVqDFBJqH") },
  { id: "cr2", title: "Achy Breaky Heart", artist: "Billy Ray Cyrus", genre: "Country", decade: "90s", categories: autoCategories("Country", "90s"), albumArt: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "cr3", title: "Man! I Feel Like a Woman!", artist: "Shania Twain", genre: "Country", decade: "90s", categories: autoCategories("Country", "90s", ["pop"]), albumArt: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "cr4", title: "Wanted Dead or Alive", artist: "Bon Jovi", genre: "Country", decade: "80s", categories: autoCategories("Country", "80s", ["rock"]), albumArt: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "cr5", title: "The Gambler", artist: "Kenny Rogers", genre: "Country", decade: "80s", categories: autoCategories("Country", "80s", ["classics"]), albumArt: "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "cr6", title: "Dirt Road Anthem", artist: "Jason Aldean", genre: "Country", decade: "10s", categories: autoCategories("Country", "10s", ["hiphop"]), albumArt: "f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "cr7", title: "Tequila Makes Her Clothes Fall Off", artist: "Joe Nichols", genre: "Country", decade: "00s", categories: autoCategories("Country", "00s", ["2000s"]), albumArt: "a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "cr8", title: "1999", artist: "Charley Crockett", genre: "Country", decade: "20s", categories: autoCategories("Country", "20s"), albumArt: "b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },

  // ===== CLASSICS (60s-70s) =====
  { id: "cl1", title: "Bohemian Rhapsody", artist: "Queen", genre: "Rock", decade: "70s", categories: autoCategories("Rock", "70s", ["classics"]), albumArt: "6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c", previewUrl: spotifyPreview("7tFiyTwD0nx5a1eklYtX2J") },
  { id: "cl2", title: "Hotel California", artist: "Eagles", genre: "Rock", decade: "70s", categories: autoCategories("Rock", "70s", ["classics"]), albumArt: "7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d", previewUrl: spotifyPreview("2TSlDMDk8S0Bfgi6M5WcpI") },
  { id: "cl3", title: "Stairway to Heaven", artist: "Led Zeppelin", genre: "Rock", decade: "70s", categories: autoCategories("Rock", "70s", ["classics"]), albumArt: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0", previewUrl: spotifyPreview("5CQ30WqJwcep0pYcV4AMNc") },
  { id: "cl4", title: "Imagine", artist: "John Lennon", genre: "Pop", decade: "70s", categories: autoCategories("Pop", "70s", ["classics"]), albumArt: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1", previewUrl: spotifyPreview("4x4Ne4vCMqK9B7b1EKRZFB") },
  { id: "cl5", title: "Stayin' Alive", artist: "Bee Gees", genre: "Pop", decade: "70s", categories: autoCategories("Pop", "70s", ["classics"]), albumArt: "8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e", previewUrl: spotifyPreview("5HxIsIDWr0wbwyH5AZSM5H") },
  { id: "cl6", title: "Superstition", artist: "Stevie Wonder", genre: "R&B", decade: "70s", categories: autoCategories("R&B", "70s", ["classics"]), albumArt: "0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a", previewUrl: spotifyPreview("3FKkILfEUoTACfSPhqRl5D") },
  { id: "cl7", title: "Respect", artist: "Aretha Franklin", genre: "R&B", decade: "60s", categories: autoCategories("R&B", "60s", ["classics"]), albumArt: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0", previewUrl: spotifyPreview("3HhbPRUuRn1X2XUNqGPK5B") },
  { id: "cl8", title: "Let It Be", artist: "The Beatles", genre: "Rock", decade: "60s", categories: autoCategories("Rock", "60s", ["classics"]), albumArt: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1", previewUrl: spotifyPreview("6KKLzt0S96gZ5JbnRlMlEL") },
  { id: "cl9", title: "Yesterday", artist: "The Beatles", genre: "Rock", decade: "60s", categories: autoCategories("Rock", "60s", ["classics"]), albumArt: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2", previewUrl: spotifyPreview("3BQHpFbHbTPVFEgFLUfpG4") },
  { id: "cl10", title: "Proud Mary", artist: "Tina Turner", genre: "Rock", decade: "80s", categories: autoCategories("Rock", "80s", ["classics", "rnb"]), albumArt: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "cl11", title: "Dancing Queen", artist: "ABBA", genre: "Pop", decade: "70s", categories: autoCategories("Pop", "70s", ["classics"]), albumArt: "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "cl12", title: "Rock Around the Clock", artist: "Bill Haley & His Comets", genre: "Rock", decade: "60s", categories: autoCategories("Rock", "60s", ["classics"]), albumArt: "f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },

  // ===== MORE R&B =====
  { id: "r1", title: "Blinding Lights", artist: "The Weeknd", genre: "R&B", decade: "20s", categories: autoCategories("R&B", "20s"), albumArt: "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b", previewUrl: spotifyPreview("0VjIjW4GlUZAMYd2vXMi3b") },
  { id: "r2", title: "Earned It", artist: "The Weeknd", genre: "R&B", decade: "10s", categories: autoCategories("R&B", "10s"), albumArt: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "r3", title: "Adorn", artist: "Miguel", genre: "R&B", decade: "10s", categories: autoCategories("R&B", "10s"), albumArt: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "r4", title: "Drunk in Love", artist: "Beyoncé ft. Jay-Z", genre: "R&B", decade: "10s", categories: autoCategories("R&B", "10s", ["hiphop"]), albumArt: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "r5", title: "Thinking Out Loud", artist: "Ed Sheeran", genre: "R&B", decade: "10s", categories: autoCategories("R&B", "10s", ["pop"]), albumArt: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "r6", title: "Best Part", artist: "Daniel Caesar ft. H.E.R.", genre: "R&B", decade: "10s", categories: autoCategories("R&B", "10s"), albumArt: "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },

  // ===== MORE HIP-HOP =====
  { id: "hp1", title: "HUMBLE.", artist: "Kendrick Lamar", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s"), albumArt: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "hp2", title: "Sicko Mode", artist: "Travis Scott", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s"), albumArt: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "hp3", title: "XO Tour Llif3", artist: "Lil Uzi Vert", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s"), albumArt: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "hp4", title: "Panda", artist: "Desiigner", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s"), albumArt: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "hp5", title: "DNA.", artist: "Kendrick Lamar", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s"), albumArt: "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "hp6", title: "Congratulations", artist: "Post Malone ft. Quavo", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s"), albumArt: "9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d", previewUrl: spotifyPreview("20RbVEnJbg0BFBjhcNJROa") },
  { id: "hp7", title: "Ric Flair Drip", artist: "21 Savage & Metro Boomin", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s"), albumArt: "f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "hp8", title: "Bad and Boujee", artist: "Migos ft. Lil Uzi Vert", genre: "Hip-Hop", decade: "10s", categories: autoCategories("Hip-Hop", "10s"), albumArt: "a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "hp9", title: "F祖ther", artist: "Diddy", genre: "Hip-Hop", decade: "00s", categories: autoCategories("Hip-Hop", "00s", ["2000s"]), albumArt: "b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "hp10", title: "Savage", artist: "Megan Thee Stallion", genre: "Hip-Hop", decade: "20s", categories: autoCategories("Hip-Hop", "20s"), albumArt: "c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "hp11", title: "Money In The Grave", artist: "Drake ft. Rick Ross", genre: "Hip-Hop", decade: "20s", categories: autoCategories("Hip-Hop", "20s"), albumArt: "d0e1f2a3b4c5d6e7f8a9c0d1e2f3a4b5c6d7e8f9", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "hp12", title: "The Box", artist: "Roddy Ricch", genre: "Hip-Hop", decade: "20s", categories: autoCategories("Hip-Hop", "20s"), albumArt: "e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
  { id: "hp13", title: "Sunflower", artist: "Post Malone & Swae Lee", genre: "Hip-Hop", decade: "20s", categories: autoCategories("Hip-Hop", "20s", ["pop"]), albumArt: "f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1", previewUrl: spotifyPreview("0hCB0tFqOSwHAnpOZqSqGI") },
];

// Deduplicate by id
const uniqueSongs = Array.from(new Map(songs.map((s) => [s.id, s])).values());

// Fuse.js for fuzzy search
const fuse = new Fuse(uniqueSongs, {
  keys: ["title", "artist"],
  threshold: 0.4,
  includeScore: true,
});

export function searchSongs(query: string): Song[] {
  if (!query || query.length < 1) return [];
  return fuse.search(query).slice(0, 8).map((r) => r.item);
}

export function getSongsByCategory(category: SongCategory): Song[] {
  if (category === "all") return uniqueSongs;
  return uniqueSongs.filter((s) => s.categories.includes(category));
}

export function getRandomSong(category?: SongCategory): Song {
  const pool = category && category !== "all" ? getSongsByCategory(category) : uniqueSongs;
  if (pool.length === 0) return uniqueSongs[Math.floor(Math.random() * uniqueSongs.length)];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getSongById(id: string): Song | undefined {
  return uniqueSongs.find((s) => s.id === id);
}

export function getDailySong(): Song {
  // Simple hash of date string for consistent daily song
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % uniqueSongs.length;
  return uniqueSongs[index];
}

export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}
