import { SearchX } from "lucide-react";

interface NoResultsProps {
  searchQuery: string;
  onClear: () => void;
}

export function NoResults({ searchQuery, onClear }: NoResultsProps) {
  return (
    <div className="text-center py-16">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl" />
        <div className="relative w-full h-full bg-linear-to-br from-orange-500/10 to-pink-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
          <SearchX className="w-9 h-9 text-orange-600" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        No results found
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        No matches for "
        <span className="text-foreground font-medium">{searchQuery}</span>"
      </p>
      <button
        onClick={onClear}
        className="px-5 py-2.5 rounded-lg bg-linear-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white text-sm font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
      >
        Clear Search
      </button>
    </div>
  );
}
