"use client";

import { SearchBar } from "@/components/search/search-bar";
import { SearchResults } from "@/components/search/search-results";
import { EmptyState } from "@/components/search/empty-state";
import { NoResults } from "@/components/search/no-results";
import { useSearch } from "@/components/search/use-search";

export default function SearchPage() {
  const {
    searchQuery,
    setSearchQuery,
    filteredResults,
    clearSearch,
    isSearching,
    isLoading,
  } = useSearch();
  console.log("filteredResults", filteredResults);

  return (
    <div className="min-h-screen pb-20">
      {/* Search Section */}
      <div className="relative border border-border/50 mx-6 mt-4 rounded-2xl  bg-linear-to-br from-purple-500/5 via-transparent to-orange-500/5">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Search
            </h1>
            <p className="text-muted-foreground text-sm">
              Find your favorite movies and series
            </p>
          </div>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={clearSearch}
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading movies...</p>
            </div>
          </div>
        ) : !isSearching ? (
          <EmptyState />
        ) : filteredResults && filteredResults.length > 0 ? (
          <SearchResults
            results={filteredResults || []}
            searchQuery={searchQuery}
          />
        ) : (
          <NoResults searchQuery={searchQuery} onClear={clearSearch} />
          
        )}
      </div>
    </div>
  );
}
