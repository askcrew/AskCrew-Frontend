"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <div className="relative flex items-center group">
      <div className="absolute left-4 w-9 h-9 rounded-lg bg-linear-to-br from-purple-500/10 to-orange-500/10 flex items-center justify-center">
        <Search className="w-5 h-5 text-purple-600" />
      </div>
      <input
        type="text"
        placeholder="Search for movies and series..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-16 pr-12 py-4 rounded-xl bg-background border border-border focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-foreground placeholder:text-muted-foreground shadow-sm hover:shadow-md"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-4 w-7 h-7 rounded-full bg-linear-to-br from-purple-500/20 to-orange-500/20 hover:from-purple-500 hover:to-orange-500 flex items-center justify-center transition-all group"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors" />
        </button>
      )}
    </div>
  );
}
