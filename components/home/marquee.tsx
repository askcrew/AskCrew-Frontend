"use client";

import Link from "next/link";
import { MovieCard } from "../global/movie-card";
import { Marquee, MarqueeContent, MarqueeItem } from "../ui/marquee";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

interface ExploreApiResponse {
  type: string;
  created_at: string;
  data: {
    id: number;
    name?: string;
    title?: string;
    about: string;
    price: string;
    cover_image?: string;
    cover_photo?: string;
    image?: string;
    rating_mean: number;
    category: {
      id: number;
      name: string;
      image: string | null;
    };
    actors: Array<{
      id: number;
      name: string;
      image: string;
    }>;
    trailer: string;
    views_count: number;
    is_ready: boolean;
    admin_approved: boolean;
    video: string;
    is_favorite: boolean;
    is_rated: boolean;
    is_paid: boolean;
    user_rating: number | null;
    rating_count: number;
    art_work_type: string;
    created_at: string;
    updated_at: string;
  };
}

interface MovieForCard {
  id: number;
  title: string;
  name?: string;
  cover_image: string;
  rating: number;
  progress: number;
  category: string;
  description: string;
  about?: string;
  art_work_type?: string;
}

const getTrendingContent = async (): Promise<MovieForCard[]> => {
  try {
    console.log("Fetching trending content from /api/proxy/content/explore");
    const response = await fetch("/api/proxy/content/explore");
    
    if (!response.ok) {
      console.error("Proxy response not ok:", response.status, response.statusText);
      throw new Error(`Proxy returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Trending content response:", data);

    // Handle both paginated and direct array responses
    let apiData: ExploreApiResponse[] = [];
    if (Array.isArray(data)) {
      apiData = data;
    } else if (data && Array.isArray(data.results)) {
      apiData = data.results;
    } else if (data && data.data && Array.isArray(data.data)) {
      apiData = data.data;
    }

    return apiData.map((item) => ({
      id: item.data.id,
      title: item.data.title || item.data.name || "Untitled",
      name: item.data.name,
      cover_image: item.data.cover_photo || item.data.cover_image || item.data.image || "",
      rating: item.data.rating_mean,
      progress: 0,
      category: item.data.category?.name || "",
      description: item.data.about || "",
      about: item.data.about,
      art_work_type: item.data.art_work_type,
    }));
  } catch (error) {
    console.error("Error fetching trending content:", error);
    throw error;
  }
};

const MarqueeTopPicks = () => {
  const {
    data: movies,
    isLoading,
    error,
  } = useQuery<MovieForCard[]>({
    queryKey: ["trending-top-picks"],
    queryFn: getTrendingContent,
  });

  if (isLoading) {
    return (
      <section className="px-6 py-12 dark">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-black">Top Picks</h2>
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

  if (error || !movies || movies.length === 0) {
    return null; // Hide section if error or no data
  }

  return (
    <section className="px-6 py-12 dark">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-black">Top Picks</h2>
        <Link
          href="/in-trend"
          className="text-orange-500 font-semibold hover:underline"
        >
          See More
        </Link>
      </div>

      <Marquee
        aria-label="Skateboard tricks showcase"
        pauseOnHover
        pauseOnKeyboard
      >
        <MarqueeContent className="rounded-none">
          {movies.map((movie) => (
            <MarqueeItem key={movie.id} className="w-[140px] md:w-[200px] lg:w-[400px] px-2">
              <div>
                <MovieCard movie={movie} key={movie.id} />
              </div>
            </MarqueeItem>
          ))}
        </MarqueeContent>
        {/* <MarqueeEdge side="left" />
        <MarqueeEdge side="right" /> */}
      </Marquee>
    </section>
  );
};

const MarqueeTopPicks_Old = () => {
  return (
    <section className="px-6 py-12 dark">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-black">Top Picks</h2>
        <Link
          href="/in-trend"
          className="text-orange-500 font-semibold hover:underline"
        >
          See More
        </Link>
      </div>
    </section>
  );
};

export default MarqueeTopPicks;
