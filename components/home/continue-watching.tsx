"use client";

import { MovieCard } from "@/components/global/movie-card";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

interface ApiContinueWatching {
  id: number;
  user: number;
  content_type: number;
  object_id: number;
  progress: number;
  created_at: string;
  updated_at: string;
  content_data: {
    id: number;
    name?: string;
    title?: string;
    about: string;
    cover_image?: string;
    cover_photo?: string;
    image?: string;
    rating_mean: number;
    category: {
      id: number;
      name: string;
      image: string | null;
    };
    art_work_type: string;
  };
}

interface Movie {
  id: number;
  title: string;
  name?: string;
  cover_image: string;
  rating: number;
  progress?: number;
  category?: string;
  description?: string;
  about?: string;
  isWatching?: boolean;
  art_work_type?: string;
}

const getContinueWatching = async (): Promise<Movie[]> => {
  const response = await axiosInstance.get("/content/continue-watching/");
  const apiData: ApiContinueWatching[] = Array.isArray(response.data)
    ? response.data
    : response.data.results || [];

  // Transform and limit to 5 items
  return apiData.slice(0, 5).map((item) => ({
    id: item.content_data.id,
    title: item.content_data.title || item.content_data.name || "Untitled",
    name: item.content_data.name,
    cover_image: item.content_data.cover_photo || item.content_data.cover_image || item.content_data.image || "",
    rating: item.content_data.rating_mean || 0,
    category: item.content_data.category?.name,
    description: item.content_data.about,
    about: item.content_data.about,
    art_work_type: item.content_data.art_work_type,
    progress: item.progress,
    isWatching: true,
  }));
};

export function ContinueWatching() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const {
    data: movies,
    isLoading,
    error,
  } = useQuery<Movie[]>({
    queryKey: ["continue-watching"],
    queryFn: getContinueWatching,
    enabled: isAuthenticated, // Only fetch when authenticated
  });

  // Don't show section if user is not authenticated or auth is still loading
  if (!isAuthenticated || isAuthLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Continue Watching
          </h2>
          <Link
            href="/continue-watching"
            className="text-orange-500 font-semibold hover:underline"
          >
            See More
          </Link>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Continue Watching
          </h2>
          <Link
            href="/continue-watching"
            className="text-orange-500 font-semibold hover:underline"
          >
            See More
          </Link>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-red-500">Error loading continue watching</p>
        </div>
      </section>
    );
  }

  if (!movies || movies.length === 0) {
    return null; // Hide section if no items
  }
  console.log("mo", movies);

  return (
    <section className="px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-foreground">
          Continue Watching
        </h2>
        <Link
          href="/continue-watching"
          className="text-orange-500 font-semibold hover:underline"
        >
          See More
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-[1800px]:grid-cols-5! gap-6">
        {movies.map((movie) => (
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
              <p className="text-muted-foreground text-sm">
                {movie.progress}% watched • {movie.art_work_type}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
