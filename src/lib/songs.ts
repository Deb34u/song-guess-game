import Fuse from "fuse.js";

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  decade: string;
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
  } catch { /* quota exceeded – ignore */ }
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
  } catch { /* network error – ignore */ }
  return null;
}

function spotifyPreview(id: string): string {
  return `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
}

function albumArt(id: string): string {
  return `https://i.scdn.co/image/ab67616d0000b273${id}`;
}

export const songs: Song[] = [
  // ===== 1980s =====
  { id: "s1", title: "Billie Jean", artist: "Michael Jackson", genre: "Pop", decade: "80s", albumArt: "2e70a41b5a2c733e1f26a2a3e16a9e3f2a07e8b0", previewUrl: spotifyPreview("5ChkMS8OtdzJeqYbK6b9ct") },
  { id: "s2", title: "Take On Me", artist: "a-ha", genre: "Pop", decade: "80s", albumArt: "7c1e5f6a3b2d4e8f9a0c1d2e3f4a5b6c7d8e9f0a", previewUrl: spotifyPreview("2WfaOiMkCvy7F5fcp2zZ8L") },
  { id: "s3", title: "Sweet Child O' Mine", artist: "Guns N' Roses", genre: "Rock", decade: "80s", albumArt: "01f5cd858d5bb06f731e3c4a1b4a1e2f3a4b5c6d", previewUrl: spotifyPreview("7o2CTHg8Jy9MvqZ8FQVrBY") },
  { id: "s4", title: "Don't Stop Believin'", artist: "Journey", genre: "Rock", decade: "80s", albumArt: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b", previewUrl: spotifyPreview("4bEkozVaHnBmALfa2MPAwl") },
  { id: "s5", title: "Every Breath You Take", artist: "The Police", genre: "Rock", decade: "80s", albumArt: "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c", previewUrl: spotifyPreview("1Jg2xXBkRGboqJDSau6Vag") },
  { id: "s6", title: "Never Gonna Give You Up", artist: "Rick Astley", genre: "Pop", decade: "80s", albumArt: "3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d", previewUrl: spotifyPreview("4c3lZ9EyI6s8MWjVzBHHHp") },
  { id: "s7", title: "Livin' on a Prayer", artist: "Bon Jovi", genre: "Rock", decade: "80s", albumArt: "4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e", previewUrl: spotifyPreview("38zRfkSWAODwVbST1B3HT0") },
  { id: "s8", title: "Girls Just Want to Have Fun", artist: "Cyndi Lauper", genre: "Pop", decade: "80s", albumArt: "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f", previewUrl: spotifyPreview("5DdBLM0PT3dS6MwN0LTQ0S") },
  { id: "s9", title: "Jump", artist: "Van Halen", genre: "Rock", decade: "80s", albumArt: "6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a", previewUrl: spotifyPreview("6Fz8J14Gbni5pFPNIF1j6h") },
  { id: "s10", title: "Stand By Me", artist: "Ben E. King", genre: "R&B", decade: "80s", albumArt: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b", previewUrl: spotifyPreview("3fusbH6pKxOOFOiK1FF7sB") },

  // ===== 1990s =====
  { id: "s11", title: "Smells Like Teen Spirit", artist: "Nirvana", genre: "Rock", decade: "90s", albumArt: "8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c", previewUrl: spotifyPreview("2guirTSMqnVBI37zN055bi") },
  { id: "s12", title: "Wonderwall", artist: "Oasis", genre: "Rock", decade: "90s", albumArt: "9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d", previewUrl: spotifyPreview("7j2jwOBZT29X5U0e0M4mSa") },
  { id: "s13", title: "No Scrubs", artist: "TLC", genre: "R&B", decade: "90s", albumArt: "0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e", previewUrl: spotifyPreview("1GhPHrqg7zE3KHZ7eXWm4z") },
  { id: "s14", title: "Waterfalls", artist: "TLC", genre: "R&B", decade: "90s", albumArt: "1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f", previewUrl: spotifyPreview("3uZazrM6GxahcR8XBsMqzB") },
  { id: "s15", title: "Killing Me Softly", artist: "Fugees", genre: "Hip-Hop", decade: "90s", albumArt: "2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a", previewUrl: spotifyPreview("2BZPZVz7GqF0gKPnNySb2P") },
  { id: "s16", title: "Losing My Religion", artist: "R.E.M.", genre: "Alternative", decade: "90s", albumArt: "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b", previewUrl: spotifyPreview("4T3Mfo0IIskU5d7lf5B0h7") },
  { id: "s17", title: "Creep", artist: "Radiohead", genre: "Alternative", decade: "90s", albumArt: "4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c", previewUrl: spotifyPreview("2RJ9b2jHZRkAZ27LoF2H3c") },
  { id: "s18", title: "Under the Bridge", artist: "Red Hot Chili Peppers", genre: "Rock", decade: "90s", albumArt: "5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d", previewUrl: spotifyPreview("1o85Mi33xSNKIh5uUtpB3v") },
  { id: "s19", title: "I Will Always Love You", artist: "Whitney Houston", genre: "Pop", decade: "90s", albumArt: "6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e", previewUrl: spotifyPreview("4wTWnSnd2bVIUbFgq6iFGt") },
  { id: "s20", title: "California Dreamin'", artist: "The Mamas & The Papas", genre: "Pop", decade: "90s", albumArt: "7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f", previewUrl: spotifyPreview("3jBfXCDbOGU8JcU8ljdmHb") },
  { id: "s21", title: "Black Hole Sun", artist: "Soundgarden", genre: "Rock", decade: "90s", albumArt: "8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a", previewUrl: spotifyPreview("08hY9eZfJfW67bJQrVdQ0Y") },
  { id: "s22", title: "November Rain", artist: "Guns N' Roses", genre: "Rock", decade: "90s", albumArt: "9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b", previewUrl: spotifyPreview("7c2r8s9Bv1dV6K0M3X5Q8Y") },
  { id: "s23", title: "Bitter Sweet Symphony", artist: "The Verve", genre: "Alternative", decade: "90s", albumArt: "0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c", previewUrl: spotifyPreview("6x4aaKH7eKkY25wKm4zG8h") },
  { id: "s24", title: "MMMBop", artist: "Hanson", genre: "Pop", decade: "90s", albumArt: "1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d", previewUrl: spotifyPreview("2CXsIMEE3Km7u3n8c2dRjP") },
  { id: "s25", title: "Smooth", artist: "Santana ft. Rob Thomas", genre: "Rock", decade: "90s", albumArt: "2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e", previewUrl: spotifyPreview("08yKROBjgjCzKQIa2BdM0F") },

  // ===== 2000s =====
  { id: "s26", title: "Hey Ya!", artist: "OutKast", genre: "Hip-Hop", decade: "00s", albumArt: "3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f", previewUrl: spotifyPreview("2pANdq4vdJ5wqFaS1zfzmP") },
  { id: "s27", title: "Mr. Brightside", artist: "The Killers", genre: "Alternative", decade: "00s", albumArt: "4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a", previewUrl: spotifyPreview("003vvx7Nk0V4ogrxJJGBbi") },
  { id: "s28", title: "Crazy in Love", artist: "Beyoncé ft. Jay-Z", genre: "Pop", decade: "00s", albumArt: "5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b", previewUrl: spotifyPreview("0Tx0v6EdS1BRLdF2b8K1SP") },
  { id: "s29", title: "Lose Yourself", artist: "Eminem", genre: "Hip-Hop", decade: "00s", albumArt: "6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c", previewUrl: spotifyPreview("1xPmRvJDq7B8T6e1d7Wf5f") },
  { id: "s30", title: "In Da Club", artist: "50 Cent", genre: "Hip-Hop", decade: "00s", albumArt: "7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d", previewUrl: spotifyPreview("6H9m4MAfiEIDbMo2PZJx0A") },
  { id: "s31", title: "Seven Nation Army", artist: "The White Stripes", genre: "Rock", decade: "00s", albumArt: "8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e", previewUrl: spotifyPreview("0Puny27gW73fZfb3vrGPlC") },
  { id: "s32", title: "Toxic", artist: "Britney Spears", genre: "Pop", decade: "00s", albumArt: "9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f", previewUrl: spotifyPreview("6naxdtIo43H5iLM87s3xMc") },
  { id: "s33", title: "Boulevard of Broken Dreams", artist: "Green Day", genre: "Rock", decade: "00s", albumArt: "0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a", previewUrl: spotifyPreview("1w5KfoOjKMPqv55RVAG7dz") },
  { id: "s34", title: "Get Low", artist: "Lil Jon & The East Side Boyz", genre: "Hip-Hop", decade: "00s", albumArt: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b", previewUrl: spotifyPreview("0b0RlH5xWHd3T6B34RtH0A") },
  { id: "s35", title: "Stan", artist: "Eminem ft. Dido", genre: "Hip-Hop", decade: "00s", albumArt: "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c", previewUrl: spotifyPreview("03Pyp1Wb7R9GN2fe2UwNkx") },
  { id: "s36", title: "Hey Ya!", artist: "OutKast", genre: "Hip-Hop", decade: "00s", albumArt: "3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d", previewUrl: spotifyPreview("2pANdq4vdJ5wqFaS1zfzmP") },
  { id: "s37", title: "Numb", artist: "Linkin Park", genre: "Rock", decade: "00s", albumArt: "4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e", previewUrl: spotifyPreview("3N2x0MRqEHMA7F31ROaS7z") },
  { id: "s38", title: "Drop It Like It's Hot", artist: "Snoop Dogg ft. Pharrell", genre: "Hip-Hop", decade: "00s", albumArt: "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f", previewUrl: spotifyPreview("5Z9iGlOPZU5U3gcfan2Z2i") },
  { id: "s39", title: "Sugar, We're Goin Down", artist: "Fall Out Boy", genre: "Rock", decade: "00s", albumArt: "6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a", previewUrl: spotifyPreview("5FhBGadT950BPlC0JlNCWB") },
  { id: "s40", title: "Crazy", artist: "Gnarls Barkley", genre: "Pop", decade: "00s", albumArt: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b", previewUrl: spotifyPreview("75k1GTq2DPvG6OBFnhjNlA") },
  { id: "s41", title: "Hips Don't Lie", artist: "Shakira ft. Wyclef Jean", genre: "Pop", decade: "00s", albumArt: "8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c", previewUrl: spotifyPreview("6PQFkLm4FNsE6FpPBdI5L2") },
  { id: "s42", title: "Since U Been Gone", artist: "Kelly Clarkson", genre: "Pop", decade: "00s", albumArt: "9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d", previewUrl: spotifyPreview("2yKxngZGK0kYaMBqEOjOYv") },
  { id: "s43", title: "Bad Day", artist: "Daniel Powter", genre: "Pop", decade: "00s", albumArt: "0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e", previewUrl: spotifyPreview("2TfSHkX2ST1mG8hHRHZSRm") },
  { id: "s44", title: "Chop Suey!", artist: "System of a Down", genre: "Rock", decade: "00s", albumArt: "1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f", previewUrl: spotifyPreview("2S8sFnAHMfbzuZFqTmR4sR") },
  { id: "s45", title: "Yellow", artist: "Coldplay", genre: "Rock", decade: "00s", albumArt: "2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a", previewUrl: spotifyPreview("3AJwUDP919HHQ2LtI0E5kz") },
  { id: "s46", title: "The Real Slim Shady", artist: "Eminem", genre: "Hip-Hop", decade: "00s", albumArt: "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b", previewUrl: spotifyPreview("3N0EPPH2i8E7qNQjHajt8H") },
  { id: "s47", title: "Feel Good Inc.", artist: "Gorillaz", genre: "Alternative", decade: "00s", albumArt: "4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c", previewUrl: spotifyPreview("0d28khmj6a4S9vJgqzfmP8") },
  { id: "s48", title: "All Star", artist: "Smash Mouth", genre: "Pop", decade: "00s", albumArt: "5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d", previewUrl: spotifyPreview("0Fn9C4TtJMcEPMX1bQbIAj") },
  { id: "s49", title: "Stacy's Mom", artist: "Fountains of Wayne", genre: "Rock", decade: "00s", albumArt: "6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e", previewUrl: spotifyPreview("1s5r7A6vBDQNpZ0cYn5GeP") },
  { id: "s50", title: "Maps", artist: "Yeah Yeah Yeahs", genre: "Alternative", decade: "00s", albumArt: "7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f", previewUrl: spotifyPreview("4dV1fCOV0Jq880d3H1mJ6J") },

  // ===== 2010s =====
  { id: "s51", title: "Party Rock Anthem", artist: "LMFAO", genre: "Pop", decade: "10s", albumArt: "8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a", previewUrl: spotifyPreview("2hlE48rz8f0WkzL9ClbE6x") },
  { id: "s52", title: "Rolling in the Deep", artist: "Adele", genre: "Pop", decade: "10s", albumArt: "9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b", previewUrl: spotifyPreview("1Cv11Pbe0aN2WMkpxPQz0z") },
  { id: "s53", title: "Thrift Shop", artist: "Macklemore & Ryan Lewis", genre: "Hip-Hop", decade: "10s", albumArt: "0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c", previewUrl: spotifyPreview("62wqa8u4A08PBlbL3o0AQ8") },
  { id: "s54", title: "Old Town Road", artist: "Lil Nas X", genre: "Hip-Hop", decade: "10s", albumArt: "1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d", previewUrl: spotifyPreview("0f3QxAGg4l1cEqHDBM0tHu") },
  { id: "s55", title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", genre: "Pop", decade: "10s", albumArt: "2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e", previewUrl: spotifyPreview("32OlwWuMpZ6b0aN2RZOeMS") },
  { id: "s56", title: "Somebody That I Used to Know", artist: "Gotye ft. Kimbra", genre: "Alternative", decade: "10s", albumArt: "3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f", previewUrl: spotifyPreview("3YJNvFozAcPl3e4xG2jEwK") },
  { id: "s57", title: "Shake It Off", artist: "Taylor Swift", genre: "Pop", decade: "10s", albumArt: "4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a", previewUrl: spotifyPreview("4qsCYjQkENeFKpHLH7F4AS") },
  { id: "s58", title: "Despacito", artist: "Luis Fonsi ft. Daddy Yankee", genre: "Pop", decade: "10s", albumArt: "5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b", previewUrl: spotifyPreview("6habFhsOp2NvshLv26DqMb") },
  { id: "s59", title: "Bohemian Rhapsody", artist: "Queen", genre: "Rock", decade: "10s", albumArt: "6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c", previewUrl: spotifyPreview("7tFiyTwD0nx5a1eklYtX2J") },
  { id: "s60", title: "Hotel California", artist: "Eagles", genre: "Rock", decade: "10s", albumArt: "7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d", previewUrl: spotifyPreview("2TSlDMDk8S0Bfgi6M5WcpI") },
  { id: "s61", title: "Stayin' Alive", artist: "Bee Gees", genre: "Pop", decade: "10s", albumArt: "8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e", previewUrl: spotifyPreview("5HxIsIDWr0wbwyH5AZSM5H") },
  { id: "s62", title: "Back in Black", artist: "AC/DC", genre: "Rock", decade: "10s", albumArt: "9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f", previewUrl: spotifyPreview("0RytW1MbOjDi1gIGn2mIBk") },
  { id: "s63", title: "Superstition", artist: "Stevie Wonder", genre: "R&B", decade: "10s", albumArt: "0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a", previewUrl: spotifyPreview("3FKkILfEUoTACfSPhqRl5D") },
  { id: "s64", title: "Don't Stop Me Now", artist: "Queen", genre: "Rock", decade: "10s", albumArt: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b", previewUrl: spotifyPreview("7hMV4WjSPCLVeicByrIR8a") },
  { id: "s65", title: "Happy", artist: "Pharrell Williams", genre: "Pop", decade: "10s", albumArt: "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c", previewUrl: spotifyPreview("60nZcImufyA1DDUcZPVILL") },
  { id: "s66", title: "Radioactive", artist: "Imagine Dragons", genre: "Rock", decade: "10s", albumArt: "3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d", previewUrl: spotifyPreview("69QHa40eBngr6gkMbPNOwO") },
  { id: "s67", title: "Lean On", artist: "Major Lazer & DJ Snake", genre: "Pop", decade: "10s", albumArt: "4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e", previewUrl: spotifyPreview("0lJmxlUROrILeSHbkwvJnR") },
  { id: "s68", title: "Stressed Out", artist: "Twenty One Pilots", genre: "Alternative", decade: "10s", albumArt: "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f", previewUrl: spotifyPreview("2zE6LyEiDmhP2U0ZwE6mNc") },
  { id: "s69", title: "Closer", artist: "The Chainsmokers ft. Halsey", genre: "Pop", decade: "10s", albumArt: "6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a", previewUrl: spotifyPreview("7BKLCY1gZRV0TDhNPD5yzc") },
  { id: "s70", title: "Formation", artist: "Beyoncé", genre: "Pop", decade: "10s", albumArt: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b", previewUrl: spotifyPreview("3jK1bC4bEofK0EaDGvZJmB") },
  { id: "s71", title: "Hotline Bling", artist: "Drake", genre: "Hip-Hop", decade: "10s", albumArt: "8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c", previewUrl: spotifyPreview("0b2ejnZqOh14f1w6s4RdWh") },
  { id: "s72", title: "Congratulations", artist: "Post Malone ft. Quavo", genre: "Hip-Hop", decade: "10s", albumArt: "9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d", previewUrl: spotifyPreview("20RbVEnJbg0BFBjhcNJROa") },
  { id: "s73", title: "Sorry", artist: "Justin Bieber", genre: "Pop", decade: "10s", albumArt: "0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e", previewUrl: spotifyPreview("09CtPGUJPdIfjr8MiLMO8X") },
  { id: "s74", title: "Rockstar", artist: "Post Malone ft. 21 Savage", genre: "Hip-Hop", decade: "10s", albumArt: "1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f", previewUrl: spotifyPreview("0lHMdveWRWfWEYAw1VbBcO") },
  { id: "s75", title: "Dance Monkey", artist: "Tones and I", genre: "Pop", decade: "10s", albumArt: "2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a", previewUrl: spotifyPreview("2XU0oxnq2qxCp2AAVJgChE") },

  // ===== 2020s =====
  { id: "s76", title: "Blinding Lights", artist: "The Weeknd", genre: "Pop", decade: "20s", albumArt: "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b", previewUrl: spotifyPreview("0VjIjW4GlUZAMYd2vXMi3b") },
  { id: "s77", title: "Shape of You", artist: "Ed Sheeran", genre: "Pop", decade: "20s", albumArt: "4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c", previewUrl: spotifyPreview("7qiZfU4dY1lWllzX7mPBI3") },
  { id: "s78", title: "Bad Guy", artist: "Billie Eilish", genre: "Pop", decade: "20s", albumArt: "5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d", previewUrl: spotifyPreview("2Fxmhks0bxGSBdJ92vM42m") },
  { id: "s79", title: "As It Was", artist: "Harry Styles", genre: "Pop", decade: "20s", albumArt: "6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e", previewUrl: spotifyPreview("0HE8rvNU0LOe6MCpb0HvFr") },
  { id: "s80", title: "Anti-Hero", artist: "Taylor Swift", genre: "Pop", decade: "20s", albumArt: "7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f", previewUrl: spotifyPreview("0V3wPSX9ygBnCm8psDIegu") },
  { id: "s81", title: "Flowers", artist: "Miley Cyrus", genre: "Pop", decade: "20s", albumArt: "8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a", previewUrl: spotifyPreview("0yLdNVWF3Srea0uzk55zFo") },
  { id: "s82", title: "Levitating", artist: "Dua Lipa", genre: "Pop", decade: "20s", albumArt: "9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b", previewUrl: spotifyPreview("39LLxExYz6ewLAo9BKLRW8") },
  { id: "s83", title: "Stay", artist: "The Kid LAROI & Justin Bieber", genre: "Pop", decade: "20s", albumArt: "0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c", previewUrl: spotifyPreview("5PjdY0CKGZdEuoNab3yDmX") },
  { id: "s84", title: "WAP", artist: "Cardi B ft. Megan Thee Stallion", genre: "Hip-Hop", decade: "20s", albumArt: "1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d", previewUrl: spotifyPreview("78QR3FlprlVeSYRqzf0Oyp") },
  { id: "s85", title: "drivers license", artist: "Olivia Rodrigo", genre: "Pop", decade: "20s", albumArt: "2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e", previewUrl: spotifyPreview("5wJ1HnToE6T2fgAI1WUgTz") },
  { id: "s86", title: "Peaches", artist: "Justin Bieber ft. Daniel Caesar", genre: "Pop", decade: "20s", albumArt: "3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f", previewUrl: spotifyPreview("67Bw2pXvFhNTab5T1aKwf2") },
  { id: "s87", title: "Watermelon Sugar", artist: "Harry Styles", genre: "Pop", decade: "20s", albumArt: "4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a", previewUrl: spotifyPreview("6UelLqGlWMcVn1aC5nZanM") },
  { id: "s88", title: "Shivers", artist: "Ed Sheeran", genre: "Pop", decade: "20s", albumArt: "5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b", previewUrl: spotifyPreview("2E3ZATBrK1pX2yFnE5rFJA") },
  { id: "s89", title: "Heat Waves", artist: "Glass Animals", genre: "Alternative", decade: "20s", albumArt: "6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c", previewUrl: spotifyPreview("69QHa40eBngr6gkMbPNOwO") },
  { id: "s90", title: "Industry Baby", artist: "Lil Nas X ft. Jack Harlow", genre: "Hip-Hop", decade: "20s", albumArt: "7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d", previewUrl: spotifyPreview("0LrcB3AO8F0G3EwKj4v0vN") },
  { id: "s91", title: "Montero", artist: "Lil Nas X", genre: "Hip-Hop", decade: "20s", albumArt: "8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e", previewUrl: spotifyPreview("32Cyrus2SxSo63I0PgsJ5c") },
  { id: "s92", title: "good 4 u", artist: "Olivia Rodrigo", genre: "Rock", decade: "20s", albumArt: "9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f", previewUrl: spotifyPreview("5wJKFkAmQYHnQMYkTp2qOm") },
  { id: "s93", title: "Leave The Door Open", artist: "Silk Sonic", genre: "R&B", decade: "20s", albumArt: "0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a", previewUrl: spotifyPreview("4b8tOGPfNOoEqS1Y9vZC4x") },
  { id: "s94", title: "Kiss Me More", artist: "Doja Cat ft. SZA", genre: "Pop", decade: "20s", albumArt: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b", previewUrl: spotifyPreview("0E5EoRFbmh5fLphJIFRDIQ") },
  { id: "s95", title: "Jolene", artist: "Dolly Parton", genre: "Country", decade: "80s", albumArt: "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c", previewUrl: spotifyPreview("3HaDpPCBpP0fbHl04F2h6P") },
  { id: "s96", title: "Take Me Out", artist: "Franz Ferdinand", genre: "Alternative", decade: "00s", albumArt: "3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d", previewUrl: spotifyPreview("0G1Xg73dFXW2iFbZ7gVyn1") },
  { id: "s97", title: "Replay", artist: "Iyaz", genre: "Pop", decade: "10s", albumArt: "4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e", previewUrl: spotifyPreview("4I93b9x1tBJFE6dIPePi8F") },
  { id: "s98", title: "Apologize", artist: "Timbaland ft. OneRepublic", genre: "Pop", decade: "10s", albumArt: "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f", previewUrl: spotifyPreview("1Uff91EOsvd99rt9sYc46r") },
  { id: "s99", title: "Crank That", artist: "Soulja Boy", genre: "Hip-Hop", decade: "00s", albumArt: "6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a", previewUrl: spotifyPreview("00sAOw8UUNfb5JP6aF6PgA") },
  { id: "s100", title: "Low", artist: "Flo Rida ft. T-Pain", genre: "Hip-Hop", decade: "00s", albumArt: "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b", previewUrl: spotifyPreview("5Z9bcI94Y8g3fB59hIY95A") },
  { id: "s101", title: "DJ Got Us Fallin' in Love", artist: "Usher ft. Pitbull", genre: "Pop", decade: "10s", albumArt: "8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c", previewUrl: spotifyPreview("1MpXq7Pab5Hgzs1v6eBc6C") },
  { id: "s102", title: "TiK ToK", artist: "Ke$ha", genre: "Pop", decade: "10s", albumArt: "9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d", previewUrl: spotifyPreview("2HDY1YBWr1FBOHR2kGzuc3") },
  { id: "s103", title: "Dynamite", artist: "BTS", genre: "Pop", decade: "20s", albumArt: "0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e", previewUrl: spotifyPreview("0pqnkoJy4QUhY8F5Nq1dpE") },
  { id: "s104", title: "Bad Habits", artist: "Ed Sheeran", genre: "Pop", decade: "20s", albumArt: "1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f", previewUrl: spotifyPreview("4GfE1J7U0qcHBT4bRQRGVY") },
  { id: "s105", title: "Sunroof", artist: "Nicky Youre & dazy", genre: "Pop", decade: "20s", albumArt: "2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a", previewUrl: spotifyPreview("5Y7vcJ3O5dE0FxZIuZq0gn") },
  { id: "s106", title: "About Damn Time", artist: "Lizzo", genre: "Pop", decade: "20s", albumArt: "3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },
  { id: "s107", title: "Super Freaky Girl", artist: "Nicki Minaj", genre: "Hip-Hop", decade: "20s", albumArt: "4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c", previewUrl: spotifyPreview("0ql2LNFPSrDJlT4b3fEfbc") },
  { id: "s108", title: "Unholy", artist: "Sam Smith & Kim Petras", genre: "Pop", decade: "20s", albumArt: "5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d", previewUrl: spotifyPreview("28dtBwGkRmAPmP4dCoBPHy") },
  { id: "s109", title: "Late Night Talking", artist: "Harry Styles", genre: "Pop", decade: "20s", albumArt: "6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e", previewUrl: spotifyPreview("0H39FkTD1FfWH1tYzS8iFy") },
  { id: "s110", title: "I Ain't Worried", artist: "OneRepublic", genre: "Pop", decade: "20s", albumArt: "7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f", previewUrl: spotifyPreview("2dE8dXlMUGqVOkxMfVrMoO") },
  { id: "s111", title: "Cruel Summer", artist: "Taylor Swift", genre: "Pop", decade: "20s", albumArt: "8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a", previewUrl: spotifyPreview("0mHYEoSd8eZ9F2V1c8u0fF") },
  { id: "s112", title: "Kill Bill", artist: "SZA", genre: "R&B", decade: "20s", albumArt: "9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b", previewUrl: spotifyPreview("2IGMVunIBsBLtEQyoI1Mu7") },
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

export function getSongById(id: string): Song | undefined {
  return uniqueSongs.find((s) => s.id === id);
}

export function getRandomSong(): Song {
  return uniqueSongs[Math.floor(Math.random() * uniqueSongs.length)];
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
