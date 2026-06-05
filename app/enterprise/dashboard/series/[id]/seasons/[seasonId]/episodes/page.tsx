"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconPlayerPlay,
  IconSparkles,
  IconVideo,
} from "@tabler/icons-react";
import { EpisodeCard } from "@/components/enterprise/series/episodes/episode-card";
import { AddEpisodeDialog } from "@/components/enterprise/series/episodes/add-episode-dialog";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { IEpisode, IEpisodes } from "@/components/enterprise/series/episodes/schema";



export default function EpisodesPage() {
  const params = useParams();
  const router = useRouter();
  const seriesId = params.id as string;
  const seasonId = params.seasonId as string;

   const { data, isLoading, error } = useQuery<IEpisodes>({
    queryKey: ["movies", seriesId],
    queryFn: async () => {
      const res = await axiosInstance.get("/content/episodes?season=" + seasonId);
      return res.data;
    },
  });

console.log("data",data);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() =>
          router.push(`/enterprise/dashboard/series/${seriesId}/seasons`)
        }
        className="w-fit hover:bg-orange-500/10"
      >
        <IconArrowLeft className="mr-2 size-4" />
        Back to Seasons
      </Button>

      {/* Season Header */}
      <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-orange-500/10 via-purple-500/10 to-pink-500/10 p-8 border border-orange-200/20 dark:border-orange-500/20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

        <div className="relative flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>{data?.results[0]?.title}</span>
                <span>/</span>
                <span className="text-orange-600 font-medium">
                  Season {data?.results[0]?.season?.season_number}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <IconVideo className="size-8 text-orange-500" />
                <h1 className="text-3xl font-bold tracking-tight">
                  {data?.results[0]?.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <IconSparkles className="size-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                {data?.results?.length}{" "}
                {data?.results?.length === 1 ? "Episode" : "Episodes"}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <IconPlayerPlay className="size-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                {/* {data?.results} Total Minutes */}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                {data
                  ?.results.reduce((acc, e) => acc + e.views_count, 0)
                  .toLocaleString()}{" "}
                Total Views
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Episode Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-linear-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
          Episodes
        </h2>
        <AddEpisodeDialog />
      </div>

      {/* Episodes Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.results?.map((episode:IEpisode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      {data?.results?.length === 0  && (
        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border-2 border-dashed border-orange-500/20">
          <IconPlayerPlay className="size-20 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No episodes yet
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
            Get started by adding the first episode to this season!
          </p>
          <AddEpisodeDialog />
        </div>
      )}
    </div>
  );
}
