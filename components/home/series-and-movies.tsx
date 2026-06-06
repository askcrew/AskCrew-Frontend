"use client";

import { MovieCard } from "@/components/global/movie-card";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

interface ApiMovie {
  id: number;
  title?: string;
  name?: string;
  image?: string;
  cover_photo?: string;
  cover_image?: string;
  rating?: number;
  rating_mean?: number;
  isWatching?: boolean;
  progress?: number;
  category?: {
    id: number;
    name: string;
    image: string;
  };
  description?: string;
  about?: string;
  art_work_type?: string;
}

interface Movie {
  id: number;
  title: string;
  name?: string;
  image?: string;
  cover_image: string;
  rating: number;
  isWatching?: boolean;
  progress?: number;
  category?: string;
  description?: string;
  about?: string;
  art_work_type?: string;
}

const getMoviesAndSeries = async (): Promise<Movie[]> => {
  try {
    console.log("Fetching movies and series from /api/proxy/content/movies-with-series");
    const response = await fetch("/api/proxy/content/movies-with-series");
    const data = await response.json();
    console.log("Movies and series response:", data);

    // Handle both paginated and direct array responses
    let apiData: ApiMovie[] = [];
    if (Array.isArray(data)) {
      apiData = data;
    } else if (data && Array.isArray(data.results)) {
      apiData = data.results;
    } else if (data && data.data && Array.isArray(data.data)) {
      apiData = data.data;
    }

    // Transform the data to match the expected format
    return apiData.map((item) => ({
      id: item.id,
      title: item.title || item.name || "Untitled",
      name: item.name,
      cover_image: item.cover_photo || item.cover_image || item.image || "",
      rating: item.rating || item.rating_mean || 0,
      category: item.category?.name,
      description: item.description || item.about,
      about: item.about,
      art_work_type: item.art_work_type,
    }));
  } catch (error) {
    console.error("Error fetching movies and series:", error);
    throw error;
  }
};

export function SeriesAndMovies() {
  const {
    data: movies,
    isLoading,
    error,
  } = useQuery<Movie[]>({
    queryKey: ["movies-with-series"],
    queryFn: getMoviesAndSeries,
  });

  if (isLoading) {
    return (
      <section className="px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Series And Movies
          </h2>
          <Link
            href="/in-trend"
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
            Series And Movies
          </h2>
          <Link
            href="/in-trend"
            className="text-orange-500 font-semibold hover:underline"
          >
            See More
          </Link>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-red-500">Error loading movies and series</p>
        </div>
      </section>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <section className="px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Series And Movies
          </h2>
          <Link
            href="/in-trend"
            className="text-orange-500 font-semibold hover:underline"
          >
            See More
          </Link>
        </div>
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-muted-foreground">No movies or series available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-foreground">
          Series And Movies
        </h2>
        <Link
          href="/in-trend"
          className="text-orange-500 font-semibold hover:underline"
        >
          See More
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-[1800px]:grid-cols-5! gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
