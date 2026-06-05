"use client";

import { HeroSection } from "@/components/movie-details/hero-section";
import { AboutSection } from "@/components/movie-details/about-section";
import { CastList } from "@/components/movie-details/cast-list";
import { TrailerSection } from "@/components/movie-details/trailer-section";
import { PaymentFooter } from "@/components/movie-details/payment-footer";
import { VideoEmbed } from "@/components/global/video-embed";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { usePaymentContext } from "@/contexts/payment-context";
import usePaymentDialog from "@/hooks/use-payment-dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Star, Play } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAuthRequiredDialog } from "@/components/global/auth-required-dialog";
import {
  useAddToFavorites,
  useRemoveFromFavorites,
} from "@/hooks/use-favorites";

interface Actor {
  id: string;
  name: string;
  role: string;
  image: string;
}

interface MovieData {
  id: number;
  name: string;
  about: string;
  price: string;
  cover_image: string;
  actors: Actor[];
  trailer: string;
  views_count: number;
  category: {
    id: number;
    name: string;
    image: string | null;
  };
  rating_mean: number;
  rating_count: number;
  created_at: string;
  is_paid?: boolean;
  duration?: string;
  is_favorite?: boolean;
}

// Get movie details
const getMovieDetails = async (id: string): Promise<MovieData> => {
  const response = await axiosInstance.get(`/content/movies/${id}`);
  return response.data;
};

// Get trailer token
const getTrailerToken = async (id: string): Promise<string> => {
  const response = await axiosInstance.get(
    `/content/videos/movie/${id}/trailer-token`,
  );
  return response.data.embed_url || response.data.token || response.data;
};

// Get video access token (for paid content)
const getVideoToken = async (id: string): Promise<string> => {
  const response = await axiosInstance.get(`/content/videos/movie/${id}/token`);
  console.log(response.data.embed_url);
  return response.data.embed_url || response.data.token || response.data;
};

export default function MovieDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;

  // Check status query parameter for immediate video access
  const status = searchParams.get("status");
  const hasPaymentSuccess = status === "payment-successful";
  const isFreeStatus = status === "free";

  const { setPaymentContent } = usePaymentContext();
  const { setIsOpen } = usePaymentDialog();

  // Fetch movie details
  const {
    data: movie,
    isLoading,
    error,
  } = useQuery<MovieData>({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetails(id),
    enabled: !!id,
  });

  // Check if content is free
  const isFree = useMemo(() => {
    if (!movie) return false;
    const price = parseFloat(movie.price);
    return price === 0 || price === 0.0;
  }, [movie]);

  // Determine if video should be accessible
  const canWatchContent = useMemo(() => {
    if (!movie) return false;
    return (
      isFree || movie.is_paid === true || hasPaymentSuccess || isFreeStatus
    );
  }, [movie, isFree, hasPaymentSuccess, isFreeStatus]);

  // Fetch trailer
  const { data: trailerUrl, isLoading: isLoadingTrailer } = useQuery<string>({
    queryKey: ["trailer", "movie", id],
    queryFn: () => getTrailerToken(id),
    enabled: !!id && !!movie?.trailer,
  });

  // Fetch full video token (only if user can watch)
  const { data: videoUrl, isLoading: isLoadingVideo } = useQuery<string>({
    queryKey: ["movie-video", id],
    queryFn: () => getVideoToken(id),
    enabled: !!id && canWatchContent,
  });

  /* hooks */
  const { mutate: addToFavorites } = useAddToFavorites();
  const { mutate: removeFromFavorites } = useRemoveFromFavorites();

  const { isAuthenticated } = useAuth();
  const { setIsOpen: setAuthDialogOpen } = useAuthRequiredDialog();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }
    if (!movie) return;

    const payload = {
      content_type: "movie" as const,
      object_id: movie.id,
    };

    if (movie.is_favorite) {
      removeFromFavorites(payload);
    } else {
      addToFavorites(payload);
    }
  };

  const handlePayClick = () => {
    // Check if user is authenticated before allowing payment
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }
    setPaymentContent(id, "movie");
    setIsOpen(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-background relative overflow-x-hidden rounded-xl mx-6 mt-4 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-muted-foreground font-medium">
            Loading movie details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !movie) {
    return (
      <div className="bg-background relative overflow-x-hidden rounded-xl mx-6 mt-4 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <span className="text-3xl">!</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-foreground">
            Failed to Load Movie
          </h3>
          <p className="text-muted-foreground">
            We couldn&apos;t load the movie details. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const price = parseFloat(movie.price);

  return (
    <div className="bg-background relative rounded-xl mx-auto max-w-7xl mt-4 mb-20 scrollbar-hide">
      {/* Enhanced Hero Section with Gradient Overlay */}
      <div className="relative">
        <HeroSection
          image={movie.cover_image}
          title={movie.name}
          date={new Date(movie.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
          isFavorite={movie.is_favorite}
          onToggleFavorite={handleToggleFavorite}
        />

        {/* Content Type Badge */}
        <div className="absolute top-6 left-6 z-30">
          <Badge
            variant="secondary"
            className="bg-black/60 backdrop-blur-md text-white border-white/20 px-4 py-1.5 text-sm font-semibold"
          >
            Movie
          </Badge>
        </div>

        {/* Free Badge */}
        {(isFree || isFreeStatus) && !hasPaymentSuccess && (
          <div className="absolute top-6 right-6 z-30">
            <Badge className="bg-green-500/90 backdrop-blur-md text-white border-green-400/20 px-4 py-1.5 text-sm font-bold shadow-lg">
              FREE
            </Badge>
          </div>
        )}

        {/* Payment Success Badge */}
        {hasPaymentSuccess && (
          <div className="absolute top-6 right-6 z-30">
            <Badge className="bg-green-500/90 backdrop-blur-md text-white border-green-400/20 px-4 py-1.5 text-sm font-bold shadow-lg animate-pulse">
              ✓ Payment Successful
            </Badge>
          </div>
        )}
      </div>

      {/* Content Info Bar */}
      <div className="relative bg-linear-to-b from-background/95 to-background z-20 -mt-20 pt-20 px-6">
        <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span className="font-semibold text-foreground">
              {movie.rating_mean.toFixed(1)}
            </span>
            <span>({movie.rating_count} reviews)</span>
          </div>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span>{movie.views_count.toLocaleString()} views</span>
          </div>

          {movie.duration && (
            <>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{movie.duration}</span>
              </div>
            </>
          )}

          {movie.category && (
            <>
              <div className="h-4 w-px bg-border" />
              <Badge variant="outline" className="text-xs">
                {movie.category.name}
              </Badge>
            </>
          )}
        </div>
      </div>

      <div className="relative bg-background z-20">
        {/* About Section */}
        <AboutSection description={movie.about} rating={movie.rating_mean} />

        {/* Watch Section - Full Video */}
        {canWatchContent && (
          <div className="px-6 py-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-linear-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                  {isFree ? "Watch Now (Free)" : "Watch Full Movie"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enjoy the full movie
                </p>
              </div>
              {isFree && (
                <Badge className="bg-green-500 text-white">
                  No Payment Required
                </Badge>
              )}
            </div>

            {isLoadingVideo ? (
              <div className="flex items-center justify-center min-h-[400px] bg-linear-to-br from-purple-50 to-orange-50 dark:from-purple-950/20 dark:to-orange-950/20 rounded-2xl border border-border/50">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Preparing your video...
                  </p>
                </div>
              </div>
            ) : videoUrl ? (
              <VideoEmbed videoUrl={videoUrl} title={movie.name} />
            ) : (
              <div className="flex items-center justify-center min-h-[400px] bg-muted/30 rounded-2xl border border-border/50">
                <p className="text-muted-foreground">
                  Video not available at this time
                </p>
              </div>
            )}
          </div>
        )}

        {/* Trailer Section */}
        {movie.trailer && (
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold mb-4">
              {!canWatchContent
                ? "Watch the trailer before purchasing"
                : "Trailer"}
            </h2>
            {isLoadingTrailer ? (
              <div className="flex items-center justify-center min-h-[300px] bg-muted/30 rounded-2xl">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary"></div>
              </div>
            ) : trailerUrl ? (
              <TrailerSection
                trailerUrl={trailerUrl}
                thumbnailUrl={movie.cover_image}
              />
            ) : (
              <div className="flex items-center justify-center min-h-[300px] bg-muted/30 rounded-2xl">
                <p className="text-muted-foreground">Trailer not available</p>
              </div>
            )}
          </div>
        )}

        {/* Cast Section */}
        {movie.actors && movie.actors.length > 0 && (
          <div className="px-6 py-8">
            <CastList actors={movie.actors} />
          </div>
        )}
      </div>

      {/* Payment Footer - Only show if NOT free AND NOT paid */}
      {!isFree && !movie.is_paid && !hasPaymentSuccess && (
        <PaymentFooter price={price} onPay={handlePayClick} />
      )}
    </div>
  );
}
