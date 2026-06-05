import { MovieCard } from "@/components/global/movie-card";

interface Movie {
  id: number;
  title: string;
  cover_image: string;
  rating: number;
  progress?: number;
}

interface SearchResultsProps {
  results: Movie[];
  searchQuery: string;
}

export function SearchResults({ results, searchQuery }: SearchResultsProps) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500/10 to-orange-500/10 flex items-center justify-center border border-purple-500/20">
          <svg
            className="w-5 h-5 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </p>
          <p className="text-xs text-muted-foreground">
            Searching for &quot;
            <span className="text-purple-600 font-medium">{searchQuery}</span>&quot;
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
