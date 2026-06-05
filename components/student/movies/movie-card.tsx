"use client";

import { Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import MovieCategoryBadge from "@/components/global/movie-category-badge";
import { Movie } from "@/components/search/use-search";
import Link from "next/link";

interface StudentMovieCardProps {
  movie: Movie;
}

export function StudentMovieCard({ movie }: StudentMovieCardProps) {
  const {
    title,
    cover_image,
    rating,
    category = "Comedy",
    description,
    contentType = "movie",
  } = movie;

  // Determine the correct route based on content type
  const watchUrl =
    contentType === "series" ? `/series/${movie.id}` : `/movie/${movie.id}`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
      {/* Image Section */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={cover_image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm transition-transform hover:scale-110">
            <Play className="h-8 w-8 fill-white text-white" />
          </div>
        </div>

        <div className="absolute top-2 right-2 flex gap-2">
          <div className="flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-md">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
          </div>
        </div>

        <div className="absolute top-2 left-2">
          <MovieCategoryBadge category={category} />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-lg font-semibold leading-tight">
            {title}
          </h3>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>

        <div className="mt-auto pt-4">
          <Button
            className="w-full bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white shadow-md shadow-orange-500/20"
            asChild
          >
            <Link href={watchUrl}>Watch Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
