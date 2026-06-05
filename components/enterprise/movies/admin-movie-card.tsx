"use client";

import { MoreVertical, Star, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MovieCategoryBadge from "@/components/global/movie-category-badge";
import { Movie } from "@/components/search/use-search";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";

interface AdminMovieCardProps {
  movie: Movie;
}

export function AdminMovieCard({ movie }: AdminMovieCardProps) {
  const { name, cover_image, rating_count, category, about } = movie;

  const queryClient = useQueryClient();

  const deleteMovieMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/content/movies/${id}`);
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["movies"] });
        Swal.fire("Deleted!", "The movie has been deleted.", "success");
      }
    },
    onError: (error) => {
      Swal.fire(
        "Error!",
        "Failed to delete the movie. Please try again.",
        "error"
      );
    },
  });

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMovieMutation.mutate(String(movie.id));
      }
    });
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
      {/* Image Section */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={cover_image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute top-2 right-2 flex gap-2">
          <div className="flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-md">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{rating_count}</span>
          </div>
        </div>

        <div className="absolute top-2 left-2">
          <MovieCategoryBadge category={category.name} />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-lg font-semibold leading-tight">
            {name}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/enterprise/dashboard/movies/${movie.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {about}
        </p>

        <div className="mt-auto pt-4">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href={`/enterprise/dashboard/movies/${movie.id}/edit`}>
              Edit Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
