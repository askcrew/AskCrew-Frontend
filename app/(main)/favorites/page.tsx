"use client";

import { useFavorites } from "@/hooks/use-favorites";
import { MovieCard } from "@/components/global/movie-card";
import { CustomPagination } from "@/components/global/custom-pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [page, setPage] = useState(1);

  const { data: favoritesData, isLoading } = useFavorites(page);

  // Redirect to login if not authenticated (handled by layout/middleware usually, but good to have)
  if (!isAuthLoading && !isAuthenticated) {
    router.push("/viewer/login");
    return null;
  }

  const onPageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = favoritesData ? Math.ceil(favoritesData.count / 10) : 1; // Assuming 10 items per page

  if (isLoading || isAuthLoading) {
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
          <h1 className="text-2xl md:text-3xl font-bold">My Favorites</h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!favoritesData?.results || favoritesData.results.length === 0) {
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
          <h1 className="text-2xl md:text-3xl font-bold">My Favorites</h1>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">No favorites yet</h2>
          <p className="text-muted-foreground text-lg text-center max-w-md">
            Start adding movies and series to your favorites list to watch them
            later.
          </p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Browse Content
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full hover:bg-secondary/80"
        >
          <ChevronLeft className="size-6" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">My Favorites</h1>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {favoritesData.results.map((item) => {
          // Normalize the data structure for MovieCard
          const content = item.content_object;

          const movie = {
            id: content.id,
            title: content.name || content.title,
            cover_image: content.cover_image || content.cover_photo || "", // Handle series cover_photo vs movie cover_image
            rating: content.rating_mean,
            progress: 0,
            category: content.category?.name,
            description: content.about || content.description,
            art_work_type:
              content.art_work_type ||
              (item.content_type === 42 ? "movie" : "series"), // content_type 42 seems to be movie based on user JSON, but better trust art_work_type
            contentType: (content.art_work_type ||
              (item.content_type === 42 ? "movie" : "series")) as
              | "movie"
              | "series",
            is_favorite: true, // It's in the favorites list
            // Pass other potential required fields as standard fallback
            price: content.price,
            trailer: content.trailer,
            views_count: content.views_count,
            created_at: content.created_at,
          };

          return (
            <div
              key={`${item.content_type}-${item.object_id}`}
              className="flex flex-col gap-2"
            >
              <MovieCard movie={movie} />
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <CustomPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="my-5"
        />
      )}
    </div>
  );
}
