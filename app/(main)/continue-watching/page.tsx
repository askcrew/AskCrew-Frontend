"use client";

import { CustomPagination } from "@/components/global/custom-pagination";
import { MovieCard } from "@/components/global/movie-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";
import { useAuth } from "@/hooks/use-auth";
import { AxiosError } from "axios";

interface Actor {
  id: number;
  name: string;
  image: string;
}

interface Category {
  id: number;
  name: string;
  image: string | null;
}

interface ContentData {
  id: number;
  name: string;
  about: string;
  price: string;
  cover_image: string;
  actors: Actor[];
  trailer: string;
  views_count: number;
  category: Category;
  is_ready: boolean;
  admin_approved: boolean;
  admin_approved_at: string | null;
  admin_approved_by: number | null;
  video: string;
  is_favorite: boolean;
  is_rated: boolean;
  is_paid: boolean;
  user_rating: number | null;
  rating_mean: number;
  rating_count: number;
  art_work_type: string;
  created_at: string;
  updated_at: string;
}

interface ContinueWatchingItem {
  id: number;
  user: number;
  content_type: number;
  object_id: number;
  progress: number;
  created_at: string;
  updated_at: string;
  content_data: ContentData;
}

export default function ContinueWatchingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [page, setPage] = useState(1);
  const [continueWatchingMovies, setContinueWatchingMovies] = useState<
    ContinueWatchingItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/viewer/login");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchContinueWatching();
    }
  }, [page, isAuthenticated]);

  const fetchContinueWatching = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<ContinueWatchingItem[]>(
        `/content/continue-watching/?page=${page}`
      );

      setContinueWatchingMovies(response.data);

      // Adjust this based on your API's pagination response
      // If your API returns pagination metadata, use it here
      setTotalPages(Math.ceil(response.data.length / 10) || 1);
    } catch (error: unknown) {
      console.error("Error fetching continue watching:", error);

      if (error instanceof AxiosError && error.response?.status !== 401) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load continue watching content",
          confirmButtonText: "OK",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onPageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          <h1 className="text-2xl md:text-3xl font-bold">Continue Watching</h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (continueWatchingMovies.length === 0) {
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
          <h1 className="text-2xl md:text-3xl font-bold">Continue Watching</h1>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-muted-foreground text-lg">
            No content to continue watching
          </p>
          <Button onClick={() => router.push("/")}>Browse Content</Button>
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
        <h1 className="text-2xl md:text-3xl font-bold">Continue Watching</h1>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {continueWatchingMovies.map((item) => {
          const movie = {
            id: item.content_data.id,
            title: item.content_data.name,
            cover_image: item.content_data.cover_image,
            rating: item.content_data.rating_mean,
            progress: item.progress,
            category: item.content_data.category.name,
            description: item.content_data.about,
            art_work_type: item.content_data.art_work_type,
          };

          return (
            <div key={item.id} className="flex flex-col gap-2">
              <MovieCard movie={movie} />
              <div className="px-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg truncate">
                    {item.content_data.name}
                  </h3>
                  <div className="flex items-center gap-1 text-orange-500">
                    <span className="text-sm font-bold">
                      ★ {item.content_data.rating_mean.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  {item.progress}% watched • {item.content_data.art_work_type}
                </p>
              </div>
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
