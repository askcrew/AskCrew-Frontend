"use client";

import { CheckboxGroup } from "@/components/global/custom-checkbox-group";
import { CustomPagination } from "@/components/global/custom-pagination";
import { MovieCard } from "@/components/global/movie-card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import type {
  TrendingResponse,
  TrendingContent,
} from "@/Schemas/content/trending";
import Swal from "sweetalert2";

export default function InTrendPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [trendingContent, setTrendingContent] = useState<TrendingContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<
    { id: string; label: string; value: string }[]
  >([]);

  // Fetch trending content
  useEffect(() => {
    const fetchTrendingContent = async () => {
      setIsLoading(true);
      try {
        const params: Record<string, string> = {
          page: page.toString(),
        };

        if (selectedCategories.length > 0) {
          params.category = selectedCategories.join(",");
        }

        const response = await axiosInstance.get<TrendingResponse>(
          "/content/trending/",
          { params }
        );

        setTrendingContent(response.data.results);

        // Calculate total pages (assuming 10 items per page)
        setTotalPages(Math.ceil(response.data.count / 10));

        // Extract unique categories from results
        const uniqueCategories = Array.from(
          new Set(response.data.results.map((item) => item.category.name))
        ).map((name) => ({
          id: name.toLowerCase().replace(/\s+/g, "-"),
          label: name,
          value: name,
        }));

        if (uniqueCategories.length > 0) {
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching trending content:", error);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load trending content. Please try again.",
          confirmButtonText: "OK",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingContent();
  }, [page, selectedCategories]);

  const onPageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Transform API data to match MovieCard expected format
  const transformedMovies = trendingContent.map((item) => ({
    id: item.id,
    title: item.name,
    cover_image: item.cover_image,
    rating: item.rating_mean,
    progress: 0,
    category: item.category.name,
    description: item.about,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-secondary/80"
          >
            <ChevronLeft className="size-6" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">In Trend</h1>
        </div>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full hover:bg-secondary/80"
          >
            <ChevronLeft className="size-6" />
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">In Trend</h1>
        </div>

        {/* Category Filter */}
        <ScrollArea className="pb-2">
          <CheckboxGroup
            options={categories}
            value={selectedCategories}
            onChange={setSelectedCategories}
          />
          <ScrollBar />
        </ScrollArea>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {transformedMovies.map((movie) => (
          <div key={movie.id} className="flex flex-col gap-2">
            <MovieCard movie={movie} />
            <div className="px-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg truncate">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-1 text-orange-500">
                  <span className="text-sm font-bold">
                    ★ {movie.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">{movie.category}</p>
            </div>
          </div>
        ))}
      </div>

      {transformedMovies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p className="text-lg">
            No movies found for the selected categories.
          </p>
          <Button
            variant="link"
            onClick={() => setSelectedCategories([])}
            className="mt-2"
          >
            Clear filters
          </Button>
        </div>
      )}

      <CustomPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="my-10"
      />
    </div>
  );
}
