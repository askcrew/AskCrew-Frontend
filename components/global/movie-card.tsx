import { Star, Heart } from "lucide-react";
import { Button } from "../ui/button";
import MovieCategoryBadge from "./movie-category-badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Actor } from "../enterprise/movies/actor-input";
import { Category } from "@/Schemas/enterprise/movie";
import {
  useAddToFavorites,
  useRemoveFromFavorites,
} from "@/hooks/use-favorites";
import { useAuth } from "@/hooks/use-auth";
import { useAuthRequiredDialog } from "./auth-required-dialog";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: {
    id: number;
    name?: string;
    title?: string;
    about?: string;
    description?: string;
    price?: string;
    cover_image: string;
    actors?: Actor[];
    trailer?: string;
    views_count?: number;
    category?: Category | string;
    is_ready?: boolean;
    admin_approved?: boolean;
    admin_approved_at?: string | null;
    admin_approved_by?: number | null;
    video?: string;
    is_favorite?: boolean;
    is_rated?: boolean;
    is_paid?: boolean;
    user_rating?: number | null;
    rating?: number;
    rating_mean?: number;
    rating_count?: number;
    art_work_type?: string;
    contentType?: "movie" | "series";
    progress?: number;
    created_at?: string;
    updated_at?: string;
  };
  onCardClick?: (id: number) => void;
}

export function MovieCard({ movie, onCardClick }: MovieCardProps) {
  const router = useRouter();
  const { mutate: addToFavorites } = useAddToFavorites();
  const { mutate: removeFromFavorites } = useRemoveFromFavorites();
  const { isAuthenticated } = useAuth();
  const { setIsOpen: setAuthDialogOpen } = useAuthRequiredDialog();

  // Handle different field names from various API responses
  const id = movie.id;
  const title = movie.name || movie.title || "Untitled";
  const cover_image = movie.cover_image;
  const rating = movie.rating_mean ?? movie.rating ?? 0;
  const progress = movie.progress ?? 0;
  const description =
    movie.about ||
    movie.description ||
    "Lorem ipsum dolor sit amet consectetur adipisicing elit...";

  // Handle category - can be string or Category object
  const categoryName =
    typeof movie.category === "string"
      ? movie.category
      : movie.category?.name || "General";

  // Determine content type
  const contentType =
    movie.art_work_type?.toLowerCase() || movie.contentType || "movie";
  const isSeriesContent = contentType === "series";

  const handleWatchClick = () => {
    if (onCardClick) {
      onCardClick(id);
      return;
    }
    if (isSeriesContent) {
      router.push(`/series/${id}`);
    } else {
      router.push(`/movie/${id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setAuthDialogOpen(true);
      return;
    }

    const payload = {
      content_type: isSeriesContent
        ? "series"
        : ("movie" as "series" | "movie"),
      object_id: id,
    };

    if (movie.is_favorite) {
      removeFromFavorites(payload);
    } else {
      addToFavorites(payload);
    }
  };

  return (
    <div className="group/moviecard cursor-pointer" onClick={handleWatchClick}>
      <div className="relative overflow-hidden rounded-2xl mb-3 bg-secondary aspect-2/3 shadow-lg group-hover/moviecard:shadow-2xl transition-all duration-300">
        <MovieCategoryBadge
          category={categoryName}
          className="absolute top-3 left-3 z-10"
        />
        {/* Image */}
        <Image
          src={cover_image}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover group-hover/moviecard:scale-110 transition-transform duration-500 ease-out"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-100 md:opacity-0 md:group-hover/moviecard:opacity-100 transition-opacity duration-300" />

        {/* Start Button & Rating Group - Top Right */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          {/* Rating */}
          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-lg">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-white">
              {typeof rating === "number" ? rating.toFixed(1) : rating}
            </span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="bg-black/70 backdrop-blur-sm p-1.5 rounded-lg shadow-lg hover:bg-black/90 transition-colors group/heart"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                movie.is_favorite
                  ? "fill-red-500 text-red-500"
                  : "text-white group-hover/heart:text-red-500",
              )}
            />
          </button>
        </div>

        {/* Progress bar - always visible at bottom */}
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 backdrop-blur-sm z-10">
            <div
              className="h-full bg-linear-to-r from-purple-500 via-orange-500 to-pink-500 transition-all duration-300 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        )}

        {/* Hover content - always visible on mobile, hover on desktop */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-0 opacity-100 md:translate-y-2 md:opacity-0 md:group-hover/moviecard:translate-y-0 md:group-hover/moviecard:opacity-100 transition-all duration-300 z-10">
          <h3 className="text-base font-bold text-white mb-2 line-clamp-2 drop-shadow-lg">
            {title}
          </h3>
          <p className="text-sm text-white/80 line-clamp-3 mb-4 drop-shadow-lg">
            {description}
          </p>
          <Button
            size={"xl"}
            onClick={(e) => {
              e.stopPropagation();
              handleWatchClick();
            }}
            className="w-full bg-purple-600 text-white hover:bg-purple-700 font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200 backdrop-blur-sm"
          >
            {progress > 0 ? "Continue Watching" : "Watch Now"}
          </Button>
        </div>
      </div>

      {/* Title below card - hidden on mobile, visible on desktop when not hovering */}
      <div className="hidden md:block md:group-hover/moviecard:opacity-0 transition-opacity duration-200">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">
          {title}
        </h3>
      </div>
    </div>
  );
}
