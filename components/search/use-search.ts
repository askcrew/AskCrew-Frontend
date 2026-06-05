"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

export interface Movie {
  id: number;
  title: string;
  cover_image: string;
  rating: number;
  progress?: number;
  category?: string;
  description?: string;
  contentType?: "movie" | "series"; // For routing to correct page
}

interface ApiMovie {
  id: number;
  name: string;
  about: string;
  price: string;
  cover_image: string;
  rating_mean: number;
  category?: {
    id: number;
    name: string;
    image: string | null;
  };
}

interface ApiResponse {
  type: string;
  created_at: string;
  data: ApiMovie;
}

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

const getMoviesAndSeries = async (): Promise<Movie[]> => {
  const response = await axiosInstance.get("/content/movies");
  const apiData: ApiMovie[] = Array.isArray(response.data)
    ? response.data
    : response.data.results || [];

  return apiData.map((item) => ({
    id: item.id,
    title: item.name,
    cover_image: item.cover_image,
    rating: item.rating_mean,
    progress: 0,
    category: item.category?.name,
    description: item.about,
  }));
};

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: movies, isLoading } = useQuery<Movie[]>({
    queryKey: ["movies-with-series-search"],
    queryFn: getMoviesAndSeries,
  });
  console.log("movies", movies);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim() && !movies) return [];
    if (!searchQuery.trim()) return movies;

    return movies?.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, movies]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredResults,
    clearSearch,
    isSearching: searchQuery.trim().length > 0,
    isLoading,
  };
}
