"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  IconCurrencyDollar,
  IconCalendar,
  IconUsers,
} from "@tabler/icons-react";
import { ISeason } from "./schema";
import { useState } from "react";
import { EditSeasonDialog } from "./edit-season-dialog";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";

interface SeasonCardProps {
  season: ISeason;
}

export function SeasonCard({ season }: SeasonCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const seriesId = params.id as string;


  const deleteSeason = async (data:ISeason) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will delete the Season permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.delete(`content/seasons/${data.id}`);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Season Deleted",
          text: "The season has been deleted successfully.",
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

        {/* Cover Photo */}
        <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-orange-500/20 to-purple-500/20">
          {season.cover_photo && (
            <Image
              src={season?.cover_photo}
              alt={"cover photo of " + season.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          {/* Season Number Badge */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-orange-500 text-white font-bold text-lg px-3 py-1">
              Season {season.season_number}
            </Badge>
          </div>
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
                  Edit Season
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => deleteSeason(season)} disabled={isSubmitting}>
                  <IconTrash className="mr-2 size-4" />
                  Delete Season
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardHeader className="relative space-y-3 pb-3">
          <h3 className="text-xl font-bold leading-tight group-hover:text-orange-600 transition-colors">
            {season.title}
          </h3>
        </CardHeader>

        <CardContent className="relative space-y-4 pb-4">
          {/* Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1.5">
              <IconPlayerPlay className="size-4" />
              <span className="font-medium">
                {season.episodes_count} Episodes
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconCurrencyDollar className="size-4" />
              <span className="font-medium text-orange-600">
                ${season.price}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconCalendar className="size-4" />
              <span className="font-medium">
                {season.release_date
                  ? new Date(season.release_date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Cast */}
          {season.actors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <IconUsers className="size-4" />
                <span>Cast</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {season.actors.slice(0, 4).map((actor, index) => (
                    <Avatar
                      key={index}
                      className="size-8 border-2 border-background ring-2 ring-orange-500/20"
                    >
                      <AvatarImage src={actor.image} alt={actor.name} />
                      <AvatarFallback className="bg-orange-500/10 text-orange-600 text-xs">
                        {actor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {season.actors.length > 4 && (
                    <div className="size-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                      +{season.actors.length - 4}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground truncate">
                    {season.actors
                      .slice(0, 2)
                      .map((a) => a.name)
                      .join(", ")}
                    {season.actors.length > 2 &&
                      ` +${season.actors.length - 2} more`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="relative pt-4 border-t border-orange-500/10 gap-2">
          <Button
            variant="outline"
            className="flex-1 border-2 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all"
          >
            <IconPlayerPlay className="mr-2 size-4" />
            Watch Trailer
          </Button>
          <Button
            onClick={() =>
              router.push(
                `/enterprise/dashboard/series/${seriesId}/seasons/${season.id}/episodes`
              )
            }
            className="flex-1 bg-linear-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-semibold shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
          >
            View Episodes
          </Button>
        </CardFooter>
      </Card>

      <EditSeasonDialog
        season={season}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
}
