"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconPlayerPlay,
  IconEye,
  IconClock,
} from "@tabler/icons-react";
import {  IEpisode, IEpisodes } from "./schema";
import { useState } from "react";
import { EditEpisodeDialog } from "./edit-episode-dialog";
import Image from "next/image";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";

interface EpisodeCardProps {
  episode: IEpisode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const params = useParams();
    const seriesId = params.id as string;
  
  
    const deleteEpisode = async (data:IEpisode) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action will delete the Episode permanently.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });
  
      if (!result.isConfirmed) return;
  
      setIsSubmitting(true);
      try {
        const response = await axiosInstance.delete(`content/episodes/${data.id}`);
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Episode Deleted",
            text: "The Episode has been deleted successfully.",
          });
          window.location.reload();
        }
      } catch (e: unknown) {
        const error = e as AxiosError<{ message: string }>;
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text:
            error?.response?.data?.message ||
            error.message ||
            "An error occurred while submitting the form.",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <>
      <Card className="group relative overflow-hidden border-2 border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-orange-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 pointer-events-none" />

        {/* Thumbnail */}
        <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-orange-500/20 to-purple-500/20">
          {episode?.season?.cover_photo && (
            <Image
              src={episode?.season?.cover_photo}
              alt={episode?.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          {/* Episode Number Badge */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-orange-500 text-white font-bold px-3 py-1">
              Episode {episode?.episode_number}
            </Badge>
          </div>
          {/* Duration Badge */}
          {/* <div className="absolute bottom-2 right-2">
            <Badge className="bg-black/70 backdrop-blur-sm text-white font-medium px-2 py-1">
              <IconClock className="mr-1 size-3" />
              {episode.duration} min
            </Badge>
          </div> */}
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="p-4 rounded-full bg-orange-500/90 backdrop-blur-sm">
              <IconPlayerPlay className="size-8 text-white" />
            </div>
          </div>
          {/* Actions Menu */}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white"
                >
                  <IconDotsVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                  <IconEdit className="mr-2 size-4" />
                  Edit Episode
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => deleteEpisode(episode)} disabled={isSubmitting}>
                  <IconTrash className="mr-2 size-4"  />
                  Delete Episode
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardHeader className="relative space-y-2 pb-3">
          <h3 className="text-lg font-bold leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
            {episode?.title}
          </h3>
        </CardHeader>

        <CardContent className="relative space-y-3 pb-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {episode?.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <IconEye className="size-4" />
              <span className="font-medium">
                {episode?.views_count?.toLocaleString()}
              </span>
              <span className="hidden sm:inline">views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium">
                {/* {new Date(episode.releaseDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })} */}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="relative pt-4 border-t border-orange-500/10">
          <Button className="w-full bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300">
            <IconPlayerPlay className="mr-2 size-4" />
            Watch Episode
          </Button>
        </CardFooter>
      </Card>

      <EditEpisodeDialog
        episode={episode}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
}
