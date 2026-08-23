"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { searchSongs, type Song } from "@/lib/songs";

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function GuessInput({ onGuess, disabled, placeholder }: GuessInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const found = searchSongs(value);
      setResults(found);
      setIsOpen(found.length > 0 && value.length > 0);
      setHighlightedIndex(-1);
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmit = (value: string) => {
    if (!value.trim() || disabled) return;
    onGuess(value.trim());
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    if (!isOpen || results.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit(query);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % results.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + results.length) % results.length);
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSubmit(results[highlightedIndex].title);
        } else {
          handleSubmit(query);
        }
        break;
    }
  };

  const handleSelect = (song: Song) => {
    handleSubmit(song.title);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            search(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder || "Type a song or artist name..."}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-800/70 py-3.5 pl-11 pr-4 text-base text-white placeholder-zinc-500 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {/* Autocomplete dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800 shadow-2xl">
          {results.map((song, index) => (
            <button
              key={song.id}
              onClick={() => handleSelect(song)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                index === highlightedIndex
                  ? "bg-indigo-500/15 text-white"
                  : "text-zinc-300 hover:bg-zinc-700/50"
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-700/60">
                <span className="text-sm">🎵</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{song.title}</p>
                <p className="truncate text-xs text-zinc-400">{song.artist}</p>
              </div>
              <span className="shrink-0 rounded-full bg-zinc-700/60 px-2 py-0.5 text-[10px] text-zinc-400">
                {song.decade}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
