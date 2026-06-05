"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/global/search-bar";
import CustomSelect from "@/components/global/custom-select";
import { AdminMovieCard } from "@/components/enterprise/movies/admin-movie-card";
import { Movie } from "@/components/search/use-search";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

const MoviesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  // Fetch categories using tanstack query
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/categories");
      return res.data.categories;
    },
  });

  // Transform categories for CustomSelect
  const categoryOptions = categoriesData
    ? [
        { label: "All Categories", value: "all" },
        ...categoriesData.map((cat: { id: number; name: string }) => ({
          label: cat.name,
          value: cat.name,
        })),
      ]
    : [{ label: "All Categories", value: "all" }];

  const { data, isLoading, error } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const res = await axiosInstance.get("/content/movies?mine=true");
      return res.data;
    },
  });
  const filteredMovies = useMemo(() => {
    return (
      data &&
      data?.results?.filter((movie: Movie) => {
        const matchesSearch = movie.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" ||
          movie.category.name === selectedCategory;
        return matchesSearch && matchesCategory;
      })
    );
  }, [data, searchQuery, selectedCategory]);
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Movies</h1>
          <p className="text-muted-foreground">
            Manage your uploaded movies and trailers
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/enterprise/dashboard/movies/create">
            <Plus className="w-4 h-4 mr-2" />
            Add Movie
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full md:w-80"
        />
        <CustomSelect
          options={categoryOptions}
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          placeholder={isCategoriesLoading ? "Loading..." : "Select category"}
          containerClassName="w-full md:w-48 space-y-0"
          className="h-10"
          message={categoriesError ? "Failed to load categories" : undefined}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading && (
          <div className="col-span-full flex justify-center items-center py-12">
            <svg
              className="animate-spin h-6 w-6 text-muted-foreground mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading movies...
          </div>
        )}
        {filteredMovies?.map((movie: Movie) => (
          <AdminMovieCard key={movie.id} movie={movie} />
        ))}
        {filteredMovies?.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No movies found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
